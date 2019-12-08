<template>
  <header>
    <ul class="horisontal">
      <li class="title">
        <h2 v-bind:class="options.class">{{options.title}}</h2>
      </li>
      <li v-for="button in options.buttons" v-bind:key="button.name">
        <button
          @click="buttonClick(button, $event)"
          :disabled="button.disabled"
          v-bind:class="button.class"
        >{{button.title}}</button>
      </li>
      <li v-if="options.search">
        <div style="width: 20rem" class="search-input">
          <div class="input-container">
            <input
              v-model="options.searchInput"
              type="text"
              id="toolbar-search"
              name="toolbar-search"
              placeholder="search"
            />
            <button
              v-if="options.searchInput"
              @click="options.searchInput = ''"
              class="input-sufix icon-cancel-alt"
            ></button>
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
  props: ["options"],
  methods: {
    buttonClick(button, $event) {
      if (typeof button.click == "string") {
        if (button.async) this.$parent[button.click](button, $event).then();
        else this.$parent[button.click](button, $event);
      } else button.click(button, $event);
    }
  },
  computed: {}
};
</script>