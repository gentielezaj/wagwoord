import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';
import router from './router';
import constants from '../shared/util/ww-constants';

// #region db
import '../shared/services/database/db-init.service';
// #endregion db

// #region direcrives
import '../shared/driectives/searchable.directive';
import '../shared/driectives/collapse.driective';
import '../shared/driectives/form-field.directive';
import '../shared/driectives/form.directive';
import '../shared/driectives/span-label.directive';
// #endregion direcrives

// #region stores
import notificationStore from '../shared/store/notification.store';
import encryptionStore from '../shared/store/encryption.store';
import proxyStore from '../shared/store/proxy.store';
import passwordStore from '../shared/store/password.store';
import blacklistStore from '../shared/store/blacklist.store';

Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    notification: notificationStore,
    encryption: encryptionStore,
    proxy: proxyStore,
    password: passwordStore,
    blacklist: blacklistStore
  }
});
// #endregion stores

// #region constants
Vue.use(constants, {
  scope: 'options'
});

// #endregion constants

new Vue({
  el: '#app',
  constants,
  store,
  router,
  render: h => h(App)
});