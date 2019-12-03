import { BaseCountEntity } from "./baseEntity";
import { Entity, Column } from "typeorm";
import { Identifier } from '../querys/modelDecorator';

@Entity({ name: 'CreditCard' })
export class CreditCardModel extends BaseCountEntity {

    @Identifier()
    @Column({ nullable: false, type: 'varchar', length: 254 })
    public name: string;
    
    @Column({ nullable: false, type: 'varchar', length: 254 })
    public cardType: ["masterCard", "visa", "maestro", "paypal"];

    @Column({ nullable: false, type: 'int' })
    public expiredMonth: number;

    @Identifier()
    @Column({ nullable: false, type: 'varchar', length: 64 })
    public cardNumber: string;

    @Column({ nullable: false, type: 'int' })
    public expiredYear: number;

    public static create(obj: any, model: CreditCardModel): CreditCardModel {
        model = model || new CreditCardModel();
        model = <CreditCardModel>super.create(model, obj);
        model.name = obj.name;
        model.cardType = obj.cardType;
        model.expiredMonth = obj.expiredMonth;
        model.expiredYear = obj.expiredYear;
        model.cardNumber = obj.cardNumber;

        if(!obj.name || !obj.cardNumber || !obj.expiredMonth || !obj.expiredYear) return undefined;

        return model;
    }
}