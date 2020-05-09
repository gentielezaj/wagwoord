import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";
import { CoreMigrationProperties } from "../coreMigrationProperties";

export class CreateCodeGeneratorTable1589025912108 extends CoreMigrationProperties implements MigrationInterface {

    private readonly tableName = "CodeGenerator";

    private columns(): Array<TableColumn> {
        return [
            ...this.coreEncryptedColumns(),
            new TableColumn({
                name: "issuer",
                type: 'varchar',
                isNullable: false,
                length: '64'
            }),
            new TableColumn({
                name: "username",
                type: 'varchar',
                isNullable: false,
                length: '128'
            }),
            new TableColumn({
                name: "secret",
                type: 'varchar',
                isNullable: false
            }),
            new TableColumn({
                name: "digits",
                type: 'int',
                isNullable: false,
                default: 6
            }),
            new TableColumn({
                name: "algorithm",
                type: 'varchar',
                isNullable: false,
                length: '512',
                default: "'sha1'"
            }),
            new TableColumn({
                name: "encoding",
                type: 'varchar',
                isNullable: false,
                length: '512',
                default: "'hex'"
            }),
            new TableColumn({
                name: "epoch",
                type: 'int',
                isNullable: true
            }),
            new TableColumn({
                name: "step",
                type: 'int',
                isNullable: false,
                default: 30
            }),
            new TableColumn({
                name: "window",
                type: 'int',
                isNullable: false,
                default: 0
            }),
            new TableColumn({
                name: "icon",
                type: 'varchar',
                isNullable: true
            }),
        ];
    }

    public async up(queryRunner: QueryRunner): Promise<any> {
        const table = new Table({
            name: this.tableName,
            columns: this.columns(),
        })
        await queryRunner.createTable(table)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable(this.tableName);
    }

}
