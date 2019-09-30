import { Entity, Column } from "typeorm";
import { BaseEntity } from "./baseEntity";

@Entity({ name: 'Password' })
export class PasswordEntity extends BaseEntity {
    @Column({ nullable: false, type: 'varchar', length: 64 })
    public name: string;

    @Column({ nullable: false, type: 'varchar' })
    public domain: string;

    @Column({ nullable: true, type: 'varchar', length: 128 })
    public username?: string;

    @Column({ nullable: false, type: 'varchar' })
    public password: string;

    @Column("int")
    public waitTime?: number;

    @Column({nullable: false, default: false, type:'int'})
    public encrypted: boolean;

    static create(obj: any) : PasswordEntity |undefined {
        if(!obj || !obj.name || !obj.domain || !obj.password) return undefined;
        let result = new PasswordEntity();
        result.name = obj.name;
        result.domain = obj.domain;
        result.username = obj.username;
        result.password = obj.password;
        result.waitTime = obj.waitTime;
        result.id = obj.id;
        result.lastModified = obj.lastModified;
        result.encrypted = obj.encrypted || false;
        return result;
    }
}