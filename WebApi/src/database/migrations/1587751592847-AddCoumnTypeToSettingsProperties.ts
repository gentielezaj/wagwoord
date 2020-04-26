import { MigrationInterface, QueryRunner, Column, Table, TableColumn } from "typeorm";

export class AddCoumnTypeToSettingsProperties1587751592847 implements MigrationInterface {

    private type = new TableColumn({
        name: 'type',
        type: "nvarchar",
        length: "64",
        isNullable: false
    });

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn("SettingsProperty", new TableColumn(this.type));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn("SettingsProperty", this.type);
    }

}
