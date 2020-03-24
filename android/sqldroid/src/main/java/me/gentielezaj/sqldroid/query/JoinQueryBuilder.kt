package me.gentielezaj.sqldroid.query

enum class JoinType {
    JOIN,
    INNER,
    OUTER,
    LEFT,
    RIGHT
}

data class JoinQueryBuilder<T: Any> internal constructor(val joinType: JoinType = JoinType.JOIN, val query: QueryBuilder<T>, val criteria: ICriteria<T>?)