import { Request, Response, Router } from "express";
import { BaseController } from "./baseController";
import { AuthRepository } from "../database/repositories/authRepository";
import { Constants } from "../utils/constants";

export class AuthController extends BaseController {
    private readonly repository: AuthRepository;

    constructor() {
        super();
        this.repository = new AuthRepository();
    }

    public GetRouter(): Router {

        let router = super.GetRouter(true, true);

        router.post('/change', (req: Request, res: Response) => {
            if (!this.checkWagwoordId(req) || !this.isEncryptionEqual(req)) {
                this.sendErrorResponse(res, 401);
            } else {
                this.change(req, res).then().catch(e => this.sendErrorResponse(res, 500));
            }
        });

        router.patch('/', (req: Request, res: Response) => {
            this.changeEncryptionHash(req, res).then().catch(e => this.sendErrorResponse(res, 500));
        });

        router.post('/login', (req: Request, res: Response) => {
            this.login(req, res).then().catch(e => this.sendErrorResponse(res, 500));
        });


        router.post('/', (req: Request, res: Response) => {
            this.resolve(req, res).then().catch(e => this.sendErrorResponse(res, 500));
        });


        router.get('/', (req: Request, res: Response) => {
            this.isValidConnection(req, res).then().catch(e => this.sendErrorResponse(res, 500));
        });
        router.get('/isValidConnection', (req: Request, res: Response) => {
            this.isValidConnection(req, res).then().catch(e => this.sendErrorResponse(res, 500));
        });

        return router;
    }

    protected async changeEncryptionHash(req: Request, res: Response) {
        if (!this.checkWagwoordId(req)) {
            this.sendResponse(res, false, 401);
            return;
        }

        const current = (await this.repository.getById(Constants.EncryptionHashKey))?.value;

        if (req.body.new == current) this.sendResponse(res, true);
        else if (req.body.old != current) this.sendResponse(res, false);
        else {
            await this.repository.SaveEncryptionHash(req.body.new);
            this.sendResponse(res, true);
        }
    }

    protected async resolve(req: Request, res: Response) {
        let status = 'unAuthorised';
        try {
            if (this.compareEncryptionHash(req.body.oldEncryptionHash) && this.checkWagwoordId(req)) {
                status = 'change';
            } else {
                status = 'login'
            }
        } catch (e) {

        }
        
        this.sendResponse(res, status, 200);
    }

    protected async isValidConnection(req: Request, res: Response) {
        if (this.checkWagwoordId(req) && this.isEncryptionEqual(req)) {
            this.sendResponse(res, true, 200);
        } else {
            this.sendResponse(res, false, 400);
        }
    }

    protected async login(req: Request, res: Response) {
        const encryptionHashReq = req.body[Constants.EncryptionHashKey] ?? '';
        try {
            let a = this.localStorage.getItem(Constants.EncryptionHashKey);
            if (encryptionHashReq == (this.localStorage.getItem(Constants.EncryptionHashKey) ?? '')) {
                this.sendResponse(res, this.repository.returnHeadersModel());
            } else {
                this.sendErrorResponse(res, 401);
            }
        } catch (e) {
            this.sendErrorResponse(res, 500, e);
        }
    }

    protected async change(req: Request, res: Response) {
        const encryptionHashReq = req.body ? req.body[Constants.EncryptionHashKey] : '';
        try {
            const w = this.checkWagwoordId(req);
            const e = this.isEncryptionEqual(req);
            if (w && e) {
                await this.repository.SaveEncryptionHash(encryptionHashReq);
                this.sendResponse(res, this.repository.returnHeadersModel());
            } else {
                this.sendErrorResponse(res, 401);
            }
        } catch (e) {
            this.sendErrorResponse(res, 500, e);
        }
    }
}