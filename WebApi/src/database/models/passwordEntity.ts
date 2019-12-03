import { Entity, Column } from "typeorm";
import { BaseEntity } from "./baseEntity";
import { Identifier } from "../querys/modelDecorator";

@Entity({ name: 'Password' })
export class PasswordEntity extends BaseEntity {
    @Column({ nullable: false, type: 'varchar', length: 64 })
    public name: string;

    @Identifier()
    @Column({ nullable: false, type: 'varchar' })
    public domain: string;

    @Identifier()
    @Column({ nullable: true, type: 'varchar', length: 128 })
    public username?: string;

    @Column({ nullable: false, type: 'varchar' })
    public password: string;

    @Column("int")
    public waitTime?: number;

    @Column({nullable: false, default: false, type:'int'})
    public encrypted: boolean;

    @Column({nullable: false, default: 0, type:'int'})
    public count: number

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
        result.deleted = obj.deleted || false;
        result.count = obj.count || 0;
        return result;
    }
}