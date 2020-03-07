package me.gentielezaj.sqldroid.models.annotations.column

import me.gentielezaj.sqldroid.models.ColumnType

@Target(AnnotationTarget.PROPERTY)
annotation class Column(val name: String = "", val type: ColumnType = ColumnType.DEFAULT, val nullable: Boolean = true, val length: Int = 0, val default: String = "", val computed: Boolean = false)
