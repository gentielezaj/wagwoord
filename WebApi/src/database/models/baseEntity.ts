import {PrimaryGeneratedColumn, Column, Entity} from 'typeorm'

@Entity()
export abstract class BaseEntity {
    @PrimaryGeneratedColumn({type: 'int'})
    public id: number;

    @Column({nullable: false, type: 'int'})
    public lastModified: number;
}