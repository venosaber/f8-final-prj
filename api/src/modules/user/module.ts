import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database/module';
import { DATA_SOURCE } from '@/shares';
import { DataSource } from 'typeorm';
import { UserEntityRepository, UserServiceToken } from '@/shares';
import { UserEntity } from '@/modules/user/entity';
import { UserService } from '@/modules/user/service';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [
    {
      provide: UserEntityRepository,
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(UserEntity),
      inject: [DATA_SOURCE],
    },
    {
      provide: UserServiceToken,
      useClass: UserService,
    },
  ],
  exports: [UserEntityRepository, UserServiceToken],
})
export class UserModule {}
