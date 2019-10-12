import { Entity, Column } from "typeorm";
import { BaseEntity } from "./baseEntity";

@Entity({ name: 'Blacklist' })
export class BlacklistEntity extends BaseEntity {
    @Column({ nullable: false, type: 'varchar', length: 64 })
    public name: string;

    @Column({nullable: false, default: false, type:'int'})
    public password: boolean;

    @Column({nullable: false, default: false, type:'int'})
    public address: boolean;

    @Column({nullable: false, default: false, type:'int'})
    public creditCard: boolean;

    @Column({nullable: false, default: false, type:'int'})
    public codeGenerator: boolean;

    static create(obj: any) : BlacklistEntity |undefined {
        if(!obj || !obj.name || !obj.domain || !obj.password) return undefined;
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