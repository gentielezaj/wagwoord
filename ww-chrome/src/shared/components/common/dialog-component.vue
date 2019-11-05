<template>
  <dialog :id="options.id">
    <div v-if="options.open" class="dialog-main">
      <component :key="options.id" :options="options.componentOptions" :is="options.component"></component>
    </div>
    <div @click="close(true)" class="dialog-wraper"></div>
  </dialog>
</template>

<script>
import Vue from "vue";

export default {
  name: "dialog-component",
  props: {
    options: { required: true }
  },
  data() {
    return {
    };
  },
  methods: {
    close(fromOutSide) {
      if (fromOutSide && this.options.disableClose) {
        return;
      }
      Vue.set(this.options, "open", false);
      const dialog = document.getElementById(this.options.id);
      if(dialog) dialog.open = false;
    }
  },
  computed: {},
  created() {
    if (!this.options.id) this.options.id = new Date().getTime();
    
    if (!this.options.componentOptions)
      this.options.componentOptions = this.options.componentOptions || {};

    this.options.componentOptions.onSubmit = (success) => {
      this.close();
    }

    if (this.options.open) {
      setTimeout(() => {
        document.getElementById(this.options.id).open = true;
      }, 10);
    }
  }
};
</script>