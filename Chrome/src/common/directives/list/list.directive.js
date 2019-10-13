wwapp.directive('appList', function ($notification, $injector) {
    return {
        restrict: 'EA',
        templateUrl: '../src/common/directives/list/list.directive.html',
        scope: {
            service: '@',
            template: '@?',
            options: '=?'
        },
        link: function (scope) {
            const $service = $injector.get('$' + scope.service);
            const takeBase = appenvirement == 'options' ? 50 : 20;
            scope.appenvirement = appenvirement;

            scope.searchModel = '';
            let take = takeBase;

            scope.data = {
                loading: true,
                list: [],
                total: 0,
            };

            scope.settings = {};

            scope.settings.refresh = function () {
                scope.data.loading = true;
                digest();
                $service.getList({
                    searchText: scope.searchModel,
                    take: take
                }).then(res => {
                    scope.data = res;
                    scope.data.loading = false;
                    digest();
                });
            };

            scope.settings.loadmore = function () {
                take += takeBase;
                scope.settings.refresh();
            };

            scope.settings.edit = function (item) {
                $notification.info('no edit');
            };

            scope.$on('refresh', () => scope.settings.refresh());

            scope.settings.delete = async function (item) {
                alert('TODO:add confimation ao app-list');
                try {
                    await $service.delete(item.id);
                    $notification.success('Item deleted');
                } catch (error) {
                    $notification.error('Error wile deleting item', error);
                }

                scope.refresh();
            };

            function digest() {
                setTimeout(() => {
                    if (!scope.$$phase) scope.$digest();
                }, 10);
            }

            scope.settings = angular.merge(scope.settings, scope.options);

            scope.settings.refresh();
        }
    };
});