package me.gentielezaj.sqldroid.models.annotations.column

import kotlin.reflect.KClass

@Target(AnnotationTarget.PROPERTY)
annotation class ForeignKey(val clazz: KClass<*> = Unit::class, val property: String = "")
