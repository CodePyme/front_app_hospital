<template>
  <v-app>
    <!-- Barra de navegación lateral con ancho suficiente para no cortar texto -->
    <v-navigation-drawer
      v-model="cajoneAbierto"
      :rail="rielesModo"
      :width="280"
      color="primary"
      class="sidebar-saludplus"
    >
      <!-- Logo / Título -->
      <div class="pa-4 d-flex align-center gap-3">
        <template v-if="almacenConfiguracion.logoUrl">
          <v-img :src="almacenConfiguracion.logoUrl" max-height="42" max-width="42" contain />
        </template>
        <template v-else>
          <v-icon icon="mdi-heart-pulse" size="38" color="white" />
        </template>

        <div v-if="!rielesModo" class="text-white">
          <div class="text-subtitle-1 font-weight-bold lh-1" style="line-height: 1.2;">
            {{ almacenConfiguracion.nombreEntidad }}
          </div>
          <div class="text-caption opacity-80">Portal del Paciente</div>
        </div>
      </div>

      <v-divider class="border-opacity-25" />

      <!-- Menú de navegación principal con 3 servicios esenciales + Inicio -->
      <v-list class="px-3 py-2">
        <v-list-item
          v-for="elemento in elementosMenu"
          :key="elemento.nombre"
          :prepend-icon="elemento.icono"
          :title="elemento.titulo"
          :value="elemento.nombre"
          :to="elemento.ruta"
          rounded="xl"
          color="white"
          base-color="white"
          class="mb-2 font-weight-medium item-menu-lateral"
          @click="alSeleccionarMenu"
        />

        <!-- Sección de Configuración (Solo Administrador) -->
        <template v-if="esAdmin">
          <v-divider class="my-2 border-opacity-25" />
          <v-list-item
            prepend-icon="mdi-palette-outline"
            title="Configuración"
            value="configuracion"
            to="/configuracion"
            rounded="xl"
            color="white"
            base-color="white"
            class="mb-2 font-weight-medium item-menu-lateral"
            @click="alSeleccionarMenu"
          />
        </template>

        <!-- Sección de Super Admin -->
        <template v-if="esSuperAdmin">
          <v-divider class="my-2 border-opacity-25" />
          <v-list-subheader v-if="!rielesModo" class="text-caption text-white opacity-80">
            SUPER ADMIN
          </v-list-subheader>
          <v-list-item
            prepend-icon="mdi-domain"
            title="Tenants"
            value="tenants"
            to="/tenants"
            rounded="lg"
            color="white"
            base-color="white"
            class="mb-2 font-weight-medium item-menu-lateral"
            @click="alSeleccionarMenu"
          >
            <template v-slot:append v-if="!rielesModo">
              <v-icon icon="mdi-shield-crown" size="14" color="deep-purple" />
            </template>
          </v-list-item>
        </template>

        <!-- Cerrar sesión -->
        <v-list-item
          prepend-icon="mdi-logout"
          title="Cerrar sesión"
          rounded="xl"
          class="text-white font-weight-medium mt-4 item-menu-lateral"
          @click="confirmarCierreSesion"
        />
      </v-list>

      <template v-slot:append>
        <div class="pa-4" v-if="!rielesModo">
          <v-card color="primary-darken-1" rounded="xl" elevation="0" class="pa-4 text-white text-center border">
            <v-icon icon="mdi-headset" size="32" class="mb-2" />
            <div class="text-subtitle-2 font-weight-bold mb-1">¿Necesitas ayuda?</div>
            <div class="text-caption opacity-80 mb-4" style="line-height:1.2;">
              Línea de atención disponible para asistirte.
            </div>
            <v-btn color="secondary" variant="flat" block rounded="xl" class="text-primary font-weight-bold text-none">
              (604) 444 13 33
            </v-btn>
          </v-card>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Barra superior -->
    <v-app-bar color="background" elevation="0" class="px-2 px-md-4">
      <template v-slot:prepend>
        <v-app-bar-nav-icon aria-label="Abrir menú de navegación" color="primary" class="d-lg-none" @click="cajoneAbierto = !cajoneAbierto"></v-app-bar-nav-icon>
      </template>

      <template v-slot:append>
        <div class="d-flex align-center gap-2 gap-md-4">
          <!-- Botón notificaciones -->
          <v-btn icon aria-label="Ver notificaciones" color="grey-darken-2" variant="text">
            <v-badge color="secondary" content="2" dot>
              <v-icon size="26">mdi-bell-outline</v-icon>
            </v-badge>
          </v-btn>

          <!-- Perfil usuario -->
          <div class="d-flex align-center gap-2 cursor-pointer bg-white px-2 px-md-3 py-1 rounded-pill border">
            <v-avatar color="green-lighten-5" size="32" class="d-md-none">
              <v-icon color="primary" size="20">mdi-account-outline</v-icon>
            </v-avatar>
            <v-avatar color="green-lighten-5" size="36" class="d-none d-md-flex">
              <v-icon color="primary">mdi-account-outline</v-icon>
            </v-avatar>
            <div class="d-none d-sm-block">
              <div class="text-body-2 font-weight-bold text-grey-darken-3" style="line-height:1.2">
                {{ almacenAuth.nombreCompleto }}
              </div>
              <div class="text-caption text-grey-darken-1" style="line-height:1.2">
                {{ almacenAuth.rolUsuario === 'administrador' ? 'Super Admin' : 'Paciente' }}
              </div>
            </div>
            <v-icon size="20" color="grey-darken-2">mdi-chevron-down</v-icon>
          </div>
        </div>
      </template>
    </v-app-bar>

    <!-- Contenido principal -->
    <v-main>
      <v-container fluid class="pa-6">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useAlmacenAutenticacion } from '../stores/autenticacion.store'
import { useAlmacenConfiguracion } from '../stores/configuracion.store'
import { usarAlertas } from '../composables/usarAlertas'

const { mdAndDown } = useDisplay()

const almacenAuth = useAlmacenAutenticacion()
const almacenConfiguracion = useAlmacenConfiguracion()
const enrutador = useRouter()
const rutaActual = useRoute()
const { confirmarEliminacion } = usarAlertas()

const cajoneAbierto = ref(true)
const rielesModo = ref(false)

// Cerrar el menú automáticamente al cambiar de ruta si estamos en móvil/tablet
watch(
  () => rutaActual.path,
  () => {
    if (mdAndDown.value) {
      cajoneAbierto.value = false
    }
  }
)

const elementosMenu = [
  { nombre: 'dashboard', titulo: 'Inicio', icono: 'mdi-home-outline', ruta: '/' },
  { nombre: 'historia', titulo: 'Historia Clínica', icono: 'mdi-file-document-outline', ruta: '/historia' },
  { nombre: 'citas', titulo: 'Citas Médicas', icono: 'mdi-calendar-blank-outline', ruta: '/citas' },
  { nombre: 'resultados', titulo: 'Ayudas Diagnósticas', icono: 'mdi-pulse', ruta: '/resultados' },
]

const CORREO_SUPER_ADMIN = 'admin@codepyme.com'
const esSuperAdmin = computed(
  () => almacenAuth.usuario?.correoElectronico === CORREO_SUPER_ADMIN,
)
const esAdmin = computed(
  () => almacenAuth.usuario?.rol === 'administrador' || almacenAuth.usuario?.correoElectronico === CORREO_SUPER_ADMIN,
)

async function confirmarCierreSesion() {
  const confirmado = await confirmarEliminacion('tu sesión')
  if (confirmado) {
    almacenAuth.cerrarSesion()
    enrutador.push({ name: 'iniciar-sesion' })
  }
}

function alSeleccionarMenu() {
  if (mdAndDown.value) {
    cajoneAbierto.value = false
  }
}
</script>

<style>
.sidebar-saludplus .v-list-item--active {
  background-color: rgb(var(--v-theme-secondary)) !important;
  color: rgb(var(--v-theme-primary)) !important;
}

.sidebar-saludplus .v-list-item--active .v-icon {
  color: rgb(var(--v-theme-primary)) !important;
}

/* Evitar que los textos se corten con '...' y asegurar ajuste perfecto */
.sidebar-saludplus .v-list-item-title {
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: unset !important;
  line-height: 1.3 !important;
  font-size: 0.93rem !important;
  word-break: normal !important;
}

.sidebar-saludplus .v-list-item__content {
  overflow: visible !important;
}

.item-menu-lateral {
  min-height: 48px !important;
  padding-top: 8px !important;
  padding-bottom: 8px !important;
}

.border {
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
