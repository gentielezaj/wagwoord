<template>
  <form>
    <div class="form-item">
      <label for="settings-enctipyion-key">
        <span>Encription key</span>
        <span v-show="savingencryptionKey" class="loader right"></span>
      </label>
      <button
        @click="encryptionKey = ''"
        v-show="encryptionKey"
        class="icon-cancel-alt-filled right"
      ></button>
      <div class="input-container">
        <textarea
          id="settings-enctipyion-key"
          :readonly="savingencryptionKey"
          v-form-field
          placeholder="Leave it blank to disable"
          name="encryptionKey"
          v-model="encryptionKey"
        ></textarea>
      </div>
    </div>
    <div class="dialog-actions">
      <input
        @click="save('encryptionKey')"
        type="button"
        class="success dialog-action"
        value="Save"
      />
      <input @click="cancel(false)" type="button" class="error dialog-action" value="Cancel" />
    </div>
  </form>
</template>

<script>
import core from "../common/core-component";

let component = {
  name: "encryption-form-component",
  props: {
    options: { required: false }
  },
  data() {
    return {
      savingencryptionKey: false,
      encryptionKey: ""
    };
  },
  methods: {
    cancel() {
      if (this.options && typeof this.options.onSubmit == "function") {
        this.options.onSubmit();
      }
      this.reset();
    },
    async save() {
      this.savingencryptionKey = true;
      let result = await this.$store.dispatch(
        "encryption/save",
        this.encryptionKey
      );
      this.cancel();
    },
    reset() {
      this.savingencryptionKey = false;
      this.encryptionKey = "";
    }
  },
  async created() {
    this.encryptionKey = await this.$store.getters["encryption/encryptionKey"];
  }
};

export default core(component);
</script>