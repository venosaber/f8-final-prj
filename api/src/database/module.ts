import { Module } from '@nestjs/common';
import { databaseProviders } from './providers';
import {ClassSubscriber} from "@/modules/class/subscriber";
import {UserSubscriber} from "@/modules/user/subscriber";

@Module({
    providers: [...databaseProviders, ClassSubscriber, UserSubscriber],
    exports: [...databaseProviders],
})
export class DatabaseModule {}
