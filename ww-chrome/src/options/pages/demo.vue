<template>
  <div class="demo">
    <section-header v-bind:options="header"></section-header>
    <main>
      <article v-searchable v-collapse="'.content'">
        <header>
          <h2>Random aricle</h2>
        </header>
        <div class="content">
          <div class="cards">
            <div search-data="progress" class="card">
              <h4>progeress bar</h4>
              <progress style="width: 250px; height: 20px;" value="50" min="0" max="100"></progress>
            </div>
            <div search-data="loader" class="card">
              <loader v-bind:dim="loaderSize"></loader>
            </div>
          </div>
          <div class="cards">
            <div search-data="notification" class="card">
              <button class="info" @click="addNotification('info')">add notification</button>
              <button class="success" @click="notifySuccess('success')">add notification</button>
              <button class="error" @click="addNotification('error')">add notification</button>
            </div>
          </div>
        </div>
      </article>
      <article v-searchable v-collapse="'.content'">
        <header>
          <h2>Buttons</h2>
          <div>
            <button @click="randomClick($event)">Random button</button>
          </div>
        </header>
        <div class="content">
          <span class="cards">TODO:Create directive for space and spasing</span>
          <div search-data="button default" class="cards">
            <button class="card">Default</button>
            <button class="card settings-icon">Default&nbsp;</button>
            <button class="card icon-settings">&nbsp;Default</button>
            <button class="card settings-icon icon-settings">&nbsp;Default&nbsp;</button>
          </div>
          <div search-data="button info" class="cards">
            <button class="info card">Default</button>
            <button class="info card settings-icon">Default&nbsp;</button>
            <button class="info card icon-settings">&nbsp;Default</button>
            <button class="info card settings-icon icon-settings">&nbsp;Default&nbsp;</button>
          </div>
          <div search-data="button success" class="cards">
            <button class="success card">Default</button>
            <button class="success card settings-icon">Default&nbsp;</button>
            <button class="success card icon-settings">&nbsp;Default</button>
            <button class="success card settings-icon icon-settings">&nbsp;Default&nbsp;</button>
          </div>
          <div search-data="button error" class="cards">
            <button class="error card">Default</button>
            <button class="error card settings-icon">Default&nbsp;</button>
            <button class="error card icon-settings">&nbsp;Default</button>
            <button class="error card settings-icon icon-settings">&nbsp;Default&nbsp;</button>
          </div>
        </div>
      </article>
      <article v-searchable v-collapse="'.content'">
        <header>
          <h2>Form</h2>
        </header>
        <div search-data="form" class="content">
          <div class="form-item">
            <label for="password-form-domain">input</label>
            <div class="input-container">
              <input id="password-form-domain" name="domain" v-model="form.input" type="text" />
            </div>
          </div>

          <div class="form-item cbx">
            <input
              type="checkbox"
              name="synced"
              v-model="form.checkbox"
              class="cbx hidden"
              id="password-form-synced"
            />
            <span class="lbl" @click="form.checkbox = !form.checkbox"></span>
            <label for="password-form-synced" class>ChackBox</label>
          </div>
          <div class="form-item">
            <label for="settings-enctipyion-key">
              <span>Encription key</span>
              <!-- FIXME: loading on label to big -->
              <span v-show="form.textarea" class="loader right"></span>
            </label>
            <button
              @click="form.textarea = ''"
              v-show="form.textarea"
              class="icon-cancel-alt-filled right transparent label"
            ></button>
            <div class="input-container">
              <textarea
                id="settings-enctipyion-key"
                v-form-field
                placeholder="Leave it blank to disable"
                name="form.textarea"
                v-model="form.textarea"
              ></textarea>
            </div>
          </div>
        </div>
      </article>
      <article v-searchable v-collapse="'.content'">
        <header>
          <h2>loader</h2>
        </header>
        <div search-data="loader input" class="content">
          <div class="input-container">
            <input type="text" id="toolbar-search" name="toolbar-search" placeholder="search" />
            <span v-show="inlineLoaderActive" class="loader"></span>
            <button class="input-sufix icon-search"></button>
          </div>
          <div class="cards">
            <button
              @click="inlineLoaderActive = !inlineLoaderActive"
              class="loader card icon-settings"
            >
              Settings
              <span v-show="inlineLoaderActive" class="loader"></span>
            </button>
          </div>
        </div>
      </article>
      <article class="icons" v-searchable v-collapse="'.content'">
        <header>
          <h2>Icons</h2>
        </header>
        <div class="content icons-font">
          <div class="cards demo">
            <div search-data="icon list ok" class="the-icons card" title="Code: 0xe800">
              <i class="icon-list-ok">&nbsp;</i>
              <span class="i-name">icon-list-ok</span>
            </div>
            <div search-data="icon ok" class="the-icons card" title="Code: 0xe801">
              <i class="icon-ok">&nbsp;</i>
              <span class="i-name">icon-ok</span>
            </div>
            <div search-data="icon list" class="the-icons card" title="Code: 0xe802">
              <i class="icon-list">&nbsp;</i>
              <span class="i-name">icon-list</span>
            </div>
            <div search-data="icon blacklist" class="the-icons card" title="Code: 0xe803">
              <i class="icon-blacklist">&nbsp;</i>
              <span class="i-name">icon-blacklist</span>
            </div>
            <div search-data="icon down" class="the-icons card" title="Code: 0xe804">
              <i class="icon-down">&nbsp;</i>
              <span class="i-name">icon-down</span>
            </div>
            <div search-data="icon remove" class="the-icons card" title="Code: 0xe805">
              <i class="icon-remove">&nbsp;</i>
              <span class="i-name">icon-remove</span>
            </div>
            <div search-data="icon demo" class="the-icons card" title="Code: 0xe806">
              <i class="icon-demo">&nbsp;</i>
              <span class="i-name">icon-demo</span>
            </div>
            <div search-data="icon test" class="the-icons card" title="Code: 0xe807">
              <i class="icon-test">&nbsp;</i>
              <span class="i-name">icon-test</span>
            </div>
            <div search-data="icon search" class="the-icons card" title="Code: 0xe808">
              <i class="icon-search">&nbsp;</i>
              <span class="i-name">icon-search</span>
            </div>
            <div search-data="icon key 1" class="the-icons card" title="Code: 0xe809">
              <i class="icon-key-1">&nbsp;</i>
              <span class="i-name">icon-key-1</span>
            </div>
            <div search-data="icon delete" class="the-icons card" title="Code: 0xe80a">
              <i class="icon-delete">&nbsp;</i>
              <span class="i-name">icon-delete</span>
            </div>
            <div search-data="icon pencil" class="the-icons card" title="Code: 0xe80b">
              <i class="icon-pencil">&nbsp;</i>
              <span class="i-name">icon-pencil</span>
            </div>
            <div search-data="icon combination_lock" class="the-icons card" title="Code: 0xe80c">
              <i class="icon-combination_lock">&nbsp;</i>
              <span class="i-name">icon-combination_lock</span>
            </div>
            <div search-data="icon card" class="the-icons card" title="Code: 0xe80d">
              <i class="icon-card">&nbsp;</i>
              <span class="i-name">icon-card</span>
            </div>
            <div search-data="icon spin3" class="the-icons card" title="Code: 0xe80e">
              <i class="icon-spin3">&nbsp;</i>
              <span class="i-name">icon-spin3</span>
            </div>
            <div search-data="icon bank" class="the-icons card" title="Code: 0xe80f">
              <i class="icon-bank">&nbsp;</i>
              <span class="i-name">icon-bank</span>
            </div>
            <div search-data="icon blacklist 2" class="the-icons card" title="Code: 0xe810">
              <i class="icon-blacklist-2">&nbsp;</i>
              <span class="i-name">icon-blacklist-2</span>
            </div>
            <div search-data="icon settings" class="the-icons card" title="Code: 0xe811">
              <i class="icon-settings">&nbsp;</i>
              <span class="i-name">icon-settings</span>
            </div>
            <div search-data="icon database" class="the-icons card" title="Code: 0xe813">
              <i class="icon-database">&nbsp;</i>
              <span class="i-name">icon-database</span>
            </div>
            <div search-data="icon network" class="the-icons card" title="Code: 0xe814">
              <i class="icon-network">&nbsp;</i>
              <span class="i-name">icon-network</span>
            </div>
            <div search-data="icon author sign" class="the-icons card" title="Code: 0xe815">
              <i class="icon-author-sign">&nbsp;</i>
              <span class="i-name">icon-author-sign</span>
            </div>
            <div search-data="icon file" class="the-icons card" title="Code: 0xe816">
              <i class="icon-file">&nbsp;</i>
              <span class="i-name">icon-file</span>
            </div>
            <div search-data="icon sync 2" class="the-icons card" title="Code: 0xe817">
              <i class="icon-sync-2">&nbsp;</i>
              <span class="i-name">icon-sync-2</span>
            </div>
            <div search-data="icon 015 time" class="the-icons card" title="Code: 0xe818">
              <i class="icon-015-time">&nbsp;</i>
              <span class="i-name">icon-015-time</span>
            </div>
            <div search-data="icon theme" class="the-icons card" title="Code: 0xe819">
              <i class="icon-theme">&nbsp;</i>
              <span class="i-name">icon-theme</span>
            </div>
            <div search-data="icon right" class="the-icons card" title="Code: 0xe81b">
              <i class="icon-right">&nbsp;</i>
              <span class="i-name">icon-right</span>
            </div>
            <div search-data="icon sync arrows" class="the-icons card" title="Code: 0xe81c">
              <i class="icon-sync-arrows">&nbsp;</i>
              <span class="i-name">icon-sync-arrows</span>
            </div>
            <div search-data="icon up" class="the-icons card" title="Code: 0xe81d">
              <i class="icon-up">&nbsp;</i>
              <span class="i-name">icon-up</span>
            </div>
            <div search-data="icon sync 1" class="the-icons card" title="Code: 0xe81f">
              <i class="icon-sync-1">&nbsp;</i>
              <span class="i-name">icon-sync-1</span>
            </div>
            <div search-data="icon sync warent" class="the-icons card" title="Code: 0xe826">
              <i class="icon-sync-warent">&nbsp;</i>
              <span class="i-name">icon-sync-warent</span>
            </div>
            <div search-data="icon sync disable" class="the-icons card" title="Code: 0xe827">
              <i class="icon-sync-disable">&nbsp;</i>
              <span class="i-name">icon-sync-disable</span>
            </div>
            <div search-data="icon left" class="the-icons card" title="Code: 0xe828">
              <i class="icon-left">&nbsp;</i>
              <span class="i-name">icon-left</span>
            </div>
            <div search-data="icon login" class="the-icons card" title="Code: 0xe829">
              <i class="icon-login">&nbsp;</i>
              <span class="i-name">icon-login</span>
            </div>
            <div search-data="icon logout" class="the-icons card" title="Code: 0xe82a">
              <i class="icon-logout">&nbsp;</i>
              <span class="i-name">icon-logout</span>
            </div>
            <div search-data="icon menu" class="the-icons card" title="Code: 0xe82b">
              <i class="icon-menu">&nbsp;</i>
              <span class="i-name">icon-menu</span>
            </div>
            <div search-data="icon qrcode" class="the-icons card" title="Code: 0xe82c">
              <i class="icon-qrcode">&nbsp;</i>
              <span class="i-name">icon-qrcode</span>
            </div>
            <div search-data="icon feather" class="the-icons card" title="Code: 0xe82d">
              <i class="icon-feather">&nbsp;</i>
              <span class="i-name">icon-feather</span>
            </div>
            <div search-data="icon cancel alt" class="the-icons card" title="Code: 0xe82e">
              <i class="icon-cancel-alt">&nbsp;</i>
              <span class="i-name">icon-cancel-alt</span>
            </div>
            <div search-data="icon cancel alt filled" class="the-icons card" title="Code: 0xe82f">
              <i class="icon-cancel-alt-filled">&nbsp;</i>
              <span class="i-name">icon-cancel-alt-filled</span>
            </div>
            <div search-data="icon settings 1" class="the-icons card" title="Code: 0xe830">
              <i class="icon-settings-1">&nbsp;</i>
              <span class="i-name">icon-settings-1</span>
            </div>
            <div search-data="icon spin2" class="the-icons card" title="Code: 0xe831">
              <i class="icon-spin2">&nbsp;</i>
              <span class="i-name">icon-spin2</span>
            </div>
            <div search-data="icon code" class="the-icons card" title="Code: 0xe832">
              <i class="icon-code">&nbsp;</i>
              <span class="i-name">icon-code</span>
            </div>
            <div search-data="icon info" class="the-icons card" title="Code: 0xe833">
              <i class="icon-info">&nbsp;</i>
              <span class="i-name">icon-info</span>
            </div>
            <div search-data="icon spin4" class="the-icons card" title="Code: 0xe834">
              <i class="icon-spin4">&nbsp;</i>
              <span class="i-name">icon-spin4</span>
            </div>
            <div search-data="icon eye" class="the-icons card" title="Code: 0xe836">
              <i class="icon-eye">&nbsp;</i>
              <span class="i-name">icon-eye</span>
            </div>
            <div search-data="icon spin 1" class="the-icons card" title="Code: 0xe838">
              <i class="icon-spin-1">&nbsp;</i>
              <span class="i-name">icon-spin-1</span>
            </div>
            <div search-data="icon spin 2" class="the-icons card" title="Code: 0xe839">
              <i class="icon-spin-2">&nbsp;</i>
              <span class="i-name">icon-spin-2</span>
            </div>
            <div search-data="icon key" class="the-icons card" title="Code: 0xe83b">
              <i class="icon-key">&nbsp;</i>
              <span class="i-name">icon-key</span>
            </div>
            <div search-data="icon logo" class="the-icons card" title="Code: 0xe83e">
              <i class="icon-logo">&nbsp;</i>
              <span class="i-name">icon-logo</span>
            </div>
            <div search-data="icon safe" class="the-icons card" title="Code: 0xe83f">
              <i class="icon-safe">&nbsp;</i>
              <span class="i-name">icon-safe</span>
            </div>
            <div search-data="icon warehouse" class="the-icons card" title="Code: 0xe840">
              <i class="icon-warehouse">&nbsp;</i>
              <span class="i-name">icon-warehouse</span>
            </div>
            <div search-data="icon blacklist 1" class="the-icons card" title="Code: 0xe841">
              <i class="icon-blacklist-1">&nbsp;</i>
              <span class="i-name">icon-blacklist-1</span>
            </div>
            <div search-data="icon open link" class="the-icons card" title="Code: 0xf08e">
              <i class="icon-open-link">&nbsp;</i>
              <span class="i-name">icon-open-link</span>
            </div>
            <div search-data="icon exchange" class="the-icons card" title="Code: 0xf0ec">
              <i class="icon-exchange">&nbsp;</i>
              <span class="i-name">icon-exchange</span>
            </div>
            <div search-data="icon attention" class="the-icons card" title="Code: 0xf12a">
              <i class="icon-attention">&nbsp;</i>
              <span class="i-name">icon-attention</span>
            </div>
            <div search-data="icon cc visa" class="the-icons card" title="Code: 0xf1f0">
              <i class="icon-cc-visa">&nbsp;</i>
              <span class="i-name">icon-cc-visa</span>
            </div>
            <div search-data="icon cc mastercard" class="the-icons card" title="Code: 0xf1f1">
              <i class="icon-cc-mastercard">&nbsp;</i>
              <span class="i-name">icon-cc-mastercard</span>
            </div>
            <div search-data="icon cc discover" class="the-icons card" title="Code: 0xf1f2">
              <i class="icon-cc-discover">&nbsp;</i>
              <span class="i-name">icon-cc-discover</span>
            </div>
            <div search-data="icon cc amex" class="the-icons card" title="Code: 0xf1f3">
              <i class="icon-cc-amex">&nbsp;</i>
              <span class="i-name">icon-cc-amex</span>
            </div>
            <div search-data="icon cc paypal" class="the-icons card" title="Code: 0xf1f4">
              <i class="icon-cc-paypal">&nbsp;</i>
              <span class="i-name">icon-cc-paypal</span>
            </div>
            <div search-data="icon user secret" class="the-icons card" title="Code: 0xf21b">
              <i class="icon-user-secret">&nbsp;</i>
              <span class="i-name">icon-user-secret</span>
            </div>
            <div search-data="icon copy" class="the-icons card" title="Code: 0xf24d">
              <i class="icon-copy">&nbsp;</i>
              <span class="i-name">icon-copy</span>
            </div>
            <div search-data="icon copy 1" class="the-icons card" title="Code: 0xf24d">
              <i class="icon-copy-1">&nbsp;</i>
              <span class="i-name">icon-copy-1</span>
            </div>
            <div search-data="icon fort" class="the-icons card" title="Code: 0xf286">
              <i class="icon-fort">&nbsp;</i>
              <span class="i-name">icon-fort</span>
            </div>
            <div search-data="icon eye close" class="the-icons card" title="Code: 0xf2a8">
              <i class="icon-eye-close">&nbsp;</i>
              <span class="i-name">icon-eye-close</span>
            </div>
          </div>
        </div>
      </article>
    </main>
  </div>
</template>

<script>
import sctionHeader from "../../shared/components/common/section-header";
import loader from "../../shared/components/common/loader.component";
import { mapGetters } from "vuex";
import core from "../../shared/components/common/core-component";

const component = {
  name: "demo-page",
  components: {
    "section-header": sctionHeader,
    loader: loader
  },
  data() {
    return {
      header: {
        title: "Demo",
        search: true,
        buttons: [
          {
            name: "sync",
            title: "Sync reandom",
            click(button) {
              console.log(button);
            },
            class: "loader icon-sync-1"
          },
          {
            name: "settings",
            title: "Settings",
            click(button) {
              console.log(button);
            },
            class: "icon icon-settings"
          }
        ]
      },
      loaderSize: 5,
      checkbox: false,
      inlineLoaderActive: true,
      form: {
        input: "",
        checkbox: false,
        textarea: ""
      }
    };
  },
  computed: {},
  methods: {
    addNotification(type) {
      this.notify("notification", type);
    },
    randomClick(e) {
      e.preventDefault();
      this.notify("button clicked");
    }
  }
};

export default core(component);
</script>

<style lang="scss" scoped>
.icon-font {
  font-size: 1rem;
}

article {
  width: 50%;
}

.cards {
  padding: 0.5rem 0;
  button.card {
    margin-right: 0.2rem;
    &.loader {
      display: -webkit-inline-flex;
    }
  }
}

.icons-font .card {
  width: 11rem;
}

article.icons {
  width: auto;
}
</style>