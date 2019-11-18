<template>
  <div class="list-item">
    <div class="item-actions right">
      <button @click="edit(item)" class="icon text">
        <span>edit</span>
        <i class="icon-pencil"></i>
      </button>
      <button @click="deleteItem(item)" v-if="appenvirement != 'popup'" class="icon text">
        <span>delete</span>
        <i class="icon-delete"></i>
      </button>
    </div>
    <div class="hidden">
      <span class="data-value">{{item.id}}</span>
    </div>
    <div class="domain title">
      <span class="data-value">{{item.name}}</span>
    </div>
    <div @dblclick="clipboard(item.domain)" class="domain data">
      <span class="data-value">{{item.domain}}</span>
      <span class="data-action right icon" @click="clipboard(item.domain)" data="domain">
        <i class="icon-copy-1"></i>
      </span>
    </div>
    <div @dblclick="clipboard(item.username)" class="domain data">
      <span class="data-value">{{item.username}}</span>
      <span class="data-action right icon" @click="clipboard(item.username)" data="username">
        <i class="icon-copy-1"></i>
      </span>
    </div>
    <div @dblclick="clipboard(item.password)" class="domain data password">
      <span data="password" class="data-value">{{showPassword ? item.password : '•••••••'}}</span>
      <span class="data-action right icon" @click="clipboard(item.password)">
        <i class="icon-copy-1"></i>
      </span>
      <span class="data-action right" data="password" @click="showPassword = !showPassword">
        <i v-show="showPassword" class="icon-eye-close"></i>
        <i v-show="!showPassword" class="icon-eye"></i>
      </span>
    </div>
    <dialog-component v-if="isOptionsScope" :options="dialogOptions"></dialog-component>
    <delete-dialog-component :options="deleteDialogOptions"></delete-dialog-component>
  </div>
</template>

<script>
import core from "../common/core-component";
import dialogComponent from "../common/dialog-component";
import passwordFormComponent from "./password-form.component";
import { clipboard } from "../../services/core/helper.service";
import deleteConfiramtionComponent from '../common/delete-dialog.component';

const component = {
  name: "password-list-item",
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
      showPassword: false,
      deleteDialogOptions: {
        store: 'password',
        item: this.item,
        message: `Delete password?`
      },
      dialogOptions: {
        id: "password-list-item-component-dialog-" + this.item.id,
        component: passwordFormComponent,
        disableClose: true,
        componentOptions: {
          itemId: this.item.id
        }
      }
    };
  },
  methods: {
    async edit() {
      if (this.isOptionsScope) this.toggelDialog();
      else {
        chrome.tabs.create({
          url:
            "option/options.html" +
            (this.item && this.item.id ? "#/?edit=" + this.item.id : "")
        });
      }
    },
    async deleteItem() {
      this.toggelDialog(true, 'deleteDialogOptions');
      // try {
      //   const res = await this.$store.dispatch("password/delete", this.item.id);
      //   if (res) {
      //     this.notifySuccess("Deleted");
      //   } else {
      //     this.notifyError("Error while deleting");
      //   }
      // } catch (error) {
      //   this.notifyError("Error while deleting", error);
      //   throw error;
      // }
    },
    clipboard(value) {
      if (clipboard(value)) this.notify("copied to clipboard");
    }
  },
  created() {}
};

export default core(component);
</script>

<style lang="scss" scoped>
.form-item {
  &.password-length {
    width: 50%;
  }
  &.autosubmit {
    padding-top: 2rem;
  }
}
</style>