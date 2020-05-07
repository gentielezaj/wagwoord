import { Request, Response, Router } from "express";
import { BaseController } from "./baseController";
import { Constants } from "../utils/constants";

export class InfoController extends BaseController {
    constructor() {
        super();
    }

    public GetRouter(): Router {

        let router = super.GetRouter(true, true);

        router.head('/', (req: Request, res: Response) => {
            res.status(200).send();
        });

        router.get('/:time', (req: Request, res: Response) => {
            const intTime = parseInt(req.params.time);
            const server = new Date().getTime();
            const model = {
                time: {
                    requestTime: intTime,
                    serverTime: server,
                    dicerence: server - intTime
                },
                wagwoord: {
                    server: process.env.WAGWOORD_ID,
                    local: req.header('wagwoordId'),
                    ok: process.env.WAGWOORD_ID == req.header('wagwoordId')
                },
                hash: {
                    server: this.localStorage.getItem(Constants.EncryptionHashKey),
                    local: req.header('hash'),
                    ok: this.isEncryptionEqual(req),
                    isEncryptionUsed: this.isEncryptionUsed(req.header('hash'), req.params.time),
                    isEncryptionEqual: this.isEncryptionEqual(req)
                }
            }

            res.json(model);
        });
        router.get('/', (req: Request, res: Response) => {
            res.status(200).send();
        });

        return router;
    }


}