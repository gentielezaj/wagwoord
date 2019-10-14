import { BaseRepository } from "./baseRepository";
import { PasswordEntity } from "../models/passwordEntity";

export class PasswordRepository extends BaseRepository<PasswordEntity> {
    constructor() {
        super(PasswordEntity);
    }

    // #region save
    // public async save(model: PasswordEntity): Promise<PasswordEntity | undefined> {

    //     const oldModel = await this.passwordExists(model);
    //     if (oldModel) model.id = oldModel.id;
    //     if (oldModel && model.lastModified && oldModel.lastModified > model.lastModified) {
    //         model = oldModel;
    //     }

    //     return await super.save(model);
    // }

    public async getSavedItem(model: PasswordEntity): Promise<PasswordEntity | undefined> {
        return await this.dbRepository.findOne({
            where: [{
                domain: model.domain,
                username: model.username,
            }]
        });
    }
    // #endregion save
}