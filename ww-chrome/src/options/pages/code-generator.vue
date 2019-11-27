<template>
  <div>
    <section-header v-bind:options="header"></section-header>
    <main class="section-content">
      this is code generator page
      {{code}}
    </main>
    <dialog-component :options="dialogOptions"></dialog-component>
  </div>
</template>

<script>
import authenticator from "otplib/authenticator";
import crypto from "crypto";

// #region components
import core from "../../shared/components/common/core-component";
import sctionHeader from "../../shared/components/common/section-header";

import form from '../../shared/components/code-generator/code-generator-form.component';
import dialogComponent from "../../shared/components/common/dialog-component";
// #endregion components

let component = {
  name: "code-generator-page",
  components: {
    "section-header": sctionHeader,
    "dialog-component": dialogComponent,
  },
  data() {
    return {
      header: {
        title: "Time-based One-time Password",
        buttons: [
          {
            name: "add",
            title: "add",
            click: this.toggelDialog
          },
          {
            name: "sync",
            title: "Sync",
            click: this.update,
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
      dialogOptions: {
        id: "code-generator-form-component-dialog",
        component: form,
        componentOptions: {}
      },
      secret: "2UIRU4MQHG4TBPSJLKRWSQW643LMNHQQ"
    };
  },
  methods: {
    async update() {

    }
  },
  computed: {
    code() {
      return authenticator.generate(this.secret);
    }
  },
  created() {
    authenticator.options = { crypto };
  }
};
export default core(component, 'codegenerator');
</script>