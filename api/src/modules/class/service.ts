import {BaseService} from "@/modules/base/service";
import {ClassEntity} from "@/modules/class/entity";
import type {ClassI, ClassReqI, ClassServiceI, ClassUserServiceI} from "@/shares";
import {ClassEntityRepository, ClassUserServiceToken} from "@/shares";
import {Inject, Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {ClsService} from "nestjs-cls";
import {HttpException, HttpStatus} from "@nestjs/common";
import {ClassUserEntity} from "@/modules/class_user/entity";
import {UserEntity} from "@/modules/user/entity";
import {Transactional} from "typeorm-transactional";

@Injectable()
export class ClassService extends BaseService<ClassEntity, ClassReqI, ClassI>
    implements ClassServiceI {
    constructor(
        @Inject(ClassEntityRepository)
        protected readonly repository: Repository<ClassEntity>,
        protected readonly cls: ClsService,
        @Inject(ClassUserServiceToken)
        private readonly classUserService: ClassUserServiceI,
    ) {
        super(repository, cls);
    }

    protected handleSelect() {
        return this.repository
            .createQueryBuilder(this.getTableName())
            .select([
                'class.id as id',
                'class.name as name',
                'class.code as code',
                `coalesce(
                    json_agg(
                        json_build_object(
                            'id', "user".id,
                            'name', "user".name,
                            'role', "user".role,
                            'email', "user".email
                        )
                    ) filter (where "user".role = 'teacher'),
                 '[]') as teachers, 
                    
                 coalesce(
                    json_agg(
                        json_build_object(
                            'id', "user".id,
                            'name', "user".name,
                            'role', "user".role,
                            'email', "user".email
                        )
                    ) filter (where "user".role = 'student'),
                 '[]') as students
                `
            ])
            .innerJoin(ClassUserEntity, 'class_user', 'class_user.class_id = class.id and class_user.active = true')
            .innerJoin(UserEntity, 'user', '"user".id = class_user.user_id and "user".active = true')
            .groupBy('class.id, class.name, class.code');
    }

    @Transactional()
    async createAndJoinClass(classReq: ClassReqI): Promise<ClassI> {
        const creatorId = this.getAuthenticatedUserId();
        const newClass = await this.create(classReq);
        if (!creatorId || !newClass)
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);

        // automatically add the creator (teacher) to the class
        await this.classUserService.create({
            class_id: newClass.id,
            user_id: creatorId
        })

        const {id, name, code} = newClass;
        return {id, name, code};
    }

}