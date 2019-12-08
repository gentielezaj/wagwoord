<template>
  <div>
    <section-header v-if="!removeHeader" v-bind:options="header"></section-header>
    <main class="section-content">
      <list-component v-bind:options="listOptions"></list-component>
    </main>
    <dialog-component  v-if="!removeForm" :options="dialogOptions"></dialog-component>
    <div class="hidden">{{syncing}}</div>
  </div>
</template>

<script>
// #region components
import {pageComponent} from "../components/common/core-component";
import sctionHeader from "../components/common/section-header";

import form from '../components/credit-card/cedit-card-form.component';
import dialogComponent from "../components/common/dialog-component";

import listComponent from "../components/common/list.component";
import creditCardListItemComponent from "../components/credit-card/credit-card-list-item.component";

import Vue from 'vue';
// #endregion components

let component = {
  name: "code-generator-page",
  components: {
    "section-header": sctionHeader,
    "dialog-component": dialogComponent,
    "list-component": listComponent,
    "creditCardListItemComponent": creditCardListItemComponent
  },
  data() {
    return {
      header: {
        title: "Credit cards",
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
        id: "credit-card-form-component-dialog",
        component: form,
        componentOptions: {}
      },
      listOptions: {
        itemComponent: creditCardListItemComponent,
        store: "creditcard"
      }
    };
  },
  methods: {
  },
  computed: {
    syncing() {
      Vue.set(this.header.buttons.find(b => b.name == 'sync'), 'disabled', this.$store.getters['creditcard/syncing']);
      return this.$store.getters['creditcard/syncing'];
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
export default pageComponent(component, 'creditcard');
</script>