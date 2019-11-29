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

export function coreComponent(component, store) {
    const c = {
        methods: {
            notify(message, type, error) {
                this.$store.dispatch('notification/notify', {
                    message,
                    type: type || 'info',
                    error
                });
            },
            async update() {
                if (await this.$store.dispatch(store + "/sync")) {
                    this.notifySuccess("Updated");
                }
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

export function pageComponent(component, store) {
    if (!component.props) component.props = {};
    if (!component.props.removeForm) {
        component.props.removeForm = {
            required: false
        };
    }
    if (!component.props.removeHeader) {
        component.props.removeHeader = {
            required: false
        };
    }

    return coreComponent(component, store);
}