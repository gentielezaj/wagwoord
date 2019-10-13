import * as express from "express";
import * as bodyParser from "body-parser";
import { PasswordController } from "./controllers/passwordController";
import { BlacklistController } from "./controllers/blacklistController";


class App {

    public app: express.Application;
    //public reouter: Route = new Route();
    
    constructor() {
        this.app = express();
        this.config();        
        //this.reouter.routes(this.app);
        this.initControllers();
    }

    private initControllers() {
        this.app.use('/api/password', new PasswordController().GetRouter());
        this.app.use('/api/blacklist', new BlacklistController().GetRouter());
    }

    private config(): void{
        this.app.use
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

}

export default new App().app;