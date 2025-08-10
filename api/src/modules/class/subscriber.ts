import {
    EventSubscriber,
    EntitySubscriberInterface,
    SoftRemoveEvent,
} from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { ClassEntity } from '@/modules/class/entity';
import { ClassUserEntity } from '@/modules/classUser/entity';
import { UserI } from "@/shares";

@EventSubscriber()
export class ClassSubscriber implements EntitySubscriberInterface<ClassEntity> {
    constructor(private readonly cls: ClsService) {}

    private getAuthenticatedUserId(): number | null{
        const user = this.cls.get<UserI>('user');
        return user ? user.id : null;
    }

    listenTo() {
        return ClassEntity;
    }

    /**
     * Will be called before a ClassEntity is soft-deleted.
     * To "soft-delete cascade" in related tables (ClassUserEntity).
     */
    async beforeSoftRemove(event: SoftRemoveEvent<ClassEntity>): Promise<void> {
        const deletedBy: number | null = this.getAuthenticatedUserId();
        const classIdToDelete = event.entityId;

        if (classIdToDelete) {
            await event.queryRunner.manager.update(
                ClassUserEntity,
                { class_id: classIdToDelete }, // for WHERE condition
                {
                    deletedAt: () => 'CURRENT_TIMESTAMP',
                    deletedBy: deletedBy,
                    active: false,
                },
            );
        }
    }
}