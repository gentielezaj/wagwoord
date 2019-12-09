import {MigrationInterface, QueryRunner} from "typeorm";

export class ReinsertAddressTable1575915427308 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('Address');
        await queryRunner.query(`CREATE TABLE "Address" 
            ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
             "lastModified" integer NOT NULL,
             "deleted" integer NOT NULL DEFAULT (0),
             "encrypted" integer NOT NULL DEFAULT (0),
             "count" integer NOT NULL DEFAULT (0),
             "firstName" varchar(64),
             "lastName" varchar(64),
             "birthDate" date,
             "street" varchar(2048),
             "secundStreet" varchar(2048),
             "city" varchar(128),
             "state" varchar(128),
             "country" varchar(128),
             "username" varchar(128),
             "postalCode" varchar(128),
             "organization" varchar(128),
             "phone" varchar(128))`,
             undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('Address');
    }

}
