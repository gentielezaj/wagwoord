wwapp.factory('$proxy', function ($rootScope, $http, $settings) {
    let vm = this;

    let settings = {
        get proxylink() {
            let link = $settings.get('server.domain');
            if (!link.endsWith('/')) link += '/';
            return link;
        },
        get headers() {
            const hs = $settings.get('server.headers');
            if (!hs) return {};
            const hrow = hs.split('\n');
            let result = {};
            hrow.forEach(row => {
                const r = row.split(':');
                result[r[0]] = r[1];
            });

            return result;
        }
    };

    vm.delete = function (controller, id) {
        return vm.send('DELETE', `${controller}/${id}`);
    };

    vm.get = function (controller, item) {
        if (parseInt(item)) controller += '/' + item;
        return vm.send('get', controller);
    };

    vm.head = function (controller, item) {
        if (parseInt(item)) controller += '/' + item;
        return vm.send('head', controller);
    };

    vm.patch = function (controller, item) {
        if (item && parseInt(item)) controller += '/' + item;
        return vm.send('PATCH', controller);
    };

    vm.init = function (controller) {
        return {
            get: (params) => vm.get(controller, params),
            post: (data) => vm.send('post', controller, data),
            patch: (data) => vm.patch(controller, data),
            head: (params) => vm.head(controller, params),
            delete: (id) => vm.delete(controller, id),
            deleteAll: () => vm.send('DELETE', controller + '/all')
        };
    };

    vm.send = function (method, controller, item) {
        if(!settings.proxylink) return {
            success: true,
            noLink: true
        };
        if (controller.startsWith('/')) controller = controller.substring(1);
        return new Promise(resolve => {
            $http({
                    method: method,
                    url: settings.proxylink + controller,
                    headers: settings.headers,
                    data: item
                })
                .then(response => resolve(response.data))
                .catch(error => resolve({
                    success: false,
                    error: error
                }));
        });
    };

    return vm;
});