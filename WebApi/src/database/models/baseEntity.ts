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

    protected static create(model: BaseEntity, obj: any): BaseEntity {
        model.deleted = obj.deleted || 0;
        model.id = obj.id;
        model.lastModified = obj.lastModified || new Date().getTime();
        return model;
    }
}

@Entity()
export abstract class BaseEncryptionEntity extends BaseEntity {
    
    constructor() {
        super();
        this.encrypted = false;
    }

    @Column({nullable: false, default: false, type:'int'})
    public encrypted: boolean;

    protected static create(model: BaseEncryptionEntity, obj: any): BaseEncryptionEntity {
        model = <BaseEncryptionEntity>super.create(model, obj);
        model.encrypted = obj.encrypted;
        return model;
    }
}

@Entity()
export abstract class BaseCountEntity extends BaseEncryptionEntity {
    constructor() {
        super();
        this.count = 0;
    }

    @Column({nullable: false, default: 0, type:'int'})
    public count: number
    
    protected static create(model: BaseCountEntity, obj: any): BaseCountEntity {
        model = <BaseCountEntity>super.create(model, obj);
        model.count = obj.count || 0;
        return model;
    }
}