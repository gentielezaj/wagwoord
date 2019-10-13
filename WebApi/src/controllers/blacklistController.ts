import { BlacklistEntity } from "../database/models/blacklistEntity";
import { BaseController } from "./baseController";
import { BlacklistRepository } from "../database/repositories/blacklistRepository";

export class BlacklistController extends BaseController<BlacklistEntity> {

    constructor() {
        super(BlacklistEntity, 'passwords');
        this.repository = new BlacklistRepository();
    }

    jsonToModel(model: any): BlacklistEntity|undefined {
        return BlacklistEntity.create(model);
    }
}