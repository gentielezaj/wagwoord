import Vue from 'vue';
import dialogComponent from './dialog-component';
import deleteDialogComponent from './delete-dialog.component';
import sctionHeader from './section-header';
import listComponent from './list.component';
import {
    clipboard
} from '../../services/core/helper.service';

function migrate(component, c, stopNasting) {
    for (const key in c) {
        if (!c.hasOwnProperty(key)) continue;
        if (!component.hasOwnProperty(key)) {
            component[key] = c[key];
        } else if (key === 'data' && c[key] !== null && typeof c.data == 'function') {
            let componetdata = component.data ? component.data() : {};
            let cData = c.data ? c.data() : {};
            component.data = function () {
                return migrate(componetdata, cData);
            };
        } else if (typeof c[key] === 'object' && c[key] !== null && !stopNasting) {
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
                if (error == 'item-exists') {
                    this.$store.dispatch('notification/notify', {
                        message: "Item exists",
                        type: 'error',
                        error
                    });
                } else {
                    this.$store.dispatch('notification/notify', {
                        message,
                        type: 'error',
                        error
                    });
                }
            },
            toggelDialog(value, id) {
                let options = typeof id === 'string' && this.hasOwnProperty(id) ? this[id] : this.dialogOptions;
                id = typeof id === 'string' && this.hasOwnProperty(id) ? id : 'dialogOptions';
                Vue.set(this[id], 'open', value || !options.open);
                const dialog = document.getElementById(options.id);
                dialog.open = value || options.open;
            }
        },
        computed: {
            vue() {
                return Vue;
            },
            storeName() {
                return store;
            }
        }
    };

    return migrate(component, c);
};

export function pageComponent(component, store, pageTitle, formComponent, listItemComponent) {
    component = coreComponent(component, store);
    const c = {
        components: {
            "section-header": sctionHeader,
            "dialog-component": dialogComponent,
            "list-component": listComponent
        },
        props: {
            removeForm: {
                required: false
            },
            removeHeader: {
                required: false
            }
        },
        computed: {
            syncing() {
                this.vue.set(
                    this.header.buttons.find(b => b.name == "sync"),
                    "disabled",
                    this.$store.getters[store + "/syncing"]
                );
                return this.$store.getters[store + "/syncing"];
            }
        },
        created() {
            if (this.$route.query.edit) {
                this.dialogOptions.componentOptions.itemId = Number(
                    this.$route.query.edit
                );
                this.dialogOptions.open = true;
            }
        }
    };

    if (pageTitle) {
        c.data = function () {
            return {
                header: {
                    title: pageTitle,
                    buttons: [{
                            name: "add",
                            title: "add",
                            click: 'toggelDialog'
                        },
                        {
                            name: "sync",
                            title: "Sync",
                            click: 'update',
                            async: true,
                            class: "loader icon-sync-1",
                            disabled: 'update'
                        }
                    ]
                },
                dialogOptions: {
                    id: store + "-form-component-dialog",
                    component: formComponent,
                    componentOptions: {}
                },
                listOptions: {
                    itemComponent: listItemComponent,
                    store: store
                }
            };
        };
    }

    return migrate(component, c);
}

export function formComponent(component, store, formId) {
    component = coreComponent(component, store);
    const c = {
        methods: {
            reset() {
                this.model = {
                    synced: true
                };
                if (this.options && typeof this.options.onSubmit == "function") {
                    this.options.onSubmit();
                }
            },
            changeModelProperty(property, value) {
                this.vue.set(this.model, property, value);
            },
            async save() {
                if (!document.getElementById(formId).checkValidity()) {
                    event.preventDefault();
                    this.notifyError("Invalide form");
                    return;
                }
                event.preventDefault();
                this.saving = true;
                try {
                    let result = await this.$store.dispatch(
                        this.storeName + "/save",
                        this.model
                    );
                    if (result) this.notifySuccess("code generator saved");
                    else this.notifyError("Error while saving code generator");
                    this.saving = false;
                    this.reset();
                } catch (error) {
                    this.notifyError("Error while saving code generator", error);
                    this.saving = false;
                    throw error;
                }
            }
        },
        async created() {
            if (this.options.itemId) {
                this.model = await this.$store.getters[this.storeName + "/item"](
                    this.options.itemId
                );
            }
        }
    };

    return migrate(component, c);
}

export function listItemComponent(component, store, form) {
    component = coreComponent(component, store);
    const c = {
        components: {
            "dialog-component": dialogComponent,
            "delete-dialog-component": deleteDialogComponent
        },
        data() {
            return {
                deleteDialogOptions: {
                  store: "codegenerator",
                  item: this.item,
                  message: `Delete code?`
                },
                dialogOptions: {
                    id: "code-generator-list-item-component-dialog-" + this.item.id,
                    component: form,
                    disableClose: true,
                    componentOptions: {
                        itemId: this.item.id
                    }
                }
            };
        },
        props: {
            item: {
                required: true
            },
            onSubmits: {
                required: false
            }
        },
        computed: {
            isOptionsScope() {
                return this.$constants.scope == "options";
            }
        },
        methods: {
            async edit() {
                this.toggelDialog();
            },
            async deleteItem() {
                this.toggelDialog(true, "deleteDialogOptions");
            },
            clipboard(value) {
                if (clipboard(value)) this.notify("copied to clipboard");
            }
        },
        created() {
            console.log(store);
            console.log(this.item);
            this.item = this.item || {};
        }
    };

    return migrate(component, c);
}