package me.gentielezaj.wagwoord.models.common

import me.gentielezaj.wagwoord.models.entities.coreEntities.IEntity

enum class SaveErrorCodes {
    NONE,
    INVALID_MODEL,
    ITEM_ALREADY_EXISTS
}

class SaveResult<T> where T : IEntity {
    constructor(model: T, errorCode: SaveErrorCodes = SaveErrorCodes.NONE) : this(model, model.id, errorCode) {}

    constructor(model: T, id: Int, errorCode: SaveErrorCodes = SaveErrorCodes.NONE) {
        this.model = model;
        this.success = errorCode == SaveErrorCodes.NONE
        this.errorCode = errorCode
        this.id = id
        if(this.success) this.model.id = id
    }

    lateinit var  model: T;
    var success: Boolean = false
    var id : Int = 0
    var errorCode: SaveErrorCodes = SaveErrorCodes.NONE
}