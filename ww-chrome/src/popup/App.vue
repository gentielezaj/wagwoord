<template>
  <main class="password-list">
    <section>
      <router-view></router-view>
    </section>
    <footer class="actions">
      <button
        class="icon-combination_lock"
        :class="isActive('')"
        @click="goTo()"
        aria-label="Settings"
        aria-details="Go to settings"
      ></button>
      <button
        @click="goTo('code-generator')"
        class="icon-015-time"
        :class="isActive('code-generator')"
        aria-label="Settings"
        aria-details="Go to settings"
      ></button>
      <button
        class="icon-blacklist"
        :class="isActive('blacklist')"
        @click="goTo('blacklist')"
        aria-label="Add to blacklist"
      ></button>
      <button
        class="icon-settings"
        @click="edit()"
        aria-label="Settings"
        aria-details="Go to settings"
      ></button>
    </footer>
  </main>
</template>

<script>
import listComponent from "../shared/components/common/list.component";
import passwordItemComponent from "../shared/components/password/password-list-item.component";

export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    "password-item-component": passwordItemComponent,
    // eslint-disable-next-line vue/no-unused-components
    "list-component": listComponent
  },
  data() {
    return {
      listOptions: {
        itemComponent: passwordItemComponent,
        store: "password"
      },
      tab: {}
    };
  },
  computed: {
  },
  methods: {
    isActive(path) {
      path = '/' + (path || '');
      return this.$route.path == path
        ? 'active'
        : '';
    },
    goTo(address) {
      this.$router.push("/" + (address || ''));
    },
    edit() {
      // TODO: open allready opened tab
      this.$store.commit("chrome/open", {
        url: "options/options.html"
      });
    }
  },
  async created() {
    this.tab = await this.$store.getters["chrome/activeTabData"];
    const currentPage = localStorage.getItem("currentPage");
    if (currentPage && currentPage != this.$route.path)
      this.$router.push(currentPage);
  }
};
</script>

<style lang="scss">
@import "../style/app.scss";
@import "../style/password-list.scss";

body {
  background: var(--wagwoord-main-color);
  color: var(--wagwoord-color);
  width: 18rem;
  /* max-height: 25rem; */
  min-height: 10rem;
  overflow: hidden;
  scroll-behavior: smooth;
  padding: 0;
  margin: 0;
}

main {
  section {
    padding-bottom: 0.5rem;
    div.list {
      margin: 0;
      width: calc(100% - 1rem);
      .search-input {
        position: fixed;
        margin: 0;
        padding: 0;
        width: 100%;
        top: 0;
        left: 0;
      }
      .data-container {
        padding: 2rem 0;
        ul {
          text-decoration: none;
          list-style-type: none;
          padding: 0 0.5rem;
          margin: 0;
          li {
            padding: 0.5rem 0;
          }
        }
      }
    }
    div.list-item.blacklist {
      padding: 0.5rem 0.5rem 2.5rem 0.5rem;
      .domain.title {
        font-size: 1.7em;
        padding-bottom: 0.1em;
        border-bottom: 1px solid;
      }
    }
  }
}

footer {
  padding: 0.5rem;
  background-color: var(--wagwoord-main-color-light);
  right: 0;
  left: 0;
  bottom: 0;
  position: fixed;
  display: flex;
  button {
    width: -webkit-fill-available;
    margin: 0 0.2rem;
    &.active {
      border-bottom: 1px solid var(--wagwoord-color);
    }
  }
}

main .list .data-container ul li .domain.title {
  font-size: unset;
}
</style>
