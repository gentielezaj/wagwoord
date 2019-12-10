<template>
  <div>
    <section-header v-bind:options="header"></section-header>
    <div class="content blacklist-list">
      <list-component v-bind:options="listOptions"></list-component>
    </div>
    <dialog-component :options="dialogOptions"></dialog-component>
    <div class="hidden">{{syncing}}</div>
  </div>
</template>

<script>
import {pageCoreComponentMixin} from "../components/common/core.component";
import form from "../components/backlist/blacklist-form.component";
import listItem from "../components/backlist/blacklist-list-item.component";

export default {
  name: "blacklist-page",
  mixins:[pageCoreComponentMixin('blacklist', 'Blacklist', form, listItem)]
};
</script>

<style lang="scss">
.content.blacklist-list {
  padding: 1rem 0;
  .search-input {
    top: 4.5rem;
    padding: 2rem 0 0.5rem 0;
    z-index: 1;
  }
}
</style>