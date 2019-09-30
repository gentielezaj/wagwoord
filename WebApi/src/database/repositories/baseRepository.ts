import { ObjectType, getRepository, Repository, DeleteResult } from "typeorm";
import { BaseEntity } from "../models/baseEntity";

export interface IBaseRepository<TEntity extends BaseEntity> {
    save(model: TEntity) : Promise<TEntity|undefined>;
    saveAll(models: Array<TEntity>) : Promise<Array<TEntity | undefined>>

    getById(id: number) : Promise<TEntity | undefined>
    getAll(): Promise<Array<TEntity> | undefined>

    delete(id: number|Array<number>): Promise<DeleteResult>;
    getLastModified(lastModified: number): Promise<Array<TEntity>>;
}

export class BaseRepository<TEntity extends BaseEntity> implements IBaseRepository<TEntity> {
    protected entity: any;
    protected get dbRepository(): Repository<TEntity> {
        return getRepository(this.entity);
    }
    constructor(entity: ObjectType<TEntity>) {
        this.entity = entity;
        //this.dbRepository = getRepository(this.entity);
    }

    // #region save
    public async save(model: TEntity) : Promise<TEntity|undefined> {
        if(!model.lastModified) model.lastModified = new Date().getTime();
        return <TEntity | undefined>(await this.dbRepository.save(<any>model));
    }

    public async saveAll(models: Array<TEntity>) : Promise<Array<TEntity | undefined>> {
        let results = new Array<TEntity|undefined>();

        for (let index = 0; index < models.length; index++) {
            const model = models[index];
            results.push(await this.save(model));
        }

        return results;
    }
    // #endregion save

    // #region get
    public async getLastModified(lastModified: number): Promise<Array<TEntity>> {
        return await this.dbRepository.createQueryBuilder('item').where('item.lastModified >= :lastModified', {lastModified: lastModified}).getMany();
    }

    public async getById(id: number) : Promise<TEntity | undefined> {
        const result = await this.dbRepository.findOne(id)
        return <TEntity|undefined>result;
    }

    public async getAll(): Promise<Array<TEntity> | undefined> {
        return await <Array<TEntity>>(await this.dbRepository.find());
    }
    // #endregion get

    // #region delete
    public async delete(id:number|Array<number>): Promise<DeleteResult> {
        return await this.dbRepository.delete(id);
    }
    // #endregion delete
}