import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUniqueIndexToCardNumver1575653106625 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE UNIQUE INDEX IF NOT EXISTS CreditCardUniqueIndexCardNumber ON CreditCard (cardNumber)')
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
