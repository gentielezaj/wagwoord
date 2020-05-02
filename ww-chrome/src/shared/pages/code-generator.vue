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
import form from "../components/code-generator/code-generator-form.component";
import listItem from "../components/code-generator/code-generator-list-item.component";

// #endregion components

export default {
  name: "code-generator-page",
  mixins: [
    pageCoreComponentMixin(
      "codegenerator",
      "Time-based One-time Password",
      form,
      listItem
    )
  ],
  data() {
    return {
      listOptions: {
        itemComponent: listItem,
        store: 'codegenerator',
        searchFormat: 'nano'
      }
    };
  }
};
</script>