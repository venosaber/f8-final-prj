import {ApiBearerAuth, ApiQuery, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Get, Inject, Param, ParseIntPipe, Post, Put, UseGuards, Query} from "@nestjs/common";
import {ExamResultServiceToken} from "@/shares";
import type {ExamResultServiceI} from "@/shares";
import {CreateExamResultDto, UpdateExamResultDto} from "@/modules/exam_result/dtos";
import {AuthGuard} from "@/modules/auth/guard";

@ApiTags('Exam Result')
@Controller('exam_results')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class ExamResultController {
    constructor(
        @Inject(ExamResultServiceToken)
        private readonly examResultService: ExamResultServiceI
    ) {}

    @Get()
    @ApiQuery({ name: 'exam_group_id', required: true, type: Number, description: 'exam group ID'})
    @ApiQuery({ name: 'user_id', required: true, type: Number, description: 'student ID'})
    findAll(
        @Query('exam_group_id', ParseIntPipe) examGroupId: number,
        @Query('user_id', ParseIntPipe) userId: number
    ){
    return this.examResultService.findAndFilter(examGroupId, userId);
    }

    @Post()
    create(@Body() data: CreateExamResultDto){
        return this.examResultService.create(data);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number){
        return this.examResultService.findOne(id);
    }

    @Put(':id')
    updateOne(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateExamResultDto){
        return this.examResultService.updateOne(id, data);
    }
}