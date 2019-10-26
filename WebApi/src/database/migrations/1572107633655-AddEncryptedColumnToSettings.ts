import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddEncryptedColumnToSettings1572107633655 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const column = new TableColumn({
            default: 0,
            name: 'encrypted',
            type: "INT",
            isNullable: false
        });

        await queryRunner.addColumn('Settings', column);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('Settings', 'encrypted');
    }

}
