<template>
  <v-app>
    <v-main class="fondo-autenticacion">
      <slot />
    </v-main>
  </v-app>
</template>

<style scoped>
.fondo-autenticacion {
  background: linear-gradient(135deg, #f6f8f9 0%, #e9f0f4 100%);
  min-height: 100vh;
}
</style>
