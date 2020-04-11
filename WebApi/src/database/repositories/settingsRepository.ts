import { BaseRepository } from "./baseRepository";
import { SettingsEntity, SettingsPropertyEntity } from "../models/settingsEntity";
import { Repository, getRepository, SelectQueryBuilder, RelationQueryBuilder } from "typeorm";
import { AppQueryBuilder, AppQueryChecker } from "../querys/query";

export class SettingsRepository extends BaseRepository<SettingsEntity> {
    protected get propertyRepository(): Repository<SettingsPropertyEntity> {
        return getRepository(SettingsPropertyEntity);
    }

    constructor() {
        super(SettingsEntity);
    }

    // #region save
    public async getSavedItem(model: SettingsEntity): Promise<SettingsEntity | undefined> {
        return await this.dbRepository.findOne({
            where: { 'name': model.name }
        });
    }

    public async save(model: SettingsEntity) : Promise<SettingsEntity | undefined > {
        try {
            let oldItem = await this.getSavedItem(model);
            if (oldItem) {
                if (oldItem && model.lastModified && oldItem.lastModified > model.lastModified) {
                    this.setLocalId(oldItem, model);
                    return oldItem;
                }

                model.id = oldItem.id;
            }
            if (!model.lastModified) model.lastModified = new Date().getTime();

            if (model.id) await this.propertyRepository.delete({ settingsId: model.id });

            let result = await this.dbRepository.save(model);

            for (let i = 0; i < model.properties.length; i++) {
                let property = model.properties[i];
                property.settingsId = result.id;
                this.propertyRepository.save(property);
            }

            this.setLocalId(result, model);
            return result;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    public async getItemByName(name: string): Promise<SettingsEntity | undefined> {
        return await this.getById({ name });
    }
    // #endregion save

    // #region get
    public async getById(id: any): Promise<SettingsEntity | undefined> {
        if (!id) return;
        let result: SettingsEntity | undefined;
        if (Number(id)) result = await this.dbRepository.findOne(id)

        if (typeof id == 'object') {
            let queryParams = new Array<string>();
            for (var property in id) {
                if (id.hasOwnProperty(property)) {
                    queryParams.push(`item.${property} = :${property}`);
                }
            }

            result = await this.dbRepository.createQueryBuilder('item').where(queryParams.join(' AND '), id).getOne();
        }

        let properties = await this.propertyRepository.find({settingsId: result.id})
        result.properties = properties;
        return result;
    }

    public async getItem(appQuery: AppQueryBuilder | number): Promise<SettingsEntity | undefined> {
        if (typeof appQuery == "number") return await this.getById(appQuery);
        appQuery.skip = undefined;
        appQuery.take = undefined;
        let queryBuilder = this.createQueryBuilder(this.dbRepository.createQueryBuilder(), appQuery);

        let item = await queryBuilder.getOne();
        let properties = await this.propertyRepository.find({ settingsId: item.id })
        item.properties = properties;

        return item;
    }

    public async getAll(appQuery?: AppQueryBuilder): Promise<Array<SettingsEntity>> {
        let query = this.createQueryBuilder(this.dbRepository.createQueryBuilder("settings"), appQuery || {});
        query.leftJoinAndSelect("settings.properties", "property");
        return await query.getMany();
    }

    protected createQueryBuilder(queryBuilder: SelectQueryBuilder<SettingsEntity>, appQuery: AppQueryBuilder): SelectQueryBuilder<SettingsEntity> {
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
}