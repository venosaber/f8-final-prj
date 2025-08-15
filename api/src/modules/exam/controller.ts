import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Post,
    Put,
    Query,
    ParseIntPipe,
    UseGuards,
    UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator
} from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiTags} from '@nestjs/swagger';
import {ExamServiceToken, FileServiceToken} from "@/shares";
import type {ExamServiceI, FileServiceI} from "@/shares";
import {ExamReq} from "@/modules/exam/dtos";
import {AuthGuard} from "@/modules/auth/guard";
import {RolesGuard} from "@/modules/auth/roles.guard";
import {ExamInterceptor} from "@/modules/exam/interceptor";
import {FileInterceptor} from "@nestjs/platform-express";
import {CreateExamWithFileDto, UpdateExamWithFileDto} from "@/modules/exam/dtos";
import {MultiFileType, OptionalParseIntPipe} from "@/shares";
import {Transactional} from "typeorm-transactional";

@ApiTags('Exam')
@Controller('exams')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
export class ExamController {
    constructor(
        @Inject(ExamServiceToken)
         private readonly examService: ExamServiceI,
        @Inject(FileServiceToken)
        private readonly fileService: FileServiceI,
    ) {}

    @Get()
    @UseInterceptors(ExamInterceptor)
    @ApiQuery({
        name: 'exam_group_id',
        required: false,
        type: Number,
        description: 'Optional exam group ID to filter exams'
    })
    findAll(@Query('exam_group_id', OptionalParseIntPipe) examGroupId?: number){
        if(examGroupId && examGroupId > 0){
            return this.examService.find({exam_group_id: examGroupId})
        }
        return this.examService.find();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number){
        return this.examService.findOne(id);
    }

    @Post()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'File for the exam',
        type: CreateExamWithFileDto
    })
    @Transactional()
    @UseInterceptors(FileInterceptor('examFile'))
    async create(
        @Body() data: ExamReq,
        @UploadedFile(
            // use Pipe to validate the file
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({maxSize: 1024 * 1024 * 10}), // 10MB
                    new MultiFileType({
                        fileTypes: ['image/png', 'image/jpeg', 'image/gif','application/pdf'],
                    }),
                ],
                fileIsRequired: true,
            }),
        )
        file: Express.Multer.File,
    ){
        console.log(data);
        // upload and create a file record
        const examFile = await this.fileService.uploadAndCreateFile(file);

        const createData = {...data};
        if(examFile.id){
            createData['file_id'] = examFile.id ;
        }

        return this.examService.create(createData);
    }

    @Put(':id')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'File for the exam',
        type: UpdateExamWithFileDto
    })
    @Transactional()
    @UseInterceptors(FileInterceptor('examFile'))
    async updateOne(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: ExamReq,
        @UploadedFile(
            // use Pipe to validate the file
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({maxSize: 1024 * 1024 * 10}), // 10MB
                    new MultiFileType({
                        fileTypes: ['image/png', 'image/jpeg', 'image/gif','application/pdf'],
                    }),
                ],
                fileIsRequired: false,
            }),
        )
        file?: Express.Multer.File,
        ){
        let fileId: number| undefined = undefined;
        if (file) {
            // upload and create a file record
            const examFile = await this.fileService.uploadAndCreateFile(file);
            fileId = examFile.id;
        }

        const updateData = {...data};
        if(fileId){
            updateData['file_id'] = fileId;
        }
        return this.examService.updateOne(id, updateData);
    }

    @Delete(':id')
    softDelete(@Param('id', ParseIntPipe) id: number){
        return this.examService.softDelete(id);
    }
}