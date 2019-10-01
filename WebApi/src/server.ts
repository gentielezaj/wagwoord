import "reflect-metadata";
import app from "./app";
import { existsSync, writeFileSync } from 'fs';
import { Database, OPEN_CREATE } from 'sqlite3';
import { Logger } from "./utils/logger";
import { options } from "./database/db"
import { createConnection } from "typeorm";
import { inherits } from "util";
require('dotenv').config();

const PORT = process.env.OPENSHIFT_NODEJS_PORT ? parseInt(process.env.OPENSHIFT_NODEJS_PORT) : 4040;
const serverAddress = process.env.OPENSHIFT_NODEJS_IP || 'localhost'

async function init() {
    console.log('run at ' + (process.env.DEBUG == 'true' ? 'debugger' : 'production') + ' mode');
    if (process.env.DEBUG == 'true')
        await createConnection({
            "type": "sqlite",
            "database": "testdata/wagwoord.sqlite",
            "entities": ["src/database/models/*.ts"],
            "migrations": ["migrations/*.ts"]
        });
    else
        await createConnection({
            "type": "sqlite",
            "database": "testdata/wagwoord.sqlite",
            "entities": ["dist/database/models/*.js"]
        });

    console.log('db set');

    app.listen(PORT, serverAddress, () => {
        console.log('Express server listening on port ' + PORT);
    });
}

init().then(f => console.log('all set up')).catch(e => Logger.logError(e, 'at app start \n'));


