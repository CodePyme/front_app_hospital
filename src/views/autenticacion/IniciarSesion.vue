<template>
  <LayoutAutenticacion>
    <v-row class="fill-height" align="center" justify="center" style="min-height: 100vh">
      <v-col cols="12" sm="8" md="5" lg="4">
        <!-- Logo y título -->
        <div class="text-center mb-8">
            <template v-if="almacenConfiguracion.logoUrl">
              <v-img :src="almacenConfiguracion.logoUrl" max-height="60" max-width="60" contain class="mx-auto mb-4" />
            </template>
            <template v-else>
              <v-icon icon="mdi-heart-pulse" size="64" color="primary" class="mb-4" />
            </template>
            <h1 class="text-h4 font-weight-bold text-primary mb-2 mt-4">{{ almacenConfiguracion.nombreEntidad }}</h1>
          <p class="text-medium-emphasis">Inicia sesión para continuar</p>
        </div>

        <!-- Tarjeta de login -->
        <v-card elevation="8" class="tarjeta-login">
          <v-card-text class="pa-8">
            <v-form ref="refFormulario" @submit.prevent="enviarFormulario" v-model="formularioValido">
              <!-- Correo -->
              <v-text-field
                v-model="formulario.correoElectronico"
                label="Correo electrónico"
                type="email"
                prepend-inner-icon="mdi-email-outline"
                :rules="reglasCorreo"
                class="mb-3"
                autocomplete="email"
                :disabled="almacenAuth.cargando"
              />

              <!-- Contraseña -->
              <v-text-field
                v-model="formulario.contrasena"
                label="Contraseña"
                :type="mostrarContrasena ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="mostrarContrasena ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="mostrarContrasena = !mostrarContrasena"
                :rules="reglasContrasena"
                class="mb-6"
                autocomplete="current-password"
                :disabled="almacenAuth.cargando"
              />

              <!-- Alerta de error -->
              <v-alert
                v-if="almacenAuth.error"
                type="error"
                variant="tonal"
                density="compact"
                class="mb-4"
                closable
                @click:close="almacenAuth.error = null"
              >
                {{ almacenAuth.error }}
              </v-alert>

              <!-- Botón de ingreso -->
              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="almacenAuth.cargando"
                :disabled="!formularioValido || almacenAuth.cargando"
              >
                <v-icon start>mdi-login</v-icon>
                Iniciar sesión
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>

        <p class="text-center text-medium-emphasis text-caption mt-4">
          Portal Paciente © {{ anioActual }}
        </p>
      </v-col>
    </v-row>
  </LayoutAutenticacion>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAlmacenAutenticacion } from '../../stores/autenticacion.store'
import { useAlmacenConfiguracion } from '../../stores/configuracion.store'
import { usarAlertas } from '../../composables/usarAlertas'
import LayoutAutenticacion from '../../layouts/LayoutAutenticacion.vue'

const enrutador = useRouter()
const almacenAuth = useAlmacenAutenticacion()
const almacenConfiguracion = useAlmacenConfiguracion()
const { mostrarExito } = usarAlertas()

const nombreApp = import.meta.env.VITE_NOMBRE_APP || 'Portal Paciente'
const anioActual = new Date().getFullYear()

const refFormulario = ref(null)
const formularioValido = ref(false)
const mostrarContrasena = ref(false)

const formulario = reactive({
  correoElectronico: '',
  contrasena: '',
})

const reglasCorreo = [
  (v) => !!v || 'El correo electrónico es requerido',
  (v) => /.+@.+\..+/.test(v) || 'El correo electrónico no es válido',
]

const reglasContrasena = [
  (v) => !!v || 'La contraseña es requerida',
  (v) => v.length >= 6 || 'La contraseña debe tener al menos 6 caracteres',
]

async function enviarFormulario() {
  const { valid } = await refFormulario.value.validate()
  if (!valid) return

  try {
    await almacenAuth.iniciarSesion(formulario.correoElectronico, formulario.contrasena)
    await mostrarExito('¡Bienvenido al Portal Paciente!', '¡Sesión iniciada!')
    enrutador.push({ name: 'dashboard' })
  } catch {
    // El error se maneja en el store
  }
}
</script>

<style scoped>
.tarjeta-login {
  background: #ffffff !important;
  border: 1px solid rgba(0,0,0, 0.05) !important;
}
</style>
