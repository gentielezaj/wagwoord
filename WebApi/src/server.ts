import "reflect-metadata";
import { App } from "./app";
import { createConnection } from "typeorm";
import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";
import { AppLogger } from "./utils/appLogger";

// #region prototypes
import './utils/prototypes/string-prototype';
// #endregion prototypes

const PORT = process.env.PORT || '4040';

if(process.env.NODE_ENV === 'dev') {
    require('dotenv').config();
}

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
