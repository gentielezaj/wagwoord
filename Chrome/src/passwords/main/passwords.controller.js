wwapp.controller("PasswordsMainController", function ($scope,$location) {
  var vm = this;
  vm.name = 'fgsfgsdfgsd';

  vm.toggleMenu = function () {
    const element = document.getElementById('section-menu-dialog-password');
    element.open = element.open ? false : true;
  };

  vm.goToSettings = function() {
    $location.path('settings');
  };
});