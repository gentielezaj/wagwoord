package me.gentielezaj.sqldroid.query

import kotlin.reflect.KProperty1


infix fun <T: Any, P: Any?> KProperty1<T, P>.eq(value: P) : ICriteria<T> =
    Restriction.eq(this, value)

infix fun <T: Any, P: Any?> KProperty1<T, P>.inTo(value: Iterable<P>) : ICriteria<T> =
    Restriction.create(this, "IN", value)