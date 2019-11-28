import { BaseController } from "./baseController";
import { CodeGeneratorEntity } from "../database/models/codegeneratorEntity";
import { CodeGeneratorRepository } from "../database/repositories/codeGeneratorRepository";

export class CodeGeneratorController extends BaseController<CodeGeneratorEntity> {

    constructor() {
        super(CodeGeneratorEntity, 'codegenerator');
        this.repository = new CodeGeneratorRepository();
    }
}