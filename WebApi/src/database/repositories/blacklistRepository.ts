import { BaseRepository } from "./baseRepository";
import { BlacklistEntity } from "../models/blacklistEntity";

export class BlacklistRepository extends BaseRepository<BlacklistEntity> {
    constructor() {
        super(BlacklistEntity);
    }

    protected async getSavedItem(model: BlacklistEntity): Promise<BlacklistEntity | undefined> {
        return await this.dbRepository.findOne({
            where: [{
                name: model.name
            }]
        });
    }
}