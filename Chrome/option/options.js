const appenvirement = 'options';

if (localStorage.getItem('nav-collapsed')) {
    var navElement = document.getElementById('app-nav');
    var selection = document.getElementById('app-section');
    navElement.classList.add('collapsed');
    selection.classList.add('collapsed');
}

var wwapp = angular.module("wwapp", ["ngRoute"]);
wwapp.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "../src/passwords/main/passwords.controller.html",
            tab: 'password'
        })
        .when("/address", {
            templateUrl: "../src/addresses/address.controller.html",
            tab: 'address'
        })
        .when("/credit-cards", {
            templateUrl: "../src/credit-cards/credit-card.controller.html",
            tab: 'credit-card'
        })
        .when("/code-generators", {
            templateUrl: "../src/code-generator/code-generator.controller.html",
            tab: 'code-generator'
        })
        .when("/settings", {
            templateUrl: "../src/settings/settings.controller.html",
            tab: 'setting'
        })
        .when("/demo", {
            templateUrl: "../src/demo/demo.controller.html",
            tab: 'demo'
        });
});