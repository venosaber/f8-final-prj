interface QuestionBaseI {
  index: number;
  type: string;
  correct_answer: string;
}

export interface QuestionI extends QuestionBaseI {
  id: number;
}

export interface QuestionReqI extends QuestionBaseI {
  id?: number;
  exam_id?: number;
}

export interface QuestionResI extends Omit<QuestionI,'exam_id'> {}
