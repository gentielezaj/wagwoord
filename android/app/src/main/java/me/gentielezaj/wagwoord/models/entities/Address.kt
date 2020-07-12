package me.gentielezaj.wagwoord.models.entities

import com.google.gson.annotations.SerializedName
import me.gentielezaj.sqldroid.models.ColumnType
import me.gentielezaj.sqldroid.models.annotations.column.Column
import me.gentielezaj.sqldroid.models.annotations.table.Table
import me.gentielezaj.wagwoord.models.annotations.Encrypt
import me.gentielezaj.wagwoord.models.annotations.ListData
import me.gentielezaj.wagwoord.models.annotations.ListDataTypes
import me.gentielezaj.wagwoord.models.entities.coreEntities.CoreEntityCount
import me.gentielezaj.wagwoord.models.entities.coreEntities.IEntityCountServer
import me.gentielezaj.wagwoord.models.entities.coreEntities.IEntityServer
import java.util.Date

@Table
open class Address : CoreEntityCount() {
    @Column(length = 64)
    @ListData(ListDataTypes.Subject, showOnCopyList = true)
    var firstName: String? = null;

    @ListData(ListDataTypes.Subject, order = 1, showOnCopyList = true)
    @Column(length = 64)
    var lastName: String? = null;

    @Column(type = ColumnType.DATE)
    var birthDate: Date? = null;

    @Column(length = 2048)
    @Encrypt
    @ListData(ListDataTypes.Description, showOnCopyList = true)
    var street: String? = null;

    @Column(length = 2048)
    @Encrypt
    var secundStreet: String? = null;

    @Column(length = 128)
    @ListData(ListDataTypes.Description, prefix = ", ", order = 1)
    var city: String? = null;

    @Column(length = 128)
    var state: String? = null;
    @Column(length = 128)
    var country: String? = null;

    @Column(length = 128)
    @ListData(ListDataTypes.Subject, prefix = "- ", order = 2, showOnCopyList = true)
    var username: String? = null;

    @Column(length = 128)
    var postalCode: String? = null;
    @Column(length = 128)
    var organization: String? = null;
    @Column(length = 128)
    var phone: String? = null;

    @Column(length = 6)
    var callingCode: String? = null;

    @Column(length = 254)
    var region: String? = null;

    @Column(length = 254)
    @SerializedName("subregion")
    var subRegion: String? = null;

    @Column(length = 2)
    var countryAlpha2Code: String? = null;

    @Column(length = 3)
    var countryAlpha3Code: String? = null;
}