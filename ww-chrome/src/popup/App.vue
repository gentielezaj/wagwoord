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
    <notification-component></notification-component>
    <dalog-component></dalog-component>
  </main>
</template>

<script>
import passwordItemComponent from "../shared/components/password/password-list-item.component";
import dialogComponent from "../shared/components/common/dialog.component";
import notificationComponent from "../shared/components/common/notification.component";

export default {
  components: {
    "notification-component": notificationComponent,
    "dalog-component": dialogComponent
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
  computed: {},
  methods: {
    isActive(path) {
      path = "/" + (path || "");
      return this.$route.path == path ? "active" : "";
    },
    goTo(address) {
      this.$router.push("/" + (address || ""));
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

#app-notificaitons {
  z-index: var(--zindex-notifications-nav);
  position: fixed;
  padding: 0;
  margin: 0;
  right: 0;
  left: 0;
  bottom: 2.8rem;
  color: #fff;
  ul {
    text-decoration: none;
    list-style-type: none;
    display: flex;
    margin: 0;
    padding: 0;
    flex-direction: column-reverse;
    li {
      padding: 0.5rem;
      width: 100%;
      font-size: 0.8rem;
      text-align: center;
      cursor: pointer;
      border-bottom: 1px solid #fff;

      transition: all 0.5s ease-out;

      &:first-child {
        border-bottom: none;
      }

      &.removed {
        margin-right: -10rem;
      }

      &.info {
        background-color: var(--wagwoord-color-info);
      }

      &.success {
        background-color: var(--wagwoord-color-success);
      }

      &.error {
        background-color: var(--wagwoord-color-error);
      }

      span {
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        max-width: 15rem;
        font-size: 0.8rem;
        text-align: end;
        max-width: 15rem;
      }
    }
  }
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
dialog > div.dialog-wraper {
  opacity: 0.9;
}
main .list .data-container ul li .domain.title {
  font-size: unset;
}
</style>
