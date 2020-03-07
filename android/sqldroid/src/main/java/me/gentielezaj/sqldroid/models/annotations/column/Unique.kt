package me.gentielezaj.sqldroid.models.annotations.column

@Target(AnnotationTarget.PROPERTY)
annotation class Unique(val index: String = "")