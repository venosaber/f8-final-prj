import {
    EventSubscriber,
    EntitySubscriberInterface,
    SoftRemoveEvent,
} from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { BaseEntity } from '@/modules/base/entity';
import { UserI } from "@/shares";

@EventSubscriber()
export class BaseSubscriber implements EntitySubscriberInterface<BaseEntity> {
    constructor(private readonly cls: ClsService) {}

    private getAuthenticatedUserId(): number | null{
        const user = this.cls.get<UserI>('user');
        return user ? user.id : null;
    }

    listenTo() {
        return BaseEntity;
    }

    /**
     * Will be called before any entities extended from BaseEntity are soft-deleted
     * To update "deletedBy" and "active" (deletedAt has been already handled by DeleteDateColumn decorator)
     */
    async beforeSoftRemove(event: SoftRemoveEvent<BaseEntity>) {
        const deletedBy: number | null = this.getAuthenticatedUserId();

        // event.metadata.target will pick up the target entity class (UserEntity, ClassEntity,...)
        // this action will be included in the same transaction as the soft delete command
        await event.queryRunner.manager.update(
            event.metadata.target,
            event.entityId,
            {
                deletedBy: deletedBy,
                active: false,
            },
        );
    }
}