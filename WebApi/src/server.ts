import "reflect-metadata";
import app from "./app";
import { createConnection } from "typeorm";
import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";

const PORT = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || '4040';
const serverAddress = process.env.OPENSHIFT_NODEJS_IP || process.env.IP || 'localhost';

if(process.env.NODE_ENV === 'dev') {
    require('dotenv').config();
}

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
        migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN == 'True' || process.env.TYPEORM_MIGRATIONS_RUN == 'true' || process.env.TYPEORM_MIGRATIONS_RUN == undefined ? true : false,
        logging: ["error", "migration", "warn"],
        logger: "file"
    }
}
