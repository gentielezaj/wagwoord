<template>
  <div id="app-notificaitons">
    <ul>
      <li
        v-for="(not, index) in notfs"
        v-bind:key="not.id"
        :id="not.id"
        :class="not.type"
        @click="close(not, index)"
      >
        <span>{{not.message}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "notification-component",
  data() {
    return {};
  },
  computed: {
    notfs() { 
      return this.$store.getters['notification/notifications'];
    }
  },
  methods: {
      close(notification, index) {
          this.$store.commit('notification/remove', notification.id);
      }
  }
};
</script>