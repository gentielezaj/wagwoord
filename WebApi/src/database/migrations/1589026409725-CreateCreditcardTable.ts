import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";
import { CoreMigrationProperties } from "../coreMigrationProperties";


export class CreateCreditcardTable1589026409725 extends CoreMigrationProperties implements MigrationInterface {

    private readonly tableName = "CreditCard";

    private columns(): Array<TableColumn> {
        return [
            ...this.coreCountColumns(),
            new TableColumn({
                name: "name",
                type: 'varchar',
                isNullable: false,
                length: '254',
            }),
            new TableColumn({
                name: "cardType",
                type: 'varchar',
                isNullable: false,
                length: '254',
            }),
            new TableColumn({
                name: "expiredMonth",
                type: 'int',
                isNullable: false
            }),
            new TableColumn({
                name: "expiredYear",
                type: 'int',
                isNullable: false
            }),
            new TableColumn({
                name: "cardNumber",
                type: 'varchar',
                isNullable: false,
                isUnique: true
            }),
            new TableColumn({
                name: "cvv",
                type: 'varchar',
                isNullable: true,
            }),
            new TableColumn({
                name: "bank",
                type: 'varchar',
                isNullable: true,
                length: '128',
            }),
            new TableColumn({
                name: "pin",
                type: 'varchar',
                isNullable: true,
            }),
            new TableColumn({
                name: "nfc",
                type: 'bool',
                isNullable: false,
                default: false,
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