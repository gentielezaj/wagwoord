<template>
  <div id="wagwoord-content-script-container" class="wagwoord-app">
    <dialog id="wagwoord-notification-dialog" open>
      <p class="title">{{title}}:</p>
      <p>
        <b>
          <i>{{message}}</i>
        </b>
      </p>
      <div class="actions">
        <input type="button" value="save" @click="save($event)" class="success" />
        <input type="button" value="reject" @click="reject($event)" class="error" />
      </div>
      <footer @click="goToSettings($event)" aria-label="open settings">
        <button class="icon-settings transparent right"></button>
        <i class="icon-key" />
        <span>Wagwoord</span>
      </footer>
    </dialog>
    <ul id="wagwoord-input-dropdown">
      <li
        v-for="listItem in inputDropdownData.data"
        v-bind:key="listItem.id"
        @click="onDropdownClick($event, listItem, inputDropdownData.event)"
      >{{listItem[inputDropdownData.valueField]}}</li>
      <li @click="goToSettings($event)" aria-label="open settings">
        <button class="icon-settings transparent right"></button>
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
// #endregion hendlers mixins

// #region helpers
import { getElmentApsolutePositionAndDimendtions } from "../handles/common/input-data";
// #endregion helpers

export default {
  name: "wagwoordAppComponent",
  mixins: [passwordFormHanderMixins],
  data() {
    return {
      title: "update password",
      message: "gogi_46",
      inputDropdownData: {},
      messageListenerEvent: new CustomEvent("messageListener", {
        bubbles: true
      })
    };
  },
  methods: {
    save(event) {
      console.log(event);
    },
    reject(event) {
      console.log(event);
    },
    action(event) {
      console.log(event);
    },
    goToSettings(event) {
      console.log("TODO: gotosettings dialog context script");
    },
    formOutSide(event) {
      console.log(event);
    },
    onDropdownClick(event, model, inputItemEvent) {
      console.log(model);
      console.log(inputItemEvent);
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
      el.style.top = dimanzions.x + dimanzions.height;
      el.style.left = dimanzions.y;
      el.style.minWidth = dimanzions.width - 5;
      el.style.display = "block";
    },
    closeDropdown(event) {
      this.inputDropdown = {};
      let el = this.inputDropDown.element;
      el.style.display = "none";
    },
    onMessageListener(message) {
      console.log("-------------------------message");
      console.log(message);
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
  created() {
    console.log(this.$appData);
    this.getPasswordForms();
    setTimeout(() => {
      this.rootElement.addEventListener("messageListener", e => {
        this.onMessageListener(e);
      });
    }, 200);
  }
};
</script>

<style lang="scss">
@import "../../style/app-defaults.scss";

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
    color: var(--wagwoord-color);
    background-color: var(--wagwoord-main-color-light);
    border: var(--wagwoord-main-color-lighter) 1px solid;
    li {
      padding: 5px;
      &:is(:hover, :focus) {
        font-display: inherit;
        background: var(--wagwoord-main-color);
      }
      &:last-child {
        @include popup-futter;
      }
    }
  }
}
</style>
