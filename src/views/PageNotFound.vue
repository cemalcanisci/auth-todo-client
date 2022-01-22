<template>
  <div class="page-not-found-wrapper">
    <div class="not-found-title my-3">Oops!</div>
    <div class="not-found-subtitle my-1">404 - PAGE NOT FOUND</div>
    <div class="not-found-content my-1">
      The page you are looking for might have been removed had its name changed or is temporarily
      unavailable
    </div>

    <v-btn class="my-4" large color="primary" @click="goToHome">GO TO HOMEPAGE</v-btn>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'PageNotFound',
  computed: {
    ...mapState(['user']),
  },
  methods: {
    goToHome() {
      if (this.user) {
        this.$router.push('active-todos');
      } else {
        this.$router.push('/');
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.page-not-found-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .not-found-title {
    font-weight: 800;
    font-size: 200px;
    background: #0008fa; /* fallback for old browsers */
    background: -webkit-linear-gradient(
      to right,
      #0008fa,
      #99bbff
    ); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(
      to right,
      #0008fa,
      #99bbff
    ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .not-found-subtitle {
    font-weight: 700;
    font-size: 30px;
  }
  .not-found-content {
    font-size: 14px;
    font-weight: 600;
  }
}
</style>
