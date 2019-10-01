import "reflect-metadata";
import app from "./app";
import { createConnection, ConnectionOptions, Logger } from "typeorm";
import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";
import { AppLogger } from "./utils/appLogger";
require('dotenv').config();

const PORT = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || '4040';
const serverAddress = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || 'localhost';

async function init() {
    
    await createConnection(getTypeOrmConfig());

    console.log('db set');

    app.listen(parseInt(PORT), serverAddress, () => {
        console.log('Express server listening on port ' + PORT);
    });
}

init().then(f => console.log('all set up')); //.catch(e => Logger.logError(e, 'at app start \n'));

function getTypeOrmConfig(): SqliteConnectionOptions {
    return {
        "type": "sqlite",
        "database": process.env.TYPEORM_DATABASE || 'wagwoord.sqlite',
        "entities": [process.env.TYPEORM_ENTITIES || 'src/database/models/*.ts'],
        "migrations": [process.env.TYPEORM_MIGRATIONS || 'migrations/*.ts'],
        "cli": {
            "migrationsDir": process.env.TYPEORM_MIGRATIONS_DIR || 'migrations'
        },
        migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN == 'True' || process.env.TYPEORM_MIGRATIONS_RUN == 'true' || !process.env.TYPEORM_MIGRATIONS_RUN ? true : false,
        logging: ["error", "migration", "warn"],
        logger: "file"
    }
}
