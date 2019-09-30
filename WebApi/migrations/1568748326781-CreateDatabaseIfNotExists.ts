import {MigrationInterface, QueryRunner} from "typeorm";
import {existsSync, writeFileSync, unlinkSync } from 'fs';

export class CreateDatabaseIfNotExists1568748326781 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const dir = this.GetPath();
        if(!existsSync(dir))
            writeFileSync(dir, '');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const dir = this.GetPath();
        if(existsSync(dir))
            unlinkSync(dir);
    }

    private GetPath():string {
        const folder = process.env.DEBUG ? 'src' : 'dist'
        let dir = __dirname.substring(0, __dirname.indexOf(folder)) + process.env.TYPEORM_DATABASE
        return dir;
    }
}
