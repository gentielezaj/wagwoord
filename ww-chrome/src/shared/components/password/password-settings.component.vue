<template>
  <div class="password-settings">
    <form id="password-settings-form">
      <div class="form-item cbx right autosubmit">
        <input
          type="checkbox"
          v-model="model.autoSubmit"
          name="autoSubmit"
          class="cbx hidden"
          @change="save('autoSubmit')"
          id="autoSubmitInput"
        />
        <span class="lbl" @click="model.autoSubmit = !model.autoSubmit; save('autoSubmit')"></span>
        <label for="autoSubmitInput" class>Auto submit</label>
        <span v-show="saving == 'autoSubmit'" class="loader"></span>
      </div>

      <div class="form-item password-length">
        <label for="settings-passwordLength">Password length (max 64)</label>
        <div class="input-container">
          <input
            id="settings-passwordLength"
            pattern="^([4-9]|[1-5][0-9]|6[0-4])$"
            min="2"
            v-form-field
            placeholder="Defalut 20"
            name="passwordLength"
            @focusout="save('passwordLength')"
            v-model.number="model.passwordLength"
            type="number"
            max="64"
          />
          <span v-show="saving == 'passwordLength'" class="loader"></span>
        </div>
      </div>

      <div class="password-settings">
        <div class="form-item cbx right">
          <input
            type="checkbox"
            v-model="model.passworIncludeSymbolCharacters"
            name="passworIncludeSymbolCharacters"
            class="cbx hidden"
            @change="save('passworIncludeSymbolCharacters')"
            id="passworIncludeSymbolCharactersInput"
          />
          <span
            class="lbl"
            @click="model.passworIncludeSymbolCharacters = !model.passworIncludeSymbolCharacters; save('passworIncludeSymbolCharacters')"
          ></span>
          <label for="passworIncludeSymbolCharactersInput" class>inclide characters</label>
          <span v-show="saving == 'passworIncludeSymbolCharacters'" class="loader"></span>
        </div>

        <h2>Password Caracters</h2>

        <div class="form-item">
          <label for="settings-passwordSymbolCharacters">Charactes to include</label>
          <div class="input-container">
            <input
              @disabled="!model.passworIncludeSymbolCharacters"
              id="settings-passwordSymbolCharacters"
              placeholder="defaut simbols !@#$^&*_+~|?=-"
              name="passwordSymbolCharacters"
              @focusout="save('passwordSymbolCharacters')"
              v-model="model.passwordSymbolCharacters"
              type="text"
            />
            <span v-show="saving == 'passwordSymbolCharacters'" class="loader"></span>
            <button
              v-show="model.passwordSymbolCharacters"
              @click="model.passwordSymbolCharacters = '', save('passwordSymbolCharacters')"
              class="icon-cancel-alt-filled"
            ></button>
          </div>
        </div>
      </div>
    </form>

    <div @click="downloadPasswords()" class="form-item button">
      <button class="info loader">
        Download passwords
        <span v-show="saving == 'downloadPasswords'" class="loader"></span>
      </button>
    </div>
    <div @click="deletePasswords()" class="form-item button">
      <button class="error">Delete all Passwords</button>
    </div>
    <delete-dialog :options="dialogOptions"></delete-dialog>
    <article>
      <header>
        <h2>Import password</h2>
      </header>
      <div id="import-passwords-container" class="content import-passwords-container">
        <input
          type="file"
          name="file"
          @change="getFileData($event)"
          value="import json"
          class="hidden"
          accept=".json, .csv"
          id="settingsFileImport"
        />
        <div v-show="!file.name" class="drag-drop empty" @click="openFileImport($event)">
          <span class="empty">Click or drag and drop file here</span>
          <br />
          <span class="error">File is not valide</span>
        </div>
        <div v-show="file.name" class="drag-drop full">
          <span>{{file.name}}, {{file.data.length}} passwords found</span>
          <div>
            <button @click="savePasswords()" :disabled="file.saveDisable" class="success">save</button>
            <button @click="resetFile()" :disabled="file.resetDisable" class="error">reset</button>
          </div>
          <progress min="0" :max="file.data.length - 1" value="0" id="password-upload-progress"></progress>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
import {coreComponentMixin} from "../common/core.component";
import deleteDialog from "../common/delete-dialog.component";
import Vue from "vue";

export default {
  name: "password-settings-component",
  mixins: [coreComponentMixin('password')],
  components: {
    "delete-dialog": deleteDialog
  },
  params: {
    options: {
      loader: {
        required: false
      }
    }
  },
  data() {
    return {
      model: {
        autoSubmit: false,
        passworIncludeSymbolCharacters: false
      },
      saving: false,
      dialogOptions: {
        item: { id: "all" },
        message: "Delete all passwords",
        store: "password"
      },
      file: {
        name: false,
        data: [],
        get el() {
          return document.getElementById("settingsFileImport");
        }
      }
    };
  },
  computed: {},
  methods: {
    async save(property) {
      if (!document.getElementById("password-settings-form").checkValidity()) {
        this.notifyError("Invalide passowrd settings form");
        return;
      }
      this.saving = property;
      try {
        let result = await this.$store.dispatch(
          "password/settings",
          this.model
        );
        if (result) this.notifySuccess("Password settings saved");
        else this.notifyError("Error while saving password settings");
        this.saving = false;
      } catch (error) {
        this.notifyError("Error while saving password settings", error);
        this.saving = false;
        throw error;
      }
    },
    async downloadPasswords() {
      try {
        await this.$store.dispatch("password/export");
      } catch (error) {
        throw error;
      }
    },
    deletePasswords() {
      this.toggelDialog();
    },

    openFileImport(event) {
      this.file.el.click(event);
    },
    async getFileData(event) {
      if (!this.file.el.files || !this.file.el.files.length) {
        this.resetFile();
        this.notifyError("no file");
        return;
      }
      this.file.name = this.file.el.files[0].name;
      try {
        this.file.data = await this.$store.dispatch(
          "password/file",
          this.file.el.files[0]
        );
      } catch (error) {
        this.notifyError("Invalide file", error);
        this.resetFile();
      }
    },
    async savePasswords() {
      Vue.set(this.file, "saveDisable", true);
      Vue.set(this.file, "resetDisable", true);
      try {
        if (
          await this.$store.dispatch("password/import", {
            data: this.file.data,
            onSave: () => {
              const element = document.getElementById(
                "password-upload-progress"
              );
              if (!element) return;
              element.value = parseInt(element.value) + 1;
            }
          })
        )
          this.notifySuccess("Passwords imported");
        else this.notifyError("Error while importing");

        Vue.set(this.file, "resetDisable", false);
      } catch (error) {
        Vue.set(this.file, "resetDisable", false);
        this.notifyError("Error while importing", error);
      }
    },
    resetFile() {
      this.file.name = false;
      this.file.data = [];
      this.file.el.value = "";
      Vue.set(this.file, "saveDisable", false);
      Vue.set(this.file, 'resetDisable', false);
      document.getElementById("password-upload-progress").value = 0;
    },
    setUpDragnDrop() {
      let container = document.getElementById("import-passwords-container");
      ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
        container.addEventListener(
          eventName,
          e => {
            e.preventDefault();
            e.stopPropagation();
          },
          false
        );
      });

      ["dragenter", "dragover"].forEach(eventName => {
        container.addEventListener(
          eventName,
          () => container.classList.add("hover"),
          false
        );
      });

      ["dragleave", "drop"].forEach(eventName => {
        container.addEventListener(
          eventName,
          () => container.classList.remove("hover"),
          false
        );
      });

      container.addEventListener(
        "drop",
        e => {
          let files = e.dataTransfer.files;
          let fileInput = document.getElementById("settingsFileImport");
          fileInput.files = e.dataTransfer.files;
          fileInput.dispatchEvent(new Event("change"));
        },
        false
      );
    }
  },
  async created() {
    this.saving = true;
    this.model = await this.$store.getters["password/settings"];
    this.saving = false;
    this.setUpDragnDrop();
  }
};
</script>

<style lang="scss" scoped>
.form-item {
  &.password-length {
    width: 50%;
  }
  &.autosubmit {
    padding-top: 2rem;
  }
}
.password-settings > article {
  padding: 0;
}
</style>