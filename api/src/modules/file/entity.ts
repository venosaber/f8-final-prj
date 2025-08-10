import { BaseEntity } from '@/modules/base/entity';
import {Entity, Column} from "typeorm";

@Entity('file')
export class FileEntity extends BaseEntity{
    @Column({
        name: 'public_id',
        unique: true
    })
    publicId: string;

    @Column({
        unique: true
    })
    url: string;

    @Column({
        name: 'original_name'
    })
    originalName: string;

    @Column({
        name: 'file_type',
        type: 'varchar',
        length: 50
    })
    fileType: string;

    @Column()
    size: number;
}