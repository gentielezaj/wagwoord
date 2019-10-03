import {PrimaryGeneratedColumn, Column, Entity} from 'typeorm'

@Entity()
export abstract class BaseEntity {
    constructor() {
        this.deleted = false;
    }

    @PrimaryGeneratedColumn({type: 'int'})
    public id: number;

    @Column({nullable: false, type: 'int'})
    public lastModified: number;

    @Column({nullable: false, default: false, type:'int'})
    public deleted: boolean;
}