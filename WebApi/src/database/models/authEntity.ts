import { BaseEntity } from "./baseEntity";
import { Entity, Column } from "typeorm";

@Entity({ name: 'Auth' })
export class AuthEntity extends BaseEntity {
    @Column({ nullable: false, type: 'varchar', length: 64, unique:true })
    public key: string;
    @Column({ nullable: true, type: 'varchar'})
    public value: string;
    
    public static create(obj: any, model?: AuthEntity): AuthEntity {
        if (!obj.key) return;

        model = model || new AuthEntity();
        model = <AuthEntity>super.create(model, obj);

        model.key = obj.key;
        model.value = obj.value;
        
        return model;
    }
}