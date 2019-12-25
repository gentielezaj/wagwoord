import { BaseCountEntity } from "./baseEntity";
import { Entity, Column } from "typeorm";

@Entity({ name: 'Address' })
export class AddressEntity extends BaseCountEntity {
    @Column({ nullable: false, type: 'varchar', length: 64 })
    public firstName: string;
    @Column({ nullable: false, type: 'varchar', length: 64 })
    public lastName: string;
    @Column("date")
    public birthDate: Date;

    @Column({ type: 'varchar', length: 2048 })
    public street: string;

    @Column({ type: 'varchar', length: 2048 })
    public secundStreet: string;
    @Column({ type: 'varchar', length: 128 })
    public city: string;
    @Column({ type: 'varchar', length: 128 })
    public state: string;
    @Column({ type: 'varchar', length: 128 })
    public country: string;
    @Column({ type: 'varchar', length: 128 })
    public username: string;
    @Column({ type: 'varchar', length: 128 })
    public postalCode: string;
    @Column({ type: 'varchar', length: 128 })
    public organization: string;
    @Column({ type: 'varchar', length: 128 })
    public phone: string;

    @Column({ type: 'varchar', length: 6, nullable: false })
    public callingCode: string;

    @Column({ type: 'varchar', length: 254 })
    public region: string;

    @Column({ type: 'varchar', length: 254 })
    public subregion: string;

    @Column({ type: 'varchar', length: 2 })
    public countryAlpha2Code: string;

    @Column({ type: 'varchar', length: 3 })
    public countryAlpha3Code: string;

    public static create(obj: any, model: AddressEntity): AddressEntity {
        model = model || new AddressEntity();
        model = <AddressEntity>super.create(model, obj);

        model.firstName = obj.firstName;
        model.lastName = obj.lastName;
        model.birthDate = obj.birthDate;
        model.street = obj.street;
        model.secundStreet = obj.secundStreet;
        model.city = obj.city;
        model.state = obj.state;
        model.country = obj.country;
        model.username = obj.username;
        model.postalCode = obj.postalCode;
        model.organization = obj.organization;
        model.phone = obj.phone;
        model.callingCode = obj.callingCode;
        model.region = obj.region;
        model.subregion = obj.subregion;
        model.countryAlpha2Code = obj.countryAlpha2Code;
        model.countryAlpha3Code = obj.countryAlpha3Code;

        if (!obj.firstName || !obj.lastName) return undefined;

        return model;
    }
}