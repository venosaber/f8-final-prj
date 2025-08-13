import { BaseEntity } from '@/modules/base/entity';
import {Column, Entity, JoinColumn, ManyToOne} from 'typeorm';
import {ExamEntity} from "@/modules/exam/entity";

@Entity('question')
export class QuestionEntity extends BaseEntity {
    @Column()
    exam_id: number;

    @Column()
    index: number;

    @Column()
    type: string;

    @Column()
    correct_answer: string;

    @ManyToOne(()=> ExamEntity)
    @JoinColumn({ name: 'exam_id' })
    exam: ExamEntity;
}
