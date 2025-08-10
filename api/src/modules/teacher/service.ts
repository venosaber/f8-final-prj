import { UserService } from '@/modules/user/service';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '@/modules/user/entity';
import { SelectQueryBuilder } from 'typeorm';
import { Role, TeacherServiceI } from '@/shares';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class TeacherService extends UserService implements TeacherServiceI {
  protected handleWhere(
    query: SelectQueryBuilder<UserEntity>,
    condition: Partial<Record<keyof UserEntity, any>>,
  ): SelectQueryBuilder<UserEntity> {
    return super.handleWhere(query, { ...condition, role: 'teacher' });
  }

  async updateOne(id: number, data: Partial<UserEntity>) {
    const user = await this.findOne(id);
    if (!user || user.role !== Role.TEACHER)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return super.updateOne(id, data);
  }

  async softDelete(id: number) {
    const user = await this.findOne(id);
    if (!user || user.role !== Role.TEACHER)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return super.softDelete(id);
  }
}
