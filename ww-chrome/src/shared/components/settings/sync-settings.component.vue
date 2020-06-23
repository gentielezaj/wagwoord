<template>
  <div class="sync-settings">
    <div class="form-item">
      <label for="settings-sync-domain">Sync Domain</label>
      <div class="input-container">
        <input
          id="settings-sync-domain"
          type="url"
          list="seturla"
          v-form-field
          v-on:focusout="save()"
          placeholder="Leave it blank to disable"
          name="domain"
          v-model="model.domain"
        />
        <button
          class="icon-cancel-alt-filled"
          id="clear-search"
          v-if="model.domain"
          @click="model.domain = ''; save()"
        ></button>
        <span v-show="loader" class="loader"></span>
        <datalist id="seturla">
          <option value="http://localhost:4040/api"></option>
          <option value="https://wagwoord.herokuapp.com/api"></option>
          <option value="https://wagwoord-api.unubo.app/api"></option>
          <option value="https://app.wagwoord.heliohost.org/api"></option>
        </datalist>
      </div>
    </div>
    <div class="form-item">
      <label for="settings-sync-headers settings-icon">
        <span>Domain headers</span>
        <span v-show="loader" class="loader right"></span>
        <button
          @click="headers = ''; save()"
          v-show="headers"
          class="icon-cancel-alt-filled transparent right"
        ></button>
      </label>
      <div class="input-container">
        <textarea
          id="settings-sync-headers"
          v-form-field
          placeholder="Leave it blank to disable"
          name="headers"
          v-on:focusout="save()"
          v-model="headers"
        ></textarea>
        <span v-show="loader.headers" class="loader"></span>
      </div>
    </div>
  </div>
</template>

<script>
import { coreComponentMixin } from "../common/core.component";

export default {
  name: "sync-settings",
  mixins: [coreComponentMixin('app')],
  data() {
    return {
      model: {},
      headers: '',
      loader: false
    };
  },
  computed: {
    domainInput: function() {
      return document.getElementById("settings-sync-domain");
    }
  },
  methods: {
    async save() {
    }
  },
  async created() {
    this.loader = true;
    this.model = (await this.$store.getters["auth/loginData"]) || {};
    this.headers = this.model && this.model.headers ? JSON.stringify(this.model.headers) : '';
    this.headers += '\n' + 'encryptionHash: ' + this.model.hash;
    this.loader = false;
  }
};

</script>