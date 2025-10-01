import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueEmailIndexForActiveUsers1759309946127
  implements MigrationInterface
{
  name = 'AddUniqueEmailIndexForActiveUsers1759309946127';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // drop old indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_user_email_active"`);

    // create partial unique index: for user who has active = true
    await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_user_email_active"
                ON "user" ("email")
                WHERE "active" = true;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // drop index when rollback
    await queryRunner.query(`DROP INDEX "IDX_user_email_active"`);
  }
}
