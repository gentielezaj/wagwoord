import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class CoreMigrationProperties {
    protected coreColumns() : Array<TableColumn> {
        return [
            new TableColumn({
                name: "id",
                type: 'int',
                isGenerated: true,
                isNullable: false,
                isPrimary: true
            }),
            new TableColumn({
                name: "lastModified",
                type: 'BIGINT',
                isNullable: false,
                default: 0
            }),
            new TableColumn({
                name: "deleted",
                type: 'bool',
                isNullable: false,
                default: false
            })
        ]
    }

    protected coreEncryptedColumns(): Array<TableColumn> {
        return [
            ...this.coreColumns(),
            new TableColumn({
                name: "encrypted",
                type: 'bool',
                isNullable: false,
                default: false
            })
        ]
    }

    protected coreCountColumns(): Array<TableColumn> {
        return [
            ...this.coreEncryptedColumns(),
            new TableColumn({
                name: "count",
                type: 'int',
                isNullable: false,
                default: 0
            })
        ]
    }
}
