import { Entity, Column } from "typeorm";
import { BaseEntity } from "./baseEntity";
import { Identifier } from "../querys/modelDecorator";

@Entity({ name: 'Blacklist' })
export class BlacklistEntity extends BaseEntity {

    @Identifier()
    @Column({ nullable: false, type: 'varchar', length: 64, unique: true })
    public name: string;

    @Column({nullable: false, default: false, type:'bool'})
    public password: boolean;

    @Column({nullable: false, default: false, type:'bool'})
    public address: boolean;

    @Column({nullable: false, default: false, type:'bool'})
    public creditCard: boolean;

    @Column({nullable: false, default: false, type:'bool'})
    public codeGenerator: boolean;

    static create(obj: any) : BlacklistEntity |undefined {
        if(!obj || !obj.name) return undefined;
        let result = new BlacklistEntity();
        result.name = obj.name;
        result.password = obj.password || false;
        result.address = obj.address || false;
        result.creditCard = obj.creditCard || false;
        result.codeGenerator = obj.codeGenerator || false;
        result.id = obj.id;
        result.lastModified = obj.lastModified;
        result.deleted = obj.deleted || false;
        return result;
    }
}