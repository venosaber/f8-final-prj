import { ApiProperty } from '@nestjs/swagger';
import {IsString, IsNotEmpty, IsNumber, ValidateNested} from 'class-validator';
import {ExamReqI, QuestionReqI} from '@/shares';
import {QuestionReq} from "@/modules/question/dtos";
import {plainToInstance, Transform, Type} from "class-transformer";

//payload / body
export class ExamReq implements ExamReqI {
    @ApiProperty({
        example: 1,
    })
    @IsNumber()
    @Type(() => Number)
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
    @Type(() => Number)
    @IsNotEmpty()
    number_of_question: number;

    @ApiProperty({
        example: 900,
    })
    @IsNumber()
    @Type(() => Number)
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
    @Transform(({ value }) => {
        let parsedValue: any[];
        if (typeof value === 'string') {
            try {
                parsedValue = JSON.parse(value);
            } catch {
                return 'invalid json';
            }
        } else {
            parsedValue = value;
        }
        if (!Array.isArray(parsedValue)) {
            console.log('not array')
            return parsedValue;
        }
        return parsedValue.map(obj => plainToInstance(QuestionReq, obj));
    })
    questions: QuestionReq[];
}

export class CreateExamWithFileDto extends ExamReq {
    @ApiProperty({
        type: 'string',
        format: 'binary', // inform to Swagger that this is a file upload
        required: true, // a file is required to create an exam
        description: 'exam document file (pdf/images)',
    })
    examFile: any;
}

export class UpdateExamWithFileDto extends ExamReq {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: false,
        description: 'exam document file (pdf/images)'
    })
    examFile: any;
}
