import { Entity, Column, MaxKey } from "typeorm";
import { BaseEntity } from "./baseEntity";

@Entity({ name: 'Settings' })
export class SettingsEntity extends BaseEntity {
    @Column({ nullable: false, type: 'varchar', length: 64, unique: true })
    public name: string;

    @Column({ nullable: false, type: 'varchar' })
    public value: boolean;

    @Column({nullable: false, default: false, type:'int'})
    public encrypted: boolean;

    static create(obj: any) : SettingsEntity |undefined {
        if(!obj || !obj.name) return undefined;
        let result = new SettingsEntity();
        result.name = obj.name;
        result.value = obj.value;
        result.id = obj.id;
        result.lastModified = obj.lastModified;
        result.deleted = obj.deleted || false;
        result.encrypted = obj.encrypted || false;
        return result;
    }
}