<template>
  <div class="delete-dialog-component">
    <span class="message">{{options.message}}</span>
    <div class="dialog-actions">
      <input @click="confirm(true)" type="button" class="success dialog-action" value="Yes" />
      <input @click="close(false)" type="button" class="error dialog-action" value="No" />
    </div>
  </div>
</template>

<script>
import { coreComponentMixin } from "./core.component";

export default {
  mixins: [coreComponentMixin()],
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
      this.$store.commit('dialog/close');
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
  created() {
    this.item = this.options.item;
    if (!this.options.message) this.options.message = "Delete item for real?";
  }
};
</script>

<style lang="scss" scoped>
.delete-dialog-component {
  padding: 1rem;
}
</style>