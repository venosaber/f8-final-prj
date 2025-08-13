import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/module';
import {AuthModule} from "@/modules/auth/module";
import {StudentModule} from "@/modules/student/module";
import {TeacherModule} from "@/modules/teacher/module";
import {ClassModule} from "@/modules/class/module";
import {InvitationModule} from "@/modules/invitation/module";

import {ClsModule} from "nestjs-cls";
import {ConfigModule} from "@nestjs/config";
import {ExamGroupModule} from "@/modules/exam_group/module";
import {QuestionModule} from "@/modules/question/module";
import {ExamModule} from "@/modules/exam/module";

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        // for all routes
        mount: true,
      }
    }),
    ConfigModule.forRoot({isGlobal: true}),

    DatabaseModule,
    AuthModule,
    StudentModule,
    TeacherModule,
    ClassModule,
    InvitationModule,
    ExamGroupModule,
    QuestionModule,
    ExamModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
