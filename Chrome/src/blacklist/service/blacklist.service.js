wwapp.service('$blacklist', function ($database, $base, $password) {
    let vm = this;
    vm.name = 'blacklist';
    const db = $database.init(vm.name);

    // #region save
    valideItem = function (item) {
        return angular.isString(item.name) && item.name.length ? true : false;
    };

    preSave = async function (item) {
        item.name = $password.getName(item.name || item.domain);
        item.domain = $password.getDomain(item.domain);

        item.password = item.password ? true : false;
        item.address = item.address ? true : false;
        item.creditCard = item.creditCard ? true : false;
        item.codeGenerator = item.codeGenerator ? true : false;

        var oldItem = await db.store.where({name: item.name}).first();
        if(angular.isObject(oldItem)) {
            item.id = oldItem.id;
        }

        return item;
    };
    // #endregion save

    vm.addTab = function(tabUrl) {
        vm.save(setAll(tabUrl));
    };

    vm.getForDomain = async function(url) {
        url = $password.getName(url);
        return await db.store.where({name: url}).first();
    };

    function setAll(item, value){
        if(angular.isString(item)) {
            item = {
                name: item
            };
        }
        value = angular.isObject(value) ? value : true;
        item.password = value;
        item.address = value;
        item.creditCard = value;
        item.codeGenerator = value;

        return item;
    }

    // #region extend
    vm = $base(vm, {
        service: vm.name,
        valideItem: valideItem,
        preSave: preSave
    });
    // #endregion extend
    return vm;
});