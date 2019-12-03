import { Request, Response, Router } from "express";
import { AppLogger } from "../utils/appLogger";
import { CreditCardModel } from "../database/models/creadit-card";

export class TestController {

    public GetRouter(): Router {

        let router = Router();

        router.use((req: Request, res: Response, next: any) => this.checkAccess(req, res, next));

        router.post('/', (req: Request, res: Response) => {
            this.resolts(req, res);
        });

        router.get('/', (req: Request, res: Response) => {
            this.test(req, res);
        });

        router.patch('/', (req: Request, res: Response) => {
            this.resolts(req, res);
        });

        router.delete('/', (req: Request, res: Response) => {
            this.resolts(req, res);
        });

        return router;
    }

    protected test(req: Request, res: Response) {
        var model = new CreditCardModel();
        model.name = undefined;
        let metadata = Reflect.getMetadata('Identifier', model);
        return res.json(metadata);
    }

    protected resolts(req: Request, res: Response) {
        let model = {
            params: req.params,
            body: req.body
        }

        return this.sendResponse(res, model);
    }

    protected checkAccess(req: Request, res: Response, next: any) {
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
            count: count,
            code
        };

        res.setHeader('Content-Type', "application/json");
        res.setHeader('mode', "cros");
        res.setHeader('Access-Control-Allow-Origin', '*')

        res.status(code).json(resModel);
    }
    // #endregion response

}