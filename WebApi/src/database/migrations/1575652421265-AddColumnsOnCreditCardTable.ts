import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddColumnsOnCreditCardTable1575652421265 implements MigrationInterface {
    private nfc = new TableColumn({
        default: 1,
        name: 'nfc',
        type: "INT",
        isNullable: false
    });
    private cvv = new TableColumn({
        name: 'cvv',
        type: "nvarchar",
        length: "4",
        isNullable: true
    });
    private bank = new TableColumn({
        name: 'bank',
        type: "nvarchar",
        length: "128",
        isNullable: true
    });
    private pin = new TableColumn({
        name: 'pin',
        type: "nvarchar",
        length: "4",
        isNullable: true
    });

    private table = 'CreditCard';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumns(this.table, [this.nfc, this.pin, this.bank, this.cvv]);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumns(this.table, [this.nfc, this.pin, this.bank, this.cvv]);
    }

}
