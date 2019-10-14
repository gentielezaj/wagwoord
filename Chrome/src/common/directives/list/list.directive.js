wwapp.directive('appList', function ($notification, $injector, app, $rootScope) {
    return {
        restrict: 'EA',
        templateUrl: '../src/common/directives/list/list.directive.html',
        scope: {
            service: '@',
            template: '@?',
            options: '=?'
        },
        link: function (scope, element, attribures) {
            const $service = $injector.get('$' + scope.service);
            const takeBase = app.envirement == 'options' ? 50 : 20;
            scope.appenvirement = app.envirement;
            scope.confirmationDialogId = 'confirmation-delete-item-dialog-' + new Date().getTime();

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

            scope.settings.delete = async function (del, item) {
                if(del !== true) {
                    scope.deleteResponseParams = del;
                    document.getElementById(scope.confirmationDialogId).open = true;
                    return;
                }

                try {
                    await $service.delete(item.id);
                    $notification.success('Item deleted');
                } catch (error) {
                    $notification.error('Error wile deleting item', error);
                }

                scope.settings.refresh();
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