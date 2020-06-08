package me.gentielezaj.wagwoord.models.entities

import me.gentielezaj.sqldroid.models.annotations.column.Column
import me.gentielezaj.sqldroid.models.annotations.column.Unique
import me.gentielezaj.sqldroid.models.annotations.table.Table
import me.gentielezaj.wagwoord.models.annotations.Identifier
import me.gentielezaj.wagwoord.models.entities.coreEntities.CoreEntity

@Table
class Blacklist : CoreEntity() {
    @Identifier()
    @Unique
    @Column(length = 64)
    lateinit var name: String

    @Column
    var password: Boolean = false

    @Column
    var address: Boolean = false

    @Column
    var creditCard: Boolean = false

    @Column
    var codeGenerator: Boolean = false
}