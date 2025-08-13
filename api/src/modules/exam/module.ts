import {Module} from "@nestjs/common";
import {DatabaseModule} from "@/database/module";
import {QuestionModule} from "@/modules/question/module";
import {DATA_SOURCE, ExamEntityRepository, ExamServiceToken} from "@/shares";
import {DataSource} from "typeorm";
import {ExamEntity} from "@/modules/exam/entity";
import {ExamService} from "@/modules/exam/service";
import {ExamController} from "@/modules/exam/controller";
import {UserModule} from "@/modules/user/module";

@Module({
    imports: [DatabaseModule, QuestionModule, UserModule],
    controllers: [ExamController],
    providers: [{
        provide: ExamEntityRepository,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExamEntity),
        inject: [DATA_SOURCE]
    }, {
        provide: ExamServiceToken,
        useClass: ExamService
    }],
})
export class ExamModule {}