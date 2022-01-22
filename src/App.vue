<template>
  <component :is="layoutComponent">
    <router-view />
    <vue-snotify></vue-snotify>
  </component>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import PublicLayout from '@/views/layouts/PublicLayout.vue';
import Layout from '@/views/layouts/Layout.vue';

export default {
  name: 'App',
  computed: {
    ...mapState(['user']),
    layoutComponent() {
      const layout = this.$route.meta?.layout;
      switch (layout) {
        case 'public':
          return PublicLayout;
        default:
          return Layout;
      }
    },
  },
  created() {
    this.fetchUser();
  },
  methods: {
    ...mapActions({ fetchUserFromDb: 'fetchUser' }),
    async fetchUser() {
      try {
        await this.fetchUserFromDb();
      } catch (err) {
        if (this.$route.name !== 'Auth') {
          this.$router.push('/');
        }
      }
    },
  },
  watch: {
    user() {
      if (this.user && this.$route.name !== 'ActiveTodos') {
        this.$router.push('active-todos');
      }
    },
  },
};
</script>
