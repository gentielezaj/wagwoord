package me.gentielezaj.sqldroid.exceptions

import java.lang.Exception

class NoPrimaryKeyException : Exception("class dose not have primary key")
class MultiplePrimaryKeyException : Exception("multiple primary key not supported")