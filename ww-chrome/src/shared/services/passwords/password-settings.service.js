import SettingsCoreService from '../core/settings-core.service';

export default class PasswordSettingsService extends SettingsCoreService {
    constructor() {
        super('password');
    }

    async _preSave(model) {
        var item = await super.get();
        model.id = item ? item.id : 0;
        model.encrypted = model.encrypted || false;
        model.autoSubmit = model.autoSubmit || false;
        model.passworIncludeSymbolCharacters = model.passworIncludeSymbolCharacters || false;
        return model;
    }

    async getOrDefults(masHaveValue) {
        let model = (await super.get()) || {};
        if(masHaveValue) {
            model = model || {};
            if(!model.passwordLength || model.passwordLength === 0) {
                model.passwordLength = 20;
            }
            if(!model.passwordSymbolCharacters) {
                model.passwordSymbolCharacters = '!@#$^&*_+~|?=-';
            }
            if(model.passworIncludeSymbolCharacters === undefined) {
                model.passworIncludeSymbolCharacters = true;
            }
            return model;
        }
        return model || {
            passworIncludeSymbolCharacters: true,
            passwordSymbolCharacters: '!@#$^&*_+~|?=-',
            passwordLength: 20
        };
    }
}