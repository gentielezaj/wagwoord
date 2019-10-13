wwapp.controller("PasswordListController", function ($scope, $rootScope, $password, $notification) {
  var vm = this;

  const takeBase = appenvirement == 'options' ? 50 : 20;
  vm.appenvirement = appenvirement;

  vm.searchModel = '';
  let take = takeBase;

  vm.passwords = {
    loading: true,
    list: [],
    total: 0,
  };

  vm.refreshPasswords = function () {
    vm.passwords.loading = true;
    if (!$scope.$$phase) $scope.$digest();
    $password.getList({
      searchText: vm.searchModel,
      take: take
    }).then(res => {
      vm.passwords = res;
      vm.passwords.loading = false;
      $scope.$digest();
    });
  };

  vm.loadmore = function () {
    take += takeBase;
    vm.refreshPasswords();
  };

  vm.edit = function (item) {
    if (appenvirement == 'options') {
      $rootScope.$broadcast('edit-password', item);
    } else {
      chrome.tabs.create({
        'url': "option/options.html" + (item && item.id ? '?itemId=' + item.id : '')
      });
    }
  };

  vm.getDomain = function (domain) {
    return $password.getDomain(domain);
  };

  $scope.$on('refresh', () => vm.refreshPasswords());

  vm.copy = function (item) {
    const el = document.createElement('textarea');
    el.value = item;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    $rootScope.$broadcast('add-nofification', {
      type: 'info',
      message: 'copied to clipboard'
    });
  };

  vm.showPassword = function (item) {
    item.showPassword = item.showPassword ? false : true;
  };

  vm.delete = async function (item) {
    try {
      await $password.delete(item.id);
      $notification.success('Password deleted');
    } catch (error) {
      $notification.error('Error wile deleting password', error);
    }

    vm.refreshPasswords();
  };

  if (appenvirement == "popup") {
    chrome.tabs.getSelected(null, function (tab) {
      if (tab.url != 'newtab' && !tab.url.startsWith('chrome-extension')) {
        const domain = $password.getName(tab.url);
        vm.searchModel = domain;
      }
      vm.refreshPasswords();
    });
  } else {
    vm.refreshPasswords();
  }
});