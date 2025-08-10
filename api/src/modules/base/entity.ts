import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  createdBy: number | null;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  updatedBy: number | null;

  @DeleteDateColumn({
    type: 'timestamp',
  })
  deletedAt: Date;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  deletedBy: number | null;

  @Column({
    type: 'boolean',
    default: true,
  })
  active: boolean;
}
