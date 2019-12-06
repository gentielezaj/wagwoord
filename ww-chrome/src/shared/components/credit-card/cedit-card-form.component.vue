<template>
  <form v-form id="credit-card-form" name="credit-card-form" novalidate>
    <div class="form-item">
      <label for="credit-card-form-id">id</label>
      <div class="input-container">
        <input readonly name="id" v-model.number="model.id" id="credit-card-form-id" type="number" />
      </div>
    </div>
    <div class="form-item">
      <label for="credit-card-form-name">name</label>
      <div class="input-container">
        <input
          id="credit-card-form-name"
          maxlength="254"
          minlength="4"
          pattern="^[A-Za-z -]{4,254}$"
          name="name"
          required
          v-form-field
          v-model="model.name"
          type="text"
        />
      </div>
    </div>
    <div class="form-item">
      <label for="credit-card-form-cardNumber">cardNumber</label>
      <div class="input-container">
        <input
          id="credit-card-form-cardNumber"
          required
          v-form-field
          maxlength="19"
          minlength="19"
          pattern="^[0-9]{19}"
          name="cardNumber"
          v-model="model.cardNumber"
          type="number"
        />
      </div>
      <div class="hint">
        <span
          id="credit-card-form-cardNumber-hint"
        >Lenght: {{model.cardNumber ? model.cardNumber.length : 0}}/19</span>
      </div>
    </div>
    <div class="form-item">
      <label for="credit-card-form-expiredMonth">expiredMonth</label>
      <div class="input-container">
        <input
          id="credit-card-form-expiredMonth"
          name="expiredMonth"
          v-form-field
          min="1"
          max="12"
          autocomplete="off"
          v-model.number="model.expiredMonth"
          type="number"
          required
        />
      </div>
    </div>
    <div class="form-item">
      <label for="credit-card-form-expiredYear">expiredYear</label>
      <div class="input-container">
        <input
          id="credit-card-form-expiredYear"
          name="expiredYear"
          v-form-field
          minlength="4"
          maxlength="4"
          min="2020"
          autocomplete="off"
          v-model.number="model.expiredYear"
          type="number"
          required
        />
      </div>
    </div>
    <div class="form-item">
      <label for="credit-card-form-cvv">cvv</label>
      <div class="input-container">
        <input
          id="credit-card-form-cvv"
          name="cvv"
          v-form-field
          autocomplete="off"
          pattern="^[0-9]{3,4}$"
          v-model="model.cvv"
          type="text"
          required
        />
      </div>
    </div>
    <div class="form-item">
      <label for="credit-card-form-pin">pin</label>
      <div class="input-container">
        <input
          id="credit-card-form-pin"
          name="pin"
          pattern="^[0-9]{4}$"
          v-form-field
          autocomplete="off"
          v-model="model.pin"
          type="number"
        />
      </div>
    </div>
    <div class="form-item">
      <label for="credit-card-form-bank">bank</label>
      <div class="input-container">
        <input
          id="credit-card-form-bank"
          name="bank"
          v-form-field
          maxlength="128"
          autocomplete="off"
          v-model="model.bank"
          type="number"
        />
      </div>
    </div>
    <div class="form-item cbx">
      <input
        type="checkbox"
        v-model="model.synced"
        name="synced"
        class="cbx hidden"
        id="credit-card-form-synced"
      />
      <span class="lbl" @click="changeModelProperty('synced', !model.synced)"></span>
      <label for="credit-card-form-synced" class>Sync</label>
    </div>
    <div class="form-item cbx">
      <input
        type="checkbox"
        v-model="model.nfc"
        name="nfc"
        class="cbx hidden"
        id="credit-card-form-nfc"
      />
      <span class="lbl" @click="changeModelProperty('nfc', !model.nfc)"></span>
      <label for="credit-card-form-nfc" class>Is nfc enable</label>
    </div>
    <div class="form-actions right">
      <button
        type="submit"
        :disabled="saving"
        id="credit-card-form-save"
        class="success loader"
        @click="save($event)"
      >
        <span>Save</span>
        <span v-show="saving" class="loader"></span>
      </button>
      <button
        type="button"
        id="credit-card-form-reset"
        :disabled="saving"
        @click="reset()"
        class="error"
      >Reset</button>
    </div>
  </form>
</template>

<script>
import Vue from "vue";
import { coreComponent } from "../common/core-component";

let component = {
  name: "credit-card-form-component",
  props: {
    options: { required: false }
  },
  data() {
    return {
      model: {
        synced: true,
        nfc: true
      },
      saving: false
    };
  },
  methods: {
    reset() {
      this.model = {
        synced: true
      };
      if (this.options && typeof this.options.onSubmit == "function") {
        this.options.onSubmit();
      }
    },
    changeModelProperty(property, value) {
      console.log("change propery");
      Vue.set(this.model, property, value);
    },
    async save() {
      if (!document.getElementById("credit-card-form").checkValidity()) {
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

export default coreComponent(component, "codegenerator");
</script>