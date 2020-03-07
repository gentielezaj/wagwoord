package me.gentielezaj.sqldroid.common

import java.util.*

fun String.valueOrDefault(default: String) : String = if(this.trim().isNullOrEmpty()) default else this
fun String.valueOrNull() : String? = if(this.trim().isNullOrEmpty()) null else this