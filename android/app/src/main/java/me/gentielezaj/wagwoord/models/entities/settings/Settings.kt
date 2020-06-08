package me.gentielezaj.wagwoord.models.entities.settings

import me.gentielezaj.sqldroid.models.ColumnType
import me.gentielezaj.sqldroid.models.annotations.column.Column
import me.gentielezaj.sqldroid.models.annotations.column.ColumnConverter
import me.gentielezaj.sqldroid.models.annotations.column.ForeignKey
import me.gentielezaj.sqldroid.models.annotations.column.PrimaryKey
import me.gentielezaj.sqldroid.models.annotations.table.Table
import me.gentielezaj.wagwoord.common.empty
import me.gentielezaj.wagwoord.models.entities.coreEntities.*
import java.lang.NullPointerException

class ColumnTypeConverter : ColumnConverter() {
    override fun read(value: Any?): Any? {
        if(value == null || value !is Int) throw NullPointerException()
        return ColumnType.values().first { it.name == value }
    }

    override fun write(value: Any?): Any? {
        if(value == null || value !is SyncStatus) throw NullPointerException()
        return  value.name
    }
}

@Table
public class Settings : CoreEntity(), IEntity {
    @Column lateinit var name: String
    @ForeignKey(property = "settingsId")
    var properties = mutableListOf<SettingsProperty>()
}

@Table
public class SettingsProperty : CoreIdEntity(), IIdEntity {
    @Column lateinit var key: String
    @Column var value: String? = null
    @Column(type = ColumnType.TEXT, converter = ColumnTypeConverter::class) var type: ColumnType = ColumnType.NVARCHAR

    @ForeignKey(Settings::class, "id")
    @Column var settingsId: Int = 0
}