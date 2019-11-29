<template>
  <div class="settings">
    <section-header v-bind:options="header"></section-header>
    <main>
      test
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
      text: ""
    };
  },
  methods: {
    
  }
};
</script>