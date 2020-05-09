import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";
import { CoreMigrationProperties } from "../coreMigrationProperties";

export class CreateSettingsTable1589026793595 extends CoreMigrationProperties implements MigrationInterface {

    private readonly tableName = "Settings";

    private columns(): Array<TableColumn> {
        return [
            ...this.coreEncryptedColumns(),
            new TableColumn({
                name: "name",
                type: 'varchar',
                isNullable: false,
                length: '64',
                isUnique: true
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
