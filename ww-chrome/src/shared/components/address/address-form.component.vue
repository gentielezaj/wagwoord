<template>
  <form v-form id="address-form" name="address-form" novalidate>
    <div class="form-item">
      <label for="address-form-id">id</label>
      <div class="input-container">
        <input readonly name="id" v-model.number="model.id" id="address-form-id" type="number" />
      </div>
    </div>
    <div class="form-item-group">
      <div class="form-item">
        <label for="address-form-firstName">firstName</label>
        <div class="input-container">
          <input
            id="address-form-firstName"
            maxlength="64"
            minlength="2"
            pattern="^[A-Za-z]+$"
            name="firstName"
            required
            v-form-field
            v-model="model.firstName"
            type="text"
          />
        </div>
      </div>
      <div class="form-item">
        <label for="address-form-lastName">lastName</label>
        <div class="input-container">
          <input
            id="address-form-lastName"
            maxlength="64"
            minlength="2"
            pattern="^[A-Za-z]+$"
            name="lastName"
            required
            v-form-field
            v-model="model.lastName"
            type="text"
          />
        </div>
      </div>
    </div>
    <div class="form-item">
      <label for="address-form-birthDay">birthDay</label>
      <div class="input-container">
        <input
          id="address-form-birthDay"
          required
          v-form-field
          name="birthDay"
          v-model="model.birthDate"
          type="date"
        />
      </div>
    </div>
    <div class="form-item">
      <label for="address-form-username">username</label>
      <div class="input-container">
        <input
          id="address-form-username"
          name="username"
          v-form-field
          autocomplete="off"
          v-model="model.username"
          type="text"
          required
        />
      </div>
    </div>
    <div class="form-item-group">
      <div class="form-item phone">
        <label for="address-form-phone">code</label>
        <div class="input-container">
          <span>+</span>
          <select
            id="address-form-phone-callingCode"
            name="phone"
            v-form-field
            autocomplete="off"
            v-model="model.callingCode"
            required
          >
            <option
              v-for="code in callingCodes"
              :key="code.callingCode"
              :value="code.callingCode"
            >{{code.callingCode}}</option>
          </select>
        </div>
      </div>
      <div class="form-item">
        <label for="address-form-phone">phone</label>
        <div class="input-container">
          <input
            id="address-form-phone"
            name="phone"
            v-form-field
            list="address-form-phone-datalist"
            autocomplete="off"
            v-model="model.phone"
            type="tel"
            required
          />
        </div>
      </div>
    </div>
    <div class="form-item">
      <label for="address-form-organization">organization</label>
      <div class="input-container">
        <input
          id="address-form-organization"
          name="organization"
          v-form-field
          autocomplete="off"
          v-model="model.organization"
          type="text"
        />
      </div>
    </div>
    <div class="form-item">
      <label for="address-form-street">street</label>
      <div class="input-container">
        <input
          id="address-form-street"
          name="street"
          v-form-field
          autocomplete="off"
          v-model="model.street"
          type="text"
          required
        />
      </div>
    </div>
    <div class="form-item">
      <label for="address-form-secundStreet">secundStreet</label>
      <div class="input-container">
        <input
          id="address-form-secundStreet"
          name="secundStreet"
          v-form-field
          autocomplete="off"
          v-model="model.secundStreet"
          type="text"
        />
      </div>
    </div>
    <div class="form-item">
      <label for="address-form-city">city</label>
      <div class="input-container">
        <input
          id="address-form-city"
          name="city"
          v-form-field
          autocomplete="off"
          v-model="model.city"
          type="text"
          required
        />
      </div>
    </div>
    <div class="form-item">
      <label for="address-form-state">state</label>
      <div class="input-container">
        <input
          id="address-form-state"
          name="state"
          v-form-field
          autocomplete="off"
          v-model="model.state"
          type="text"
        />
      </div>
    </div>
    <div class="form-item">
      <label for="address-form-country">country</label>
      <div class="input-container">
        <select
          id="address-form-country"
          name="country"
          v-form-field
          autocomplete="off"
          v-model="model.country"
          required
        >
          <option
            v-for="country in countries"
            :key="country.alfa2Code"
            :value="country.name"
          >{{country.name}}</option>
        </select>
      </div>
    </div>
    <div class="form-item">
      <label for="address-form-postalCode">postalCode</label>
      <div class="input-container">
        <input
          id="address-form-postalCode"
          name="postalCode"
          v-form-field
          autocomplete="off"
          v-model="model.postalCode"
          type="text"
          required
        />
      </div>
    </div>
    <div class="form-item cbx">
      <input
        type="checkbox"
        v-model="model.synced"
        name="synced"
        class="cbx main hidden"
        id="address-form-synced"
      />
      <span class="lbl" @click="changeModelProperty('synced', !model.synced)"></span>
      <label for="address-form-synced" class>Sync</label>
    </div>
    <div class="form-actions right">
      <button
        type="submit"
        :disabled="saving"
        id="address-form-save"
        class="success loader"
        @click="save($event)"
      >
        <span>Save</span>
        <span v-show="saving" class="loader"></span>
      </button>
      <button
        type="button"
        id="address-form-reset"
        :disabled="saving"
        @click="reset()"
        class="error"
      >Reset</button>
    </div>
  </form>
</template>

<script>
import { formCoreComponentMixin } from "../common/core.component";
import { copy } from "../../services/core/helper.service";

export default {
  mixins: [formCoreComponentMixin("address")],
  methods: {
    async save(event) {
      if (event) event.preventDefault();
      if (!this.checkFormVaidity()) return;
      if(this.model.country) {
        const selectedCountiry = this.countries.find(c => c.name == this.model.country);
        this.model.region = selectedCountiry.region;
        this.model.subregion = selectedCountiry.subregion;
        this.model.countryAlpha2Code = selectedCountiry.alpha2Code;
        this.model.countryAlpha3Code = selectedCountiry.alpha3Code;
      } else {
        this.model.region = undefined;
        this.model.subregion = undefined;
        this.model.countryAlpha2Code = undefined;
        this.model.countryAlpha3Code = undefined;
      }
      await this.coreSave(event);
    },
    async onCreate() {
      if (this.options.itemId) {
        this.model = await this.$store.getters[this.storeName + "/item"](
          this.options.itemId
        );
      } else {
        this.model = copy(this.baseModel);
      }
    }
  },
  computed: {
    callingCodes() {
      return this.$store.getters["address/callingCodes"];
    },
    countries() {
      return this.$store.getters["address/countries"];
    }
  }
};
</script>

<style lang="scss" scoped>
.form-item.phone {
  width: 6rem;
  .input-container {
    & span {
      font-size: 1rem;
      padding: 0.2rem 0 0.2rem 0.2rem;
    }

    select {
      padding-left: 0;
    }
  }
}
</style>