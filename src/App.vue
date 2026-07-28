<template>
  <div v-if="almacenConfiguracion.cargando" class="d-flex justify-center align-center h-screen bg-background">
    <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
  </div>
  <RouterView v-else />
</template>

<script setup>
import { onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { useAlmacenConfiguracion } from './stores/configuracion.store'

const temaVuetify = useTheme()
const almacenConfiguracion = useAlmacenConfiguracion()

onMounted(async () => {
  await almacenConfiguracion.cargarConfiguracion(temaVuetify)
})
</script>
<style>
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', 'Roboto', sans-serif;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #0f1923;
}

::-webkit-scrollbar-thumb {
  background: #2196f3;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #1565c0;
}

.swal-portal-paciente {
  font-family: 'Inter', 'Roboto', sans-serif !important;
  border-radius: 16px !important;
}
</style>
