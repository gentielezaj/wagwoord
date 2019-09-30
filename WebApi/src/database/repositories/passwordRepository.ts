import { BaseRepository } from "./baseRepository";
import { PasswordEntity } from "../models/passwordEntity";

export class PasswordRepository extends BaseRepository<PasswordEntity> {
    constructor() {
        super(PasswordEntity);
    }

    // #region save
    public async save(model: PasswordEntity): Promise<PasswordEntity | undefined> {

        const oldModel = await this.passwordExists(model);
        if (oldModel) model.id = oldModel.id;
        if (oldModel && model.lastModified && oldModel.lastModified > model.lastModified) {
            model = oldModel;
        }

        return await super.save(model);
    }

    public async passwordExists(model: PasswordEntity): Promise<PasswordEntity | undefined> {
        let passowrd = await this.dbRepository.find({
            where: [{
                domain: model.domain,
                username: model.username,
            }]
        });

        return passowrd.length ? passowrd[0] : undefined;
    }
    // #endregion save
}