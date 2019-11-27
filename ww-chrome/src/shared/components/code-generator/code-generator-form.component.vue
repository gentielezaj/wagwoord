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
          pattern="^[A-Za-z0-9_\-.@:]{1,64}$"
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
      <article v-searchable v-collapse="'.content'">
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
                placeholder="time, defult 6"
                min="6"
                max="10"
                v-model.number="model.digits"
                type="number"
              />
            </div>
          </div>
          <div class="form-item">
            <label for="code-generator-form-step">step</label>
            <div class="input-container">
              <input
                id="code-generator-form-step"
                name="step"
                placeholder="generated code leght, defult 30"
                v-model.number="model.step"
                type="number"
              />
            </div>
          </div>
          <div class="form-item">
            <label for="code-generator-form-encoding">encoding</label>
            <div class="input-container">
              <input
                id="code-generator-form-encoding"
                name="encoding"
                placeholder="defult ascii"
                maxlength="512"
                v-model="model.encoding"
                type="number"
              />
            </div>
          </div>
          <div class="form-item">
            <label for="code-generator-form-algorithm">algorithm</label>
            <div class="input-container">
              <input
                id="code-generator-form-algorithm"
                name="algorithm"
                placeholder="defult sha1"
                maxlength="512"
                v-model="model.algorithm"
                type="number"
              />
            </div>
          </div>
          <div class="form-item">
            <label for="code-generator-form-window">window</label>
            <div class="input-container">
              <input
                id="code-generator-form-window"
                name="window"
                placeholder="defult 0"
                v-model.number="model.window"
                type="number"
              />
            </div>
          </div>
          <div class="form-item">
            <label for="code-generator-form-epoch">epoch</label>
            <div class="input-container">
              <input
                id="code-generator-form-epoch"
                name="epoch"
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
        class="cbx hidden"
        id="code-generator-form-synced"
      />
      <span class="lbl" @click="model.synced = !model.synced"></span>
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
        @click="reset()"
        class="error"
      >Reset</button>
    </div>
  </form>
</template>

<script>
export default {
  name: "code-generator-form-component",
  props: {
    options: { required: false }
  },
  data() {
    return {
      model: {}
    };
  },
  methods: {
    reset() {
      this.model = {};
      if (this.options && typeof this.options.onSubmit == "function") {
        this.options.onSubmit();
      }
    },
    async save() {
      if (!document.getElementById("code-generator-form").checkValidity()) {
        event.preventDefault();
        this.notifyError("Invalide form");
        return;
      }
      event.preventDefault();
      this.saving = true;
      try {
        let result = await this.$store.dispatch(
          "codegenerator/save",
          this.model
        );
        if (result) this.notifySuccess("code generator saved");
        else this.notifyError("Error while saving code generator");
        this.saving = false;
        this.reset();
      } catch (error) {
        this.notifyError("Error while saving code generator", error);
        this.saving = false;
        throw error;
      }
    }
  },
  async created() {
    if (this.options.itemId) {
      this.model = await this.$store.getters["codegenerator/item"](
        this.options.itemId
      );
      console.log(this.model);
    }
  }
};
</script>