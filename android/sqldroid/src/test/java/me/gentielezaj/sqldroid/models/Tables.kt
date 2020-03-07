package me.gentielezaj.sqldroid.models

import me.gentielezaj.sqldroid.models.annotations.column.Column
import me.gentielezaj.sqldroid.models.annotations.column.ForeignKey
import me.gentielezaj.sqldroid.models.annotations.column.PrimaryKey
import me.gentielezaj.sqldroid.models.annotations.column.Unique
import me.gentielezaj.sqldroid.models.annotations.table.Table

abstract class Entity {
    @PrimaryKey(true)
    @Column
    var id: Int = 0
}

@Table
class City : Entity()
{
    @Column(nullable = false)
    @Unique
    var name: String? = null

    @ForeignKey(property = "cityId")
    lateinit var persons: MutableList<Person>
}

@Table
class Person(
    @Column
    var name: String,
    @Column
    @ForeignKey(City::class, "city")
    var cityId: Int?,
    var city: City
) : Entity()