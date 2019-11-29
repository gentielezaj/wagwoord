<template>
  <form v-form id="passwordForm" name="passwordForm" novalidate>
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
          required
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
        class="cbx hidden"
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
import {coreComponent} from "../common/core-component";
import Vue from 'vue';

const component = {
  name: "password-form",
  props: {
    options: { required: false }
  },
  data() {
    return {
      model: {
        synced: true
      },
      passwordInput: {
        get el() {
          return document.getElementById("password-form-password");
        },
        buttonClass: "icon-eye",
        type: "password"
      },
      saving: false
    };
  },
  computed: {},
  methods: {
    async save(event) {
      if (!document.getElementById("passwordForm").checkValidity()) {
        this.notifyError("Invalide form");
        return;
      }
      event.preventDefault();
      this.saving = true;
      try {
        let result = await this.$store.dispatch("password/save", this.model);
        if (result) this.notifySuccess("Password saved");
        else this.notifyError("Error while saving password");
        this.saving = false;
        this.reset();
      } catch (error) {
        this.notifyError("Error while saving password", error);
        this.saving = false;
        throw error;
      }
    },
    async generatePassword() {
      const gp = await this.$store.dispatch('password/generate');
      console.log(gp);
      Vue.set(this.model, 'password', gp);
    },
    reset() {
      this.model = { synced: true };
      if (this.options && typeof this.options.onSubmit == "function") {
        this.options.onSubmit();
      }
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
  },
  async created() {
    if(this.options.itemId) {
      this.model = await this.$store.getters['password/item'](this.options.itemId);
      console.log(this.model);
    }
  }
};

export default coreComponent(component);
</script>

<style lang="scss" scoped>
</style>