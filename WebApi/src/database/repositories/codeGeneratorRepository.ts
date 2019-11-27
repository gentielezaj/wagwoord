import { BaseRepository } from "./baseRepository";
import { CodeGeneratorEntity } from "../models/codegeneratorEntity";

export class CodeGeneratorRepository extends BaseRepository<CodeGeneratorEntity> {
    constructor() {
        super(CodeGeneratorEntity);
    }

    protected async getSavedItem(model: CodeGeneratorEntity): Promise<CodeGeneratorEntity | undefined> {
        return await this.dbRepository.findOne({
            where: [{
                issuer: model.issuer,
                username: model.username
            }]
        });
    }
}