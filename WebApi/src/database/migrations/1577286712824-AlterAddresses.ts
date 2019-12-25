import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterAddresses1577286712824 implements MigrationInterface {
    private columns: TableColumn[] = [new TableColumn({
        default: 1,
        name: 'callingCode',
        type: "nvarchar",
        length: "6",
        isNullable: false
    }),
    new TableColumn({
        name: 'region',
        type: "nvarchar",
        length: "254",
        isNullable: true
    }),
    new TableColumn({
        name: 'subregion',
        type: "nvarchar",
        length: "254",
        isNullable: true
    }),
    new TableColumn({
        name: 'countryAlpha2Code',
        type: "nvarchar",
        length: "2",
        isNullable: true
    }),
    new TableColumn({
        name: 'countryAlpha3Code',
        type: "nvarchar",
        length: "3",
        isNullable: true
    })];

    private table = 'Address';
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumns(this.table, this.columns);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumns(this.table, this.columns);
    }

}
