<template>
  <form v-form id="blacklistForm" name="blacklistForm" novalidate>
    <div class="form-item">
      <label for="blacklist-form-id">id</label>
      <div class="input-container">
        <input readonly name="id" v-model="model.id" id="blacklist-form-id" type="text" />
      </div>
    </div>
    <div class="form-item">
      <label for="blacklist-form-name">name</label>
      <div class="input-container">
        <input
          id="blacklist-form-name"
          maxlength="64"
          minlength="2"
          name="name"
          required
          v-form-field
          v-model="model.name"
          type="text"
        />
      </div>
    </div>
    <div class="form-item">
      <div class="item-actions flex">
        <div class="form-item cbx">
          <input
            type="checkbox"
            v-model="model.password"
            name="password"
            class="cbx hidden"
            id="blacklist-form-password"
          />
          <span class="lbl" @click="model.password = !model.password"></span>
          <label for="blacklist-form-password" class>Password</label>
        </div>
        <div class="form-item cbx">
          <input
            type="checkbox"
            v-model="model.address"
            name="address"
            class="cbx hidden"
            id="blacklist-form-address"
          />
          <span class="lbl" @click="model.address = !model.address"></span>
          <label for="blacklist-form-address" class>Address</label>
        </div>
        <div class="form-item cbx">
          <input
            type="checkbox"
            v-model="model.creditCard"
            name="creditCard"
            class="cbx hidden"
            id="blacklist-form-creditCard"
          />
          <span class="lbl" @click="model.creditCard = !model.creditCard"></span>
          <label for="blacklist-form-creditCard" class>Credit card</label>
        </div>
        <div class="form-item cbx">
          <input
            type="checkbox"
            v-model="model.codeGenerator"
            name="codeGenerator"
            class="cbx hidden"
            id="blacklist-form-codeGenerator"
          />
          <span class="lbl" @click="model.codeGenerator = !model.codeGenerator"></span>
          <label for="blacklist-form-codeGenerator" class>Code generator</label>
        </div>
      </div>
    </div>
    <div class="form-actions right">
      <button
        type="submit"
        :disabled="saving"
        id="blacklist-form-save"
        class="success loader"
        @click="save($event)"
      >
        <span>Save</span>
        <span v-show="saving" class="loader"></span>
      </button>
      <button id="blacklist-form-reset" type="button" @click="reset($event)" class="error">Reset</button>
    </div>
  </form>
</template>

<script>
import core from "../common/core-component";

const component = {
  name: "password-form",
  props: {
    options: { required: false }
  },
  data() {
    return {
      model: {
          name:'',
        synced: true,
        password: true,
        address: true,
        codeGenerator: true,
        creditCard: true
      },
      saving: false
    };
  },
  computed: {},
  methods: {
    async save(event) {
      if (!document.getElementById("blacklistForm").checkValidity()) {
        event.preventDefault();
        this.notifyError("Invalide form");
        return;
      }
      event.preventDefault();
      this.saving = true;
      try {
        let result = await this.$store.dispatch("blacklist/save", this.model);
        if (result) this.notifySuccess("Blacklist saved");
        else this.notifyError("Error while saving blacklist");
        this.saving = false;
        this.reset();
      } catch (error) {
        this.notifyError("Error while saving blacklist", error);
        this.saving = false;
        throw error;
      }
    },
    reset() {
      this.model = {
        synced: true,
        password: true,
        address: true,
        codeGenerator: true,
        creditCard: true
      };
      if (this.options && typeof this.options.onSubmit == "function") {
        this.options.onSubmit();
      }
    }
  },
  async created() {
    if (this.options.itemId) {
      this.model = await this.$store.getters["blacklist/item"](
        this.options.itemId
      );
    }
  }
};

export default core(component);
</script>

<style lang="scss" scoped>
</style>