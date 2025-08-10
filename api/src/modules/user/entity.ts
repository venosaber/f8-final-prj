import { BaseEntity } from '@/modules/base/entity';
import {Column, Entity, OneToMany} from 'typeorm';
import { Role } from '@/shares';
import {ClassUserEntity} from "@/modules/classUser/entity";

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.STUDENT,
  })
  role: Role;

  @Column()
  password: string;

  @Column()
  status: string;

  @Column({ type: 'int', nullable: true })
  avatar: number | null;

  @Column({ type: 'varchar', nullable: true })
  parent_name: string | null;

  @Column({ type: 'varchar', nullable: true })
  parent_phone: string | null;

  @OneToMany(()=> ClassUserEntity, classUser => classUser.user)
  classUsers: ClassUserEntity[];
}
