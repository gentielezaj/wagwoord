<template>
  <div>
    <nav :class="{collapsed: collapsed}" id="app-nav">
      <ul>
        <li @click="toggleCollapsed()">
          <div>
            <i></i>
          </div>
          <div class="nav-text">
            <span>Wagwoord</span>
          </div>
        </li>
        <li
          v-for="page in pages"
          v-bind:key="page.name"
          v-bind:data-page="page.name"
          @click="changeTab(page.link)"
          v-bind:class="{active: isActiveTab(page.link)}"
        >
          <i v-bind:class="page.icon"></i>
          <!-- <object data="../assests/icons/015-sync.svg"></object> -->
          <div class="nav-text">
            <span>{{page.title}}</span>
          </div>
        </li>
      </ul>
    </nav>
    <section :class="{collapsed: collapsed}" id="app-section">
      <div clss="section-content">
        <router-view></router-view>
      </div>
    </section>
    <notification-component></notification-component>
  </div>
</template>

<script>
import notificationComponent from "../shared/components/common/notification.component";
export default {
  name: "App",
  components: {
    "notification-component": notificationComponent
  },
  data: () => {
    return {
      pages: [
        {
          title: "Passwords",
          page: "password",
          link: "/",
          icon: "icon-combination_lock"
        },
        {
          title: "Addresses",
          page: "address",
          link: "/address",
          icon: "icon-fort"
        },
        {
          title: "Credit Cards",
          page: "credit-card",
          link: "/credit-card",
          icon: "icon-card"
        },
        {
          title: "Code Generateor",
          page: "code-generator",
          link: "/code-generator",
          icon: "icon-015-time"
        },
        {
          title: "Blacklist",
          page: "blacklist",
          link: "/blacklist",
          icon: "icon-blacklist"
        },
        {
          title: "Settings",
          page: "settings",
          link: "/settings",
          icon: "icon-settings"
        },
        {
          title: "Demo",
          page: "demo",
          link: "/demo",
          icon: "icon-demo"
        },
        {
          title: "Test",
          page: "test",
          link: "/test",
          icon: "icon-test"
        }
      ],
      collapsed: false
    };
  },
  methods: {
    isActiveTab(tab) {
      return this.$route.path == tab;
    },
    toggleCollapsed(collapsed) {
      this.collapsed = collapsed === undefined ? !this.collapsed : collapsed;
      if (this.collapsed) localStorage.setItem("nav-collapsed", "true");
      else localStorage.removeItem("nav-collapsed");
    },
    changeTab(link) {
      if (link != this.$route.path) this.$router.push(link);
    }
  },
  created() {
    console.log(this.$store);
    console.log(this.$constants);
    this.$store.commit("address/setCountries");
    if (localStorage.getItem("nav-collapsed") == "true") {
      this.toggleCollapsed(true);
    }
  }
};
</script>

<style lang="scss">
@import "../style/app.scss";
@import "../style/options.scss";
</style>
