import Vue from 'vue';
import sctionHeader from './section-header';
import listComponent from './list.component';

export function coreComponentMixin(store) {
    return {
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
            toggelDialog(id) {
                const options = typeof id === 'string' && this.hasOwnProperty(id) ? this[id] : this.dialogOptions;
                this.$store.commit('dialog/open', options);
            }
        },
        computed: {
            vue() {
                return Vue;
            },
            storeName() {
                return store;
            },
            isOptionsScope() {
                return this.$constants.scope == "options";
            }
        }
    };
};

export function pageCoreComponentMixin(store, pageTitle, formComponent, listItemComponent) {
    return {
        mixins: [coreComponentMixin(store)],
        components: {
            "section-header": sctionHeader,
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
                    this.$store.getters[this.storeName + "/syncing"]
                );
                return this.$store.getters[this.storeName + "/syncing"];
            }
        },
        data() {
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
                    store: store,
                    searchFormat: 'mini'
                }
            };
        },
        created() {
            if (this.$route.query.edit) {
                this.dialogOptions.componentOptions.itemId = Number(
                    this.$route.query.edit
                );
                setTimeout(() => {
                    this.$store.commit('dialog/open', this.dialogOptions);
                }, 100);
            }
        },
        methods: {
            async update() {
                if (await this.$store.dispatch(store + "/sync")) {
                    this.notifySuccess("Updated");
                }
            }
        }
    };
}

export function listItemCoreComponentMixin(store, form, page) {
    return {
        mixins: [coreComponentMixin(store)],
        data() {
            return {
                deleteDialogOptions: {
                    store: store,
                    item: this.item,
                    message: `Delete ${store}?`
                },
                dialogOptions: {
                    id: store + "-list-item-component-dialog-" + this.item.id,
                    component: form,
                    disableClose: false,
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
        methods: {
            async edit() {
                if (this.isOptionsScope) this.$store.commit('dialog/open', this.dialogOptions);
                else {
                    this.$store.commit('chrome/open', {
                        url: "options/options.html#/" + (page || page === '' ? page : store) +
                            (this.item && this.item.id ? "?edit=" + this.item.id : "")
                    });
                }
            },
            async deleteItem() {
                this.$store.commit('dialog/delete', this.deleteDialogOptions);
            },
            clipboard(value) {
                if (this.$util.clipboard(value)) this.notify("copied to clipboard");
            }
        }
    };
}

export function formCoreComponentMixin(store, formId) {
    return {
        mixins: [coreComponentMixin(store)],
        name: store + '-from-component',
        props: {
            options: {
                required: false
            }
        },
        data() {
            return {
                model: {
                    synced: true
                },
                saving: false
            };
        },
        computed: {
            baseModel() {
                return {
                    synced: true
                };
            },
            formId() {
                return formId || (store + '-form');
            }
        },
        methods: {
            reset() {
                this.model = this.$util.copy(this.baseModel);
                if (this.options && typeof this.options.onSubmit == "function") {
                    this.options.onSubmit();
                }
                this.$store.commit('dialog/close');
            },
            changeModelProperty(property, value) {
                this.vue.set(this.model, property, value);
            },
            async save(event) {
                if (event) event.preventDefault();
                if (!this.checkFormVaidity()) return;
                await this.coreSave(event);
            },
            async coreSave(event) {
                if (event) event.preventDefault();
                this.saving = true;
                try {
                    let result = await this.$store.dispatch(
                        this.storeName + "/save",
                        this.model
                    );
                    if (result) {
                        this.notifySuccess(store + " saved");
                        this.reset();
                    } else {
                        this.notifyError("Error while saving " + store);
                    }
                    this.saving = false;
                } catch (error) {
                    this.notifyError("Error while saving " + store, error);
                    this.saving = false;
                    throw error;
                }
            },
            checkFormVaidity(event) {
                if(document.getElementById(this.formId)?.checkValidity) {
                    if (!document.getElementById(this.formId).checkValidity()) {
                        if (event) event.preventDefault();
                        this.notifyError("Invalide form");
                        return false;
                    }
                }
                return true;
            },
            async onCreate() {
                if (this.options.itemId) {
                    this.model = await this.$store.getters[this.storeName + "/item"](
                        this.options.itemId
                    );
                } else {
                    this.model = this.$util.copy(this.baseModel);
                }
            }
        },
        async created() {
            await this.onCreate();
        }
    };
}