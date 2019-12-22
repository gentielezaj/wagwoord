import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateCodeGeneratorEncodingToHex1577008971490 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const lastModified = new Date().getTime();
        await queryRunner.query(`UPDATE CodeGenerator SET encoding = 'hex', algorithm = 'sha1', lastModified = '${lastModified}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
