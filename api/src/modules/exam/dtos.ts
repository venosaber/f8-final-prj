import { ApiProperty } from '@nestjs/swagger';
import {IsString, IsNotEmpty, IsNumber, ValidateNested} from 'class-validator';
import {ExamReqI, QuestionReqI} from '@/shares';
import {QuestionReq} from "@/modules/question/dtos";
import {Type} from "class-transformer";

//payload / body
export class ExamReq implements ExamReqI {
    @ApiProperty({
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    exam_group_id: number;

    @ApiProperty({
        example: 'test name',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: 'abc123',
    })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({
        example: 10,
    })
    @IsNumber()
    @IsNotEmpty()
    number_of_question: number;

    @ApiProperty({
        example: 900,
    })
    @IsNumber()
    @IsNotEmpty()
    total_time: number;

    @ApiProperty({
        example: 'test description',
    })
    @IsString()
    description: string;

    @ApiProperty({
        type: [QuestionReq],
        description: 'list of questions',
    })
    @ValidateNested({ each: true })
    @Type(() => QuestionReq)
    questions: QuestionReqI[];
}
