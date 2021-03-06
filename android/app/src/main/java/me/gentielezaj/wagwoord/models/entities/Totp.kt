package me.gentielezaj.wagwoord.models.entities

import android.annotation.SuppressLint
import dev.turingcomplete.kotlinonetimepassword.HmacAlgorithm
import dev.turingcomplete.kotlinonetimepassword.TimeBasedOneTimePasswordConfig
import dev.turingcomplete.kotlinonetimepassword.TimeBasedOneTimePasswordGenerator
import me.gentielezaj.sqldroid.models.annotations.column.Column
import me.gentielezaj.sqldroid.models.annotations.column.Unique
import me.gentielezaj.sqldroid.models.annotations.table.Table
import me.gentielezaj.wagwoord.models.annotations.Encrypt
import me.gentielezaj.wagwoord.models.annotations.ListData
import me.gentielezaj.wagwoord.models.annotations.ListDataOrderDirection
import me.gentielezaj.wagwoord.models.annotations.ListDataTypes
import me.gentielezaj.wagwoord.models.entities.coreEntities.CoreEntity
import org.apache.commons.codec.binary.Base32
import java.io.Serializable;
import java.util.concurrent.TimeUnit
import kotlin.math.round

@Table
class Totp : CoreEntity(), Serializable {
    @ListData(ListDataTypes.Subject, showOnCopyList = true, searchable = true, orderBy = ListDataOrderDirection.ASC)
    @Column var issuer: String = ""
    @ListData(ListDataTypes.Description, showOnCopyList = true, searchable = true)
    @Column var username: String = ""

    @Column
    @Unique
    @Encrypt
    var secret: String = ""

    @Column(default = "6") var digits: Int? = 6
    @Column(default = "hex") var encoding: String? = "hex"
    @Column(default = "sha1") var algorithm: String? = "sha1"
    @Column var epoch: Int? = null
    @Column(default = "30") var step: Int = 30
    @Column(default = "0") var window: Int? = 0
    @Column var icon: String? = null

    @ListData(ListDataTypes.ExpandPrimary, showOnCopyList = true)
    val code: String
        @SuppressLint("DefaultLocale")
        get() {
            val config = TimeBasedOneTimePasswordConfig(step.toLong(), TimeUnit.SECONDS, digits?:6, HmacAlgorithm.valueOf((algorithm?:"sha1").toUpperCase()))
            return TimeBasedOneTimePasswordGenerator(Base32().decode(secret), config).generate()
        }

    @ListData(ListDataTypes.ExpandSecondary)
    val timeLeft: Int
        get() {
            val s = (System.currentTimeMillis() / 1000).toDouble();
            return round(step - round(s) % step).toInt() - 1;
        }
}
