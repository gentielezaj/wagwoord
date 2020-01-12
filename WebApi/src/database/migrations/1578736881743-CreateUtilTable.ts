import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUtilTable1578736881743 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "Util" 
            ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
             "lastModified" integer NOT NULL,
             "deleted" integer NOT NULL DEFAULT (0),
             "key" varchar(64) NOT NULL,
             "value" varchar,
             CONSTRAINT "util_key" UNIQUE ("key"))`
            , undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("Util");
    }

}
