import { MigrationInterface, QueryRunner } from "typeorm"

export class AuthenticationTalbe1739875025637 implements MigrationInterface {
  name = "AuthenticationTalbe1739875025637"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "sessions" (
                "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
                "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "token" character varying NOT NULL,
                "user_agent" character varying,
                "metadata" json,
                "expires_at" TIMESTAMP,
                "user_id" integer,
                CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id")
            )
        `)
    await queryRunner.query(`
            CREATE TABLE "users" (
                "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
                "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
                "id" SERIAL NOT NULL,
                "fist_name" character varying,
                "last_name" character varying,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "role_id" integer,
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `)
    await queryRunner.query(`
            CREATE TABLE "roles" (
                "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
                "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone,
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "description" character varying,
                CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "roles"."name" IS 'Role name';
            COMMENT ON COLUMN "roles"."description" IS 'Role description'
        `)
    await queryRunner.query(`
            CREATE TABLE "abilities" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "can" boolean NOT NULL,
                "subject" character varying NOT NULL,
                "action" character varying NOT NULL,
                CONSTRAINT "PK_8cd72b52f6374bf02333abf365a" PRIMARY KEY ("id")
            )
        `)
    await queryRunner.query(`
            CREATE TABLE "role_abilities" (
                "role_id" integer NOT NULL,
                "ability_id" integer NOT NULL,
                CONSTRAINT "PK_07ad485e5ab2b34534cc978ca64" PRIMARY KEY ("role_id", "ability_id")
            )
        `)
    await queryRunner.query(`
            CREATE INDEX "IDX_1e8a9df86d8adbd9e20a6a0101" ON "role_abilities" ("role_id")
        `)
    await queryRunner.query(`
            CREATE INDEX "IDX_285ea6ef85f557217e3c564646" ON "role_abilities" ("ability_id")
        `)
    await queryRunner.query(`
            ALTER TABLE "sessions"
            ADD CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
    await queryRunner.query(`
            ALTER TABLE "role_abilities"
            ADD CONSTRAINT "FK_1e8a9df86d8adbd9e20a6a0101f" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `)
    await queryRunner.query(`
            ALTER TABLE "role_abilities"
            ADD CONSTRAINT "FK_285ea6ef85f557217e3c564646e" FOREIGN KEY ("ability_id") REFERENCES "abilities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "role_abilities" DROP CONSTRAINT "FK_285ea6ef85f557217e3c564646e"
        `)
    await queryRunner.query(`
            ALTER TABLE "role_abilities" DROP CONSTRAINT "FK_1e8a9df86d8adbd9e20a6a0101f"
        `)
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"
        `)
    await queryRunner.query(`
            ALTER TABLE "sessions" DROP CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19"
        `)
    await queryRunner.query(`
            DROP INDEX "public"."IDX_285ea6ef85f557217e3c564646"
        `)
    await queryRunner.query(`
            DROP INDEX "public"."IDX_1e8a9df86d8adbd9e20a6a0101"
        `)
    await queryRunner.query(`
            DROP TABLE "role_abilities"
        `)
    await queryRunner.query(`
            DROP TABLE "abilities"
        `)
    await queryRunner.query(`
            DROP TABLE "roles"
        `)
    await queryRunner.query(`
            DROP TABLE "users"
        `)
    await queryRunner.query(`
            DROP TABLE "sessions"
        `)
  }
}
