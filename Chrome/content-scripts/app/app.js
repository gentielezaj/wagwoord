import {PasswordHandler} from './passwords/auto-fill-passwords.js';

const appData = JSON.parse(sessionStorage.getItem('wwapp'));

// #region paswords
if(appData.passwords && appData.settings) {
    var passwordHandler = new PasswordHandler(appData.passwords, appData.settings, appData.blacklist);
}

// #endregion paswords