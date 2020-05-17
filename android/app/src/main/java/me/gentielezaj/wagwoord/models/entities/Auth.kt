package me.gentielezaj.wagwoord.models.entities

import me.gentielezaj.sqldroid.models.annotations.column.Column
import me.gentielezaj.sqldroid.models.annotations.column.Unique
import me.gentielezaj.wagwoord.models.entities.coreEntities.CoreEntity

class Auth : CoreEntity() {
    @Column(nullable = false, length = 64)
    @Unique()
    var key: String = ""

    @Column(nullable = false, length = 64)
    var value: String? = null
}