import { PasswordEntity } from "../database/models/passwordEntity";
import { BaseController } from "./baseController";
import { Request, Response, Application } from "express";
import { PasswordRepository } from "../database/repositories/passwordRepository";
import { basename } from "path";

export class PasswordController extends BaseController<PasswordEntity> {

    constructor(app: Application) {
        super(app, PasswordEntity, 'passwords');
        this.repository = new PasswordRepository();
    }

    jsonToModel(model: any): PasswordEntity|undefined {
        return PasswordEntity.create(model);
    }
}