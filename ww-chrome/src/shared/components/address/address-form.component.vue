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
    <div class="form-item">
      <label for="address-form-phone">phone</label>
      <div class="input-container">
        <input
          id="address-form-phone"
          name="phone"
          v-form-field
          autocomplete="off"
          v-model="model.phone"
          type="tel"
          required
        />
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
        <input
          id="address-form-country"
          name="country"
          v-form-field
          autocomplete="off"
          v-model="model.country"
          type="text"
          required
        />
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

export default {
  mixins: [formCoreComponentMixin("address", 'address-form')],
  name: "address-form-component"
};
</script>