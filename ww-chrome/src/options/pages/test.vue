<template>
  <div class="settings">
    <section-header v-bind:options="header"></section-header>
    <main>
      <article v-searchable class="m" v-collapse="'.content'">
        <header>
          <h2>chrome storage and db</h2>
        </header>
        <div search-data="storage db database" class="content">
          <form>
            <div class="form-item">
              <div class="input-container">
                <input v-model="text" type="text" id="toolbar-search" name="toolbar-search" />
                <span v-show="inlineLoaderActive" class="loader"></span>
                <button class="input-sufix icon-search"></button>
              </div>
            </div>
            <div class="form-actions">
              <button @click="encrypt($event)" class="loader">Encrypt</button>
              <button @click="encrypt($event, true)" class="loader">Decrypt</button>
            </div>
          <div class="form-actions">
            <button @click="consol()" class="loader">Consol log chrome storage</button>
            <button @click="reqyest()" class="loader">request</button>
            <button @click="local()" class="loader">local</button>
          </div>
          </form>
        </div>
      </article>
    </main>
  </div>
</template>

<script>
import sctionHeader from "../../shared/components/common/section-header";
import core from "../../shared/components/common/core-component";
import { EncryptionService } from "../../shared/services/encryprion.service";
import { ChromeService } from "../../shared/services/chrome.service";
import { ProxyService } from "../../shared/services/proxy.service";

const component = {
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
      text: ""
    };
  },
  methods: {
    async encrypt(event, decrypt) {
      event.preventDefault();
      this.inlineLoaderActive = true;
      if (!this.text) {
        this.inlineLoaderActive = false;
        return;
      } else if (decrypt) {
        this.text = await this.$store.getters["encryption/decrypt"](this.text);
      } else {
        this.text = await this.$store.getters["encryption/encrypt"](this.text);
      }
      this.inlineLoaderActive = false;
    },
    async consol() {},
    async reqyest() {
      var proxy = new ProxyService("test");
      try {
        let response = await proxy.get();
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    },
    local() {
      fetch("http://localhost:4040/api/test", {
        method: "GET",
        headers: {
          wagwoordId: "8babd553-f463-4498-9e7f-6b3c983ca58d",
          mode: "cors",
          // "Access-Control-Allow-Origin": '*',
          "Content-Type": "application/json"
        }
      })
        .then(response => console.log(response))
        .then(response => console.log("ok"))
        .catch(error => console.log("fucking error"));
    }
  }
};

export default core(component);
</script>