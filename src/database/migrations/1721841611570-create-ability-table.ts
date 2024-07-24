import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateAbilityTable1721841611570 implements MigrationInterface {
  name = "CreateAbilityTable1721841611570"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`abilities\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                \`can\` tinyint NOT NULL,
                \`subject\` varchar(255) NOT NULL,
                \`action\` varchar(255) NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `)
    await queryRunner.query(`
            CREATE TABLE \`role_abilities\` (
                \`role_id\` int NOT NULL,
                \`ability_id\` int NOT NULL,
                INDEX \`IDX_1e8a9df86d8adbd9e20a6a0101\` (\`role_id\`),
                INDEX \`IDX_285ea6ef85f557217e3c564646\` (\`ability_id\`),
                PRIMARY KEY (\`role_id\`, \`ability_id\`)
            ) ENGINE = InnoDB
        `)
    await queryRunner.query(`
            ALTER TABLE \`role_abilities\`
            ADD CONSTRAINT \`FK_1e8a9df86d8adbd9e20a6a0101f\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `)
    await queryRunner.query(`
            ALTER TABLE \`role_abilities\`
            ADD CONSTRAINT \`FK_285ea6ef85f557217e3c564646e\` FOREIGN KEY (\`ability_id\`) REFERENCES \`abilities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`role_abilities\` DROP FOREIGN KEY \`FK_285ea6ef85f557217e3c564646e\`
        `)
    await queryRunner.query(`
            ALTER TABLE \`role_abilities\` DROP FOREIGN KEY \`FK_1e8a9df86d8adbd9e20a6a0101f\`
        `)
    await queryRunner.query(`
            DROP INDEX \`IDX_285ea6ef85f557217e3c564646\` ON \`role_abilities\`
        `)
    await queryRunner.query(`
            DROP INDEX \`IDX_1e8a9df86d8adbd9e20a6a0101\` ON \`role_abilities\`
        `)
    await queryRunner.query(`
            DROP TABLE \`role_abilities\`
        `)
    await queryRunner.query(`
            DROP TABLE \`abilities\`
        `)
  }
}
