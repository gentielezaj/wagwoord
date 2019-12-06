<template>
  <div class="list-item">
    <div class="item-actions right">
      <button @click="edit(item)" class="icon text">
        <span>edit</span>
        <i class="icon-pencil"></i>
      </button>
      <button @click="deleteItem(item)" v-if="isOptionsScope" class="icon text">
        <span>delete</span>
        <i class="icon-delete"></i>
      </button>
    </div>
    <div class="hidden">
      <span class="data-value">{{item.id}}</span>
    </div>
    <div class="domain title">
      <span class="data-value">{{item.issuer}}</span>
    </div>
    <div @dblclick="clipboard(item.username)" class="domain data">
      <span class="data-value">{{item.username}}</span>
      <span class="data-action right icon" @click="clipboard(item.username)" data="username">
        <i class="icon-copy-1"></i>
      </span>
    </div>
    <div @dblclick="clipboard(code)" class="domain data">
      <span class="data-value">{{code}} - {{timeLeft}}</span>
      <span class="data-action right icon" @click="clipboard(code)" data="code">
        <i class="icon-copy-1"></i>
      </span>
    </div>
    <dialog-component v-if="isOptionsScope" :options="dialogOptions"></dialog-component>
    <delete-dialog-component :options="deleteDialogOptions"></delete-dialog-component>
  </div>
</template>

<script>
import {coreComponent} from "../common/core-component";
import dialogComponent from "../common/dialog-component";
import codegeneratorFormComponent from "./code-generator-form.component";
import { clipboard } from "../../services/core/helper.service";
import deleteConfiramtionComponent from "../common/delete-dialog.component";

import authenticator from "otplib/authenticator";
import crypto from "crypto";

import Vue from "vue";

const component = {
  name: "code-generator-list-item",
  props: {
    item: { required: true },
    onSubmits: { required: false }
  },
  components: {
    "dialog-component": dialogComponent,
    "delete-dialog-component": deleteConfiramtionComponent
  },
  computed: {
    isOptionsScope() {
      return this.$constants.scope == "options";
    }
  },
  data() {
    return {
      appenvirement: false,
      deleteDialogOptions: {
        store: "codegenerator",
        item: this.item,
        message: `Delete code?`
      },
      dialogOptions: {
        id: "code-generator-list-item-component-dialog-" + this.item.id,
        component: codegeneratorFormComponent,
        disableClose: true,
        componentOptions: {
          itemId: this.item.id
        }
      },
      code: "",
      timeLeft: 0,
      checkCodeInterval: ""
    };
  },
  beforeDestroy() {
    this.checkCodeInterval = undefined;
  },
  methods: {
    async edit() {
      if (this.isOptionsScope) this.toggelDialog();
      else {
        this.$store.commit('chrome/open', {
          url:
            "options/options.html#/code-generator" +
            (this.item && this.item.id ? "?edit=" + this.item.id : "")
        });
      }
    },
    async deleteItem() {
      this.toggelDialog(true, "deleteDialogOptions");
    },
    clipboard(value) {
      if (clipboard(value)) this.notify("copied to clipboard");
    },
    checkCode() {
      Vue.set(this, "timeLeft", authenticator.timeRemaining());
      Vue.set(this, "code", authenticator.generate(this.item.secret));
    }
  },
  created() {
    authenticator.options = { crypto };
    this.checkCodeInterval = setInterval(() => {
      this.checkCode();
    }, 1);
  }
};

export default coreComponent(component);
</script>
