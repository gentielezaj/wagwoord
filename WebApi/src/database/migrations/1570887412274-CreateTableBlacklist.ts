import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableBlacklist1570887412274 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "Blacklist" (
            "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
            "lastModified" integer NOT NULL,
            "deleted" integer NOT NULL DEFAULT (0),
            "name" varchar(64) NOT NULL,
            "password" integer NOT NULL DEFAULT (0),
            "address" integer NOT NULL DEFAULT (0),
            "creditCard" integer NOT NULL DEFAULT (0),
            "codeGenerator" integer NOT NULL DEFAULT (0)
          )`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "Blacklist"`, undefined);
    }

}
