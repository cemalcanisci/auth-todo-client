<template>
  <v-app>
    <app-header />

    <v-main>
      <vue-snotify></vue-snotify>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>
<script>
import { mapActions } from 'vuex';
import AppHeader from '@/components/AppHeader.vue';

export default {
  name: 'Layout',
  components: { AppHeader },
  created() {
    this.fetchGroups();
  },
  methods: {
    ...mapActions({ fetch: 'fetchGroups' }),
    async fetchGroups() {
      try {
        await this.fetch();
      } catch (error) {
        const { message } = error.response.data;
        this.$snotify.error(message);
      }
    },
  },
};
</script>
