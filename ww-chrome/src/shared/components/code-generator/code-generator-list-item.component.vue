<template>
  <div class="list-item">
    <div class="item-actions right">
      <button @click="edit(item)" class="icon text">
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
      <span class="data-value">{{item.issuer}}</span>
    </div>
    <div @dblclick="clipboard(item.username)" class="domain data">
      <span class="data-value">{{item.username}}</span>
      <span class="data-action right icon" @click="clipboard(item.username)" data="username">
        <i class="icon-copy-1"></i>
      </span>
    </div>
    <div @dblclick="clipboard(code)" class="domain data">
      <span class="data-value">{{code}} - {{timeLeft}}</span>
      <span class="data-action right icon" @click="clipboard(code)" data="code">
        <i class="icon-copy-1"></i>
      </span>
      <div
        class="code-time-progress"
        :class="progressColorClass"
        :id="'code-time-progress' + item.id"
        :style="widthStyle"
      ></div>
    </div>
  </div>
</template>

<script>
import { listItemCoreComponentMixin } from "../common/core.component";
import form from "./code-generator-form.component";
import authenticator from "otplib/authenticator";

export default {
  name: "code-generator-list-item",
  mixins: [listItemCoreComponentMixin("codegenerator", form, "code-generator")],
  data() {
    return {
      code: "",
      timeLeft: 0,
      checkCodeInterval: "",
      widthStyle: "width: 100%",
      progressColorClass: "success",
      authenticator: new authenticator.Authenticator()
    };
  },
  beforeDestroy() {
    this.checkCodeInterval = undefined;
  },
  methods: {
    checkCode() {
      const timeRemaining = this.authenticator.timeRemaining();
      let procent =
        100 -
        ((this.timeRemaining() / (Number(this.item.step) || 30)) * 100).toFixed(
          4
        );
      if (procent > 11) this.vue.set(this, "progressColorClass", "success");
      else if (procent < 6) this.vue.set(this, "progressColorClass", "error");
      else this.vue.set(this, "progressColorClass", "info");

      this.vue.set(this, "timeLeft", timeRemaining);
      this.vue.set(this, "code", this.authenticator.generate(this.item.secret));
      this.vue.set(this, "widthStyle", `width: ${procent}%`);
    },
    timeRemaining() {
      return (
        ((this.item.epoch || new Date().getTime()) / 1000) %
        (this.item.step || 30)
      );
    }
  },
  created() {
    const defaults = this.$store.getters[this.storeName + "/assingeDefaults"](
      this.item
    );

    this.authenticator.options = defaults;
    this.checkCodeInterval = setInterval(() => {
      this.checkCode();
    }, 10);
  }
};
</script>

<style lang="scss" scoped>
.code-time-progress {
  height: 1px;
  &.success {
    background-color: var(--wagwoord-color-success-secend);
  }
  &.info {
    background-color: var(--wagwoord-color-info-secend);
  }
  &.error {
    background-color: var(--wagwoord-color-error-secend);
  }
}
</style>
