import Vue from 'vue';

function migrate(component, c) {
    for (const key in c) {
        if (!c.hasOwnProperty(key)) continue;
        if (!component.hasOwnProperty(key)) {
            component[key] = c[key];
        } else if (typeof c[key] === 'object' && c[key] !== null) {
            component[key] = migrate(component[key], c[key]);
        }
    }

    return component;
}

export default function (component) {
    const c = {
        methods: {
            notify(message, type, error) {
                this.$store.dispatch('notification/notify', {
                    message,
                    type: type || 'info',
                    error
                });
            },
            notifySuccess(message) {
                this.$store.dispatch('notification/notify', {
                    message,
                    type: 'success'
                });
            },
            notifyError(message, error) {
                this.$store.dispatch('notification/notify', {
                    message,
                    type: 'error',
                    error
                });
            },
            toggelDialog(value, id) {
                let options = typeof id === 'string' && this.hasOwnProperty(id) ? this[id] : this.dialogOptions;
                id = typeof id === 'string' && this.hasOwnProperty(id) ? id : 'dialogOptions';
                Vue.set(this[id], 'open', value || !options.open);
                const dialog = document.getElementById(options.id);
                dialog.open = value || options.open;
            }
        }
    };

    return migrate(component, c);
};