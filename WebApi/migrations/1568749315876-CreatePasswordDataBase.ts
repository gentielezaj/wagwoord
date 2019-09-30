import {MigrationInterface, QueryRunner} from "typeorm";

export class CreatePasswordDataBase1568749315876 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`create table "Password" (
            "id" INTEGER PRIMARY KEY AUTOINCREMENT,
            "name" varchar(64) not null,
            "domain" varchar not null,
            "username" varchar(128),
            "password" varchar not null,
            "waitTime" int,
            "lastModified" INT not NULL,
            "encrypted" INTEGER not null
           )`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('Password', true);
    }

}
