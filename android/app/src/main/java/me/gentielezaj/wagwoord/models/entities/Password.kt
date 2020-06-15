package me.gentielezaj.wagwoord.models.entities

import me.gentielezaj.sqldroid.models.annotations.column.Column
import me.gentielezaj.sqldroid.models.annotations.column.Unique
import me.gentielezaj.sqldroid.models.annotations.table.Table
import me.gentielezaj.wagwoord.models.annotations.Encrypt
import me.gentielezaj.wagwoord.models.annotations.Identifier
import me.gentielezaj.wagwoord.models.annotations.ListData
import me.gentielezaj.wagwoord.models.annotations.ListDataTypes
import me.gentielezaj.wagwoord.models.entities.coreEntities.CoreEntityCount

@Table
class Password: CoreEntityCount() {

    @Column(length = 128)
    @ListData(ListDataTypes.Description)
    var name: String? = null

    @Column
    @Identifier
    @Unique("domain_username")
    lateinit var domain: String;

    @Column(length = 128)
    @Identifier
    @Unique("domain_username")
    @ListData(ListDataTypes.Subject)
    var username: String? = null;

    @Column
    @Encrypt
    @ListData(ListDataTypes.ExpandPrimary)
    lateinit var password: String

    @Column
    var waitTime: Int? = null
}
