<template>
  <v-app>
    <v-main>
      <v-container fluid class="public-layout">
        <slot></slot>
      </v-container>
    </v-main>
  </v-app>
</template>
<style lang="scss" scoped>
.public-layout {
  height: 100%;
}
</style>
