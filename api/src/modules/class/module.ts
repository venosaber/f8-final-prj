import { Module } from '@nestjs/common';
import { DatabaseModule } from "@/database/module";
import {DATA_SOURCE, ClassEntityRepository, ClassServiceToken} from "@/shares";
import {DataSource} from "typeorm";
import {ClassEntity} from "@/modules/class/entity";
import {ClassService} from "@/modules/class/service";
import {ClassUserModule} from "@/modules/classUser/module";
import {UserModule} from "@/modules/user/module";
import {ClassController} from "@/modules/class/controller";

@Module({
    imports: [DatabaseModule, ClassUserModule, UserModule],
    controllers: [ClassController],
    providers: [{
        provide: ClassEntityRepository,
        useFactory: (dataSource: DataSource)=> dataSource.getRepository(ClassEntity),
        inject: [DATA_SOURCE]
    },{
        provide: ClassServiceToken,
        useClass: ClassService
    }],
    exports: [ClassServiceToken]
})
export class ClassModule {}