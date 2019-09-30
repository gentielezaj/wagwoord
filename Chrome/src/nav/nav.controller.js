wwapp.controller("NavController", function ($scope, $route, $location) {
    var vm = this;
    vm.isActiveTab = function (tabId) {
        return $route.current && $route.current.tab == tabId;
    };

    vm.changeTab = function (tab) {
        $location.path(tab);
    };

    vm.toggleCollapsed = function() {
        let navElement = document.getElementById('app-nav');
        let selection = document.getElementById('app-section');
        if(navElement.classList.contains('collapsed')) {
            selection.classList.remove('collapsed');
            navElement.classList.remove('collapsed');
            localStorage.removeItem('nav-collapsed');
        } else {
            selection.classList.add('collapsed');
            navElement.classList.add('collapsed');
            localStorage.setItem('nav-collapsed', 'true');
        }
    };
});