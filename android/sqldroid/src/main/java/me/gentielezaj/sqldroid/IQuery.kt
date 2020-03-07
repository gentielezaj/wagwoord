package me.gentielezaj.sqldroid

interface IQuery {
    fun toSqlString(): String
}