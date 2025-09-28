import {type ChangeEvent, type FormEvent, useCallback, useRef, useState} from "react";
import type {TeacherAnswersProps} from "./types.ts";
import {validateExamForm} from "./validation.ts";
import {toast} from "react-toastify";
import {submitExam} from "./services.ts";

export const useTeacherAnswers = ({
                                      handleBackToExamGroupDetail,
                                      examGroupIdNum,
                                      examIdNum,
                                      state,
                                      dispatch,
                                      selectedFile
                                  }: TeacherAnswersProps) => {

    const useInputChange = (actionType: string) => {
        return useCallback((e: ChangeEvent<HTMLInputElement>) => {
            const value: string | number = actionType === 'SET_AMOUNT' ? Number(e.target.value) : e.target.value;
            dispatch({type: actionType, payload: value});
        }, [dispatch, actionType]);
    };

    const [isWaiting, setIsWaiting] = useState<boolean>(false);
    // flag to lock
    const isLocked = useRef<boolean>(false);

    const handlers = {
        onNameChange: useInputChange('SET_NAME'),
        onCodeChange: useInputChange('SET_CODE'),
        onTotalTimeChange: useInputChange('SET_TOTAL_TIME'),
        onAmountChange: useInputChange('SET_AMOUNT'),
        onTypeChange: useCallback((index: number, questionType: string) => {
            dispatch({type: 'CHANGE_QUESTION_TYPE', payload: {index, questionType}})
        }, [dispatch]),

        onAnswerChange: useCallback(
            (index: number, type: 'single-choice' | 'multiple-choice', value: string, checked?: boolean) => {
                const payload = {targetedAnswer: value, index: index};

                if (type === 'single-choice') {
                    dispatch({type: 'SINGLE_CHANGE_CORRECT_ANSWER', payload: payload});
                } else if (type === 'multiple-choice') {
                    if (checked) {
                        dispatch({type: 'MULTIPLE_CHECK_OPTION', payload: payload});
                    } else {
                        dispatch({type: 'MULTIPLE_UNCHECK_OPTION', payload: payload});
                    }
                }
            }, [dispatch]),
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // check the flag immediately
        if (isLocked.current) {
            return;
        }

        // turn on the lock immediately
        isLocked.current = true;

        // loading for the button
        setIsWaiting(true);

        // validation
        const validationResult = validateExamForm({
            name: state.name,
            code: state.code,
            total_time: state.total_time,
            questions: state.questions,
            fileUrl: state.file?.url,
            number_of_question: Number(state.number_of_question)
        });

        if (!validationResult.isValid) {
            toast.error(validationResult.message);
            // unlock if validation failed
            isLocked.current = false;
            setIsWaiting(false);
            return;
        }

        // submission
        try {
            const response = await submitExam({...state, examGroupIdNum, examIdNum, selectedFile});
            if (!response) {
                toast.error(examIdNum ? 'Chỉnh sửa đề thi thất bại!' : 'Tạo đề thi thất bại!');
            } else {
                toast.success(examIdNum ? 'Chỉnh sửa đề thi thành công!' : 'Tạo đề thi thành công!');
                handleBackToExamGroupDetail();
            }

        } catch (e) {
            console.error('Submission failed: ', e);
            toast.error('Đã có lỗi xảy ra, vui lòng thử lại!');
        } finally {
            isLocked.current = false;
            setIsWaiting(false);
        }
    }

    return {handlers, handleSubmit, isWaiting};
}