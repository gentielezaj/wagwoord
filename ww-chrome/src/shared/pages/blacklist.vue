<template>
  <div>
    <section-header v-bind:options="header"></section-header>
    <div class="content blacklist-list">
      <list-component v-bind:options="listOptions"></list-component>
    </div>
    <dialog-component :options="dialogOptions"></dialog-component>
  </div>
</template>

<script>
import {coreComponent} from "../components/common/core-component";
import sctionHeader from "../components/common/section-header";
import dialogComponent from "../components/common/dialog-component";

import blacklistFormComponent from "../components/backlist/blacklist-form.component";
import listComponent from "../components/common/list.component";
import blacklistItemComponent from "../components/backlist/blacklist-list-item.component";

const component = {
  name: "blacklist-page",
  components: {
    "section-header": sctionHeader,
    "blacklist-form-component": blacklistFormComponent,
    "dialog-component": dialogComponent,
    "list-component": listComponent,
    "blacklist-list-item": blacklistItemComponent
  },
  data() {
    return {
      header: {
        title: "Blacklist",
        buttons: [
          {
            name: "add",
            title: "add",
            click: this.toggelDialog
          },
          {
            name: "sync",
            title: "Sync",
            click: this.update,
            class: "loader icon-sync-1"
          },
          {
            name: "settings",
            title: "Settings",
            click(button) {
              console.log(button);
            },
            class: "icon icon-settings"
          }
        ]
      },
      dialogOptions: {
        id: "blacklist-form-component-dialog",
        component: blacklistFormComponent,
        componentOptions: {}
      },
      listOptions: {
        itemComponent: blacklistItemComponent,
        store: "blacklist"
      }
    };
  },
  methods: {
    async update() {
      if (await this.$store.dispatch("blacklist/sync")) {
        this.notifySuccess("Updated");
      }
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

export default coreComponent(component);
</script>

<style lang="scss">
.content.blacklist-list {
  padding: 1rem 0;
  .search-input {
    top: 4.5rem;
    padding: 2rem 0 0.5rem 0;
    z-index: 1;
  }
}
</style>