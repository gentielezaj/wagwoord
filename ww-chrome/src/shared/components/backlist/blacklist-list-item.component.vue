<template>
  <div class="list-item blacklist">
    <div class="item-actions right">
      <span v-show="saving" class="loader"></span>
      <button @click="edit(item)" class="icon text">
        <span>edit</span>
        <i class="icon-pencil"></i>
      </button>
      <button @click="deleteItem(item)" v-if="isOptionsScope" class="icon text">
        <span>delete</span>
        <i class="icon-delete"></i>
      </button>
    </div>
    <div class="hidden">
      <span class="data-value">{{item.id}}</span>
    </div>
    <div class="domain title">
      <span class="data-value">{{item.name}}</span>
    </div>
    <div class="item-actions">
      <div class="form-item cbx">
        <input
          type="checkbox"
          v-model="item.password"
          @change="save($event)"
          name="password"
          class="cbx light hidden"
          :id="'blacklist-password' + item.id"
        />
        <span class="lbl" @click="item.password = !item.password; save($event)"></span>
        <label :for="'blacklist-password' + item.id" class>Password</label>
      </div>
      <div class="form-item cbx">
        <input
          type="checkbox"
          v-model="item.address"
          @change="save($event)"
          name="address"
          class="cbx light hidden"
          :id="'blacklist-address' + item.id"
        />
        <span class="lbl" @click="item.address = !item.address; save($event)"></span>
        <label :for="'blacklist-address' + item.id" class>Address</label>
      </div>
      <div class="form-item cbx">
        <input
          type="checkbox"
          v-model="item.creditCard"
          @change="save($event)"
          name="creditCard"
          class="cbx light hidden"
          :id="'blacklist-creditCard' + item.id"
        />
        <span class="lbl" @click="item.creditCard = !item.creditCard; save($event)"></span>
        <label :for="'blacklist-creditCard' + item.id" class>Credit card</label>
      </div>
      <div class="form-item cbx">
        <input
          type="checkbox"
          v-model="item.codeGenerator"
          @change="save($event)"
          name="codeGenerator"
          class="cbx light hidden"
          :id="'blacklist-codeGenerator' + item.id"
        />
        <span class="lbl" @click="item.codeGenerator = !item.codeGenerator; save($event)"></span>
        <label :for="'blacklist-codeGenerator' + item.id" class>Code generator</label>
      </div>
    </div>
    <dialog-component :options="dialogOptions"></dialog-component>
    <delete-dialog-component :options="deleteDialogOptions"></delete-dialog-component>
  </div>
</template>

<script>
import { listItemCoreComponentMixin } from "../common/core.component";
import form from "./blacklist-form.component";

export default {
  name: "blacklist-list-item",
  mixins: [listItemCoreComponentMixin("blacklist", form)],
  data() {
    return {
      saving: false
    };
  },
  methods: {
    async save(value) {
      this.saving = true;
      try {
        let result = await this.$store.dispatch("blacklist/save", this.item);
        if (result) this.notifySuccess("Password saved");
        else this.notifyError("Error while saving password1");
        this.saving = false;
      } catch (error) {
        this.notifyError("Error while saving password2", error);
        this.saving = false;
        throw error;
      }
    },
    async edit() {
      if (this.isOptionsScope) this.toggelDialog();
      else {
        // TODO: resolve page
        this.$store.commit("chrome/open", {
          url: `options/options.html#/blacklist?edit=${
            this.item.id
          }&name=${encodeURIComponent(this.item.name)}`
        });
      }
    }
  },
  async created() {
    if (!this.item || this.item == -1) {
      const url = this.$util.getName(this.$constants.tab.url, true);
      this.item = (await this.$store.getters["blacklist/item"]({
        name: url
      })) || {
        id: -1,
        name: url
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.form-item {
  &.password-length {
    width: 50%;
  }
  &.autosubmit {
    padding-top: 2rem;
  }
}
</style>