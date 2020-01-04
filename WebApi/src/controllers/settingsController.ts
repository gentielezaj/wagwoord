import { SettingsEntity } from "../database/models/settingsEntity";
import { SettingsRepository } from "../database/repositories/settingsRepository";
import { CoreRepositoryController } from "./coreController";
import { Request, Response } from "express";

export class SettingsController extends CoreRepositoryController<SettingsEntity, SettingsRepository> {

    constructor() {
        super(SettingsEntity, 'settings', new SettingsRepository());
    }

    jsonToModel(model: any): SettingsEntity|undefined {
        return SettingsEntity.create(model);
    }

    public async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            if (id) {
                await super.getById(req, res);
            }

            const responseBody = await this.repository.getItemByName(req.params.id);

            this.sendResponse(res, responseBody, responseBody ? 200 : 204);
        } catch (error) {
            this.sendErrorResponse(res, 500, error);
        }
    }
}