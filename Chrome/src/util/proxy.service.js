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

    vm.get = function (controller, item) {
        if (parseInt(item)) controller += '/' + item;
        return vm.send(controller, undefined, 'get');
    };

    vm.head = function (controller, item) {
        if (parseInt(item)) controller += '/' + item;
        return vm.send(controller, undefined, 'head');
    };

    vm.patch = function (controller, item) {
        if (parseInt(item)) controller += '/' + item;
        return vm.send(controller, undefined, 'PATCH');
    };

    vm.init = function (controller) {
        return {
            get: (params) => vm.get(controller, params),
            post: (data) => vm.send(controller, data, 'post'),
            patch: (data) => vm.patch(controller, data),
            head: (params) => vm.head(controller, params)
        };
    };

    vm.send = function (controller, item, method) {
        if (controller.startsWith('/')) controller = controller.substring(1);
        return new Promise(resolve => {
            $http({
                method: method,
                url: settings.proxylink + controller,
                headers: settings.headers,
                data: item
            })
            .then(response => resolve(response.data));
        });
    };

    return vm;
});