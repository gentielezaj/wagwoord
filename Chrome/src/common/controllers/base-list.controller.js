wwapp.controller("BaseListController", function ($scope, $base, $rootScope, $notification) {
        var vm = this;

        const takeBase = appenvirement == 'options' ? 50 : 20;
        vm.appenvirement = appenvirement;

        vm.searchModel = '';
        let take = takeBase;

        vm.data = {
            loading: true,
            list: [],
            total: 0,
        };

        vm.refresh = function () {
            vm.data.loading = true;
            if (!$scope.$$phase) $scope.$digest();
            $base.getList({
                searchText: vm.searchModel,
                take: take
            }).then(res => {
                vm.data = res;
                vm.data.loading = false;
                $scope.$digest();
            });
        };

        vm.loadmore = function () {
            take += takeBase;
            vm.refresh();
        };

        vm.edit = function (item) {
            if (appenvirement == 'options') {
                $rootScope.$broadcast('edit-' + $base.name, item);
            } else {
                chrome.tabs.create({
                    'url': "option/options.html" + (item && item.id ? '?itemId=' + item.id : '')
                });
            }
        };

        $scope.$on('refresh', () => vm.refresh());

        vm.delete = async function (item) {
            try {
                await $base.delete(item.id);
                $notification.success('Item deleted');
            } catch (error) {
                $notification.error('Error wile deleting item', error);
            }

            vm.refresh();
        };
});