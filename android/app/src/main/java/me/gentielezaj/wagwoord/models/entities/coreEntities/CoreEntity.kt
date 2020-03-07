package me.gentielezaj.wagwoord.models.entities.coreEntities

import me.gentielezaj.sqldroid.models.annotations.column.Column
import me.gentielezaj.sqldroid.models.annotations.column.PrimaryKey
import me.gentielezaj.sqldroid.models.annotations.column.Unique
import java.util.*

abstract class CoreEntity : IEntity {
    @Column
    @PrimaryKey(autoincrement = true)
    override var id: Long = 0

    @Column(nullable = false) override var lastModified: String? = null

    @Column
    @Unique
    override var serverId: Int = 0

    @Column override var encrypted:Boolean = false
}

abstract class CoreEntityCount : CoreEntity(), IEntityCount {
    @Column(nullable = false, default = "0") override var count: Int = 0
}
