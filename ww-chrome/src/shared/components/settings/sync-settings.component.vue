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
        </datalist>
      </div>
    </div>
    <div class="form-item">
      <label for="settings-sync-headers settings-icon">
        <span>Domain headers</span>
        <span v-show="loader" class="loader right"></span>
        <button
          @click="model.headers = ''"
          v-show="model.headers"
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
          v-model="model.headers"
        ></textarea>
        <span v-show="loader.headers" class="loader"></span>
      </div>
    </div>
  </div>
</template>

<script>
import {coreComponent} from "../common/core-component";

const component = {
  name: "sync-settings",
  data() {
    return {
      model: {},
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
      if (!this.domainInput || !this.domainInput.validity.valid) return;
      this.loader = true;
      try {
        console.log("jerere");
        if (await this.$store.dispatch("proxy/save", this.model)) {
          this.notifySuccess("Sync data saved!");
        } else {
          this.notifyError("Sync data faild to save!");
        }
        this.loader = false;
      } catch (error) {
        this.loader = false;
        this.notifyError("Sync data faild to save!", error);
      }
    }
  },
  async created() {
    this.loader = true;
    this.model = (await this.$store.getters["proxy/model"]) || {};

    console.log(this.model);
    this.loader = false;
  }
};

export default coreComponent(component);
</script>