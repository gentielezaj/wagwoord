package me.gentielezaj.sqldroid.models.annotations.column

@Target(AnnotationTarget.PROPERTY)
public annotation class PrimaryKey(val autoincrement: Boolean = false)