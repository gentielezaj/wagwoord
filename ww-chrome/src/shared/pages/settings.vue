<template>
  <div class="settings">
    <section-header v-bind:options="header"></section-header>
    <main class="columns">
      <div class="column xl">
        <article v-searchable v-collapse="'.content'">
          <header>
            <h2>Sever Settings</h2>
            <div>
              <button @click="openWizard($event, dialogOptions)">Open wizard</button>
            </div>
          </header>
          <div search-data="sync server" class="content">
            <sync-settings-component></sync-settings-component>
          </div>
        </article>
        <article id="settings-password-container" v-searchable v-collapse="'.content'">
          <header>
            <h2>Password Settings</h2>
          </header>
          <div id="password-settings-container" search-data="password" class="content">
            <password-settings-component></password-settings-component>
          </div>
        </article>
        <article v-searchable v-collapse="'.content'">
          <header>
            <h2>Encryption</h2>
          </header>
          <div id="settings-enctyption-container" search-data="encryption" class="content">
            <encryption-component></encryption-component>
          </div>
        </article>
      </div>
      <div class="column m">
        <ul class="settings-navigation right">
          <li>
            <u>Scroll to:</u>
          </li>
          <li>
            <a active @click="scrollTo()">Server</a>
          </li>
          <li>
            <a @click="scrollTo('settings-password-container')">Passwords</a>
          </li>
          <li>
            <a @click="scrollTo('settings-enctyption-container')">Encryption</a>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script>
import sctionHeader from "../components/common/section-header";
import encryptionComponent from "../components/encryption/encryption.component";
import syncSettingComponent from "../components/settings/sync-settings.component";
import passwordSettingsComponent from "../components/password/password-settings.component";
import formwizard from "../components/util/util-form.component";

export default {
  name: "settings-page",
  components: {
    "section-header": sctionHeader,
    "encryption-component": encryptionComponent,
    "sync-settings-component": syncSettingComponent,
    "password-settings-component": passwordSettingsComponent
  },
  data() {
    return {
      header: {
        title: "Settings",
        search: true,
        buttons: [
          {
            name: "sync",
            title: "Sync",
            click: this.sync,
            class: "loader icon-sync-1"
          }
        ]
      },
      dialogOptions: {
        id: "startup-wizard-form-component-dialog",
        component: formwizard,
        componentOptions: {}
      }
    };
  },
  methods: {
    scrollTo(id) {
      if (!id) {
        document.documentElement.scrollTop = 0;
      } else {
        document.documentElement.scrollTop = document.getElementById(
          id
        ).offsetTop;
      }
    },
    openWizard(event, data) {
      this.$store.commit("dialog/open", data);
    },
    async sync() {
      alert("TODO: create sync settings");
    }
  }
};
</script>