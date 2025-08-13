import { DataSource } from 'typeorm';
import { DATA_SOURCE } from "@/shares";
import {PasswordResetTokenEntity} from "@/modules/password_reset_token/entity";
import {UserEntity} from "@/modules/user/entity";
import {FileEntity} from "@/modules/file/entity";
import {ClassEntity} from "@/modules/class/entity";
import {ClassUserEntity} from "@/modules/class_user/entity";
import {ClassSubscriber} from "@/modules/class/subscriber";
import {UserSubscriber} from "@/modules/user/subscriber";
import {ExamGroupEntity} from "@/modules/exam_group/entity";
import {QuestionEntity} from "@/modules/question/entity";
import {ExamEntity} from "@/modules/exam/entity";
import { addTransactionalDataSource } from 'typeorm-transactional';
import {BaseCascadeSubscriber} from "@/modules/base/subscriber";

export const databaseProviders = [
    {
        provide: DATA_SOURCE,
        useFactory: async () => {
            const dataSource = new DataSource({
                type: 'postgres',
                host: 'db',
                port: 5432,
                username: process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASSWORD,
                database: process.env.POSTGRES_DB,
                entities: [
                    UserEntity,
                    PasswordResetTokenEntity,
                    FileEntity,
                    ClassEntity,
                    ClassUserEntity,
                    ExamGroupEntity,
                    QuestionEntity,
                    ExamEntity,
                ],
                subscribers: [BaseCascadeSubscriber, UserSubscriber, ClassSubscriber],
                synchronize: true,
            });

            await dataSource.initialize();

            addTransactionalDataSource(dataSource);
            BaseCascadeSubscriber.dataSource = dataSource;
            return dataSource;
        },
    },
];
