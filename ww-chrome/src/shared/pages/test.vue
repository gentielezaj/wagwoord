<template>
  <div class="settings">
    <section-header v-bind:options="header"></section-header>
    <main>
      test
      <br />
      <button @click="clearData">Clear all chrome data</button>
      <button @click="clearData">Clear database</button>
      <div>
        <form style="width:50px" v-form>
          <div class="form-item">
            <div class="input-container">
              <input
                v-model="request.url"
                id="util-form-domain"
                type="text"
                v-form-field
                placeholder="url"
                name="url"
              />
              <button
                class="icon-cancel-alt-filled"
                id="clear-search"
                v-if="request.url"
                @click="request.url = ''"
              ></button>
            </div>
          </div>
          <div class="form-item">
            <div class="input-container">
              <textarea
                id="util-form-enctipyionKey"
                v-form-field
                placeholder="Leave it blank to disable"
                name="body"
                v-model="request.body"
              ></textarea>
            </div>
          </div>
          <button @click="send($event)">send</button>
        </form>
      </div>
    </main>
  </div>
</template>

<script>
import sctionHeader from "../components/common/section-header";

export default {
  name: "test-page",
  components: {
    "section-header": sctionHeader
  },
  data() {
    return {
      header: {
        title: "Test",
        search: true
      },
      inlineLoaderActive: false,
      text: "",
      request: {}
    };
  },
  methods: {
    async clearData() {
      await this.$store.dispatch("chrome/clear");
      console.log("cleared");
    },
    async send(event) {
      event.preventDefault();
      let model = {
        params: new Date().getTime() + ''
      };
      console.log("sending request to: " + model.action);
      console.log(await this.$store.dispatch("app/request", model));
    }
  }
};
</script>