wwapp.controller("PasswordsMainController", function ($scope, $location, $password, $notification) {
  var vm = this;
  vm.name = 'fgsfgsdfgsd';

  vm.goToSettings = function () {
    $location.path('settings');
  };

  vm.sync = async function () {
    vm.passwordSyncLoader = true;
    try {
      if (await $password.update())
        $notification.success('synched');
      else
        $notification.error('could not sync');
    } catch (err) {
      $notification.error('server error', err);
    }

    vm.passwordSyncLoader = false;
    $scope.$digest();
  };
});