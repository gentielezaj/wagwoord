import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./baseEntity";
import { Settings } from "http2";

@Entity({ name: 'Settings' })
export class SettingsEntity extends BaseEntity {
    @Column({ nullable: false, type: 'varchar', length: 64, unique: true })
    public name: string;

    @Column({nullable: false, default: false, type:'bool'})
    public encrypted: boolean;

    @OneToMany(type => SettingsPropertyEntity, property => property.settings)
    @JoinColumn()
    public properties: Array<SettingsPropertyEntity>;

    static create(obj: any) : SettingsEntity |undefined {
        if(!obj || !obj.name) return undefined;
        let result = new SettingsEntity();
        result.name = obj.name;
        result.id = obj.id;
        result.lastModified = obj.lastModified;
        result.deleted = obj.deleted ? true : false;
        result.encrypted = obj.encrypted ? true : false;

        if (obj.properties?.length > 0) {
            result.properties = new Array<SettingsPropertyEntity>();
            obj.properties.forEach((i: any) => {
                const property = SettingsPropertyEntity.create(i);
                if (property?.value) result.properties.push(property)
            });
        }

        return result;
    }
}

@Entity({ name: 'SettingsProperty' })
export class SettingsPropertyEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    public id: number;

    @Column({ nullable: false, type: "varchar", length: 128})
    public property: string;
    
    @Column({ nullable: false, type: "varchar"})
    public value: string;

    @Column({nullable: false, type:"int"})
    public settingsId: number;

    @Column({ name:"propertyType", nullable: false, type: "varchar", length:64 })
    public type: string;

    @ManyToOne(type => SettingsEntity, property => property.properties)
    public settings: Settings


    static create(obj: any): SettingsPropertyEntity | undefined {
        if (!obj || !obj.property) return undefined;
        if (obj.value === undefined || obj.value === null || obj.value === NaN) return undefined;
        let result = new SettingsPropertyEntity();
        result.id = obj.id;
        result.property = obj.property;
        result.value = obj.value;
        result.type = obj.type || typeof obj.value;
        return result;
    }
}