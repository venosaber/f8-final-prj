import type {ExamFormValidationData} from "./types.ts";

export const validateExamForm = (data: ExamFormValidationData): {isValid: boolean, message?: string} => {
    const {name, code, total_time, questions, fileUrl} = data;

    if(!name || !code) {
        return {isValid: false, message: 'Hãy điền đầy đủ tên đề và mã đề!'};
    }

    if(total_time <= 0 || isNaN(total_time)) {
        return {isValid: false, message: 'Thời gian thi phải là số dương!'};
    }

    if(!fileUrl) {
        return {isValid: false, message: 'Chưa upload đề thi!'};
    }

    const unCheckedQtn: number = questions.findIndex(question => !question.correct_answer && question.type !== 'long-response');
    if (unCheckedQtn !== -1) {
        return {isValid: false, message: 'Câu số ${unCheckedQtn + 1} chưa chọn đáp án!'};
    }

    return {isValid: true};
}