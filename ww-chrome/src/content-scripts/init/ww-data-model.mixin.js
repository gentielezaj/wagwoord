import chromeApp from '../handles/common/chrome-handler';

export const dataMixin = {
    install: function (Vue, options) {
        const obj = {
            envirement: "debug",
            ...options,
            setData(key, value) {
                this[key] = value;
            }
        };

        Vue.prototype.$appData = obj;
    }
};

export const chromeConst = {
    install: function (Vue, options) {
        const obj = {
            ...chromeApp
        };

        Vue.prototype.$chrome = obj;
    }
};