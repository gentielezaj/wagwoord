import { BlacklistEntity } from "../database/models/blacklistEntity";
import { BaseController } from "./baseController";

export class BlacklistController extends BaseController<BlacklistEntity> {

    constructor() {
        super(BlacklistEntity, 'passwords');
    }

    jsonToModel(model: any): BlacklistEntity|undefined {
        return BlacklistEntity.create(model);
    }
}