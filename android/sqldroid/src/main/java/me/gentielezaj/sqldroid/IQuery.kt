package me.gentielezaj.sqldroid

import me.gentielezaj.sqldroid.query.*
import kotlin.reflect.KProperty
import kotlin.reflect.KProperty1

interface ICoreQuery<T>

interface IQuery<T: Any, TResult: Any> : ICoreQuery<T>, ICoreQueryBuilder<T, IQuery<T, TResult>, IQuery<T, T>, IQuery<T,  Map<KProperty1<out Any, out Any?>, out Any?>>>  {
    fun toList(criteria: ICriteria<T>? = null): List<TResult>

    fun firstOrNull(criteria: ICriteria<T>? = null): TResult?
    fun first(criteria: ICriteria<T>? = null): TResult = firstOrNull(criteria)!!

    fun singleOrNull(criteria: ICriteria<T>? = null): TResult?
    fun single(criteria: ICriteria<T>? = null): TResult = singleOrNull(criteria)!!

    fun uniqueOrNull(criteria: ICriteria<T>? = null): TResult?
    fun unique(criteria: ICriteria<T>? = null): TResult = uniqueOrNull(criteria)!!

    fun lastOrNull(criteria: ICriteria<T>? = null): TResult?
    fun last(criteria: ICriteria<T>? = null): TResult = lastOrNull(criteria)!!

    fun <TValue: Any> select(property: KProperty1<T, TValue?>) : IQuery<T, TValue>

    fun count(criteria: ICriteria<T>? = null): Int
}

interface IQueryBuilder<T:Any> : ICoreQuery<T>, ICoreQueryBuilder<T, IQueryBuilder<T>, IQueryBuilder<T>, IQueryBuilder<T>> {
    fun <TValue: Any> select(property: KProperty1<T, TValue?>) : IQueryBuilder<T>
}

interface ICoreQueryBuilder<T:Any, TResult: Any, TAll: Any, TMap: Any> : SqlBuilder<T> {
    // region order
    fun resetOrder()
    infix fun asc(proeprty: KProperty1<T, Any?>) : TResult = orderBy(proeprty, OrderDirections.ASC)
    infix fun desc(proeprty: KProperty1<T, Any?>) : TResult =  orderBy(proeprty, OrderDirections.DESC)
    fun orderBy(proeprty: KProperty1<T, Any?>, directions: OrderDirections) : TResult
    fun orderBy(order: Order<T>): TResult
    // endregion order

    // region join
    //fun <TJoin> join():  TResult
    // endregion join

    // region select
    fun selectAll() : TAll
    fun selects(vararg properties: KProperty1<T, Any?>) : TMap
    // fun select() : Iterable<KProperty<Any>>
    // endregion select

    // region where
//    fun or(criteria: ICriteria<T>) : IQueryBuilder<T> = where(WhereConditions.OR, criteria)
//    fun and(criteria: ICriteria<T>) : IQueryBuilder<T> = where(WhereConditions.OR, criteria)
    fun where(criteria: ICriteria<T>) : TResult
    // fun where(whereConditions: WhereConditions, criteria: ICriteria<T>) : IQueryBuilder<T>
    // endregion where

    // region take skip
    fun take(t: Int) : TResult

    fun skip(i: Int) : TResult
    // endregion
}

interface SqlBuilder<T:Any> {
    fun toSqlString(alias: String? = null) : String
}