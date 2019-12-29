<template>
  <form v-form id="credit-card-form" name="credit-card-form" novalidate>
    <div class="form-item">
      <label for="credit-card-form-id">id</label>
      <div class="input-container">
        <input readonly name="id" v-model.number="model.id" id="credit-card-form-id" type="number" />
      </div>
    </div>
    <div class="form-item">
      <label for="credit-card-form-name">Name</label>
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
      <label for="credit-card-form-cardNumber">Card number</label>
      <div class="input-container">
        <input
          id="credit-card-form-cardNumber"
          required
          @keyup="checkCardNumber($event)"
          v-form-field
          maxlength="19"
          minlength="16"
          pattern="^\d{4}[ ]?\d{4}[ ]?\d{4}[ ]?\d{4}"
          name="cardNumber"
          v-model="model.cardNumber"
          type="text"
        />
        <img v-if="cardIcon" :src="cardIcon"/>
      </div>
    </div>
    <div class="form-item-group">
      <div class="form-item">
        <label for="credit-card-form-expiredMonth">Expired month</label>
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
        <label for="credit-card-form-expiredYear">Expired year</label>
        <div class="input-container">
          <input
            id="credit-card-form-expiredYear"
            name="expiredYear"
            v-form-field
            :min="minYear"
            :max="maxYear"
            autocomplete="off"
            v-model.number="model.expiredYear"
            type="number"
            required
          />
        </div>
      </div>
    </div>
    <div class="form-item-group">
      <div class="form-item">
        <label for="credit-card-form-cvv">CVV</label>
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
        <label for="credit-card-form-pin">Pin</label>
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
    </div>
    <div class="form-item">
      <label for="credit-card-form-bank">Bank name</label>
      <div class="input-container">
        <input
          id="credit-card-form-bank"
          name="bank"
          v-form-field
          maxlength="128"
          autocomplete="off"
          v-model="model.bank"
          type="text"
        />
      </div>
    </div>
    <div class="form-item-group">
      <div class="form-item cbx">
        <input
          type="checkbox"
          v-model="model.synced"
          name="synced"
          class="cbx main hidden"
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
          class="cbx main hidden"
          id="credit-card-form-nfc"
        />
        <span class="lbl" @click="changeModelProperty('nfc', !model.nfc)"></span>
        <label for="credit-card-form-nfc" class>Is nfc enable</label>
      </div>
    </div>
    <div class="form-actions right">
      <button
        type="submit"
        :disabled="saving"
        id="credit-card-form-save"
        class="success loader"
        @click="saveItem($event)"
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
import { formCoreComponentMixin } from "../common/core.component";

export default {
  mixins: [formCoreComponentMixin("creditcard", 'credit-card-form')],
  data() {
    return {
      cardIcon: undefined
    };
  },
  computed: {
    minYear() {
      return new Date().getFullYear();
    },
    maxYear() {
      return this.minYear + 20;
    },
    baseModel() {
      return {
        synced: true,
        nfc: true
      };
    }
  },
  methods: {
    checkCardNumber(event) {
      if (
        this.model.cardNumber &&
        !Number(event.key) &&
        event.key != "Backspace" &&
        event.key != "Delete"
      )
        return;
      let curorPosition = event.target && event.target.selectionStart != this.model.cardNumber.length ? Number(event.target.selectionStart) : -1;
      if (this.model.cardNumber && this.model.cardNumber.length > 4) {
        let val = "";
        this.model.cardNumber = this.model.cardNumber.replace(/( )/g, "");
        for (let index = 0; index < this.model.cardNumber.length; index++) {
          val = val + this.model.cardNumber[index];
          if (
            index != 0 &&
            index != this.model.cardNumber.length - 1 &&
            (index + 1) % 4 == 0
          )
            val = val + " ";
        }
        this.model.cardNumber = val;
      }
      if (curorPosition !== -1 && curorPosition < this.model.cardNumber.length) {
        if((curorPosition == 5 || curorPosition == 9 || curorPosition == 15) && event.key != "Backspace" && event.key != "Delete") {
          curorPosition++; 
        }
        setTimeout(() => {
          event.target.selectionStart = curorPosition;
          event.target.selectionEnd = curorPosition;
        });
      }
      this.getCreditCardType();
    },
    getCreditCardType() {
      this.cardIcon = this.$store.getters['creditcard/creditCardImage'](this.model.cardNumber);
    },
    async saveItem() {
      this.model.cardNumber = this.model.cardNumber ? this.model.cardNumber.replace(/( )/g, '') : this.model.cardNumber;
      this.model.cardType = this.$store.getters['creditcard/creditCardType'](this.model.cardNumber);
      await this.save();
    }
  },
  async created() {
    await this.onCreate(); 
    this.checkCardNumber({ key: 'Backspace' });
  }
};
</script>