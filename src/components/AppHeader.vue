<template>
  <div class="header-wrapper">
    <v-toolbar color="#4eb5f2">
      <app-logo :max-width="logoWidth" />
      <div class="header-items ml-10 hidden-sm-and-down">
        <router-link
          v-for="(item, key) in menu"
          :key="key"
          class="header-item ml-8"
          :to="item.route"
          >{{ item.title }}</router-link
        >
      </div>
      <v-spacer></v-spacer>
      <v-list v-if="user" color="#4eb5f2" class="py-0">
        <v-list-item class="px-0">
          <v-list-item-avatar>
            <v-img src="@/assets/avatar.jpg"></v-img>
          </v-list-item-avatar>
          <v-list-item-content class="py-0">
            <v-list-item-title class="text-white user-full-name"> {{ fullName }}</v-list-item-title>
            <v-list-item-subtitle class="text-white user-email"
              >{{ user.email }}m</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-btn icon color="white" class="hidden-sm-and-down" @click="logoutAndRedirect">
        <v-icon>mdi-export</v-icon>
      </v-btn>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-app-bar-nav-icon
            class="hidden-md-and-up"
            v-bind="attrs"
            v-on="on"
            color="white"
          ></v-app-bar-nav-icon>
        </template>
        <v-list>
          <v-list-item v-for="(item, index) in menu" :key="index">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title @click="logoutAndRedirect">Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>
  </div>
</template>
.
<script>
import { mapState, mapActions } from 'vuex';
import AppLogo from '@/components/AppLogo.vue';

export default {
  name: 'Header',
  components: { AppLogo },
  data() {
    return {
      menu: [
        { title: 'Active Todos', route: '/active-todos' },
        { title: 'Completed Todos', route: '/completed-todos' },
        { title: 'Groups', route: '/groups' },
      ],
      logoWidth: '50px',
    };
  },
  computed: {
    ...mapState(['user']),
    fullName() {
      return `${this.user.firstName} ${this.user.lastName}`;
    },
  },
  created() {
    if (this.$vuetify.breakpoint.xs) {
      this.logoWidth = '0px';
    }
  },
  methods: {
    ...mapActions(['logout']),
    logoutAndRedirect() {
      this.logout();
      this.$router.push('/');
    },
  },
};
</script>
<style lang="scss" scoped>
.header-wrapper {
  .header-items {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .header-item {
      color: #fff;
      text-decoration: none;
    }
    .user-email {
      font-size: 12px;
    }
  }
}
</style>
