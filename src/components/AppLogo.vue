<template>
  <div class="logo-wrapper">
    <img class="logo" src="@/assets/logo.png" alt="App Logo" :style="{ 'max-width': maxWidth }" />
  </div>
</template>
<script>
export default {
  name: 'AppLogo',
  props: {
    maxWidth: {
      type: String,
      default: '200px',
    },
  },
};
</script>
<style lang="scss" scoped>
.logo-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
