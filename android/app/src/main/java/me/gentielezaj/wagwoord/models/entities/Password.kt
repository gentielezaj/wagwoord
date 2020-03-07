package me.gentielezaj.wagwoord.models.entities

import me.gentielezaj.sqldroid.models.annotations.column.Column
import me.gentielezaj.sqldroid.models.annotations.table.Table
import me.gentielezaj.wagwoord.common.*
import me.gentielezaj.wagwoord.models.entities.coreEntities.CoreEntityCount

@Table
class Password: CoreEntityCount() {

    @Column(length = 64, nullable = false)
    var name: String = String.empty;

    @Column(nullable = false)
    var domain: String = String.empty;

    @Column(length = 128)
    var username: String? = null;

    @Column(nullable = false)
    var password: String? = null

    @Column
    var waitTime: Int? = null
}
