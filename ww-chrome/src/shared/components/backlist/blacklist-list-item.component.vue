<template>
  <div class="list-item">
    <div class="item-actions right">
        <span v-show="saving" class="loader"></span>
      <button @click="edit(item)" class="icon text">
        <span>edit</span>
        <i class="icon-pencil"></i>
      </button>
      <button @click="deleteItem(item)" v-if="appenvirement != 'popup'" class="icon text">
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
  </div>
</template>

<script>
import {coreComponent} from "../common/core-component";
import dialogComponent from "../common/dialog-component";
import blacklistFormComponent from "./blacklist-form.component";

const component = {
  name: "blacklist-list-item",
  props: {
    item: { required: true },
    onSubmits: { required: false }
  },
  components: {
    "dialog-component": dialogComponent
  },
  data() {
    return {
      appenvirement: false,
      showPassword: false,
      dialogOptions: {
        id: "blacklist-list-item-component-dialog-" + this.item.id,
        component: blacklistFormComponent,
        disableClose: true,
        componentOptions: {
          itemId: this.item.id
        }
      },
      saving:false
    };
  },
  methods: {
    async edit() {
      this.toggelDialog();
    },
    async deleteItem() {
      try {
        const res = await this.$store.dispatch("blacklist/delete", this.item.id);
        if (res) {
          this.notifySuccess("Deleted");
        } else {
          this.notifyError("Error while deleting");
        }
      } catch (error) {
        this.notifyError("Error while deleting", error);
        throw error;
      }
    },
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
    }
  },
  created() {}
};

export default coreComponent(component);
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