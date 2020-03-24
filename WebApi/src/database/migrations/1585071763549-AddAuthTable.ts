import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAuthTable1585071763549 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "Auth" 
            ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
             "lastModified" integer NOT NULL,
             "deleted" integer NOT NULL DEFAULT (0),
             "key" varchar(64) NOT NULL,
             "value" TEXT,
             CONSTRAINT "util_key" UNIQUE ("key"))`
            , undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        queryRunner.dropTable("Auth")
    }

}
