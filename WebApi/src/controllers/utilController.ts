import { Request, Response, Router } from "express";
import { BaseController } from "./baseController";
import { UtilRepository } from "../database/repositories/utilRepository";
import { Constants } from "../utils/constants";

export class UtilController extends BaseController {
    private readonly repository: UtilRepository;

    constructor() {
        super();
        this.repository = new UtilRepository();
    }

    public GetRouter(): Router {

        let router = super.GetRouter(true);

        router.post('/encryptionHash', (req: Request, res: Response) => {
            this.save(req, res).then().catch(e => this.sendErrorResponse(res, 500));
        });

        router.post('/startup', (req: Request, res: Response) => {
            this.startup(req, res).then().catch(e => this.sendErrorResponse(res, 500));
        });

        router.get('/:key', (req: Request, res: Response) => {
            this.get(req, res).then().catch(e => this.sendErrorResponse(res, 500));
        });

        return router;
    }


    protected async startup(req: Request, res: Response) {
        const encryptionHash = this.localStorage.getItem(Constants.EncryptionHashKey);
        if (req.header(Constants.EncryptionHashKey) != encryptionHash) {
            this.sendErrorResponse(res, 401);
        }

        this.sendResponse(res, this.repository.returnHeadersModel(encryptionHash));
    }

    protected async save(req: Request, res: Response) {
        if (!req.body || !req.body.hasOwnProperty(Constants.EncryptionHashKey)) {
            this.sendErrorResponse(res, 400);
            return;
        }
        try {
            if (req.header('wagwoordId') == process.env.WAGWOORD_ID && req.header(Constants.EncryptionHashKey) == this.localStorage.getItem(Constants.EncryptionHashKey)) {
                let encryptionHash = await this.repository.SaveEncryptionHash(req.body[Constants.EncryptionHashKey]);
                this.sendResponse(res, this.repository.returnHeadersModel(encryptionHash));
            } else {
                this.sendErrorResponse(res, 401);
            }
        } catch (e) {
            this.sendErrorResponse(res, 500, e);
        }
    }

    protected async get(req: Request, res: Response) {
        let key = req.params.key;
        if (!key) return;
        try {
            const model = this.repository.getById(key);
            this.sendResponse(res, model);
        } catch (e) {
            this.sendErrorResponse(res, 500, e);
        }
    }
}