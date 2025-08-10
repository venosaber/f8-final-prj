import {
    EventSubscriber,
    EntitySubscriberInterface,
    SoftRemoveEvent,
} from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { UserEntity } from '@/modules/user/entity';
import { ClassUserEntity } from '@/modules/classUser/entity';
import { UserI } from "@/shares";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
    constructor(private readonly cls: ClsService) {}

    private getAuthenticatedUserId(): number | null{
        const user = this.cls.get<UserI>('user');
        return user ? user.id : null;
    }

    listenTo() {
        return UserEntity;
    }

    /**
     * Will be called before a UserEntity is soft-deleted.
     * To "soft-delete cascade" in related tables (ClassUserEntity).
     */
    async beforeSoftRemove(event: SoftRemoveEvent<UserEntity>): Promise<void> {
        const deletedBy: number | null = this.getAuthenticatedUserId();
        const userIdToDelete = event.entityId;

        if (userIdToDelete) {
            await event.queryRunner.manager.update(
                ClassUserEntity,
                { user_id: userIdToDelete }, // for WHERE condition
                {
                    deletedAt: () => 'CURRENT_TIMESTAMP',
                    deletedBy: deletedBy,
                    active: false,
                },
            );
        }
    }
}