wwapp.factory('$encryption', function ($rootScope) {
    let vm = this;
    const encryptionKeyName = 'encryptionKey';
    
    vm.encrypt = async function(text) {
        const key = await vm.get();
        if(!key.encryptionKey) return text;
        return CryptoJS.AES.encrypt(text, key.encryptionKey).toString();
    };

    vm.decrypt = async function(text) {
        const key = await vm.get();
        if(!key.encryptionKey) return text;
        return CryptoJS.AES.decrypt(text, key.encryptionKey).toString(CryptoJS.enc.Utf8);
    };

    vm.save = async function(key) {
        try {
            if(!key.encryptionKey) await vm.remove();
            else await storage('set', key);
            return true;
        } catch (error) {
            console.log(error);
        }
    };

    vm.get = async function() {
        return await storage('get');
    };

    vm.remove = async function() {
        return await storage('remove');
    };

    async function storage(operation, key){
        if(!operation) return false;
        if(operation === 'set' && !key) return false;
        return new Promise(resolve => {
            chrome.storage.local[operation](key || encryptionKeyName, result => {
                resolve(result);
            });
        });
    }

    return vm;
});