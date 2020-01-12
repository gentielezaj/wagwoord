import { BaseEntity } from "./baseEntity";
import { Entity, Column } from "typeorm";

@Entity({ name: 'Util' })
export class UtilEntity extends BaseEntity {
    @Column({ nullable: false, type: 'varchar', length: 64, unique:true })
    public key: string;
    @Column({ nullable: true, type: 'varchar'})
    public value: string;
    
    public static create(obj: any, model?: UtilEntity): UtilEntity {
        if (!obj.key) return;

        model = model || new UtilEntity();
        model = <UtilEntity>super.create(model, obj);

        model.key = obj.key;
        model.value = obj.value;
        
        return model;
    }
}