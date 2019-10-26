import { BaseRepository } from "./baseRepository";
import { SettingsEntity } from "../models/settingsEntity";

export class SettingsRepository extends BaseRepository<SettingsEntity> {
    constructor() {
        super(SettingsEntity);
    }

    // #region save
    public async getSavedItem(model: SettingsEntity): Promise<SettingsEntity | undefined> {
        return await this.dbRepository.findOne({
            where: { 'name': model.name }
        });
    }
    // #endregion save
}