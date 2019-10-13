import { ObjectType, getRepository, Repository, DeleteResult, SelectQueryBuilder } from "typeorm";
import { BaseEntity } from "../models/baseEntity";
import { AppQueryBuilder, AppQueryChecker } from "../querys/query";

export interface IBaseRepository<TEntity extends BaseEntity> {
    save(model: TEntity): Promise<TEntity | undefined>;
    saveAll(models: Array<TEntity>): Promise<Array<TEntity | undefined>>

    getById(id: number): Promise<TEntity | undefined>
    getAll(appQuery?: AppQueryBuilder): Promise<Array<TEntity>>

    delete(id: number | Array<number>, destroy?: boolean): Promise<DeleteResult>;
    getLastModified(lastModified: number): Promise<Array<TEntity>>;
    getItem(appQuery: AppQueryBuilder | number): Promise<TEntity | undefined>;
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
    public async save(model: TEntity): Promise<TEntity | undefined> {
        let oldItem = await this.getSavedItem(model);
        if(oldItem.lastModified > model.lastModified) return oldItem;
        if (!model.lastModified) model.lastModified = new Date().getTime();
        return <TEntity | undefined>(await this.dbRepository.save(<any>model));
    }

    protected async getSavedItem(model: TEntity): Promise<TEntity | undefined> {
        if(model.id > 0) return undefined;
        return await this.getById(model.id);
    }

    public async saveAll(models: Array<TEntity>): Promise<Array<TEntity | undefined>> {
        let results = new Array<TEntity | undefined>();

        for (let index = 0; index < models.length; index++) {
            const model = models[index];
            results.push(await this.save(model));
        }

        return results;
    }
    // #endregion save

    // #region get
    public async getLastModified(lastModified: number): Promise<Array<TEntity>> {
        return await this.dbRepository.createQueryBuilder('item').where('item.lastModified > :lastModified', { lastModified: lastModified }).getMany();
    }

    public async getById(id: number): Promise<TEntity | undefined> {
        const result = await this.dbRepository.findOne(id)
        return <TEntity | undefined>result;
    }

    public async getItem(appQuery: AppQueryBuilder | number): Promise<TEntity | undefined> {
        if (typeof appQuery == "number") return await this.getById(appQuery);
        appQuery.skip = undefined;
        appQuery.take = undefined;
        let queryBuilder = this.createQueryBuilder(this.dbRepository.createQueryBuilder(), appQuery);

        return await queryBuilder.getOne();
    }

    public async getAll(appQuery?: AppQueryBuilder): Promise<Array<TEntity>> {
        let query = this.createQueryBuilder(this.dbRepository.createQueryBuilder(), appQuery || {});

        return await query.getMany();
    }

    protected createQueryBuilder(queryBuilder: SelectQueryBuilder<TEntity>, appQuery: AppQueryBuilder): SelectQueryBuilder<TEntity> {
        if (AppQueryChecker.hasQuery(appQuery.select)) {
            if (typeof appQuery.select == 'string') appQuery.select = [appQuery.select];
            queryBuilder.select(<string[]>appQuery.select);
        }

        if (appQuery.take && appQuery.take > 0) {
            queryBuilder.take(appQuery.take);
        }

        if (appQuery.skip && appQuery.skip > 0) {
            queryBuilder.skip(appQuery.skip);
        }

        if (AppQueryChecker.hasQuery(appQuery.order)) {
            if (!Array.isArray(appQuery.order)) appQuery.order = [appQuery.order];
            queryBuilder.orderBy(appQuery.order[0].property, appQuery.order[0].order, appQuery.order[0].nulls)
            for (let i = 1; i < appQuery.order.length; i++) {
                queryBuilder = queryBuilder.addOrderBy(appQuery.order[i].property, appQuery.order[i].order, appQuery.order[0].nulls)
            }
        }

        if (appQuery.where) {
            const where = AppQueryChecker.buildWhere(appQuery.where);
            queryBuilder.where(where.sql, where.params);
        } 

        return queryBuilder;
    }
    // #endregion get

    // #region delete
    public async delete(id: number | Array<number>, destroy?: boolean): Promise<DeleteResult> {
        if (destroy)
            return await this.dbRepository.delete(id);
        else {
            if (!Array.isArray(id)) {
                id = [id];
            }

            let entities = await this.dbRepository.findByIds(id);
            for (let entity of entities) {
                entity.deleted = true;
                entity.lastModified = new Date().getTime();
                await this.save(entity);
            }

            return new DeleteResult();
        }
    }
    // #endregion delete
}