package me.gentielezaj.wagwoord.models.entities

import me.gentielezaj.sqldroid.models.annotations.column.Column
import me.gentielezaj.sqldroid.models.annotations.column.PrimaryKey
import me.gentielezaj.sqldroid.models.annotations.column.Unique
import me.gentielezaj.sqldroid.models.annotations.table.Table
import me.gentielezaj.wagwoord.models.annotations.Encrypt
import me.gentielezaj.wagwoord.models.annotations.ListData
import me.gentielezaj.wagwoord.models.annotations.ListDataTypes
import me.gentielezaj.wagwoord.models.entities.coreEntities.CoreEntity
import me.gentielezaj.wagwoord.models.entities.coreEntities.CoreEntityCount
import me.gentielezaj.wagwoord.models.entities.coreEntities.IEntityCount
import java.util.*

@Table
class Totp : CoreEntity() {
    @ListData(ListDataTypes.Subject)
    @Column var issuer: String = ""
    @ListData(ListDataTypes.Description)
    @Column var username: String = ""

    @Column
    @Unique
    @Encrypt
    @ListData(ListDataTypes.ExpandPrimary)
    var secret: String = ""

    @Column(default = "6") var digits: Int? = 6
    @Column(default = "hex") var encoding: String? = "hex"
    @Column(default = "sha1") var algorithm: String? = "sha1"
    @Column var epoch: Int? = null
    @Column(default = "30") var step: Int = 30
    @Column(default = "0") var window: Int? = 0
    @Column var icon: String? = null
}
