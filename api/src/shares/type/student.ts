import { UserBase } from '@/shares/type/user';

export type StudentBase = UserBase;

export interface StudentI extends StudentBase {
  id: number;
}

export interface StudentReqI extends StudentBase {}

export type StudentResI = StudentI;
