import {MigrationInterface, QueryRunner} from "typeorm";

export class addSettingsTable1572106005058 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "Settings" 
            ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
             "lastModified" integer NOT NULL,
             "deleted" integer NOT NULL DEFAULT (0),
             "name" varchar(64) NOT NULL,
             "value" varchar NOT NULL,
             CONSTRAINT "settings_name" UNIQUE ("name"))`
        , undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "Settings"`, undefined);
    }

}
