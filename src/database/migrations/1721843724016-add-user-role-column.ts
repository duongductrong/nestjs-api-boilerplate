import { MigrationInterface, QueryRunner } from "typeorm"

export class AddUserRoleColumn1721843724016 implements MigrationInterface {
  name = "AddUserRoleColumn1721843724016"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`role_abilities\` DROP FOREIGN KEY \`FK_1e8a9df86d8adbd9e20a6a0101f\`
        `)
    await queryRunner.query(`
            ALTER TABLE \`role_abilities\` DROP FOREIGN KEY \`FK_285ea6ef85f557217e3c564646e\`
        `)
    await queryRunner.query(`
            ALTER TABLE \`users\`
            ADD \`role_id\` int NULL
        `)
    await queryRunner.query(`
            ALTER TABLE \`users\`
            ADD CONSTRAINT \`FK_a2cecd1a3531c0b041e29ba46e1\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE \`role_abilities\`
            ADD CONSTRAINT \`FK_285ea6ef85f557217e3c564646e\` FOREIGN KEY (\`ability_id\`) REFERENCES \`abilities\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `)
    await queryRunner.query(`
            ALTER TABLE \`role_abilities\`
            ADD CONSTRAINT \`FK_1e8a9df86d8adbd9e20a6a0101f\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`role_abilities\` DROP FOREIGN KEY \`FK_1e8a9df86d8adbd9e20a6a0101f\`
        `)
    await queryRunner.query(`
            ALTER TABLE \`role_abilities\` DROP FOREIGN KEY \`FK_285ea6ef85f557217e3c564646e\`
        `)
    await queryRunner.query(`
            ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_a2cecd1a3531c0b041e29ba46e1\`
        `)
    await queryRunner.query(`
            ALTER TABLE \`users\` DROP COLUMN \`role_id\`
        `)
    await queryRunner.query(`
            ALTER TABLE \`role_abilities\`
            ADD CONSTRAINT \`FK_285ea6ef85f557217e3c564646e\` FOREIGN KEY (\`ability_id\`) REFERENCES \`abilities\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE \`role_abilities\`
            ADD CONSTRAINT \`FK_1e8a9df86d8adbd9e20a6a0101f\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `)
  }
}
