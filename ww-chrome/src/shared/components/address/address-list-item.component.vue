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
      <span class="data-value">{{item.firstName}} {{item.lastName}}</span>
    </div>
    <div @dblclick="clipboard(item.username)" class="domain data">
      <span class="data-value">{{item.username}}</span>
      <span class="data-action right icon" @click="clipboard(item.username)" data="username">
        <i class="icon-copy-1"></i>
      </span>
    </div>
    <dialog-component v-if="isOptionsScope" :options="dialogOptions"></dialog-component>
    <delete-dialog-component :options="deleteDialogOptions"></delete-dialog-component>
  </div>
</template>

<script>
import {listItemCoreComponentMixin} from "../common/core.component";
import form from "./address-form.component";

export default {
  mixins: [listItemCoreComponentMixin('address', form)],
  name: "address-list-item"
};
</script>
