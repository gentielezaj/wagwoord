import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";
import { CoreMigrationProperties } from "../coreMigrationProperties";

export class CreatePasswordTable1589020478736 extends CoreMigrationProperties implements MigrationInterface {

    private readonly tableName = "Password";

    private columns(): Array<TableColumn> {
        return [
            ...this.coreCountColumns(),
            new TableColumn({
                name: "name",
                type: 'varchar',
                isNullable: false,
                length: '64',
            }),
            new TableColumn({
                name: "domain",
                type: 'varchar',
                isNullable: false,
            }),
            new TableColumn({
                name: "username",
                type: 'varchar',
                isNullable: true,
                length: '128',
            }),
            new TableColumn({
                name: "password",
                type: 'varchar',
                isNullable: false,
            }),
            new TableColumn({
                name: "waitTime",
                type: 'int',
                isNullable: true,
            })
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
