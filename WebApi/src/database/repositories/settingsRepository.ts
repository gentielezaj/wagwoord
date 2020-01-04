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

    public async getItemByName(name: string): Promise<SettingsEntity | undefined> {
        return await this.dbRepository.createQueryBuilder('item').where('item.name = :name', { name: name }).getOne();
    }
    // #endregion save

    public async saveEncryptionHash(hash: string): Promise<SettingsEntity> {
        let result = await this.getEncryptionHash() ?? new SettingsEntity();
        result.name = 'EncryptionHash';
        result.value = hash;
        result.id = result?.id;
        result.lastModified = new Date().getTime();
        result.deleted = false;
        result.encrypted = false;

        return await this.save(result);
    }

    public async getEncryptionHash(): Promise<SettingsEntity> | undefined {
        return await this.dbRepository.createQueryBuilder('item').where('item.name = :name', { name: 'EncryptionHash' }).getOne();
    }
}