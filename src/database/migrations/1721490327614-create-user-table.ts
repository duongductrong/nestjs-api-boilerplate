import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateUserTable1721490327614 implements MigrationInterface {
  name = "CreateUserTable1721490327614"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`first_name\` varchar(255) NULL,
                \`last_name\` varchar(255) NULL,
                \`email\` varchar(255) NOT NULL UNIQUE,
                \`password\` varchar(255) NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE \`users\`
        `)
  }
}
