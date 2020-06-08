package me.gentielezaj.sqldroid.query

import me.gentielezaj.sqldroid.ICoreQuery
import me.gentielezaj.sqldroid.ICoreQueryBuilder
import me.gentielezaj.sqldroid.IQuery
import me.gentielezaj.sqldroid.IQueryBuilder
import me.gentielezaj.sqldroid.common.columnInfo
import me.gentielezaj.sqldroid.exceptions.querybuilder.NoSelectPropertiesExceptions
import me.gentielezaj.sqldroid.models.ColumnInfo
import me.gentielezaj.sqldroid.models.TableInfo
import kotlin.reflect.KClass
import kotlin.reflect.KProperty
import kotlin.reflect.KProperty1

abstract class BaseQueryBuilder<T: Any>() {
    abstract val from: TableInfo;
    open var select: MutableCollection<ColumnInfo>? = null
    open lateinit var where: Where<T>
    open var joins: MutableCollection<JoinQueryBuilder<*>>? = null
    open var orders: MutableCollection<Order<T>>? = null
    open lateinit var alias: String
    protected open var take: Int? = null
    protected open var skip: Int? = null
}

abstract class CoreQueryBuilder<T: Any, TResult: Any, TAll: Any, TMap: Any>() : BaseQueryBuilder<T>(), ICoreQuery<T>, ICoreQueryBuilder<T, TResult, TAll, TMap> {
    constructor(from: TableInfo,
                select: MutableCollection<ColumnInfo>? = mutableListOf(),
                where: Where<T> = Where.AND(),
                joins: MutableCollection<JoinQueryBuilder<*>>? = null,
                orders: MutableCollection<Order<T>>? = null,
                alias: String = "") : this() {
        this.select = select
        this.where = where
        this.joins = joins
        this.orders = orders

    }

    // region take skip
    override fun take(i: Int) : TResult {
        this.take = i;
        return this as TResult
    }

    override fun skip(i: Int) : TResult {
        this.skip = i;
        return this as TResult
    }

    protected fun takeSkipToSqlString() : String {
        var sql = mutableListOf<String>()
        if(take != null && take!! > 0) sql.add("LIMIT $take")
        if(skip != null && skip!! > 0) sql.add("OFFSET $skip")
        return sql.joinToString(" ")
    }
    // endregion

    // region order
    override fun resetOrder() { orders = null }
    override fun orderBy(proeprty: KProperty1<T, Any?>, directions: OrderDirections) : TResult =
        orderBy(Order<T>(from, from.columns.first { it.property.name == proeprty.name }, directions))

    override fun orderBy(order: Order<T>): TResult {
        if(orders == null) orders = mutableListOf()
        orders!!.add(order)
        return this as TResult
    }

    internal fun orderToSqlString() : String {
        if(orders?.any() != true) return ""
        var sql = mutableListOf<String>()
        for (order in orders!!) sql.add(order.toSqlString(alias))
        if(joins?.any() == true)
            for(join in joins!!) sql.add(join.query.orderToSqlString())

        return "ORDER BY " + sql.joinToString(", ")
    }
    // endregion order

    // region select

    protected fun selectOpr(properties: Iterable<KProperty1<T, Any?>>, asNew: Boolean) {
        if(select == null || asNew) select = mutableListOf()
        for (property in properties) select!!.add(property.columnInfo(from))
    }
    // endregion

    // region where
    override fun where(criteria: ICriteria<T>) : TResult = where(WhereConditions.AND, criteria)
    fun where(condition: WhereConditions, criteria: ICriteria<T>) : TResult {
        val thisWhere = Where(condition, mutableListOf(criteria))
        where!!.criteria!!.add(criteria);
        return this as TResult
    }

    internal fun whereToSqlString() : String {
        val sql = where.toSqlString(alias)
        return if(sql.isNotEmpty()) "WHERE $sql" else ""
    }
    // endregion where

    // region toSqlString
    override fun toSqlString(alias: String?): String {
        var sql = "${selectToSqlString()} ${fromToSqlString()} ${whereToSqlString()} ${orderToSqlString()} ${takeSkipToSqlString()}"
        return sql;
    }

    // region fromToSqlString
    internal fun fromToSqlString() : String = """FROM "${from.name}""""
    // endregion fromToSqlString

    internal fun getCurrentSelectProperties(): Collection<ColumnInfo> {
        val currentSelect = if(select?.any() == true) select else from.columns

        if(currentSelect?.any() != true) throw NoSelectPropertiesExceptions()

        return currentSelect
    }

    // region selectToSqlString
    internal fun selectToSqlString() : String {
        var sql = mutableListOf<String>()
        val currentSelect = getCurrentSelectProperties()
        for (column in currentSelect!!) {
            sql.add(""""$alias"."${column.name}"""")
        }

        if(joins?.any() == true)
            for(join in joins!!) sql.add(join.query.selectToSqlString())

        return "SELECT " + sql.joinToString(", ")
    }
    // endregion selectToSqlString

    // endregion

}


data class QueryBuilder<T: Any>
protected constructor(override val from: TableInfo,
                      override var select: MutableCollection<ColumnInfo>? = mutableListOf(),
                      override var where: Where<T> = Where.AND(),
                      override var joins: MutableCollection<JoinQueryBuilder<*>>? = null,
                      override var orders: MutableCollection<Order<T>>? = null,
                      override var alias: String = "",
                      override var take: Int? = null,
                      override var skip: Int? = null
) : CoreQueryBuilder<T, IQueryBuilder<T>, IQueryBuilder<T>, IQueryBuilder<T>>(), IQueryBuilder<T>  {


    init {
        if(alias.isNullOrEmpty()) {
            alias = from.name
        }
    }

    override fun selectAll() : IQueryBuilder<T> {
        select = null;
        return this
    }

    override fun selects(vararg properties: KProperty1<T, Any?>): IQueryBuilder<T> {
        selectOpr(properties.toList(), false)
        return this
    }

    override fun <TValue: Any> select(property: KProperty1<T, TValue?>): IQueryBuilder<T> {
        selectOpr(listOf(property), true)
        return this
    }

    public companion object {
        fun <T: Any> create(clazz: KClass<T>, alias: String) : QueryBuilder<T> = QueryBuilder(TableInfo.create(clazz), alias = alias)
        fun <T: Any> create(clazz: KClass<T>) : QueryBuilder<T> = QueryBuilder(TableInfo.create(clazz))
        fun <T: Any> create(clazz: KClass<T>, select: Iterable<KProperty1<T, Any?>>) : QueryBuilder<T> = QueryBuilder<T>(TableInfo.create(clazz), select.map { ColumnInfo.create(it!!)!! }.toMutableList())

        inline fun <reified T: Any> create() : QueryBuilder<T> = QueryBuilder.create(T::class)
        inline fun <reified T: Any> create(select: Iterable<KProperty1<T, Any?>>) : QueryBuilder<T> = QueryBuilder.create(T::class, select)
        inline fun <reified T: Any> create(vararg select: KProperty1<T, Any?>) : QueryBuilder<T> = QueryBuilder.create<T>(select.toList())
    }
}