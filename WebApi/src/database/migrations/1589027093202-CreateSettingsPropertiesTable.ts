import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";
import { CoreMigrationProperties } from "../coreMigrationProperties";

export class CreateSettingsPropertiesTable1589027093202 extends CoreMigrationProperties implements MigrationInterface {

    private readonly tableName = "SettingsProperty";

    private columns(): Array<TableColumn> {
        return [
            new TableColumn({
                name: "id",
                type: 'int',
                isGenerated: true,
                isNullable: false,
                isPrimary: true
            }),
            new TableColumn({
                name: "property",
                type: 'varchar',
                isNullable: false,
                length: '128'
            }),
            new TableColumn({
                name: "value",
                type: 'varchar',
                isNullable: true
            }),
            new TableColumn({
                name: "settingsId",
                type: 'int',
                isNullable: false
            }),
            new TableColumn({
                name: "propertyType",
                type: 'varchar',
                isNullable: false,
                length:'64'
            }),
            new TableColumn({
                name: "encrypted",
                type: 'bool',
                isNullable: false,
                default: false
            })
        ];
    }

    public async up(queryRunner: QueryRunner): Promise<any> {
        const table = new Table({
            name: this.tableName,
            columns: this.columns(),
            uniques: [{
                name: "sp_property",
                columnNames: ["settingsId", "property"]
            }],
            foreignKeys: [{
                columnNames: ["settingsId"],
                referencedTableName: "Settings",
                name: "settings_property_fk",
                onDelete: "CASCADE",
                referencedColumnNames: ["id"]
            }]
        })
        await queryRunner.createTable(table)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable(this.tableName);
    }

}
