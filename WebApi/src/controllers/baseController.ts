import { BaseEntity } from "database/models/baseEntity";
import { Request, Response, Application, response } from "express";
import { ObjectType } from "typeorm";
import { BaseRepository, IBaseRepository } from "../database/repositories/baseRepository";
import { AppLogger } from "../utils/appLogger";

export abstract class BaseController<TEntity extends BaseEntity> {
    protected entity: ObjectType<TEntity>;
    protected repository: IBaseRepository<TEntity>;
    controller: string

    constructor(app: Application, entity: ObjectType<TEntity>, controller: string) {
        this.entity = entity;
        this.repository = new BaseRepository<TEntity>(this.entity);
        this.controller = controller;
        this.init(app);
    }

    protected init(app: Application) {
        app.use((req: Request, res: Response, next: any) => this.checkAccess(req, res, next));

        app.post('/api/' + this.controller, (req: Request, res: Response) => {
            this.save(req, res).then().catch(e => AppLogger.logError(this.controller + ' post', e));
        });

        app.put('/api/' + this.controller, (req: Request, res: Response) => {
            this.save(req, res).then().catch(e => AppLogger.logError(this.controller + ' put', e));
        });

        app.get('/api/' + this.controller, (req: Request, res: Response) => {
            this.getAll(req, res).then().catch(e => AppLogger.logError(this.controller + ' get', e));
        });

        app.patch(`/api/${this.controller}/:lastModified`, (req: Request, res: Response) => {
            this.getLastModified(req, res).then().catch(e => AppLogger.logError(this.controller + ' patch', e));
        });

        app.get(`/api/${this.controller}/:id`, (req: Request, res: Response) => {
            this.getById(req, res).then().catch(e => AppLogger.logError(this.controller + ' get/' + req.params.id, e));
        });

        app.delete(`/api/${this.controller}/:id`, (req: Request, res: Response) => {
            this.delete(req, res).then().catch(e => AppLogger.logError(this.controller + ' delete/' + req.params.id, e));
        });
    }

    protected checkAccess(req: Request, res: Response, next: any) {
        if (req.header('wagwoordId') == process.env.WAGWOORD_ID) {
            next();
        } else {
            this.sendErrorResponse(res, 401);
        }
    }

    abstract jsonToModel(model: any): TEntity | undefined;

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

    // #region response
    protected sendErrorResponse(res: Response, code: number, exeption?: any, error?: string): void {
        if (exeption) AppLogger.logError('creating error response', exeption);
        this.sendResponse(res, null, code, error);
    }

    protected sendResponse(res: Response, body: any, code?: number, error?: string): void {
        code = code || 200;
        let success = code == 200 ? true : false;
        if (!error && code != 200) {
            switch (code) {
                case 500:
                    error = 'error on server'
                    break;
                case 400:
                    error = 'badRequest'
                    break;
                case 401:
                    error = 'unuthorised'
                    break;
                case 204:
                    error = 'no entity found'
                    code = 200;
                    success = false;
                    break;
            }
        }

        let count = 0;
        if(body) {
            count = 1;
            if(Array.isArray(body)) {
                count = body.length;
            }
        }

        const resModel = {
            success: success,
            data: body,
            errorMessage: error,
            count: count
        };

        res.status(code).json(resModel);
    }
    // #endregion response

    // #region delete

    public async delete(req: Request, res: Response) {
        try {
            let ids: Array<number> | undefined = new Array<number>();
            if (req.params.id.indexOf(',') > -1) {
                let splited = req.params.id.split(',');
                for (const s in splited) {
                    const id = parseInt(s);
                    if (!id) {
                        ids = undefined;
                        break;
                    }
                    ids.push(parseInt(s))
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