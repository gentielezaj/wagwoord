import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';
import router from './router';
import constants from '../shared/util/ww-constants';

// #region stores
import passwordStore from '../shared/store/password.store';
import blacklistStore from '../shared/store/blacklist.store';
import chromeStore from '../shared/store/chrome.store';
import codeGenerator from '../shared/store/code-generator.store';

Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    password: passwordStore,
    blacklist: blacklistStore,
    chrome: chromeStore,
    codegenerator: codeGenerator
  }
});
// #endregion stores

// #region constants
Vue.use(constants, {
  scope: 'popup'
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