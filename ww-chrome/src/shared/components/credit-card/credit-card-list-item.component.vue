<template>
  <div class="list-item">
    <div class="item-actions right">
      <button @click="toggelDialog()" class="icon text">
        <span>edit</span>
        <i class="icon-pencil"></i>
      </button>
      <button @click="deleteItem(item)" class="icon text">
        <span>delete</span>
        <i class="icon-delete"></i>
      </button>
    </div>
    <div class="hidden">
      <span class="data-value">{{item.id}}</span>
    </div>
    <div class="domain title">
      <span class="data-value">{{item.name}} <i v-show="item.bank">- {{item.bank}}</i></span>
    </div>
    <div @dblclick="clipboard(item.cardNumber)" class="domain data xl">
      <!-- <i :class="cardIcon"></i> -->
      <img v-if="cardIcon" :src="cardIcon">
      &nbsp;&nbsp;
      <span class="data-value">**** **** **** {{cardNumber}}</span>
      <span class="data-action right icon" @click="clipboard(item.cardNumber)" data="cardNumber">
        <i class="icon-copy-1"></i>
      </span>
    </div>
    <div class="domain data">
      <span class="data-value">Expires on: {{expiredMonthView}} / {{item.expiredYear}}</span>
      <!-- <span class="data-action right icon" @click="clipboard(code)" data="code">
        <i class="icon-copy-1"></i>
      </span> -->
    </div>
    <dialog-component :options="dialogOptions"></dialog-component>
    <delete-dialog-component :options="deleteDialogOptions"></delete-dialog-component>
  </div>
</template>

<script>
import { listItemCoreComponentMixin } from "../common/core.component";
import form from "./cedit-card-form.component";

export default {
  name: "credit-card-list-item",
  mixins: [listItemCoreComponentMixin('creditcard', form)],
  computed: {
    cardNumber() {
        return this.item.cardNumber ? this.item.cardNumber.substring(this.item.cardNumber.length - 4) : '';
    },
    expiredMonthView() {
        return this.item.expiredMonth < 10 ? ("0" + this.item.expiredMonth) : this.item.expiredMonth;
    },
    cardIcon() {
        return this.$store.getters['creditcard/creditCardImage'](this.item.cardType);
    }
  },
  beforeDestroy() {
    this.checkCodeInterval = undefined;
  }
};
</script>
