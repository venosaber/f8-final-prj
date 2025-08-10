import { UserService } from '@/modules/user/service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from '@/modules/user/entity';
import { SelectQueryBuilder } from 'typeorm';
import { Role, StudentServiceI } from '@/shares';

@Injectable()
export class StudentService extends UserService implements StudentServiceI {
  protected handleWhere(
    query: SelectQueryBuilder<UserEntity>,
    condition: Partial<Record<keyof UserEntity, any>>,
  ): SelectQueryBuilder<UserEntity> {
    return super.handleWhere(query, { ...condition, role: 'student' });
  }

  async updateOne(id: number, data: Partial<UserEntity>) {
    const user = await this.findOne(id);
    if (!user || user.role !== Role.STUDENT)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return super.updateOne(id, data);
  }

  async softDelete(id: number) {
    const user = await this.findOne(id);
    if (!user || user.role !== Role.STUDENT)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return super.softDelete(id);
  }
}
