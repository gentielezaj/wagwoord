<template>
  <dialog :id="id">
    <div v-if="isOpen" class="dialog-main">
      <component :key="optionId" :options="options.componentOptions" :is="options.component"></component>
    </div>
    <div @click="close(true)" class="dialog-wraper"></div>
  </dialog>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "dialog-component",
  computed: {
    ...mapGetters("dialog", [
      "isOpen",
      "component",
      "disableCloseFromOutside",
      "id",
      'optionId',
      'options'
    ])
  },
  methods: {
    ...mapMutations("dialog", ["close", "open"])
  }
};
</script>