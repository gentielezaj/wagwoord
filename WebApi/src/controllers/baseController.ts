import { Router, Response, Request } from "express";
import { AppLogger } from "../utils/appLogger";
import { LocalStorage } from "node-localstorage";
import { Constants } from "../utils/constants";

export abstract class BaseController {

    protected localStorage: LocalStorage;

    constructor() {
        this.localStorage = new LocalStorage(Constants.LocalStorageFolder);
    }


    public GetRouter(skipCheck?: boolean): Router {
        let router = Router();

        if(!skipCheck) router.use((req: Request, res: Response, next: any) => this.checkAccess(req, res, next));

        return router;
    }

    protected checkAccess(req: Request, res: Response, next: any): void {
        if (req.header('wagwoordId') == process.env.WAGWOORD_ID) {
            next();
        } else {
            this.sendErrorResponse(res, 401);
        }
    }

    // #region response
    protected sendErrorResponse(res: Response, code: number, exeption?: any, error?: string): void {
        if (exeption) AppLogger.logError('creating error response', exeption);
        this.sendResponse(res, null, code, error);
    }

    protected sendResponse(res: Response, body?: any, code?: number, error?: string): void {
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
                case 426:
                    error = 'upateRequired'
                    success = false;
                    break;
                case 428:
                    error = 'encryptonHashUpdate'
                    success = false;
                    break;
                case 204:
                    error = 'no entity found'
                    code = 200;
                    success = false;
                    break;
            }
        }

        let count = 0;
        if (body) {
            count = 1;
            if (Array.isArray(body)) {
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
}