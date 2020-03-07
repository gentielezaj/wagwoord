package me.gentielezaj.sqldroid.query

import android.location.Criteria
import android.os.Parcel
import android.os.Parcelable
import me.gentielezaj.sqldroid.IQuery
import me.gentielezaj.sqldroid.models.ColumnInfo

enum class CriteriaConditions {
    AND, OR
}

interface ICriteria : IQuery {
    var condition: CriteriaConditions
}

data class Restriction internal constructor(override var condition: CriteriaConditions, var column: ColumnInfo, var value: Any) : ICriteria {
    override fun toSqlString(): String {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }
}

data class Where internal constructor(override var condition: CriteriaConditions, val criteria: MutableIterable<Criteria>) : ICriteria {
    override fun toSqlString(): String {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    companion object {
        fun OR(criteria: MutableIterable<Criteria> = mutableListOf()) :  Where  = Where(CriteriaConditions.OR, criteria)
        fun AND(criteria: MutableIterable<Criteria> = mutableListOf()) :  Where  = Where(CriteriaConditions.AND, criteria)
    }
}