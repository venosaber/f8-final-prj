import { BaseService } from '@/modules/base/service';
import {Inject, Injectable} from '@nestjs/common';
import { UserEntity } from '@/modules/user/entity';
import {
  UserEntityRepository,
  UserReqI,
  UserI,
  UserServiceI,
} from '@/shares';
import { Repository } from 'typeorm';
import {ClsService} from "nestjs-cls";

@Injectable()
export class UserService
  extends BaseService<UserEntity, UserReqI, UserI>
  implements UserServiceI
{
  constructor(
    @Inject(UserEntityRepository)
    protected readonly repository: Repository<UserEntity>,
    protected readonly cls: ClsService,
  ) {
    super(repository, cls);
  }

  protected getPublicColumns(): string[] {
    return super.getPublicColumns().filter((column) => column !== 'password');
  }

  async findUserByEmailWithPassword(email: string): Promise<UserEntity | null> {
    return await this.repository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }
}
