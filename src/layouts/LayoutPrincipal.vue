<template>
  <v-app>
    <!-- Barra de navegación lateral -->
    <v-navigation-drawer v-model="cajoneAbierto" :rail="rielesModo" color="primary" permanent class="sidebar-saludplus">
      <!-- Logo / Título -->
      <div class="pa-4 d-flex align-center gap-3">
        <template v-if="almacenConfiguracion.logoUrl">
          <v-img :src="almacenConfiguracion.logoUrl" max-height="40" max-width="40" contain />
        </template>
        <template v-else>
          <v-icon icon="mdi-heart-pulse" size="40" color="white" />
        </template>

        <div v-if="!rielesModo" class="text-white">
          <div class="text-h6 font-weight-bold lh-1" style="line-height: 1.2;">{{ almacenConfiguracion.nombreEntidad }}
          </div>
          <div class="text-caption opacity-80">Portal del Paciente</div>
        </div>
      </div>

      <v-divider />

      <!-- Menú de navegación -->
      <v-list class="px-2">
        <v-list-item v-for="elemento in elementosMenu" :key="elemento.nombre" :prepend-icon="elemento.icono"
          :title="elemento.titulo" :value="elemento.nombre" :to="elemento.ruta" rounded="xl"
          active-color="primary-darken-1" color="secondary" class="mb-1 text-white font-weight-medium" />

        <!-- Separador y sección super admin -->
        <template v-if="esAdmin">
          <v-divider class="my-2" />
          <v-list-item prepend-icon="mdi-cog-outline" title="Configuración" value="configuracion" to="/configuracion"
            rounded="xl" active-color="primary-darken-1" color="secondary" class="mb-1 text-white font-weight-medium" />
        </template>

        <template v-if="esSuperAdmin">
          <v-divider class="my-2" />
          <v-list-subheader v-if="!rielesModo" class="text-caption">
            SUPER ADMIN
          </v-list-subheader>
          <v-list-item prepend-icon="mdi-domain" title="Tenants" value="tenants" to="/tenants" rounded="lg"
            active-color="deep-purple" color="deep-purple">
            <template v-slot:append v-if="!rielesModo">
              <v-icon icon="mdi-shield-crown" size="14" color="deep-purple" />
            </template>
          </v-list-item>
        </template>
        <v-list-item prepend-icon="mdi-logout" title="Cerrar sesión" rounded="xl"
          class="text-white font-weight-medium mt-2" @click="confirmarCierreSesion" />
      </v-list>

      <template v-slot:append>
        <div class="pa-4" v-if="!rielesModo">
          <v-card color="primary-darken-1" rounded="xl" elevation="0" class="pa-4 text-white text-center border">
            <v-icon icon="mdi-headset" size="32" class="mb-2" />
            <div class="text-subtitle-2 font-weight-bold mb-1">¿Necesitas ayuda?</div>
            <div class="text-caption opacity-80 mb-4 lh-normal" style="line-height:1.2;">
              Contáctanos, estamos para ayudarte.
            </div>
            <v-btn color="secondary" variant="flat" block rounded="xl" class="text-primary font-weight-bold text-none">
              Contáctanos
            </v-btn>
          </v-card>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Barra superior -->
    <v-app-bar color="background" elevation="0" class="px-4">
      <template v-slot:append>
        <div class="d-flex align-center gap-4">
          <!-- Botón notificaciones -->
          <v-btn icon color="grey-darken-2" variant="text">
            <v-badge color="secondary" content="2" dot>
              <v-icon size="28">mdi-bell-outline</v-icon>
            </v-badge>
          </v-btn>

          <!-- Perfil usuario -->
          <div class="d-flex align-center gap-2 cursor-pointer bg-white px-3 py-1 rounded-pill border">
            <v-avatar color="green-lighten-5" size="36">
              <v-icon color="primary">mdi-account-outline</v-icon>
            </v-avatar>
            <div>
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
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAlmacenAutenticacion } from '../stores/autenticacion.store'
import { useAlmacenConfiguracion } from '../stores/configuracion.store'
import { usarAlertas } from '../composables/usarAlertas'

const almacenAuth = useAlmacenAutenticacion()
const almacenConfiguracion = useAlmacenConfiguracion()
const enrutador = useRouter()
const rutaActual = useRoute()
const { confirmarEliminacion } = usarAlertas()

const nombreApp = import.meta.env.VITE_NOMBRE_APP || 'Portal Paciente'
const cajoneAbierto = ref(true)
const rielesModo = ref(false)

const elementosMenu = [
  { nombre: 'dashboard', titulo: 'Inicio', icono: 'mdi-home-outline', ruta: '/' },
  { nombre: 'citas', titulo: 'Mis citas', icono: 'mdi-calendar-check', ruta: '/citas' },
  { nombre: 'resultados', titulo: 'Resultados de exámenes', icono: 'mdi-flask-outline', ruta: '/resultados' },
  { nombre: 'historia', titulo: 'Historia clínica', icono: 'mdi-file-document-outline', ruta: '/historia' },
  { nombre: 'medicamentos', titulo: 'Medicamentos', icono: 'mdi-pill', ruta: '/medicamentos' },
  // { nombre: 'facturacion', titulo: 'Facturación', icono: 'mdi-receipt-text-outline', ruta: '/facturacion' },
  // { nombre: 'mensajes', titulo: 'Mensajes', icono: 'mdi-message-outline', ruta: '/mensajes' },
  // { nombre: 'perfil', titulo: 'Mi perfil', icono: 'mdi-account-outline', ruta: '/perfil' },
]

const CORREO_SUPER_ADMIN = 'admin@codepyme.com'
const esSuperAdmin = computed(
  () => almacenAuth.usuario?.correoElectronico === CORREO_SUPER_ADMIN,
)
const esAdmin = computed(
  () => almacenAuth.usuario?.rol === 'administrador',
)

const titulosExtra = {
  '/tenants': 'Gestión de Tenants',
}

const tituloRutaActual = computed(() => {
  const elemento = elementosMenu.find((e) => e.ruta === rutaActual.path)
  return elemento?.titulo || titulosExtra[rutaActual.path] || 'Portal Paciente'
})

async function confirmarCierreSesion() {
  const confirmado = await confirmarEliminacion('tu sesión')
  if (confirmado) {
    almacenAuth.cerrarSesion()
    enrutador.push({ name: 'iniciar-sesion' })
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

.border {
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
