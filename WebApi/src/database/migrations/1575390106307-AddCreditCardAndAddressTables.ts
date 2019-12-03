import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCreditCardAndAddressTables1575390106307 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "Address" 
            ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
             "lastModified" integer NOT NULL,
             "deleted" integer NOT NULL DEFAULT (0),
             "encrypted" integer NOT NULL DEFAULT (0),
             "count" integer NOT NULL DEFAULT (0),
             "firstName" varchar(64) NOT NULL,
             "lastName" varchar(64) NOT NULL,
             "birthDate" date NOT NULL,
             "street" varchar(2048) NOT NULL,
             "secundStreet" varchar(2048) NOT NULL,
             "city" varchar(128) NOT NULL,
             "state" varchar(128) NOT NULL,
             "country" varchar(128) NOT NULL,
             "username" varchar(128) NOT NULL,
             "postalCode" varchar(128) NOT NULL,
             "organization" varchar(128) NOT NULL,
             "phone" varchar(128) NOT NULL)`,
             undefined);

        await queryRunner.query(`CREATE TABLE "CreditCard" 
        ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
         "lastModified" integer NOT NULL,
         "deleted" integer NOT NULL DEFAULT (0),
         "encrypted" integer NOT NULL DEFAULT (0),
         "count" integer NOT NULL DEFAULT (0),
         "name" varchar(254) NOT NULL,
         "cardType" varchar(254) NOT NULL,
         "expiredMonth" integer NOT NULL,
         "cardNumber" varchar(64) NOT NULL,
         "expiredYear" integer NOT NULL)`,
         undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "CreditCard"`, undefined);
        await queryRunner.query(`DROP TABLE "Address"`, undefined);
    }

}
