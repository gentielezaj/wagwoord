import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';
import router from './router';
import constants from '../shared/util/ww-constants';

// #region stores
import passwordStore from '../shared/store/password.store';
import blacklistStore from '../shared/store/blacklist.store';
import chromeStore from '../shared/store/chrome.store';
import encryptionStore from '../shared/store/encryption.store';
import dialogStore from '../shared/store/dialog.store';
import utilStore from '../shared/store/util.store';
import codeGenerator from '../shared/store/code-generator.store';
import notificationStore from '../shared/store/notification.store';

import ChromeService from '../shared/services/chrome.service';

Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    password: passwordStore,
    blacklist: blacklistStore,
    chrome: chromeStore,
    encryption: encryptionStore,
    codegenerator: codeGenerator,
    dialog: dialogStore,
    util: utilStore,
    notification: notificationStore
  }
});
// #endregion stores

new ChromeService().selectedTab().then(t => {
  // #region constants
  Vue.use(constants, {
    scope: 'popup',
    tab: t
  });

  // #endregion constants

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    constants,
    store,
    router,
    render: h => h(App)
  });
});