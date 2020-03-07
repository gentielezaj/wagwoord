package me.gentielezaj.wagwoord.models.entities

import me.gentielezaj.sqldroid.models.annotations.column.Column
import me.gentielezaj.sqldroid.models.annotations.column.PrimaryKey
import me.gentielezaj.sqldroid.models.annotations.column.Unique
import me.gentielezaj.sqldroid.models.annotations.table.Table
import me.gentielezaj.wagwoord.models.entities.coreEntities.CoreEntityCount
import me.gentielezaj.wagwoord.models.entities.coreEntities.IEntityCount
import java.util.*

@Table
class Totp : CoreEntityCount() {
    @Column(nullable = false) var issuer: String = ""
    @Column(nullable = false) var username: String = ""
    @Column(nullable = false) @Unique var secret: String = ""
    @Column(default = "6") var digits: Int? = 6
    @Column(default = "hex") var encoding: String? = "hex"
    @Column(default = "sha1") var algorithm: String? = "sha1"
    @Column var epoch: Int? = null
    @Column(default = "30") var step: Int = 30
    @Column(default = "0") var window: Int = 0
    @Column var icon: String? = null
}
