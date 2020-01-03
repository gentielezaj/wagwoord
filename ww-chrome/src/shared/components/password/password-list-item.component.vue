<template>
  <div class="list-item">
    <div class="item-actions right">
      <button @click="edit(item)" class="icon text">
        <span>edit</span>
        <i class="icon-pencil"></i>
      </button>
      <button @click="deleteItem(item)" class="icon text">
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
  </div>
</template>

<script>
import { listItemCoreComponentMixin } from "../common/core.component";
import form from "./password-form.component";

export default {
  name: "password-list-item",
  mixins: [listItemCoreComponentMixin('password', form, '')],
  data() {
    return {
      showPassword: false
    };
  }
};
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