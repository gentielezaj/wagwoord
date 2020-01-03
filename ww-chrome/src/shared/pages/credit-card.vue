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
import { pageCoreComponentMixin } from "../components/common/core.component";
import form from "../components/credit-card/cedit-card-form.component";
import listItem from "../components/credit-card/credit-card-list-item.component";

// #endregion components

export default {
  name: "credit-card-page",
  mixins: [pageCoreComponentMixin("creditcard", "Credit cards", form, listItem)]
};
</script>