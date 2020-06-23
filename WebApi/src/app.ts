import "reflect-metadata";
import { Server } from "./server";
import { createConnection, ConnectionOptions } from "typeorm";
import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";
import { PostgresConnectionCredentialsOptions } from "typeorm/driver/postgres/PostgresConnectionCredentialsOptions";
import { AppLogger } from "./utils/appLogger";

// #region prototypes
import './utils/prototypes/string-prototype';
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
// #endregion prototypes

const PORT = process.env.PORT || '4040';
const HOST = process.env.HOST || 'localhost';

if (!process.env.NODE_ENV) {
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
        case 'sqlite': return getSqliteConfig();
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
        entities: [process.env.TYPEORM_ENTITIES || 'database/models/*.js'],
        migrations: [process.env.TYPEORM_MIGRATIONS || 'database/migrations/*.js'],
        cli: {
            migrationsDir: process.env.TYPEORM_MIGRATIONS_DIR || 'database/migrations'
        },
        migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN == 'True' || process.env.TYPEORM_MIGRATIONS_RUN == 'true' || !process.env.TYPEORM_MIGRATIONS_RUN ? true : false,
        logging: ["error", "migration", "warn"],
        logger: "file"
    }
}

function getSqliteConfig(): SqliteConnectionOptions {
    return {
        "type": "sqlite",
        "database": process.env.TYPEORM_DATABASE || 'appData/wagwoord.sqlite',
        "entities": [process.env.TYPEORM_ENTITIES || 'database/models/*.js'],
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
    AppLogger.info('db set');
    new Server().app.listen(parseInt(PORT), HOST, (e) => {
        console.log('Express server listening on port ' + PORT);
    });
}).catch(e => {
    AppLogger.error('db error:');
    AppLogger.error(e);
});