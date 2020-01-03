<template>
  <div>
    <section-header v-if="!removeHeader" v-bind:options="header"></section-header>
    <main class="section-content">
      <list-component v-bind:options="listOptions"></list-component>
    </main>
    <div class="hidden">{{syncing}}</div>
  </div>
</template>

<script>
// #region components
import form from "../components/address/address-form.component";
import { pageCoreComponentMixin } from "../components/common/core.component";
import listItem from "../components/address/address-list-item.component";

// #endregion components

export default {
  name: "address-page",
  mixins: [pageCoreComponentMixin('address', 'Address', form, listItem)]
};
</script>