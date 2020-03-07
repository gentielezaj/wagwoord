package me.gentielezaj.sqldroid.exceptions

class InvalidForeingKeyException(propertyName: String, clazz: String) : Exception("Invalide foreign key on ${clazz}.${propertyName}")
class InvalidForeingKeyTableException(clazz: String) : Exception("Invalide foreign key on table ${clazz}")