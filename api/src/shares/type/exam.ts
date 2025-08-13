import { QuestionReqI, QuestionI } from '@/shares';

interface ExamBaseI {
    exam_group_id: number;
    name: string;
    code: string;
    number_of_question: number;
    total_time: number;
    description: string;
    questions: QuestionReqI[];
}

export interface ExamI extends Omit<ExamBaseI,'questions'>  {
    id: number;
    questions: QuestionI[];
    // file_id: number;
}

export interface ExamReqI extends ExamBaseI{}

export interface ExamResI extends Omit<ExamI, 'file_id'> {
    // file: {
    //     id: number;
    //     url: string;
    // }
}
