package me.gentielezaj.wagwoord.models.entities.coreEntities

enum class SyncStatus(val value: Int) {
    OFF(-1),
    Syncing(0),
    Synced(1)
}

interface IIdEntity {
    var id: Int
}

interface IEntity : IIdEntity {
    var lastModified: Long
    var serverId: Int?
    var encrypted:Boolean
    var sync: SyncStatus
}

interface IEntityCount : IEntity {
    var count: Int
}