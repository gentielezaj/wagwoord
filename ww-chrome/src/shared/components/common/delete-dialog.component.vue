<template>
  <dialog :id="options.id">
    <div v-if="options.open" class="dialog-main">
      <span class="message">{{options.message}}</span>
      <div class="dialog-actions">
        <input @click="confirm(true)" type="button" class="success dialog-action" value="Yes" />
        <input @click="close(false)" type="button" class="error dialog-action" value="No" />
      </div>
    </div>
    <div @click="close(true)" class="dialog-wraper"></div>
  </dialog>
</template>

<script>
import Vue from "vue";
import {coreComponent} from './core-component';

const component = {
  name: "dialog-delete-component",
  props: {
    options: { required: true }
  },
  data() {
    return {
      item: {}
    };
  },
  methods: {
    close() {
      Vue.set(this.options, "open", false);
      const dialog = document.getElementById(this.options.id);
      if (dialog) dialog.open = false;
    },
    async confirm() {
      try {
        const res = await this.$store.dispatch(
          this.options.store + "/delete",
          this.item.id
        );
        if (res) {
          this.close();
          this.notifySuccess("Deleted");
        } else {
          this.notifyError("Error while deleting");
        }
      } catch (error) {
        this.notifyError("Error while deleting", error);
        throw error;
      }
    }
  },
  computed: {},
  created() {
    this.item = this.options.item;
    if (!this.options.id)
      this.options.id =
        "dialog-delete-" + this.options.store + "-" + this.item.id;
    if (!this.options.message) this.options.message = "Delete item for real?";
  }
};

export default coreComponent(component);
</script>

<style lang="scss" scoped>
.dialog-main {
    padding: 1rem;
}
</style>