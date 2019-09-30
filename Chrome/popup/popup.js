var appenvirement = 'popup';

var wwapp = angular.module("wwapp", ["ngRoute"]);
wwapp.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "../src/passwords/list/password-list.controller.html",
            tab: 'password'
        })
        .when("/code", {
            templateUrl: "../src/addresses/address.controller.html",
            tab: 'address'
        })
        .when("/password-save", {
            templateUrl: "../src/credit-cards/credit-card.controller.html",
            tab: 'credit-card'
        });
});

wwapp.controller("PopUpMainController", function ($scope) {
    var vm = this;

    vm.edit = function (item) {
        chrome.tabs.create({
            'url': "option/options.html" + (item && item.id ? '?itemId=' + item.id : '')
        });
    };
});