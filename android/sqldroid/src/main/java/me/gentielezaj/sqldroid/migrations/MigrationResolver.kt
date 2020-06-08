package me.gentielezaj.sqldroid.migrations

import me.gentielezaj.sqldroid.exceptions.UnsuportedColumnTypeException
import me.gentielezaj.sqldroid.models.ColumnInfo
import me.gentielezaj.sqldroid.models.ColumnType
import me.gentielezaj.sqldroid.models.TableInfo
import me.gentielezaj.sqldroid.models.annotations.column.Column
import kotlin.reflect.KClass
import kotlin.reflect.KProperty
import kotlin.reflect.KProperty1
import kotlin.reflect.jvm.javaField

internal class MigrationResolver {

    // region table

    fun createTable(table: TableInfo, ifNotExists: Boolean, columns: List<ColumnInfo>) : String {
        var sql = mutableListOf<String>()

        sql.add("CREATE TABLE")
        if(ifNotExists) sql.add("IF NOT EXISTS")
        sql.add(table.name)
        sql.add("(")
        sql.add(getCoumnsConstant(table, columns))
        sql.add(");")

        return sql.joinToString(" ")
    }

    private fun getCoumnsConstant(table: TableInfo, columns: List<ColumnInfo>): String {
        var sql = mutableListOf<String>()
        sql.addAll(columns.map {createColumn( it )})
        sql.add(createUniqueKey(table))
        return sql.filter{!it.isNullOrEmpty()}.joinToString(", ")
    }

    fun dropTable(table: TableInfo, ifNotExists: Boolean = false) : String {
        var sql = mutableListOf<String>()
        sql.add("DROP TABLE ${if(ifNotExists) "IF EXISTS" else ""} ${table.name};")
        return sql.joinToString("; ")
    }

    fun renameTable(currentName: String, newName: String) : String = "ALTER TABLE ${currentName} RENAME TO ${newName};"

    // endregion


    //region foreignKeys primery and unique key
    fun createUniqueKey(table: TableInfo) : String {
        val sql = mutableListOf<String>()
        if(table.uniques?.any() == true) {
            for (uq in table.uniques) {
                sql.add("CONSTRAINT ${uq.name} UNIQUE (${uq.columns.map{it.name}.joinToString(", ")})")
            }
        }

        return sql.joinToString(", ")
    }
    // endregion

    //region columns
    private fun createColumn(columnInfo: ColumnInfo) : String {
        var sql = mutableListOf<String>(""""${columnInfo.name}"""")
        sql.add(when(columnInfo.type) {
            ColumnType.INT, ColumnType.BOOLEAN
            -> "INTEGER"
            ColumnType.TIME, ColumnType.DATE, ColumnType.DATETIME, ColumnType.TEXT
            -> "TEXT"
            ColumnType.REAL -> "REAL"
            ColumnType.BIGINT -> "BIGINT"
            ColumnType.NVARCHAR -> if(columnInfo.length > 0) "NVARCHAR(${columnInfo.length})" else "TEXT"
            else -> throw UnsuportedColumnTypeException()
        })

        if(columnInfo.isPrimaryKey) {
            sql.add("PRIMARY KEY")
            if(columnInfo.isAutoIncrement) sql.add("AUTOINCREMENT")
        }
        else {
            if (!columnInfo.nullable) sql.add("NOT NULL")
            if (columnInfo.default != null) sql.add("DEFAULT " + columnInfo.default)
        }

        if(columnInfo.isForeignKey) {
            sql.add("REFERENCES ${columnInfo.foreignKey!!.table.name}")
        }

        return sql.joinToString(" ")
    }

    fun createColumn(table: TableInfo, columnInfo: ColumnInfo) : String {
        return "ALTER TABLE ${table.name} ADD COLUMN ${createColumn(columnInfo)}"
    }
    //endregion

    // region index
    fun createIndex(unique: Boolean, table: TableInfo, name: String?, columns: Collection<ColumnInfo>) : String {
        val n = name?: ("IN_${table.name.toIndex()}_" + columns.map { it.name.toIndex() }.joinToString("_"))
        var sql = "CREATE "
        if(unique) sql += "UNIQUE "
        sql += "INDEX ${n} ON ${table.name} (${columns.map { it.name }.joinToString(", ")});"
        return sql;
    }

    fun dropIndex(name: String) : String {
        return "DROP INDEX ${name};"
    }

    private fun String?.toIndex() : String {
        if(this.isNullOrEmpty()) return ""
        if(this.length <= 2) return this.toUpperCase()
        return this.substring(0..2).toUpperCase()
    }
    // endregion

    companion object {
        private val mr: MigrationResolver
            get() = MigrationResolver()

        fun <T:Any> createTable(clazzs: KClass<T>, vararg properties: KProperty1<T, Any?>) : String = mr.createTable(TableInfo.create(clazzs), false, properties.map { ColumnInfo.create(it)!! })
        fun <T:Any> createTableIfNotExists(clazzs: KClass<T>, vararg properties: KProperty1<T, Any?>) : String = mr.createTable(TableInfo.create(clazzs), true, properties.map { ColumnInfo.create(it)!! })

        fun addColumn(property: KProperty1<out Any, Any?>) : String = mr.createColumn(TableInfo.create(property.javaField!!.declaringClass.kotlin), ColumnInfo.create(property)!!)

        fun createIndex(unique: Boolean, clazz: KClass<*>, vararg columns: KProperty1<out Any, Any?>) = mr.createIndex(unique, TableInfo.create(clazz), null, columns.map{ ColumnInfo.create(it)!! })
        fun createIndex(unique: Boolean, column: KProperty1<out Any, Any?>) = mr.createIndex(unique, TableInfo.create(column.javaField!!.declaringClass.kotlin), null, listOf(ColumnInfo.create(column)!!))
        fun dropIndex(name: String) = mr.dropIndex(name)
    }
}