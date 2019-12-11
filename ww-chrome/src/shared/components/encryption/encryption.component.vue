<template>
  <div class="encryption-component" id="encryption-component">
    <div class="form-item cbx right">
      <input
        type="checkbox"
        name="encryptLocal"
        v-model="encryptLocal"
        class="cbx hidden"
        @change="save()"
        id="encyption-form-local"
      />
      <span class="lbl" v-span-label for="encyption-form-local"></span>
      <label for="encyption-form-local" class>encryptLocal</label>
    </div>
    <div class="form-item">
      <button @click="toggelDialog(true);">Manage EncryptonKey</button>
    </div>
    <dialog-component :options="dialogOptions"></dialog-component>
  </div>
</template>

<script>
import {coreComponentMixin} from "../common/core.component";
import dialog from "../common/dialog-component";
import form from "./encryption-form.component";

export default {
  name: "encryption-component",
  mixins: [coreComponentMixin('encryption')],
  components: {
    "dialog-component": dialog,
    "encryption-form-component": form
  },
  data() {
    return {
      savingencryptionKey: false,
      encryptLocal: false,
      dialogOptions: {
        id: "encryption-component-dialog",
        component: form
      }
    };
  },
  methods: {
    async save() {
      this.savingencryptionKey= true;
      let result = await this.$store.dispatch(
        "encryption/save",
        this.encryptLocal
      );

      if(result) this.notifySuccess('Save encrypt localy');
      else this.notifySuccess('Error while saved encrypt localy');
      this.savingencryptionKey = false;
    }
  },
  async created() {
    this.encryptLocal = await this.$store.getters['encryption/encryptLocal'] || false;
  }
};
</script>