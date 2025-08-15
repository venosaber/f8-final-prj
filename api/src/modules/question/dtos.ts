import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { QuestionReqI } from '@/shares';

//payload / body
export class QuestionReq implements QuestionReqI {
    @ApiProperty({
        example: 1,
    })
    @IsNumber()
    @IsOptional()
    id?: number;

    @ApiProperty({
        example: 0,
    })
    @IsNumber()
    @IsNotEmpty()
    index: number;

    @ApiProperty({
        example: 'multiple-choice',
    })
    @IsString()
    @IsNotEmpty()
    type: string;

    @ApiProperty({
        example: 'A,C',
    })
    @IsString()
    correct_answer: string;

    @IsNumber()
    @IsOptional()
    exam_id?: number;
}
