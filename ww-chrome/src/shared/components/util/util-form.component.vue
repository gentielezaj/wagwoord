<template>
  <form v-form id="util-form">
    <div class="form-item">
      <label for="util-form-domain">Server url</label>
      <div class="input-container">
        <input
          id="util-form-domain"
          type="url"
          list="seturla"
          v-form-field
          placeholder="Leave it blank to disable"
          name="domain"
          v-model="model.domain"
        />
        <button
          class="icon-cancel-alt-filled"
          id="clear-search"
          v-if="model.domain"
          @click="model.domain = ''"
        ></button>
        <span v-show="saving" class="loader"></span>
        <datalist id="seturla">
          <option value="http://localhost:4040/api"></option>
        </datalist>
      </div>
    </div>
    <div class="form-item">
      <label for="util-form-enctipyionKey">
        <span>Encription key</span>
        <span v-show="saving" class="loader right"></span>
      </label>
      <button
        @click="model.encryptionKey = ''"
        v-show="model.encryptionKey"
        type="button"
        class="icon-cancel-alt-filled right"
      ></button>
      <div class="input-container">
        <textarea
          id="util-form-enctipyionKey"
          :readonly="saving"
          v-form-field
          placeholder="Leave it blank to disable"
          name="encryptionKey"
          v-model="model.encryptionKey"
        ></textarea>
      </div>
    </div>
    <div class="form-item cbx">
      <input
        type="checkbox"
        v-model="model.encryptLocal"
        name="encryptLocal"
        class="cbx hidden"
        id="encryptLocalInput"
      />
      <span class="lbl" @click="model.encryptLocal = !model.encryptLocal"></span>
      <label for="encryptLocalInput" class>Encrypt local (TODO: this)</label>
      <span v-show="saving == 'encryptLocal'" class="loader"></span>
    </div>
    <div class="dialog-actions right">
      <input @click="save()" type="button" class="success dialog-action" value="Save" />
      <input @click="close(false)" type="button" class="error dialog-action" value="Cancel" />
    </div>
  </form>
</template>

<script>
import { formCoreComponentMixin } from "../common/core.component";
import { mapActions, mapGetters } from "vuex";

export default {
  mixins: [formCoreComponentMixin("auth")],
  computed: {
    baseModel() {
      return {
        encryptLocal: false
      };
    }
  },
  methods: {
    close() {
      this.$store.commit("dialog/close");
    },
    async coreSave(event) {
      if (event) event.preventDefault();
      this.saving = true;
      try {
        this.model = this.model || {};
        this.model.domain = this.model.domain || undefined;
        this.model.encryptionKey = this.model.encryptionKey || undefined;
        this.model.encryptLocal = this.model.encryptLocal || false;
        let result = await this.$store.dispatch("auth/login", this.model);
        if (result) {
          this.notifySuccess("saved data");
          this.reset();
        } else {
          this.notifyError("Connectin to server");
        }
        this.saving = false;
      } catch (error) {
        this.notifyError("Error while saving data", error);
        this.saving = false;
        throw error;
      }
    }
  },
  async created() {
    this.model = (await this.$store.getters["auth/loginData"]) || {
      encryptLocal: false
    };
    console.log(this.model);
  }
};
</script>