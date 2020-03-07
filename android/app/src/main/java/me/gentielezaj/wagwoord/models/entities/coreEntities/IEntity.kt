package me.gentielezaj.wagwoord.models.entities.coreEntities

interface IEntity {
    var id: Long;
    var lastModified: String?
    var serverId: Int
    var encrypted:Boolean
}

interface IEntityCount : IEntity {
    var count: Int
}