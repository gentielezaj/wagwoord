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
    @ListData(ListDataTypes.Description, searchable = true)
    var name: String? = null

    @Column
    @Identifier
    @ListData(ListDataTypes.None, showOnCopyList = true, searchable = true)
    @Unique("domain_username")
    lateinit var domain: String;

    @Column(length = 128)
    @Identifier
    @Unique("domain_username")
    @ListData(ListDataTypes.Subject, showOnCopyList = true, searchable = true)
    var username: String? = null;

    @Column
    @Encrypt
    @ListData(ListDataTypes.ExpandPrimary, showOnCopyList = true)
    lateinit var password: String

    @Column
    var waitTime: Int? = null
}
