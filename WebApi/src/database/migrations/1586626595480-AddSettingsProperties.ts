import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddSettingsProperties1586626595480 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn("Settings", "value")

        await queryRunner.query(
            `CREATE TABLE "SettingsProperty" 
            ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
             "property" nvarchar(128) NOT NULL,
             "value" Text NOT NULL,
             "settingsId" INT NOT NUll,
              CONSTRAINT FK_settingsId FOREIGN KEY (settingsId) REFERENCES Settings (id) on delete CASCADE
            )`
            , undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn("Settings",
            new TableColumn({
                name: 'value',
                type: "TEXT",
                isNullable: true
            }));
        queryRunner.dropTable("SettingsProperty")
    }

}
