package me.gentielezaj.sqldroid

import android.content.ContentValues
import android.database.sqlite.SQLiteDatabase
import me.gentielezaj.sqldroid.common.DatePatterns
import me.gentielezaj.sqldroid.exceptions.UnsuportedColumnTypeException
import me.gentielezaj.sqldroid.models.ColumnType
import me.gentielezaj.sqldroid.models.TableInfo
import me.gentielezaj.sqldroid.query.*
import java.text.SimpleDateFormat
import java.util.*
import kotlin.reflect.KClass
import kotlin.reflect.full.createInstance
import kotlin.reflect.jvm.javaField

class Database internal constructor(val db: SQLiteDatabase) {
    fun close() = db.close()

    //region save
    fun <T : Any> save(model: T, foreignDepended: Boolean = true): Any {
        val table = TableInfo.create(model.javaClass.kotlin)
        val primaryKeyValue = table.primaryKey.get(model);
        return if(primaryKeyValue == null || (primaryKeyValue is Long && primaryKeyValue == 0L) || (primaryKeyValue is Int && primaryKeyValue == 0)) insert(model, foreignDepended)
        else update(model, foreignDepended)
    }

    fun <T : Any> insert(entity: T, foreignDepended: Boolean = true): Any {
        var table = TableInfo.create(entity.javaClass.kotlin)
        var model = entity
        if (foreignDepended) model = saveForeign(model)
        val res = db.insertOrThrow(table.name, null, getContentValues(model, table))
        if(table.primaryKey.isAutoIncrement)table.primaryKey.setValue(model, res.toInt())
        if (foreignDepended) saveForeignList(model)
        return table.primaryKey.property.get(model)!!;
    }

    fun <T : Any> update(entity: T, foreignDepended: Boolean = true): Any {
        var table = TableInfo.create(entity.javaClass.kotlin)
        var model = entity
        if (foreignDepended) model = saveForeign(model)
        val primaryKeyValue = table.primaryKey.get(entity)!!
        db.update(table.name, getContentValues(model, table), "id = ${primaryKeyValue}", null)
        if (foreignDepended) saveForeignList(model)
        return primaryKeyValue
    }

    private fun <T: Any> saveForeign(model: T): T {
        var table = TableInfo.create(model.javaClass.kotlin)
        var foreignTables = table.foreignKeys.filter { it.foreignKey!!.tablePoperty != null }
        foreignTables.forEach {
            val propertyValue = it.foreignKey!!.tablePoperty!!.get(model);
            if (propertyValue != null) {
                it.property.set(model, save(propertyValue))
            }
        }

        return model
    }
    private fun saveForeignList(model: Any) {
        var table = TableInfo.create(model.javaClass.kotlin)
        for (f in table.foreignList ?: listOf()) {
            val propertyValue = f.property.get(model) as Iterable<out Any>? ?: return;
            for(item in propertyValue) {
                val id = table.primaryKey.property.get(model);
                f.foreignProperty.javaField!!.set(item, id)
                save(item)
            }
        }
    }
    // endregion

    // region query
    inline fun <reified T:Any> getQuery(builder: IQueryBuilder<T>? = null) : IQuery<T, T> = getQuery(T::class, builder)

    fun <T:Any> getQuery(clazz: KClass<T>, builder: IQueryBuilder<T>? = null) : IQuery<T, T> {
        if(builder == null) {
            var tableInfo = TableInfo.create(clazz)
            return QueryExecuterEntity(db, tableInfo)
        }

        val q = builder as BaseQueryBuilder<T>
        return QueryExecuterEntity(db, q.from, q.where, q.joins, q.orders, q.alias)
    }

    fun <T: Any> get(clazz: KClass<T>, id: Any?) : T? {
        if(id == null) return null;
        var table = TableInfo.create(clazz)
        return getQuery(clazz).singleOrNull(Restriction(table, table.primaryKey, "=", id))
    }

    inline fun <reified T: Any> get(id: Any?) : T? = get(T::class, id)
    // endregion

    // region delete

    fun delete(clazz: KClass<*>, id: Any?) {
        var table = TableInfo.create(clazz)
        delete(table, id)
    }

    fun delete(item: Any) {
        var tableInfo = TableInfo.create(item.javaClass.kotlin)
        var id = tableInfo.primaryKey.property.get(item)
        delete(tableInfo, id)
    }

    fun delete(table: TableInfo, id: Any?) =
        db.delete(table.name, "${table.primaryKey.name} = $id", null)

    // endregion

    // region helpers
    private fun getContentValues(model: Any, table: TableInfo): ContentValues {
        var values = ContentValues()
        for (column in table.columns) {
            if (column.isAutoIncrement) continue
            var propertyValue = column.property.get(model)
            if(column.converter != null) {
                propertyValue = column.converter.createInstance().write(propertyValue);
            }

            if (propertyValue == null) values.putNull(column.name)
            else {
                when (column.type) {
                    ColumnType.INT -> values.put(column.name, propertyValue as Int)
                    ColumnType.BIGINT -> values.put(column.name, propertyValue as Long)
                    ColumnType.TEXT, ColumnType.NVARCHAR -> values.put(
                        column.name,
                        propertyValue as String
                    )
                    ColumnType.REAL -> values.put(column.name, propertyValue as Float)
                    ColumnType.BOOLEAN -> values.put(
                        column.name,
                        if (propertyValue as Boolean) 1 else 0
                    )
                    ColumnType.TIME -> {
                        val format = SimpleDateFormat(DatePatterns.time)
                        if(propertyValue is Date) values.put(column.name, format.format(propertyValue))
                    }
                    ColumnType.DATETIME -> {
                        val format = SimpleDateFormat(DatePatterns.dateTime)
                        if(propertyValue is Date) values.put(column.name, format.format(propertyValue))
                    }
                    ColumnType.DATE -> {
                        val format = SimpleDateFormat(DatePatterns.date)
                        if(propertyValue is Date) values.put(column.name, format.format(propertyValue))
                    }
                    else -> throw UnsuportedColumnTypeException()
                }
            }
        }

        return values;
    }
// endregion
}

// endregion