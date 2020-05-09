import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";
import { CoreMigrationProperties } from "../coreMigrationProperties";

export class CreateAuthTable1589025602960 extends CoreMigrationProperties implements MigrationInterface {

    private readonly tableName = "Auth";

    private columns(): Array<TableColumn> {
        return [
            ...this.coreColumns(),
            new TableColumn({
                name: "key",
                type: 'varchar',
                isNullable: false,
                length: '64',
                isUnique: true
            }),
            new TableColumn({
                name: "value",
                type: 'varchar',
                isNullable: true
            }),
        ];
    }

    public async up(queryRunner: QueryRunner): Promise<any> {
        const table = new Table({
            name: this.tableName,
            columns: this.columns()
        })
        await queryRunner.createTable(table)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable(this.tableName);
    }

}
