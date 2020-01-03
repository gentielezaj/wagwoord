<template>
  <div id="wagwoord-content-script-container" class="wagwoord-app">
    <dialog v-if="dialogData" id="wagwoord-notification-dialog" open>
      <p v-if="dialogData.title" class="title">{{dialogData.title}}:</p>
      <p v-if="dialogData.message">
        <b>
          <i>{{dialogData.message}}</i>
        </b>
      </p>
      <div v-if="dialogData.actions" class="actions">
        <input
          v-for="button in dialogData.actions"
          :key="button.name"
          type="button"
          :value="button.value"
          @click="dialogActionOnClick($event, button)"
          :class="button.class"
        />
      </div>
      <footer @click="goToSettings($event)" aria-label="open settings">
        <button class="icon-settings transparent right"></button>
        <i class="icon-key" />
        <span>Wagwoord</span>
      </footer>
    </dialog>
    <ul id="wagwoord-input-dropdown">
      <li
        v-for="(listItem, index) in inputDropdownData.data"
        :id="listItem.id"
        v-bind:key="listItem.id"
        :tabindex="index"
        class="data"
        :class="{'active': listItem.active}"
        @click="onDropdownClick($event, listItem, inputDropdownData.event)"
        wagwoord-app-field="true"
      >
        <span>{{listItem[inputDropdownData.valueField]}}</span>
        <span v-if="inputDropdownData.info" v-html="typeof inputDropdownData.info == 'function' ? inputDropdownData.info(listItem) : listItem[inputDropdownData.info]"></span>
        <span v-if="inputDropdownData.infoSecundary" v-html="typeof inputDropdownData.infoSecundary == 'function' ? inputDropdownData.infoSecundary(listItem) : listItem[inputDropdownData.infoSecundary]"></span>
      </li>
      <li
        @click="goToSettings($event)"
        wagwoord-app-field="true"
        aria-label="open settings"
        wagwoord-data="open-settings"
        :tabindex="inputDropdownData.data ? inputDropdownData.data.length : 0"
      >
        <i class="icon-settings transparent right"></i>
        <i class="icon-key" />
        <span>Wagwoord</span>
      </li>
    </ul>
  </div>
</template>

<script>
import Vue from "vue";
// #region hendlers mixins
import passwordFormHanderMixins from "../handles/passwords/password-handler.js";
import creditCardFormHanderMixins from "../handles/passwords/creditcard-handler";
import addressFormHanderMixins from "../handles/passwords/address-handler";
// #endregion hendlers mixins

// #region helpers
import { getElmentApsolutePositionAndDimendtions } from "../handles/common/input-data";
import { getForms } from "../handles/common/form-detectors";
// #endregion helpers

export default {
  name: "wagwoordAppComponent",
  mixins: [passwordFormHanderMixins, creditCardFormHanderMixins, addressFormHanderMixins],
  data() {
    return {
      title: "update password",
      message: "gogi_46",
      inputDropdownData: {},
      dialogData: undefined,
      observer: undefined,
      forms: [],
      messageListenerEvent: new CustomEvent("messageListener", {
        bubbles: true
      })
    };
  },
  methods: {
    openDialog(model) {
      this.dialogData = model;
    },
    closeDialog() {
      if (this.dialog.element) this.dialog.element.open = false;
      this.dialogData = undefined;
    },
    dialogActionOnClick(event, button) {
      if (button.method)
        this[button.method](this.dialogData.model, button.clickData).then();
      this.closeDialog();
    },
    goToSettings(url) {
      // TODO: resolve tab not open corectly on windows open
      url = "options/options.html#/" + (url || "");
      url = chrome.runtime.getURL(url);
      window.open(url, "_blank").focus();
    },
    openDropdown(event, model) {
      if (model) {
        model.event = event;
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.inputDropdownData = model;
        Vue.set(this, "inputDropdownData", model);
      }
      let el = this.inputDropDown.element;
      const dimanzions = getElmentApsolutePositionAndDimendtions(event.target);
      document.documentElement.style.setProperty(
        "--wagwoord-dropdown-top",
        dimanzions.x + dimanzions.height + "px"
      );
      document.documentElement.style.setProperty(
        "--wagwoord-dropdown-left",
        dimanzions.y + "px"
      );
      document.documentElement.style.setProperty(
        "--wagwoord-dropdown-min-width",
        dimanzions.width - 5 + "px"
      );
      el.style.display = "block";
    },
    closeDropdown(event, callback) {
      this.inputDropdownData = {};
      if (this.inputDropDown.element)
        this.inputDropDown.element.style.display = "none";
    },
    onMessageListener(message) {
      if (message.detail == "error") {
        setTimeout(() => {
          this.openDialog({
            message: "error accured",
            actions: [{ value: "close", class: "error" }]
          });
          setTimeout(() => {
            this.closeDialog();
          }, 2000);
        }, 100);
      } else {
        this.openDialog({
          title: "OTOP: " + message.detail.issuer,
          message: message.detail.code,
          model: message.detail,
          actions: [
            {
              value: "copy",
              class: "info",
              clickData: message.detail.code,
              method: "copyToClipboard"
            },
            {
              value: "close",
              class: "error"
            }
          ]
        });
      }
    },
    copyToClipboard(model, data) {
      this.$util.clipboard(data);
      setTimeout(() => {
        this.openDialog({
          title: "value copied",
          actions: [{ value: "close", class: "error" }]
        });
        setTimeout(() => {
          this.closeDialog();
        }, 2000);
      }, 100);
    },
    setValueToElement(element, value, skipChangeIfSet) {
      if (!element || (skipChangeIfSet && element.value)) return;
      element.setAttribute("value", value);
      element.value = value;
      element.dispatchEvent(new Event("change", { bubbles: true }));
      element.dispatchEvent(new Event("blur", { bubbles: true }));
    },
    async onCreate() {
      this.forms = [...this.forms, ...getForms()];
      if(!this.$appData.blacklist || !this.$appData.blacklist.password)
        this.passwordFormsInit(this.$appData.submittedResponse);
        
      if(!this.$appData.blacklist || !this.$appData.blacklist.creditCard)
        await this.creditcardFormsInit(this.$appData.submittedResponse);
      
      if(!this.$appData.blacklist || !this.$appData.blacklist.address)
        await this.addressFormsInit(this.$appData.submittedResponse);
    }
  },
  computed: {
    dialog() {
      return {
        get element() {
          return document.getElementById("wagwoord-notification-dialog");
        }
      };
    },
    inputDropDown() {
      return {
        get element() {
          return document.getElementById("wagwoord-input-dropdown");
        }
      };
    },
    rootElement() {
      return document.getElementById("wagwoord-content-script-container");
    }
  },
  async created() {
    console.log(this.$appData);
    console.log(this.$chrome);
    await this.onCreate();
    setTimeout(() => {
      this.rootElement.addEventListener("messageListener", e => {
        this.onMessageListener(e);
      });
    }, 200);
    if (!this.observer) {
      this.observer = new MutationObserver((e, s) => {
        this.onCreate().then();
      });

      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
      });
    }
  }
};
</script>

<style lang="scss">
@import "../../style/app-defaults.scss";

:root {
  --wagwoord-dropdown-top: 0px;
  --wagwoord-dropdown-left: 0px;
  --wagwoord-dropdown-min-width: 24px;
}

@mixin popup-futter {
  padding: 0.5em 0rem;
  border-top: 1px solid;
  cursor: pointer;
  text-align: start;
  &:hover {
    background-color: var(--wagwoord-main-color-light);
  }
  button {
    padding: 0.2em;
  }
}

div#wagwoord-content-script-container {
  dialog#wagwoord-notification-dialog {
    position: fixed;
    margin: 0;
    right: 1rem;
    top: 1rem;
    min-width: 12rem;
    left: unset;
    z-index: 9999999999999999999;
    padding: 0.5rem 0.5rem 0rem 0.5rem;
    background-color: var(--wagwoord-main-color);
    color: var(--wagwoord-color);
    border: 1px solid var(--wagwoord-main-color-lighter);
    text-align: center;
    p {
      margin: 0;
      padding: 0 0 0.5rem 0;
    }
    div.actions {
      padding-bottom: 0.5em;
      input[type="button"] {
        margin: 0 0.2em;
        min-width: 40%;
      }
    }
    footer {
      @include popup-futter;
    }
  }
  ul#wagwoord-input-dropdown {
    position: absolute;
    cursor: pointer;
    padding: 0;
    text-decoration: none;
    list-style-type: none;
    margin: 0;
    display: none;
    z-index: 9999999;
    top: var(--wagwoord-dropdown-top);
    left: var(--wagwoord-dropdown-left);
    min-width: var(--wagwoord-dropdown-min-width);
    color: var(--wagwoord-color);
    background-color: var(--wagwoord-main-color-light);
    border: var(--wagwoord-main-color-lighter) 1px solid;
    li {
      padding: 5px;
      border-bottom: 1px solid var(--wagwoord-main-color-lighter);
      &.data {
        display: grid;
      }
      img {
        height: 1em;
      }
      &:hover, &:focus {
        font-display: inherit;
        background: var(--wagwoord-main-color);
      }
      &:last-child {
        @include popup-futter;
      }
      &.active {
        background: var(--wagwoord-main-color-lighter);
      }
    }
  }
}
</style>
