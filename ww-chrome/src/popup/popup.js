import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';
import constants from '../shared/util/ww-constants';

// #region stores
import passwordStore from '../shared/store/password.store';
import blacklistStore from '../shared/store/blacklist.store';
import chromeStore from '../shared/store/chrome.store';

Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    password: passwordStore,
    blacklist: blacklistStore,
    chrome: chromeStore
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
  render: h => h(App)
});
