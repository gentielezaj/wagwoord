import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCodeGeneratorTable1574877308169 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE "CodeGenerator" 
            ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "lastModified" integer NOT NULL,
                "deleted" integer NOT NULL DEFAULT (0),
                "issuer" varchar(64) NOT NULL,
                "username" varchar(128) NOT NULL,
                "secret" varchar NOT NULL,
                "encrypted" integer NOT NULL DEFAULT (0),
                "digits" integer DEFAULT (6),
                "encoding" varchar(512) DEFAULT ('ascii'),
                "algorithm" varchar(512) DEFAULT ('sha1'),
                "epoch" integer,
                "step" integer NOT NULL DEFAULT (30),
                "window" integer DEFAULT (0),
                "icon" nvarchar)`,
            undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "CodeGenerator"`, undefined);
    }

}
