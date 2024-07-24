import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateRoleTable1721839398864 implements MigrationInterface {
  name = "CreateRoleTable1721839398864"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`roles\` (
                \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL COMMENT 'Role name',
                \`description\` varchar(255) NULL COMMENT 'Role description',
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE \`roles\`
        `)
  }
}
