package me.gentielezaj.wagwoord.models.entities

import com.google.gson.annotations.SerializedName
import me.gentielezaj.sqldroid.models.ColumnType
import me.gentielezaj.sqldroid.models.Nullable
import me.gentielezaj.sqldroid.models.annotations.column.Column
import me.gentielezaj.sqldroid.models.annotations.column.ColumnConverter
import me.gentielezaj.sqldroid.models.annotations.column.Unique
import me.gentielezaj.sqldroid.models.annotations.table.Table
import me.gentielezaj.wagwoord.models.annotations.Encrypt
import me.gentielezaj.wagwoord.models.annotations.Identifier
import me.gentielezaj.wagwoord.models.annotations.ListData
import me.gentielezaj.wagwoord.models.annotations.ListDataTypes
import me.gentielezaj.wagwoord.models.entities.coreEntities.CoreEntityCount
import java.lang.NullPointerException

enum class CreditCardType(val value: String) {
    @SerializedName("mastercard")
    MasterCard("mastercard"),
    @SerializedName("visa")
    Visa("visa"),
    @SerializedName("maestro")
    Maestro("maestro"),
    @SerializedName("paypal")
    Paypal("paypal"),
    @SerializedName("unknown")
    Unknown("unknown")
}

class CreditCardTypeConverter : ColumnConverter() {
    override fun read(value: Any?): Any? {
        if(value == null || value !is String) throw NullPointerException()
        return CreditCardType.values().first { it.value == value }
    }

    override fun write(value: Any?): Any? {
        if(value == null || value !is CreditCardType) throw NullPointerException()
        return  value.value
    }
}

@Table
class CreditCard : CoreEntityCount() {
    @Column(length = 254)
    @ListData(ListDataTypes.Subject)
    lateinit var name: String;

    @Column(type = ColumnType.TEXT, length = 254, converter = CreditCardTypeConverter::class)
    @ListData(ListDataTypes.Description)
    var cardType: CreditCardType = CreditCardType.Unknown

    @Column(nullable = Nullable.NOT_NULL)
    var expiredMonth: Int = 0;

    @Identifier
    @Unique
    @Encrypt
    @Column(length = 64)
    @ListData(ListDataTypes.Description, order = 1)
    lateinit var cardNumber: String;

    @Column(nullable = Nullable.NOT_NULL)
    var expiredYear: Int = 0;

    @Column
    @Encrypt
    @ListData(ListDataTypes.ExpandPrimary, "CVS: ")
    var cvv: String? = null;

    @Column
    @ListData(ListDataTypes.Subject, "(", ")", 1)
    var bank: String? = null;

    @Column
    @Encrypt
    @ListData(ListDataTypes.ExpandSecondary, "PIN: ")
    var pin: String? = null;

    @Column(default = "0")
    var nfc: Boolean = false;
}