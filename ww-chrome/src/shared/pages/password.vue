<template>
  <div class="passwords">
    <section-header v-if="!removeHeader" v-bind:options="header"></section-header>
    <div class="password-list">
      <list-component v-bind:options="listOptions"></list-component>
    </div>
    <div v-if="!removeForm" class="content">
      <dialog-component :options="dialogOptions"></dialog-component>
    </div>
    <div class="hidden">{{syncing}}</div>
  </div>
</template>

<script>
import sctionHeader from "../components/common/section-header";
import passwordFormComponent from "../components/password/password-form.component";
import dialogComponent from "../components/common/dialog-component";
import { pageComponent } from "../components/common/core-component";
import Vue from 'vue';
import listComponent from "../components/common/list.component";
import passwordItemComponent from "../components/password/password-list-item.component";

const component = {
  name: "password-page",
  components: {
    "section-header": sctionHeader,
    "password-form": passwordFormComponent,
    "dialog-component": dialogComponent,
    "password-item-component": passwordItemComponent,
    "list-component": listComponent
  },
  data() {
    return {
      header: {
        title: "Password",
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
            class: "loader icon-sync-1",
            disabled: this.syncing
          }
        ]
      },
      dialogOptions: {
        id: "password-form-component-dialog",
        component: passwordFormComponent,
        disableClose: true,
        componentOptions: {}
      },
      listOptions: {
        itemComponent: passwordItemComponent,
        store: "password"
      }
    };
  },
  created() {
    if (this.$route.query.edit) {
      this.dialogOptions.componentOptions.itemId = Number(
        this.$route.query.edit
      );
      this.dialogOptions.open = true;
    }
  },
  computed: {
    syncing() {
      Vue.set(this.header.buttons.find(b => b.name == 'sync'), 'disabled', this.$store.getters['password/syncing']);
      return this.$store.getters['password/syncing'];
    }
  },
  methods: {
    async update() {
      const button = this.header.buttons.find(b => b.name == 'sync');
      if (await this.$store.dispatch("password/sync")) {
        this.notifySuccess("Updated");
      }
    }
  }
};

export default pageComponent(component, 'password');
</script>

<style>
div.passwords {
  min-width: 295px;
}
div .list {
  margin: 4.5rem 0 4.5rem 2rem;
  max-width: 60rem;
  width: 100%;
  min-width: 290px;
}

.list .search-input {
  position: fixed;
  max-width: 60rem;
  width: 100%;
  min-width: 290px;
  background-color: var(--wagwoord-main-color);
}

.list .data-container {
  padding: 1.5rem 0;
}

.list .data-container ul {
  text-decoration: none;
  list-style-type: none;
  padding: 0;
  margin: 2.5rem 0;
}

.list .data-container ul li {
  padding: 0.5rem;
  border-bottom: 1px var(--wagwoord-main-color-light) solid;
}

.list .data-container ul li:last-child {
  border-bottom: none;
}

@import url(../../style/password-list.scss);

</style>