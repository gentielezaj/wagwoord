<template>
  <form v-form id="password-form" name="password-form" novalidate>
    <div class="form-item">
      <label for="password-form-id">id</label>
      <div class="input-container">
        <input readonly name="id" v-model="model.id" id="password-form-id" type="text" />
      </div>
    </div>
    <div class="form-item">
      <label for="password-form-name">name</label>
      <div class="input-container">
        <input
          id="password-form-name"
          maxlength="64"
          minlength="2"
          pattern="^[A-Za-z0-9_\-.@:]{1,64}$"
          name="name"
          v-form-field
          v-model="model.name"
          type="text"
        />
      </div>
    </div>
    <div class="form-item">
      <label for="password-form-domain">domain</label>
      <div class="input-container">
        <input id="password-form-domain"  name="domain" v-model="model.domain" type="text" required />
      </div>
    </div>
    <div class="form-item">
      <label for="password-form-username">username</label>
      <div class="input-container">
        <input id="password-form-username" required name="username" v-model="model.username" type="text" />
      </div>
    </div>
    <div class="form-item">
      <label for="password-form-password">password</label>
      <div class="input-container">
        <input
          id="password-form-password"
          name="password"
          v-form-field
          v-model="model.password"
          :type="passwordInput.type"
          required
        />
        <button type="button" :class="passwordInput.buttonClass" @click="showPassword()"></button>
      </div>
      <div class="hint">
        <a id="password-form-password-generate" @click="generatePassword()" class="right">Generate</a>
        <span
          id="password-form-password-hint"
        >Lenght: {{model.password ? model.password.length : 0}}</span>
      </div>
    </div>
    <div class="form-item">
      <label for="password-form-wait-time">wait time (ms)</label>
      <div class="input-container">
        <input id="password-form-wait-time" name="waitTime" v-model="model.waitTime" type="number" />
      </div>
    </div>
    <div class="form-item cbx">
      <input
        type="checkbox"
        v-model="model.synced"
        name="synced"
        class="cbx main hidden"
        id="password-form-synced"
      />
      <span class="lbl" @click="model.synced = !model.synced"></span>
      <label for="password-form-synced" class>Sync</label>
    </div>
    <div class="form-actions right">
      <button
        type="submit"
        :disabled="saving"
        id="password-form-save"
        class="success loader"
        @click="save($event)"
      >
        <span>Save</span>
        <span v-show="saving" class="loader"></span>
      </button>
      <button
        type="button"
        id="password-form-reset"
        :disabled="saving"
        @click="reset()"
        class="error"
      >Reset</button>
    </div>
  </form>
</template>

<script>
import { formCoreComponentMixin } from "../common/core.component";
import Vue from 'vue';

export default {
  mixins: [formCoreComponentMixin('password')],
  data() {
    return {
      passwordInput: {
        get el() {
          return document.getElementById("password-form-password");
        },
        buttonClass: "icon-eye",
        type: "password"
      }
    };
  },
  methods: {
    async generatePassword() {
      const gp = await this.$store.dispatch('password/generate');
      Vue.set(this.model, 'password', gp);
    },
    showPassword() {
      if (this.passwordInput.type == "password") {
        this.passwordInput.type = "text";
        this.passwordInput.buttonClass = "icon-eye-close";
      } else {
        this.passwordInput.type = "password";
        this.passwordInput.buttonClass = "icon-eye";
      }
    }
  }
};

</script>