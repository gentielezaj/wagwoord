import { Router, Response, Request } from "express";
import { AppLogger } from "../utils/appLogger";
import { LocalStorage } from "node-localstorage";
import { Constants } from "../utils/constants";
import { hotp } from 'otplib';

export abstract class BaseController {

    protected readonly localStorage: LocalStorage;

    constructor() {
        this.localStorage = new LocalStorage(Constants.LocalStorageFolder);
    }


    public GetRouter(skipCheck?: boolean, skipEncryption?: boolean): Router {
        let router = Router();

        if(!skipCheck) router.use((req: Request, res: Response, next: any) => this.checkAccess(req, res, next));

        if (!skipEncryption)
            router.use((req: Request, res: Response, next: any) => this.checkEncryption(req, res, next));

        return router;
    }

    // region authorize

    protected checkAccess(req: Request, res: Response, next: any): void {
        if (this.checkWagwoordId(req)) {
            next();
        } else {
            this.sendErrorResponse(res, 401);
        }
    }

    protected checkWagwoordId(req: Request): boolean {
        return this.compareWagwoordId(req.header('wagwoordId'));
    }

    protected compareWagwoordId(wagwordId: string): boolean {
        return wagwordId == process.env.WAGWOORD_ID
    }

    protected checkEncryption(req: Request, res: Response, next: any): void {
        try {
            if (!this.isEncryptionEqual(req)) {
                this.sendErrorResponse(res, 428);
            }
        } catch (error) {
            console.error(error);
        }

        next();
    }

    protected isEncryptionEqual(req: Request): boolean {
        try {
            const encryptonHash = this.localStorage.getItem(Constants.EncryptionHashKey);
            console.log('encryptonHash: ' + encryptonHash);
            if (!encryptonHash) return true;

            const otp = req.header('hash')
            if (otp == 'nohash') return true;
            if (!otp) return false;

            const code = otp.split('-')[0];
            const epoch = otp.split('-')[1];
            const key = hotp.check(code, encryptonHash, parseInt(epoch));
            return key;
        } catch (e) {
            console.log(e);
        }
    }

    protected compareEncryptionHash(hash: string): boolean {
        return hash == this.localStorage.getItem(Constants.EncryptionHashKey);
    }

    // endregion

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