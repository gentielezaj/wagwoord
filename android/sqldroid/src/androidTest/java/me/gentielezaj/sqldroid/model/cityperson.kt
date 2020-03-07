package me.gentielezaj.sqldroid.model

import me.gentielezaj.sqldroid.models.annotations.column.Column
import me.gentielezaj.sqldroid.models.annotations.column.ForeignKey
import me.gentielezaj.sqldroid.models.annotations.column.PrimaryKey
import me.gentielezaj.sqldroid.models.annotations.column.Unique
import me.gentielezaj.sqldroid.models.annotations.table.Table

@Table
class City(

    @PrimaryKey(true)
    @Column
    public var id: Int = 0,

    @Column(nullable = false)
    @Unique
    public var name: String,

    @ForeignKey(property = "cityId")
    public var persons: List<Person>? = null
)

@Table
class Person(
    @PrimaryKey(true)
    @Column
    var id: Int = 0,
    @Column
    var name: String,
    @Column
    @ForeignKey(City::class, "city")
    var cityId: Int? = null,
    var city: City,
    @Column
    var age: Int = 0
)