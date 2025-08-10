import { DataSource } from 'typeorm';
import { DATA_SOURCE } from "@/shares";
import {PasswordResetTokenEntity} from "@/modules/password_reset_token/entity";
import {UserEntity} from "@/modules/user/entity";
import {FileEntity} from "@/modules/file/entity";
import {ClassEntity} from "@/modules/class/entity";
import {ClassUserEntity} from "@/modules/classUser/entity";

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
                ],
                synchronize: true,
            });

            return dataSource.initialize();
        },
    },
];
