<template>
  <div>
    <section-header v-if="!removeHeader" v-bind:options="header"></section-header>
    <main class="section-content">
      <list-component v-bind:options="listOptions"></list-component>
    </main>
    <dialog-component v-if="!removeForm" :options="dialogOptions"></dialog-component>
    <div class="hidden">{{syncing}}</div>
  </div>
</template>

<script>
// #region components
import { pageComponent } from "../components/common/core-component";
import form from "../components/address/address-form.component";
import addressListItemComponent from "../components/address/address-list-item.component";

import Vue from "vue";
// #endregion components

let component = {
  name: "address-page",
};
export default pageComponent(
  component,
  "address",
  "Addresses",
  form,
  addressListItemComponent
);
</script>