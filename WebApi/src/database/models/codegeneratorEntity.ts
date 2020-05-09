import { Entity, Column } from "typeorm";
import { BaseEntity } from "./baseEntity";
import { Identifier } from "../querys/modelDecorator";

@Entity({ name: 'CodeGenerator' })
export class CodeGeneratorEntity extends BaseEntity {
    @Identifier()
    @Column({ nullable: false, type: 'varchar', length: 64 })
    public issuer: string;
    
    @Identifier()
    @Column({ nullable: false, type: 'varchar', length: 128 })
    public username: string;

    @Column({ nullable: false, type: 'varchar' })
    public secret: string;

    @Column({ nullable: false, default: false, type: 'int' })
    public encrypted: boolean;

    @Column({ nullable: true, default: 6, type: 'int' })
    public digits: number;

    @Column({ nullable: true, default: 'hex', type: 'varchar', length: 512 })
    public encoding: string;

    @Column({ nullable: true, default: 'sha1', type: 'varchar', length: 512 })
    public algorithm: string;

    @Column({ nullable: true, type: 'int'})
    public epoch: number;

    @Column({ nullable: false, default:30, type: 'int' })
    public step: string; 

    @Column({ nullable: true, default: 0, type: 'int' })
    public window: number; 


    @Column({ nullable: true, type: 'varchar' })
    public icon: string; 

    static create(obj: any): CodeGeneratorEntity | undefined {
        if (!obj || !obj.issuer || !obj.username || !obj.secret) return undefined;
        let result = new CodeGeneratorEntity();
        result.issuer = obj.issuer;
        result.username = obj.username;
        result.secret = obj.secret;
        result.id = obj.id;
        result.lastModified = obj.lastModified || new Date().getTime() + '';
        result.encrypted = obj.encrypted || false;
        result.deleted = obj.deleted || false;
        result.digits = obj.digits;
        result.encoding = obj.encoding;
        result.algorithm = obj.algorithm;
        result.epoch = obj.epoch;
        result.step = obj.step;
        result.window = obj.window;
        result.icon = obj.icon;
        return result;
    }
}