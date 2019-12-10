<template>
  <div class="passwords">
    <section-header v-if="!removeHeader" v-bind:options="header"></section-header>
    <div class="password-list">
      <list-component v-bind:options="listOptions"></list-component>
    </div>
    <div v-if="!removeForm" class="content">
      <dialog-component :options="dialogOptions"></dialog-component>
    </div>
    <div class="hidden">{{syncing}}</div>
  </div>
</template>

<script>
import form from "../components/password/password-form.component";
import { pageCoreComponentMixin } from "../components/common/core.component";
import listItem from "../components/password/password-list-item.component";

export default {
  name: "password-page",
  mixins: [pageCoreComponentMixin('password', 'Passwords', form, listItem)]
};

</script>

<style>
div.passwords {
  min-width: 295px;
}
div .list {
  margin: 4.5rem 0 4.5rem 2rem;
  max-width: 60rem;
  width: 100%;
  min-width: 290px;
}

.list .search-input {
  position: fixed;
  max-width: 60rem;
  width: 100%;
  min-width: 290px;
  background-color: var(--wagwoord-main-color);
}

.list .data-container {
  padding: 1.5rem 0;
}

.list .data-container ul {
  text-decoration: none;
  list-style-type: none;
  padding: 0;
  margin: 2.5rem 0;
}

.list .data-container ul li {
  padding: 0.5rem;
  border-bottom: 1px var(--wagwoord-main-color-light) solid;
}

.list .data-container ul li:last-child {
  border-bottom: none;
}

@import url(../../style/password-list.scss);

</style>