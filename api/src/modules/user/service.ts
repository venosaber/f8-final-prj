import {BaseService} from '@/modules/base/service';
import {Inject, Injectable} from '@nestjs/common';
import {UserEntity} from '@/modules/user/entity';
import {
    UserEntityRepository,
    UserReqI,
    UserResI,
    UserWithPassI,
    UserServiceI,
} from '@/shares';
import {Repository, SelectQueryBuilder} from 'typeorm';
import {ClsService} from "nestjs-cls";

@Injectable()
export class UserService
    extends BaseService<UserEntity, UserReqI, UserResI>
    implements UserServiceI {
    constructor(
        @Inject(UserEntityRepository)
        protected readonly repository: Repository<UserEntity>,
        protected readonly cls: ClsService,
    ) {
        super(repository, cls);
    }

    // remove password for security
    // remove id to avoid conflict when joining with FileEntity
    protected getPublicColumns(): string[] {
        return super.getPublicColumns().filter((column) => !['password', 'avatar', 'id'].includes(column));
    }

    protected handleSelect(): SelectQueryBuilder<UserEntity> {
        return this.repository
            .createQueryBuilder(this.getTableName())
            .select('user.id AS id')    // avoid conflict with FileEntity.id
            .addSelect(this.getPublicColumns())
            .addSelect(`
            CASE WHEN user_file.id IS NULL THEN NULL
                 ELSE json_build_object('id', user_file.id, 'url', user_file.url)
            END as avatar_info
        `)
            .leftJoin('user.file', 'user_file');
    }

    async findUserByEmailWithPassword(email: string): Promise<UserWithPassI | null> {
        const response: UserWithPassI | undefined = await this.handleSelect()
            .addSelect('user.password AS password')
            .where('user.email = :email', {email})
            .getRawOne<UserWithPassI>();
        if (!response) return null;
        return response;
    }
}
