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
            tabindex="1"
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
            tabindex="2"
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
      <label for="address-form-birthDate-day">birthDay</label>
      <div class="input-container">
        <input
          tabindex="3"
          id="address-form-birthDate-day"
          required
          v-form-field
          placeholder="day"
          min="1"
          :max="maxDay"
          name="birthDateDey"
          v-model.number="birthDateDay"
          type="number"
        />
        <span>/</span>
        <input
          tabindex="4"
          id="address-form-birthDate-month"
          required
          v-form-field
          placeholder="month"
          name="birthDateMonth"
          min="1"
          max="12"
          v-model.number="birthDateMonth"
          type="number"
        />
        <span>/</span>
        <input
          tabindex="5"
          id="address-form-birthDate-year"
          required
          v-form-field
          min="1970"
          :max="new Date().getFullYear()"
          placeholder="year"
          name="birthDateYear"
          v-model.number="birthDateYear"
          type="number"
        />
      </div>
    </div>
    <div class="form-item">
      <label for="address-form-username">username</label>
      <div class="input-container">
        <input
          tabindex="6"
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
        <label for="address-form-callingCode">code</label>
        <div class="input-container">
          <span>+</span>
          <select
            tabindex="7"
            id="address-form-callingCode"
            name="callingCode"
            v-form-field
            autocomplete="off"
            v-model="model.callingCode"
            @change="changeValue($event, 'country')"
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
            tabindex="8"
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
          tabindex="9"
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
          tabindex="10"
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
          tabindex="11"
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
          tabindex="12"
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
          tabindex="13"
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
          tabindex="14"
          id="address-form-country"
          name="country"
          v-form-field
          autocomplete="off"
          v-model="model.country"
            @change="changeValue($event, 'callingCode')"
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
          tabindex="15"
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
        tabindex="16"
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
import { mapGetters } from "vuex";

export default {
  mixins: [formCoreComponentMixin("address")],
  data() {
    return {
      birthDateDay: undefined,
      birthDateMonth: undefined,
      birthDateYear: undefined
    };
  },
  methods: {
    async save(event) {
      if (event) event.preventDefault();
      if (!this.checkFormVaidity()) return;
      if (this.model.country) {
        const selectedCountiry = this.countries.find(
          c => c.name == this.model.country
        );
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

      this.model.birthDate = this.getDate();
      console.log(this.model);
      await this.coreSave(event);
    },
    getDate() {
      let day = this.birthDateDay > 9 ? this.birthDateDay + '' : '0' + this.birthDateDay;
      let month = this.birthDateMonth > 9 ? this.birthDateMonth + '' : '0' + this.birthDateMonth;
      const val = `${this.birthDateYear}-${month}-${day}T00:00:00.000Z`;
      console.log(val);
      return new Date(val);
    },
    changeValue($event, property) {
      // FIXME: not working with new forms
      // if(document.getElementById('address-form-' + property).getAttribute('touched')) return;
      // let value = this.callingCodes.find(c => c[$event.target.name] == $event.target.value)[property];
      // Vue.set(this.model, property, value);
    },
    async onCreate() {
      if (this.options.itemId) {
        this.model = await this.$store.getters[this.storeName + "/item"](
          this.options.itemId
        );

        if(typeof this.model.birthDate != 'object') {
          this.model.birthDate = new Date(this.model.birthDate);
        }

        this.birthDateDay = this.model.birthDate.getDate();
        this.birthDateMonth = this.model.birthDate.getMonth() + 1;
        this.birthDateYear = this.model.birthDate.getFullYear();
      } else {
        this.model = this.$util.copy(this.baseModel);
        if (this.userLocation) {
          this.model.city = this.userLocation.city;
          this.model.country = this.userLocation.countryName;
          // this.model.state = this.userLocation.state || this.userLocation.country;
          this.model.callingCode = this.userLocation.callingCodes.length
            ? this.userLocation.callingCodes[0]
            : undefined;
        }
      }
    }
  },
  computed: {
    ...mapGetters("address", ["callingCodes", "countries", "userLocation"]),
    maxDay() {
      return new Date(
        this.birthDateYear || new Date().getFullYear,
        this.birthDateMonth || 0,
        0
      ).getDate();
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
.form-item span {
  font-size: 1rem;
  padding: 0.2rem 0 0.2rem 0.2rem;
}
</style>