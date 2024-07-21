import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateUserTable1721490327615 implements MigrationInterface {
  name = "CreateUserTable1721490327615"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`sessions\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`token\` varchar(255) NOT NULL,
                \`browser_name\` varchar(255) NULL,
                \`metadata\` json NULL,
                \`userId\` int NULL,
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
