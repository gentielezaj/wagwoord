package me.gentielezaj.sqldroid

import android.content.ContentValues
import android.database.Cursor
import android.database.sqlite.SQLiteDatabase
import android.location.Criteria
import me.gentielezaj.sqldroid.common.DatePatterns
import me.gentielezaj.sqldroid.exceptions.UnsuportedColumnTypeException
import me.gentielezaj.sqldroid.exceptions.queryExectution.MultipleRowsException
import me.gentielezaj.sqldroid.models.ColumnType
import me.gentielezaj.sqldroid.models.TableInfo
import me.gentielezaj.sqldroid.query.*
import java.time.format.DateTimeFormatter
import java.time.temporal.TemporalAccessor
import kotlin.reflect.KClass
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
        val id = db.update(table.name, getContentValues(model, table), "id = ${primaryKeyValue}", null)
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
            val propertyValue = f.property.get(model) as Iterable<out Any>?;
            if(propertyValue == null) return;
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

    fun <T: Any> delete(clazz: KClass<T>, id: Any?) : Boolean {
        if(id == null) return false;
        var table = TableInfo.create(clazz)
        return db.delete(table.name, "${table.primaryKey.name} = ${id}", null) > -1
    }

    inline fun <reified T: Any> delete(id: Any?) : Boolean = delete(T::class, id)

    // endregion

    // region helpers
    private fun getContentValues(model: Any, table: TableInfo): ContentValues {
        var values = ContentValues()
        for (column in table.columns) {
            if (column.isAutoIncrement) continue
            val propertyValue = column.property.get(model)
            if (propertyValue == null) values.putNull(column.name)
            else {
                when (column.type) {
                    ColumnType.INT -> values.put(column.name, propertyValue as Int)
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
                        val format = DateTimeFormatter.ofPattern(DatePatterns.time)
                        values.put(column.name, format.format(propertyValue as TemporalAccessor))
                    }
                    ColumnType.DATETIME -> {
                        val format = DateTimeFormatter.ofPattern(DatePatterns.dateTime)
                        values.put(column.name, format.format(propertyValue as TemporalAccessor))
                    }
                    ColumnType.DATE -> {
                        val format = DateTimeFormatter.ofPattern(DatePatterns.date)
                        values.put(column.name, format.format(propertyValue as TemporalAccessor))
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