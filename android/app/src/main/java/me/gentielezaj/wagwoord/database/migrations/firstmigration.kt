package me.gentielezaj.wagwoord.database.migrations

import me.gentielezaj.sqldroid.migrations.Migration
import me.gentielezaj.sqldroid.migrations.MigrationQuery
import me.gentielezaj.wagwoord.common.property
import me.gentielezaj.wagwoord.models.entities.*
import me.gentielezaj.wagwoord.models.entities.coreEntities.*
import me.gentielezaj.wagwoord.models.entities.settings.Settings
import me.gentielezaj.wagwoord.models.entities.settings.SettingsProperty
import kotlin.reflect.KProperty1
import kotlin.reflect.full.declaredMemberProperties
import kotlin.reflect.full.memberProperties

val migrationList = listOf(FirstMigration(), InsertSettingsMigration(), InsertAddress(), InsertBlacklist(), InsertCreditCard())

abstract class AppMigration(version: Int): Migration(version) {
    protected inline fun <reified T: CoreIdEntity> entityIdProperties() : MutableSet<KProperty1<T, Any?>> {
        return mutableSetOf(T::class.property("id"))
    }

    protected inline fun <reified T: CoreEntity> entityProperties() : MutableSet<KProperty1<T, Any?>> {
        var list = entityIdProperties<T>()
        val cl = T::class
        val s = cl.memberProperties.find { it.name == "sync" }!!
        list.addAll(setOf(T::class.property("sync"), T::class.property("lastModified"), T::class.property("encrypted"), T::class.property("serverId")))
        return list
    }

    protected inline fun <reified T: CoreEntityCount> entityCountProperties() : MutableSet<KProperty1<T, Any?>> {
        var list = entityProperties<T>()
        list.add(T::class.property("count"))
        return list
    }
}

class FirstMigration : AppMigration(1) {
    private fun passwordProps() : Set<KProperty1<Password, Any?>> {
        var list = entityCountProperties<Password>()
        list.addAll(listOf(Password::domain, Password::name, Password::password, Password::username, Password::waitTime))
        return list
    }

    private fun totpProps()  : Set<KProperty1<Totp, Any?>> {
        var list = entityProperties<Totp>()
        list.addAll(setOf(Totp::issuer, Totp::username, Totp::secret, Totp::digits, Totp::encoding, Totp::algorithm, Totp::epoch, Totp::step, Totp::window, Totp::icon))
        return list
    }

    override fun onUpgrade(query: MigrationQuery) {
        query.createTable(Totp::class, totpProps())
        query.createTable(Password::class, passwordProps())
    }

    override fun onDowngrade(query: MigrationQuery) {
        query.dropTable(Totp::class)
        query.dropTable(Password::class)
    }
}

class InsertSettingsMigration : AppMigration(2) {

    private fun settingsColumns() : Set<KProperty1<Settings, Any?>> {
        var list = entityProperties<Settings>()
        list.add(Settings::name)
        return list
    }

    private fun settingsPropertyColumns() : Set<KProperty1<SettingsProperty, Any?>> {
        var list = entityIdProperties<SettingsProperty>()
        list.addAll(setOf(SettingsProperty::key, SettingsProperty::value, SettingsProperty::type, SettingsProperty::settingsId))
        return list
    }

    override fun onUpgrade(query: MigrationQuery) {
        query.createTable(Settings::class, settingsColumns())
        query.createTable(SettingsProperty::class, settingsPropertyColumns())
    }

    override fun onDowngrade(query: MigrationQuery) {
        query.dropTable(Settings::class)
        query.dropTable(SettingsProperty::class)
    }
}

class InsertAddress : AppMigration(3) {

    private fun props() :  Set<KProperty1<Address, Any?>> {
        var list = entityCountProperties<Address>()
        list.addAll(setOf(Address::firstName,Address::lastName,Address::birthDate,Address::street,Address::secundStreet,Address::city,Address::state,Address::country,Address::username,Address::postalCode,Address::organization,Address::phone,Address::callingCode,Address::region,Address::subRegion,Address::countryAlpha2Code,Address::countryAlpha3Code))
        return list;
    }

    override fun onUpgrade(query: MigrationQuery) {
        query.createTable(Address::class, props())
    }

    override fun onDowngrade(query: MigrationQuery) {
        query.dropTable(Address::class)
    }
}

class InsertBlacklist : AppMigration(4) {
    private fun props() :  Set<KProperty1<Blacklist, Any?>> {
        var list = entityProperties<Blacklist>()
        list.addAll(setOf(Blacklist::name,Blacklist::password,Blacklist::address,Blacklist::creditCard,Blacklist::codeGenerator))
        return list;
    }

    override fun onUpgrade(query: MigrationQuery) {
        query.createTable(Blacklist::class, props())
    }

    override fun onDowngrade(query: MigrationQuery) {
        query.dropTable(Blacklist::class)
    }
}

class InsertCreditCard : AppMigration(5) {
    private fun props() :  Set<KProperty1<CreditCard, Any?>> {
        var list = entityCountProperties<CreditCard>()
        list.addAll(setOf(CreditCard::name,CreditCard::cardType,CreditCard::expiredMonth,CreditCard::cardNumber,CreditCard::expiredYear,CreditCard::cvv,CreditCard::bank,CreditCard::pin,CreditCard::nfc))
        return list;
    }

    override fun onUpgrade(query: MigrationQuery) {
        query.createTable(CreditCard::class, props())
    }

    override fun onDowngrade(query: MigrationQuery) {
        query.dropTable(CreditCard::class)
    }
}