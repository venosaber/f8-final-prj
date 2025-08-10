import {
  UserReqI, UserI, UserResI,
  LoginReqI, LoginResI,
  StudentI, StudentReqI,
  RegisterReqI,
  TeacherReqI, TeacherI,
  FileI, FileReqI,
  ClassI, ClassReqI,
  ClassUserI, ClassUserReqI,
  InvitationI,
} from '@/shares';
import { ForgotPasswordReq, ResetPasswordReq } from '@/modules/auth/dtos';

export interface BaseServiceI<RequestI, ResponseI> {
  find: (params?: any) => Promise<ResponseI[]>;
  findOne: (id: number) => Promise<ResponseI>;
  findOneBy: (params?: any) => Promise<ResponseI | null>;
  create: (data: RequestI) => Promise<ResponseI>;
  updateOne: (id: number, data: Partial<RequestI>) => Promise<ResponseI>;
  softDelete: (id: number) => Promise<{ msg: string }>;
}

export interface UserServiceI extends BaseServiceI<UserReqI, UserI> {
  findUserByEmailWithPassword: (email: string) => Promise<UserResI | null>;
}

export type StudentServiceI = BaseServiceI<StudentReqI, StudentI>;
export type TeacherServiceI = BaseServiceI<TeacherReqI, TeacherI>;

export interface AuthServiceI {
  login: (data: LoginReqI) => Promise<LoginResI>;
  register: (data: RegisterReqI) => Promise<{ msg: string }>;
  forgotPassword: (data: ForgotPasswordReq) => Promise<{ msg: string }>;
  resetPassword: (data: ResetPasswordReq) => Promise<{ msg: string }>;
}

export interface FileServiceI extends BaseServiceI<FileReqI, FileI> {
  uploadAndCreateFile: (file: Express.Multer.File) => Promise<FileI>;
}

export interface ClassServiceI extends BaseServiceI<ClassReqI, ClassI> {
  createAndJoinClass: (data: ClassReqI) => Promise<ClassI>;
}
export interface ClassUserServiceI extends BaseServiceI<ClassUserReqI, ClassUserI> {}
export interface InvitationServiceI {
  invite: (invitation: InvitationI) => Promise<{msg: string}>;
}