<template>
  <header>
    <ul class="horisontal">
      <li class="title">
        <h2 v-bind:class="options.class">{{options.title}}</h2>
      </li>
      <li v-for="button in options.buttons" v-bind:key="button.name">
        <button @click="button.click(button, $event)" :disabled="button.disabled" v-bind:class="button.class">{{button.title}}</button>
      </li>
      <li v-if="options.search">
        <div style="width: 20rem" class="search-input">
            <div class="input-container">
                <input v-model="options.searchInput" type="text" id="toolbar-search" name="toolbar-search" placeholder="search">
                <button v-if="options.searchInput" @click="options.searchInput = ''" class="input-sufix icon-cancel-alt"></button>
                <button class="input-sufix icon-search"></button>
            </div>
        </div>
      </li>
    </ul>
  </header>
</template>

<script>
export default {
  name: "section-header-component",
  props: [
      'options'
  ],
  data() {
    return {
    };
  },
  computed: {
    // searchInput :{
    //   get: function() {
    //     return this.$store.getters['sectionSearch/searchInput'];
    //   },
    //   set: function(value) {
    //     return this.$store.commit('sectionSearch/updateSearchInput', value);
    //   }
    // }
  }
};
</script>