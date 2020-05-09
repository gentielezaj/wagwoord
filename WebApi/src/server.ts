import "reflect-metadata";
import { App } from "./app";
import { createConnection, ConnectionOptions } from "typeorm";
import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";
import { PostgresConnectionCredentialsOptions } from "typeorm/driver/postgres/PostgresConnectionCredentialsOptions";
import { AppLogger } from "./utils/appLogger";

// #region prototypes
import './utils/prototypes/string-prototype';
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
// #endregion prototypes

const PORT = process.env.PORT || '4040';

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'dev') {
    require('dotenv').config();
}

function getType(): 'postgres' | 'sqlite' {
    if (process.env.TYPEORM_TYPE == 'postgres') return 'postgres';
    if (process.env.TYPEORM_TYPE == 'sqlite') return 'sqlite';
    throw 'not suported db';
}

function getTypeOrmConfig(): ConnectionOptions {
    switch (process.env.TYPEORM_CONNECTION) {
        case 'postgres': return pgConfig();
        default: return {
            type: getType(),
            "database": process.env.TYPEORM_DATABASE,
            host: process.env.TYPEORM_HOST,
            password: process.env.TYPEORM_PASSWORD,
            port: parseInt(process.env.TYPEORM_PORT),
            url: process.env.TYPEORM_URL,
            username: process.env.TYPEORM_USERNAME,


            "entities": [process.env.TYPEORM_ENTITIES],
            "migrations": [process.env.TYPEORM_MIGRATIONS],
            "cli": {
                "migrationsDir": process.env.TYPEORM_MIGRATIONS_DIR
            },
            migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN == 'True' || process.env.TYPEORM_MIGRATIONS_RUN == 'true' || !process.env.TYPEORM_MIGRATIONS_RUN ? true : false,
            logging: ["error", "migration", "warn"],
            logger: "file"
        };
    }
}

function pgConfig(): PostgresConnectionOptions {
    return {
        type: 'postgres',
        database: process.env.TYPEORM_DATABASE || 'postgres',
        host: process.env.TYPEORM_HOST || 'localhost',
        password: process.env.TYPEORM_PASSWORD || '123456',
        port: parseInt(process.env.TYPEORM_PORT) || 5432,
        url: process.env.TYPEORM_URL,
        username: process.env.TYPEORM_USERNAME || 'postgres',
    }
}

function getSqliteConfig(): SqliteConnectionOptions {
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
}).catch(e => {
    console.log('db error:');
    console.log(e);
});
