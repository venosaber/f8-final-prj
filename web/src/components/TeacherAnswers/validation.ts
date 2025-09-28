import type {ExamFormValidationData} from "./types.ts";

export const validateExamForm = (data: ExamFormValidationData): { isValid: boolean, message?: string } => {
    const {name, code, total_time, questions, number_of_question, fileUrl} = data;

    if (!name || !code) {
        return {isValid: false, message: 'Hãy điền đầy đủ tên đề và mã đề!'};
    }

    if (total_time <= 0 || isNaN(total_time)) {
        return {isValid: false, message: 'Thời gian thi phải là số dương!'};
    }

    if (Number(number_of_question) <= 0 || isNaN(Number(number_of_question))) {
        return {isValid: false, message: 'Số câu hỏi phải là số dương!'};
    }

    if (!fileUrl) {
        return {isValid: false, message: 'Chưa upload đề thi!'};
    }

    // only long-response questions or questions with index > number_of_question (excluded questions)
    // are allowed to have null correct answers
    const unCheckedQtn: number = questions.findIndex(
        question => !question.correct_answer
            && question.type !== 'long-response'
            && question.index < Number(number_of_question)
    );
    if (unCheckedQtn !== -1) {
        return {isValid: false, message: `Câu số ${unCheckedQtn + 1} chưa chọn đáp án!`};
    }

    return {isValid: true};
}