import "reflect-metadata";
import { App } from "./app";
import { createConnection } from "typeorm";
import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";
import { AppLogger } from "./utils/appLogger";

// #region prototypes
import './utils/prototypes/string-prototype';
// #endregion prototypes

const PORT = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || '4040';
const serverAddress = process.env.OPENSHIFT_NODEJS_IP || process.env.IP || 'localhost';

if(process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'dev') {
    require('dotenv').config();
}

//async function init() {

//    await createConnection(getTypeOrmConfig());

//    console.log('db set');

//    app.listen(parseInt(PORT), (e) => {
//        console.log('Express server listening on port ' + PORT);
//    });
//}

//init().then(f => console.log('all set up')).catch(e => AppLogger.logError(e, 'at app start \n'));

function getTypeOrmConfig(): SqliteConnectionOptions {
    return {
        "type": "sqlite",
        "database": process.env.TYPEORM_DATABASE || 'appData/wagwoord.sqlite',
        "entities": [process.env.TYPEORM_ENTITIES || 'dist/database/models/*.js'],
        "migrations": [process.env.TYPEORM_MIGRATIONS || 'dist/database/migrations/*.js'],
        "cli": {
            "migrationsDir": process.env.TYPEORM_MIGRATIONS_DIR || 'dist/database/migrations'
        },
        migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN == 'True' || process.env.TYPEORM_MIGRATIONS_RUN == 'true' || !process.env.TYPEORM_MIGRATIONS_RUN ? true : false,
        logging: ["error", "migration", "warn"],
        logger: "file"
    }
}



createConnection(getTypeOrmConfig()).then(e => {
    console.log('db set');
    new App().app.listen(parseInt(PORT), (e) => {
        console.log('Express server listening on port ' + PORT);
    });
});
