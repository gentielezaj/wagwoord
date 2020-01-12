import { BaseRepository } from "./baseRepository";
import { UtilEntity } from "../models/utilEntity";
import { Constants } from "../../utils/constants";
import { LocalStorage } from "node-localstorage";

export class UtilRepository extends BaseRepository<UtilEntity> {
    protected readonly localStorage: LocalStorage
    constructor() {
        super(UtilEntity);
        this.localStorage = new LocalStorage(Constants.LocalStorageFolder);
    }

    public async SaveEncryptionHash(encryptionHash?: string): Promise<string | undefined> {
        if (encryptionHash && !encryptionHash?.isNullOrEmpty()) {
            const key = Constants.EncryptionHashKey;
            const model = (await this.getById(key)) ?? UtilEntity.create({
                key: Constants.EncryptionHashKey,
                value: encryptionHash
            })

            await this.save(model);
        } else {
            encryptionHash = undefined;
            const model = await this.getById(Constants.EncryptionHashKey)
            if (model) await this.dbRepository.delete(model.id)
        }

        await this.setup(encryptionHash);
        return encryptionHash
    }

    public async startup(encryptionHashHeader?: string): Promise<any> {
        console.log('setting up');
        const encryptionHashModel = await this.getById(Constants.EncryptionHashKey);
        const encryptionHash = encryptionHashModel?.value;
        if (encryptionHash && encryptionHashHeader != encryptionHash) {
            return false;
        } else {
            await this.setup(encryptionHash);
        }

        return this.returnHeadersModel(encryptionHash);
    }

    public returnHeadersModel(encryptionHash: any): any {
        let model: any = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        model.headers[Constants.WagwoordId] = process.env.WAGWOORD_ID;
        model.headers[Constants.EncryptionHashKey] = encryptionHash;

        return model;
    }

    public async setup(encryptionHash?: string): Promise<void> {
        encryptionHash = encryptionHash ?? await (await this.getById(Constants.EncryptionHashKey))?.value;
        if (encryptionHash && !encryptionHash.isNullOrEmpty()) {
            this.localStorage.setItem(Constants.EncryptionHashKey, encryptionHash);
        } else {
            this.localStorage.removeItem(Constants.EncryptionHashKey);
        }
    }

    public async getById(id: any): Promise<UtilEntity | undefined> {
        if (typeof id == 'string') {
            const model = { key: id };
            return await super.getById(model);
        }
        return await super.getById(id);
    }
}