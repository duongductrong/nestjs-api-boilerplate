import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateSessionTable1721576312094 implements MigrationInterface {
  name = "CreateSessionTable1721576312094"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`sessions\` (
                \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`id\` varchar(36) NOT NULL,
                \`token\` varchar(255) NOT NULL,
                \`user_agent\` varchar(255) NULL,
                \`metadata\` json NULL,
                \`userId\` int NULL,
                \`expires_at\` timestamp NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `)
    await queryRunner.query(`
            ALTER TABLE \`sessions\`
            ADD CONSTRAINT \`FK_57de40bc620f456c7311aa3a1e6\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`sessions\` DROP FOREIGN KEY \`FK_57de40bc620f456c7311aa3a1e6\`
        `)
    await queryRunner.query(`
            DROP TABLE \`sessions\`
        `)
  }
}
