import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddCountToPasswordTable1572105037030 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const column = new TableColumn({
            default: 0,
            name: 'count',
            type: "INT",
            isNullable: false
        });

        await queryRunner.addColumn('Password', column);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('Password', 'count')
    }

}
