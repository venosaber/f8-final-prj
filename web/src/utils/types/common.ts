export interface Course {
    id: number,
    code: string,
    name: string,
    teachers: Member[],
    students: Member[],
}

export interface Member {
    id: number,
    name: string,
    role: string,
    email: string,
}

export interface AvatarInfo {
    id: number | null,
    url?: string,
}

export interface User extends Member {
    email: string,
    school: string | null,
    parent_name: string | null,
    parent_phone: string | null,
    status: string,
    avatar_info: AvatarInfo | null
}

export interface ExamGroup {
    id: number,
    name: string,
    class_id: number,
    start_time: string,
    await_time: number,
    created_at: Date,
    is_once: boolean,
    is_save_local: boolean
}

export interface Exam {
    id?: number,
    name: string,
    code: string,
    exam_group_id: number,
    number_of_question: number | string,
    total_time: number,
    questions: Question[],
    description: string,
    file: ExamFile | null,
}

export interface ExamFile {
    id: number | null,
    url?: string,
    file_type?: string
}

export interface ExamWithStatus extends Exam {
    status: string
}

export interface Question {
    type: string,
    correct_answer: string,
    index: number,
    id?: number
}

export interface Answer {
    questionId: number,
    questionIndex: number,
    questionType: string,
    answer: string
}

export interface AnswerResult {
    id: number | null,
    question_id: number,
    index: number,
    answer: string | null,
    is_correct: boolean[] | null,
    type: string
}

export interface ExamDoing {
    examName: string,
    examCode: string,
    examFile: ExamFile,
    questions: Answer[],
    timeLeft: number,
    device: string
}

export interface ExamResult {
    id: number,
    exam_id: number,
    user_id: number,
    status: string,
    answers: AnswerResult[],
    number_of_question: number,
    number_of_correct_answer: number,
    score: number | null,
    created_at: Date,
    device: string
}

export interface StudentResultGroup extends Member {
    results: ExamResult[]
}

export interface Action {
    type: string,
    payload?: any
}