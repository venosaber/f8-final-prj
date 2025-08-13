import {Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Post, Put, Query, UseGuards} from "@nestjs/common";
import type {ExamGroupServiceI} from "@/shares";
import {ExamGroupServiceToken} from "@/shares";
import {ExamGroupReq} from "@/modules/exam_group/dtos";
import {ApiBearerAuth, ApiQuery, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "@/modules/auth/guard";
import {OptionalParseIntPipe} from "@/shares";

@ApiTags('Exam Group')
@Controller('exam_groups')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class ExamGroupController {
    constructor(
        @Inject(ExamGroupServiceToken)
        private readonly examGroupService: ExamGroupServiceI
    ) {}

    @Get()
    @ApiQuery({
        name: 'class_id',
        required: false,
        type: Number,
        description: 'Optional class ID to filter exam groups'
    })
    findAll(@Query('class_id', OptionalParseIntPipe) classId?: number){
        if(classId){
            return this.examGroupService.find({class_id: classId})
        }
        return this.examGroupService.find();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number){
        return this.examGroupService.findOne(id);
    }

    @Post()
    create(@Body() data: ExamGroupReq){
        return this.examGroupService.create(data);
    }

    @Put(':id')
    updateOne(@Param('id', ParseIntPipe) id: number, @Body() data: ExamGroupReq){
        return this.examGroupService.updateOne(id, data);
    }

    @Delete(':id')
    softDelete(@Param('id', ParseIntPipe) id: number){
        return this.examGroupService.softDelete(id);
    }
}