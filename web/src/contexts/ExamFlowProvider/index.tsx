import {createContext, useContext, useState, useEffect, type ReactNode, useCallback} from "react";
import type {ExamGroup, ExamWithStatus, Exam, ExamResult} from '../../utils/types';
import {useNavigate} from "react-router-dom";
import {getMethod} from "../../utils/api.ts";
import {getValidAccessToken, getUserInfo} from "../../router/auth.ts";

// 1. interface for the context
interface ExamFlowContextType {
    isLoading: boolean;
    examsWithStatus: ExamWithStatus[];
    examGroupDetail?: ExamGroup;
    awaitingTime: number;
    isUnlocking: boolean;
    startUnlockTimer: (completedExamId: number) => void;
    initializeExamData: (examGroupId: string) => Promise<void>;
}

// 2. create the context
export const ExamFlowContext = createContext<ExamFlowContextType | null>(null);

// 3. create a custom hook to use the context
export const useExamFlow = () => {
    const context = useContext(ExamFlowContext);
    if (!context) {
        throw new Error("useExamFlow must be used inside an ExamFlowProvider");
    }
    return context;
}

export function ExamFlowProvider({children}: { children: ReactNode }) {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [examGroupDetail, setExamGroupDetail] = useState<ExamGroup | undefined>(undefined);
    const [examsWithStatus, setExamsWithStatus] = useState<ExamWithStatus[]>([]);
    const [awaitingTime, setAwaitingTime] = useState(-1);
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);


    const [activeExamGroupId, setActiveExamGroupId] = useState<string | null>(null);

    const initializeExamData = useCallback(async (examGroupId: string) => {
        if (!examGroupId) {
            setIsLoading(false);
            return;
        }
        // save the examGroupId to state
        setActiveExamGroupId(examGroupId);
        setIsLoading(true);

        const accessToken = await getValidAccessToken();
        if (!accessToken) {
            navigate('/login');
            return;
        }

        const userInfo = getUserInfo(accessToken);
        if (!userInfo || !userInfo.sub) {
            navigate('/login');
            return;
        }

        const currentUserId: number = Number(userInfo.sub);
        setUserId(currentUserId);

        try {
            const [examGroupData, exams, examResults] = await Promise.all([
                getMethod(`/exam_groups/${examGroupId}`),
                getMethod(`/exams/?exam_group_id=${examGroupId}`),
                getMethod(`/exam_results/?student_id=${currentUserId}&exam_group_id=${examGroupId}`)
            ]);

            setExamGroupDetail(examGroupData);

            // if an exam has its id appear in the ids of examResults, that exam's status is 'completed'
            // otherwise its status can be temporarily assigned to 'locked'
            let processedExams: ExamWithStatus[] = exams.map((exam: Exam) => ({
                ...exam,
                status: examResults.some((r: ExamResult) => r.exam_id === exam.id) ? 'completed' : 'locked'
            }));

            const unlockStartTime: string | null = localStorage.getItem(`unlockStartTime-${currentUserId}-${examGroupId}`);
            const unlockingExamId: string | null = localStorage.getItem(`unlockingExamId-${currentUserId}-${examGroupId}`);

            if (unlockStartTime && unlockingExamId) {
                const elapsed: number = Math.floor((Date.now() - parseInt(unlockStartTime)) / 1000);
                const remainingTime: number = examGroupData.await_time - elapsed;

                if (remainingTime > 0) {
                    processedExams = processedExams.map(exam => exam.id === Number(unlockingExamId) ? {
                        ...exam,
                        status: 'unlocking'
                    } : exam);
                    setIsUnlocking(true);
                    setAwaitingTime(remainingTime);
                } else {
                    // when timeout, change status from 'unlocking' to 'unlocked' and clear localStorage
                    processedExams = processedExams.map(exam => exam.id === Number(unlockingExamId) ? {
                        ...exam,
                        status: 'unlocked'
                    } : exam);

                    localStorage.removeItem(`unlockStartTime-${currentUserId}-${examGroupId}`);
                    localStorage.removeItem(`unlockingExamId-${currentUserId}-${examGroupId}`);
                }
            } else {
                const hasActiveExam: boolean = processedExams.some(e => ['unlocked', 'unlocking'].includes(e.status));
                // if there is no 'unlocking' or 'unlocked' exam, unlock a 'locked' exam (if any)

                if (!hasActiveExam) {
                    const firstLockedIndex: number = processedExams.findIndex(e => e.status === 'locked');
                    if (firstLockedIndex !== -1) {
                        processedExams = processedExams.map((exam, index) => index === firstLockedIndex ? {
                            ...exam,
                            status: 'unlocked'
                        } : exam);
                    }
                }
            }
            setExamsWithStatus(processedExams);
        } catch (error) {
            console.error("Error initializing exam data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    const startUnlockTimer = useCallback((completedExamId: number) => {

        if (!examGroupDetail || !userId || !activeExamGroupId) return;

        // pick one from locked exams to unlock
        setExamsWithStatus(prevExams => {
            let nextExamToUnlockId: number | undefined;
            const completedIndex: number = prevExams.findIndex(exam => exam.id === completedExamId);
            for (let i = completedIndex + 1; i < prevExams.length; i++) {
                if (prevExams[i].status === 'locked') {
                    nextExamToUnlockId = prevExams[i].id;
                    break;
                }
            }

            if (nextExamToUnlockId) {
                localStorage.setItem(`unlockStartTime-${userId}-${activeExamGroupId}`, Date.now().toString());
                localStorage.setItem(`unlockingExamId-${userId}-${activeExamGroupId}`, nextExamToUnlockId.toString());
                setIsUnlocking(true);
                setAwaitingTime(examGroupDetail.await_time);
            }

            return prevExams.map(exam => {
                if (exam.id === completedExamId) return {...exam, status: 'completed'};
                if (exam.id === nextExamToUnlockId) return {...exam, status: 'unlocking'};
                return exam;
            });
        });
    }, [examGroupDetail, userId, activeExamGroupId]);

    // countdown
    useEffect(() => {
        if (!isUnlocking || awaitingTime <= 0) return;
        const interval = setInterval(() => setAwaitingTime(prev => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [isUnlocking, awaitingTime]);

    // timeout scenario, change the exam's status from 'unlocking' to 'unlocked' and clear localStorage
    useEffect(() => {

        if (isUnlocking && awaitingTime === 0) {

            if (userId && activeExamGroupId) {
                const unlockingExamId: string | null = localStorage.getItem(`unlockingExamId-${userId}-${activeExamGroupId}`);
                if (unlockingExamId) {
                    setExamsWithStatus(prevExams =>
                        prevExams.map(exam =>
                            exam.id === Number(unlockingExamId)
                                ? {...exam, status: 'unlocked'}
                                : exam
                        )
                    );
                }
                localStorage.removeItem(`unlockStartTime-${userId}-${activeExamGroupId}`);
                localStorage.removeItem(`unlockingExamId-${userId}-${activeExamGroupId}`);
            }
            setIsUnlocking(false);
            setAwaitingTime(-1);
        }
    }, [isUnlocking, awaitingTime, userId, activeExamGroupId]);

    const value = {
        isLoading,
        examsWithStatus,
        examGroupDetail,
        awaitingTime,
        isUnlocking,
        startUnlockTimer,
        initializeExamData
    };

    return <ExamFlowContext.Provider value={value}>{children}</ExamFlowContext.Provider>;
}