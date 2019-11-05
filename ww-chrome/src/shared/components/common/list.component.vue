<template>
  <div class="list">
    <div class="search-input">
      <div class="input-container">
        <input
          type="text"
          id="searchInput"
          name="searchInput"
          v-model="searchInput"
          autocomplete="off"
          aria-autocomplete="none"
          @change="refresh()"
          placeholder="search"
        />
        <span v-show="list.loading" class="loader"></span>
        <button
          class="input-sufix icon-cancel-alt-filled"
          id="clear-search"
          v-if="searchInput"
          @click="searchInput = ''; refresh()"
        ></button>
        <button class="input-sufix icon-search" id="clear-search" @click="refresh()"></button>
      </div>
    </div>
    <div class="data-container">
      <ul id="list">
        <li class="text-center" v-if="!list.data.length && !list.loading">
          <h2>No data!</h2>
        </li>
        <li v-for="(item, index) in list.data" :key="index">
          <component :item="item" :is="options.itemComponent"></component>
        </li>
        <li class="text-center" v-show="list.loading">
          <loader-component size="10"></loader-component>
        </li>
        <li class="loadmore">
          <input
            type="button"
            v-if="list.data.length != list.total"
            @click="loadmore()"
            value="Load more"
          />
          <span class="right">{{list.data.length}}/{{list.total}}</span>
        </li>
      </ul>
    </div>
    <div class="hidden">{{time}}</div>
  </div>
</template>

<script>
import core from "./core-component";
import loaderComponent from "./loader.component";

const component = {
  name: "list-component",
  props: ["options"],
  components: {
    "loader-component": loaderComponent
  },
  data() {
    return {
      searchInput: "",
      list: {
        total: 0,
        loading: false,
        data: []
      },
      take: 20,
      comp: false
    };
  },
  computed: {
    async time() {
      if(this.comp) await this.refresh();
      return await this.$store.getters[this.options.store + "/createdTime"];
    }
  },
  methods: {
    async refresh() {
      this.list.loading = true;
      const listData = await this.$store.getters[
        this.options.store + "/list"
      ]({
        searchText: this.searchInput,
        take: this.take
      });
      this.list.data = listData.list;
      this.list.total = listData.count;
      this.list.loading = false;
    },
    async loadmore() {
      this.take += 20;
      await this.refresh();
    }
  },
  async created() {
    if(this.$constants.scope === 'popup') {
      const url = (await this.$store.getters['chrome/selectedTab']).wwurl;
      if(url && !url.startsWith('chrome') && !url.toLowerCase().startsWith('newtab')) {
        this.searchInput = url;
      }
    }
    this.comp = true;
    await this.refresh();
  }
};

export default core(component);
</script>