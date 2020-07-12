package me.gentielezaj.wagwoord.models.entities.coreEntities

import com.google.gson.annotations.SerializedName
import me.gentielezaj.sqldroid.models.ColumnType
import me.gentielezaj.sqldroid.models.annotations.column.Column
import me.gentielezaj.sqldroid.models.annotations.column.ColumnConverter
import me.gentielezaj.sqldroid.models.annotations.column.PrimaryKey
import me.gentielezaj.sqldroid.models.annotations.column.Unique
import java.lang.NullPointerException
import java.util.*

class SyncStatusConverter : ColumnConverter() {
    override fun read(value: Any?): Any? {
        if(value == null || value !is Int) throw NullPointerException()
        return SyncStatus.values().first { it.value == value }
    }

    override fun write(value: Any?): Any? {
        if(value == null || value !is SyncStatus) throw NullPointerException()
        return  value.value
    }
}

abstract class CoreIdEntity: IIdEntity, Any() {
    @Column
    @PrimaryKey(autoincrement = true)
    @SerializedName("localId")
    override var id: Int = 0
}

abstract class CoreEntity : CoreIdEntity(), IEntity {

    @Column override var lastModified: Long = 0

    @Column
    @Unique
    @SerializedName("id")
    override var serverId: Int? = null

    @Column override var encrypted:Boolean = false

    @Column(type = ColumnType.INT, converter = SyncStatusConverter::class) override var sync: SyncStatus = SyncStatus.OFF

    override var deleted = false
}

abstract class CoreEntityCount : CoreEntity(), IEntityCount {
    @Column(default = "0") override var count: Int = 0
}

