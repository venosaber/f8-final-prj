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
    UseInterceptors
} from '@nestjs/common';
import {ApiBearerAuth, ApiQuery, ApiTags} from '@nestjs/swagger';
import {ExamServiceToken} from "@/shares";
import type {ExamServiceI} from "@/shares";
import {ExamReq} from "@/modules/exam/dtos";
import {OptionalParseIntPipe} from "@/shares";
import {AuthGuard} from "@/modules/auth/guard";
import {RolesGuard} from "@/modules/auth/roles.guard";
import {ExamInterceptor} from "@/modules/exam/interceptor";

@ApiTags('Exam')
@Controller('exams')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
export class ExamController {
    constructor(
        @Inject(ExamServiceToken)
         private readonly examService: ExamServiceI
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
    create(@Body() data: ExamReq){
        return this.examService.create(data);
    }

    @Put(':id')
    updateOne(@Param('id', ParseIntPipe) id: number, @Body() data: ExamReq){
        return this.examService.updateOne(id, data);
    }

    @Delete(':id')
    softDelete(@Param('id', ParseIntPipe) id: number){
        return this.examService.softDelete(id);
    }
}