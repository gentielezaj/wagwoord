import { BaseCountEntity } from "./baseEntity";
import { Entity, Column } from "typeorm";
import { Identifier } from '../querys/modelDecorator';

@Entity({ name: 'CreditCard' })
export class CreditCardModel extends BaseCountEntity {

    @Column({ nullable: false, type: 'varchar', length: 254 })
    public name: string;

    @Column({ nullable: false, type: 'varchar', length: 254 })
    public cardType: ["mastercard", "visa", "maestro", "paypal"];

    @Column({ nullable: false, type: 'int' })
    public expiredMonth: number;

    @Identifier()
    @Column({ nullable: false, type: 'varchar', length: 64, unique: true })
    public cardNumber: string;

    @Column({ nullable: false, type: 'int' })
    public expiredYear: number;

    @Column({ nullable: true, type: 'varchar', length: 4 })
    public cvv: string;

    @Column({ nullable: true, type: 'varchar', length: 128 })
    public bank: string;

    @Column({ nullable: true, type: 'varchar', length: 4 })
    public pin: string;

    @Column({ nullable: false, type: 'int', default: true })
    public nfc: boolean;

    public static create(obj: any, model: CreditCardModel): CreditCardModel {
        model = model || new CreditCardModel();
        model = <CreditCardModel>super.create(model, obj);
        model.name = obj.name;
        model.cardType = obj.cardType;
        model.expiredMonth = obj.expiredMonth;
        model.expiredYear = obj.expiredYear;
        model.cardNumber = obj.cardNumber;
        model.cvv = obj.cvv;
        model.bank = obj.bank;
        model.pin = obj.pin;
        model.nfc = obj.nfc;


        if (!obj.name || !obj.cardNumber || !obj.expiredMonth || !obj.expiredYear) return undefined;

        return model;
    }
}