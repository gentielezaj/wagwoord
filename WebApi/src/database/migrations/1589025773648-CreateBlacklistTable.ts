import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";
import { CoreMigrationProperties } from "../coreMigrationProperties";

export class CreateBlacklistTable1589025773648 extends CoreMigrationProperties implements MigrationInterface {

    private readonly tableName = "Blacklist";

    private columns(): Array < TableColumn > {
        return [
            ...this.coreColumns(),
            new TableColumn({
                name: "name",
                type: 'varchar',
                isNullable: false,
                length: '64',
                isUnique: true
            }),
            new TableColumn({
                name: "password",
                type: 'bool',
                isNullable: false,
                default: false
            }),
            new TableColumn({
                name: "address",
                type: 'bool',
                isNullable: false,
                default: false
            }),
            new TableColumn({
                name: "creditCard",
                type: 'bool',
                isNullable: false,
                default: false
            }),
            new TableColumn({
                name: "codeGenerator",
                type: 'bool',
                isNullable: false,
                default: false
            }),
        ];
    }

    public async up(queryRunner: QueryRunner): Promise < any > {
        const table = new Table({
            name: this.tableName,
            columns: this.columns()
        })
        await queryRunner.createTable(table)
    }

    public async down(queryRunner: QueryRunner): Promise < any > {
        await queryRunner.dropTable(this.tableName);
    }

}
