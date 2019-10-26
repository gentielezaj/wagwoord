import { SettingsEntity } from "../database/models/settingsEntity";
import { BaseController } from "./baseController";
import { SettingsRepository } from "../database/repositories/settingsRepository";

export class SettingsController extends BaseController<SettingsEntity> {

    constructor() {
        super(SettingsEntity, 'settings');
        this.repository = new SettingsRepository();
    }

    jsonToModel(model: any): SettingsEntity|undefined {
        return SettingsEntity.create(model);
    }
}