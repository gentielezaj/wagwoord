<template>
  <form v-form id="code-generator-form" name="code-generator-form" novalidate>
    <div class="form-item">
      <label for="code-generator-form-id">id</label>
      <div class="input-container">
        <input
          readonly
          name="id"
          v-model.number="model.id"
          id="code-generator-form-id"
          type="number"
        />
      </div>
    </div>
    <div class="form-item">
      <label for="code-generator-form-issuer">issuer</label>
      <div class="input-container">
        <input
          id="code-generator-form-issuer"
          maxlength="64"
          minlength="2"
          pattern="^[A-Za-z0-9_\-.@: ]{1,64}$"
          name="issuer"
          required
          v-form-field
          v-model="model.issuer"
          type="text"
        />
      </div>
    </div>
    <div class="form-item">
      <label for="code-generator-form-username">username</label>
      <div class="input-container">
        <input
          id="code-generator-form-username"
          required
          v-form-field
          name="username"
          v-model="model.username"
          type="text"
        />
      </div>
    </div>
    <div class="form-item">
      <label for="code-generator-form-secret">secret</label>
      <div class="input-container">
        <input
          id="code-generator-form-secret"
          name="secret"
          v-form-field
          autocomplete="off"
          v-model="model.secret"
          type="text"
          required
        />
      </div>
    </div>
    <div class="form-item">
      <label for="code-generator-form-icon">icon</label>
      <div class="input-container">
        <input id="code-generator-form-icon" name="icon" v-model="model.icon" type="text" />
      </div>
    </div>
    <div class="form-item">
      <article v-collapse="'.content'" class="xl">
        <header>
          <h3>Advance</h3>
        </header>
        <div class="content hidden">
          <div class="form-item">
            <label for="code-generator-form-digits">digits</label>
            <div class="input-container">
              <input
                id="code-generator-form-digits"
                name="digits"
                placeholder="generated code leght, defult 6"
                min="6"
                v-form-field
                max="10"
                v-model.number="model.digits"
                type="number"
                required
              />
            </div>
          </div>
          <div class="form-item">
            <label for="code-generator-form-step">step</label>
            <div class="input-container">
              <input
                id="code-generator-form-step"
                name="step"
                v-form-field
                placeholder="time, defult 30"
                v-model.number="model.step"
                type="number"
                required
              />
            </div>
          </div>
          <div class="form-item">
            <label for="code-generator-form-encoding">encoding</label>
            <div class="input-container">
              <select
                id="code-generator-form-encoding"
                name="encoding"
                placeholder="defult hex"
                v-form-field
                v-model="model.encoding"
                required
              >
                <option
                  v-for="encodingType in encodingTypes"
                  :key="encodingType"
                  :value="encodingType"
                >{{encodingType.toUpperCase()}}</option>
              </select>
            </div>
          </div>
          <div class="form-item">
            <label for="code-generator-form-algorithm">algorithm</label>
            <div class="input-container">              
              <select
                id="code-generator-form-algorithm"
                name="algorithm"
                placeholder="defult sha1"
                v-form-field
                v-model="model.algorithm"
                required
              >
                <option
                  v-for="algorithmType in algorithmTypes"
                  :key="algorithmType"
                  :value="algorithmType"
                >{{algorithmType.toUpperCase()}}</option>
              </select>
            </div>
          </div>
          <div class="form-item">
            <label for="code-generator-form-window">window</label>
            <div class="input-container">
              <input
                id="code-generator-form-window"
                name="window"
                placeholder="defult 0"
                v-form-field
                v-model.number="model.window"
                type="number"
                required
              />
            </div>
          </div>
          <div class="form-item">
            <label for="code-generator-form-epoch">epoch</label>
            <div class="input-container">
              <input
                id="code-generator-form-epoch"
                name="epoch"
                v-form-field
                v-model.number="model.epoch"
                type="number"
              />
            </div>
          </div>
        </div>
      </article>
    </div>
    <div class="form-item cbx">
      <input
        type="checkbox"
        v-model="model.synced"
        name="synced"
        class="cbx main hidden"
        id="code-generator-form-synced"
      />
      <span class="lbl" @click="changeModelProperty('synced', !model.synced)"></span>
      <label for="code-generator-form-synced" class>Sync</label>
    </div>
    <div class="form-actions right">
      <button
        type="submit"
        :disabled="saving"
        id="code-generator-form-save"
        class="success loader"
        @click="save($event)"
      >
        <span>Save</span>
        <span v-show="saving" class="loader"></span>
      </button>
      <button
        type="button"
        id="code-generator-form-reset"
        :disabled="saving"
        @click="reset($event)"
        class="error"
      >Reset</button>
    </div>
  </form>
</template>

<script>
import { formCoreComponentMixin } from "../common/core.component";

export default {
  mixins: [formCoreComponentMixin("codegenerator", "code-generator-form")],
  methods: {
    async save(event) {
      if (event) event.preventDefault();
      if (!this.checkFormVaidity()) return;

      await this.coreSave(event);
    }
  },
  computed: {
    encodingTypes() {
      return ["hex", "ascii", "utf8", "base64", "latin1"];
    },
    algorithmTypes() {
      return ["sha1", "sha256", "sha512"];
    }
  },
  async created() {
    await this.onCreate();
    this.model = await this.$store.getters[this.storeName + "/assingeDefaults"](
      this.model,
      true
    );
  }
};
</script>