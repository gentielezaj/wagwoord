import { Request, Response, Router } from "express";
import { BaseController } from "./baseController";
import { AppLogger } from "../utils/appLogger";
import { Constants } from '../utils/constants';

export class EncryptionController extends BaseController {
    constructor() {
        super();
    }

    public GetRouter(): Router {
        let router = super.GetRouter();

        router.post('/', (req: Request, res: Response) => {
            this.save(req, res);
        });

        router.get('/', (req: Request, res: Response) => {
            this.get(req, res);
        });

        router.delete('/', (req: Request, res: Response) => {
            this.delete(req, res);
        });

        return router;
    }

    protected save(req: Request, res: Response) {
        if (!req.body) this.sendErrorResponse(res, 400);
        this.localStorage.setItem(Constants.EncryptionHashKey, req.body);
        this.sendResponse(res);
    }


    protected delete(req: Request, res: Response) {
        this.localStorage.removeItem(Constants.EncryptionHashKey);
        this.sendResponse(res);
    }

    protected get(req: Request, res: Response) {
        this.sendResponse(res, this.localStorage.getItem(Constants.EncryptionHashKey));
    }
}