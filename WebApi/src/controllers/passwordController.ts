import { PasswordEntity } from "../database/models/passwordEntity";
import { BaseController } from "./baseController";
import { PasswordRepository } from "../database/repositories/passwordRepository";

export class PasswordController extends BaseController<PasswordEntity> {

    constructor() {
        super(PasswordEntity, 'password');
        this.repository = new PasswordRepository();
    }

    jsonToModel(model: any): PasswordEntity|undefined {
        return PasswordEntity.create(model);
    }
}