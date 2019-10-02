import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddDeletedToPasswords1570054034480 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('Password', new TableColumn({
            default: 0,
            isNullable: false,
            name: 'deleted',
            type: 'INT'
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('Password', 'deleted')
    }

}
