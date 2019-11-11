import * as express from "express";
import * as cros from 'cors';
import * as bodyParser from "body-parser";
import { PasswordController } from "./controllers/passwordController";
import { BlacklistController } from "./controllers/blacklistController";
import { SettingsController } from "./controllers/settingsController";
import { TestController } from "./controllers/testController";


class App {

    public app: express.Application;
    //public reouter: Route = new Route();

    constructor() {
        this.app = express();
        this.config();
        this.initControllers();
    }

    private config(): void {
        this.app.use
        this.app.use(cros())
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));

        // setup view

        // this.app.set('views', __dirname + '/views');
        // this.app.engine('html', require('ejs').renderFile);
        // this.app.set('view engine', 'html');
    }

    private initControllers() {
        this.app.use('/api/password', new PasswordController().GetRouter());
        this.app.use('/api/blacklist', new BlacklistController().GetRouter());
        this.app.use('/api/settings', new SettingsController().GetRouter());
        this.app.use('/api/test', new TestController().GetRouter());

        this.app.get('/', function (req, res) {
            res.sendFile('index.html', {root : __dirname + '/views'});
        });
    }
}

export default new App().app;