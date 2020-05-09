import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";
import { CoreMigrationProperties } from "../coreMigrationProperties";

export class CreateAddressTable1589025176281 extends CoreMigrationProperties implements MigrationInterface {

    private readonly tableName = "Address";

    private columns(): Array<TableColumn> {
        return [
            ...this.coreCountColumns(),
            new TableColumn({
                name: "firstName",
                type: 'varchar',
                isNullable: false,
                length: '64',
            }),
            new TableColumn({
                name: "lastName",
                type: 'varchar',
                isNullable: false,
                length: '64',
            }),
            new TableColumn({
                name: "birthDate",
                type: 'date',
                isNullable: true,
            }),
            new TableColumn({
                name: "street",
                type: 'varchar',
                isNullable: true,
                length: '2048'
            }),
            new TableColumn({
                name: "secundStreet",
                type: 'varchar',
                isNullable: true,
                length: '2048'
            }),
            new TableColumn({
                name: "city",
                type: 'varchar',
                isNullable: true,
                length: '128'
            }),
            new TableColumn({
                name: "state",
                type: 'varchar',
                isNullable: true,
                length: '128'
            }),
            new TableColumn({
                name: "country",
                type: 'varchar',
                isNullable: true,
                length: '128'
            }),
            new TableColumn({
                name: "username",
                type: 'varchar',
                isNullable: true,
                length: '128'
            }),
            new TableColumn({
                name: "postalCode",
                type: 'varchar',
                isNullable: true,
                length: '128'
            }),
            new TableColumn({
                name: "organization",
                type: 'varchar',
                isNullable: true,
                length: '128'
            }),
            new TableColumn({
                name: "phone",
                type: 'varchar',
                isNullable: true,
                length: '128'
            }),
            new TableColumn({
                name: "callingCode",
                type: 'varchar',
                isNullable: true,
                length: '6'
            }),
            new TableColumn({
                name: "region",
                type: 'varchar',
                isNullable: true,
                length: '254'
            }),
            new TableColumn({
                name: "subregion",
                type: 'varchar',
                isNullable: true,
                length: '254'
            }),
            new TableColumn({
                name: "countryAlpha2Code",
                type: 'varchar',
                isNullable: true,
                length: '2'
            }),
            new TableColumn({
                name: "countryAlpha3Code",
                type: 'varchar',
                isNullable: true,
                length: '3'
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
