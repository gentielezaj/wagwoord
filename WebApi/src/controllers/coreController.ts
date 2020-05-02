import { BaseEntity } from "../database/models/baseEntity";
import { Request, Response, Application, response, Router } from "express";
import { ObjectType, SelectQueryBuilder, QueryBuilder } from "typeorm";
import { IBaseRepository, BaseRepository } from "../database/repositories/baseRepository";
import { AppLogger } from "../utils/appLogger";
import { BaseController } from "./baseController";

export abstract class CoreRepositoryController<TEntity extends BaseEntity, TRepository extends IBaseRepository<TEntity>> extends BaseController {
    protected entity: ObjectType<TEntity>;
    protected repository: TRepository;
    protected controller: string;

    constructor(entity: ObjectType<TEntity>, controller: string, repository: TRepository) {
        super();
        this.entity = entity;
        this.repository = repository;
        this.controller = controller;
    }

    public GetRouter(skipCheck?: boolean, skipEncryption?: boolean): Router {
        let router = super.GetRouter(skipCheck, skipEncryption);

        router.post('/', (req: Request, res: Response) => {
            this.save(req, res).then().catch(e => AppLogger.logError(this.controller + ' post', e));
        });

        router.get('/', (req: Request, res: Response) => {
            this.getAll(req, res).then().catch(e => AppLogger.logError(this.controller + ' get', e));
        });

        router.get('/:id', (req: Request, res: Response) => {
            this.getById(req, res).then().catch(e => AppLogger.logError(this.controller + ' get/' + req.params.id, e));
        });

        router.patch('/:lastModified', (req: Request, res: Response) => {
            this.getLastModified(req, res).then().catch(e => AppLogger.logError(this.controller + ' patch', e));
        });

        router.patch('/', (req: Request, res: Response) => {
            this.getLastModifiedValue(req, res).then().catch(e => AppLogger.logError(this.controller + '/getLastModifiedValue patch', e));
        });

        router.delete('/all', (req: Request, res: Response) => {
            this.deleteAll(req, res).then().catch(e => AppLogger.logError(this.controller + ' delete/all', e));
        });

        router.delete('/:id', (req: Request, res: Response) => {
            this.delete(req, res).then().catch(e => AppLogger.logError(this.controller + ' delete/' + req.params.id, e));
        });

        return router;
    }

    protected jsonToModel(model: any): TEntity | undefined {
        var e = (<any>this.entity).create(model);
        this.repository.setLocalId(e, model);
        return e;
    }

    // #region save
    public async save(req: Request, res: Response): Promise<void> {
        if (Array.isArray(req.body)) {
            await this.saveAll(req, res)
        } else {
            await this.saveOne(req, res);
        }
    }

    public async saveAll(req: Request, res: Response): Promise<void> {
        var models = new Array<TEntity>();
        for (let index = 0; index < req.body.length; index++) {
            const element = req.body[index];
            const model = this.jsonToModel(element);
            if (!model) {
                this.sendErrorResponse(res, 400);
                return;
            } else {
                models.push(model);
            }
        }

        try {
            const entities = await this.repository.saveAll(models);
            this.sendResponse(res, entities);
        } catch (error) {
            this.sendErrorResponse(res, 500, error);
        }
    }

    public async saveOne(req: Request, res: Response): Promise<void> {
        const model = this.jsonToModel(req.body);
        if (!model) {
            this.sendErrorResponse(res, 400);
            return;
        }
        try {
            const entity = await this.repository.save(model);
            this.sendResponse(res, entity);
        } catch (error) {
            this.sendErrorResponse(res, 500, error);
        }
    }
    // #endregion save

    // #region get

    public async getLastModifiedValue(req: Request, res: Response) {
        try {
            var item = await this.repository.getItem({ order: { property: "lastModified", order: "DESC" } });
            this.sendResponse(res, item ? item.lastModified : 0);
        } catch (error) {
            this.sendErrorResponse(res, 500, error);
        }
    }

    public async getLastModified(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.lastModified);
            if (!id) {
                await this.getAll(req, res);
                return;
            }

            const responseBody = await this.repository.getLastModified(id);

            this.sendResponse(res, responseBody, responseBody ? 200 : 204);
        } catch (error) {
            this.sendErrorResponse(res, 500, error);
        }
    }

    public async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            if (!id) {
                this.sendErrorResponse(res, 400);
                return;
            }

            const responseBody = await this.repository.getById(id);

            this.sendResponse(res, responseBody, responseBody ? 200 : 204);
        } catch (error) {
            this.sendErrorResponse(res, 500, error);
        }
    }

    public async getAll(req: Request, res: Response): Promise<void> {
        try {
            const responseBody = await this.repository.getAll();
            this.sendResponse(res, responseBody);
        } catch (error) {
            this.sendErrorResponse(res, 500, error);
        }
    }
    // #endregion get

    // #region delete

    public async deleteAll(req: Request, res: Response): Promise<void> {
        try {
            const entities = await this.repository.getAll();
            for (const entity of entities) {
                await this.repository.delete(entity.id, true);
            }

            this.sendResponse(res, true);
        } catch (error) {
            this.sendErrorResponse(res, 500, error);
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        try {
            let ids: Array<number> | undefined = new Array<number>();
            if (req.params.id.indexOf(',') > -1) {
                let splited = req.params.id.split(',');
                for (const s in splited) {
                    const id = parseInt(splited[s]);
                    if (!id) {
                        ids = undefined;
                        break;
                    }
                    ids.push(id);
                }
            } else {
                const id = parseInt(req.params.id);
                if (id) {
                    ids.push(id);
                }
            }

            if (!ids || !ids.length) {
                this.sendErrorResponse(res, 400);
                return;
            }

            const responseBody = await this.repository.delete(ids);
            this.sendResponse(res, responseBody);
        } catch (error) {
            this.sendErrorResponse(res, 500, error);
        }
    }

    // #endregion delete
}

export class CoreController<TEntity extends BaseEntity> extends CoreRepositoryController<TEntity, BaseRepository<TEntity>> {
    constructor(entity: ObjectType<TEntity>, controller: string) {
        super(entity, controller, new BaseRepository<TEntity>(entity));
    }
}