<template>
  <LayoutPrincipal>
    <!-- Cabecera -->
    <div class="mb-6 mt-2">
      <h2 class="text-h4 font-weight-bold text-primary mb-1">¡Hola, {{ almacenAuth.usuario?.nombres.split(' ')[0] }}!</h2>
      <p class="text-grey-darken-1 text-body-1">Bienvenido a tu portal de servicios de salud</p>
    </div>

    <!-- Banner Hero -->
    <v-card class="mb-8 overflow-hidden position-relative" rounded="xl" color="#f4f9f1" elevation="0" style="border: 1px solid #e2ebd9;">
      <v-row no-gutters>
        <v-col cols="12" md="6" class="pa-8 d-flex flex-column justify-center z-index-1">
          <h1 class="text-h4 text-md-h3 font-weight-bold mb-2 text-primary" style="line-height: 1.2;">
            Tu salud, <br />
            <span class="text-secondary">nuestra prioridad</span>
          </h1>
          <p class="text-body-1 text-grey-darken-2 mb-6 mt-2 pr-md-4">
            Accede fácilmente a tus citas, resultados, información médica y más servicios en un solo lugar.
          </p>
          <div>
            <v-btn color="primary" size="large" rounded="pill" prepend-icon="mdi-calendar-check" to="/citas" class="text-none font-weight-bold px-6">
              Ver mis citas
            </v-btn>
          </div>
        </v-col>
        <v-col cols="12" md="6" class="position-relative d-none d-md-block">
          <v-img
            src="/hero_banner.png"
            cover
            height="100%"
            width="100%"
            class="position-absolute"
            style="top: 0; right: 0; mask-image: linear-gradient(to right, transparent 0%, black 20%); -webkit-mask-image: linear-gradient(to right, transparent 0%, black 20%);"
          ></v-img>
        </v-col>
      </v-row>
    </v-card>

    <!-- Accesos rápidos -->
    <h3 class="text-h6 font-weight-bold text-primary mb-4">Accesos rápidos</h3>
    <v-row class="mb-8">
      <v-col cols="12" sm="6" md="3" v-for="acceso in accesosRapidos" :key="acceso.titulo">
        <v-card :to="acceso.ruta" class="h-100 acceso-card border transition-swing" elevation="0" rounded="xl">
          <v-card-text class="pa-5 d-flex flex-column h-100 position-relative">
            <v-avatar color="#f4f9f1" size="56" class="mb-4 text-secondary">
              <v-icon size="32">{{ acceso.icono }}</v-icon>
            </v-avatar>
            <div class="text-subtitle-1 font-weight-bold text-primary mb-1">{{ acceso.titulo }}</div>
            <div class="text-caption text-grey-darken-1 mb-4" style="line-height:1.3">{{ acceso.descripcion }}</div>
            
            <v-icon color="secondary" class="mt-auto align-self-end absolute-bottom-right" size="24">mdi-arrow-right</v-icon>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Columnas inferiores: Próxima cita y Notificaciones -->
    <v-row>
      <!-- Próxima Cita -->
      <v-col cols="12" md="6">
        <div class="d-flex justify-space-between align-center mb-4">
          <h3 class="text-h6 font-weight-bold text-primary">Próxima cita</h3>
          <v-btn variant="text" color="primary" size="small" class="text-none font-weight-bold">Ver todas</v-btn>
        </div>
        <v-card elevation="0" rounded="xl" class="border pa-6 h-100 d-flex align-center">
          <div v-if="proximaCita" class="d-flex flex-column flex-sm-row w-100 align-center align-sm-start text-center text-sm-left gap-4">
            <!-- Bloque fecha -->
            <v-card color="primary" rounded="lg" class="text-center text-white flex-shrink-0" width="80" height="90" elevation="0">
              <div class="text-caption font-weight-bold pt-2 text-uppercase opacity-80">{{ mesProximaCita }}</div>
              <div class="text-h4 font-weight-bold pb-2">{{ diaProximaCita }}</div>
              <div class="text-caption opacity-80 pb-2" style="margin-top:-8px">{{ anioProximaCita }}</div>
            </v-card>
            
            <!-- Detalles -->
            <div class="ml-sm-4 flex-grow-1">
              <div class="text-subtitle-1 font-weight-bold text-primary mb-1">Medicina General</div>
              <div class="text-body-2 text-grey-darken-2 mb-2">Dra. Laura Martínez</div>
              <div class="d-flex align-center justify-center justify-sm-start gap-1 text-body-2 text-primary mb-1">
                <v-icon size="16">mdi-clock-outline</v-icon>
                <span>{{ horaProximaCita }}</span>
              </div>
              <div class="d-flex align-center justify-center justify-sm-start gap-1 text-body-2 text-primary">
                <v-icon size="16">mdi-map-marker-outline</v-icon>
                <span>Consultorio 203</span>
              </div>
            </div>

            <!-- Icono decorativo -->
            <v-icon size="100" color="#f4f9f1" class="ml-auto d-none d-sm-block">mdi-calendar-clock-outline</v-icon>
          </div>
          <div v-else class="text-center w-100 py-8 text-grey-darken-1">
            No tienes citas próximas.
          </div>
        </v-card>
      </v-col>

      <!-- Notificaciones -->
      <v-col cols="12" md="6">
        <div class="d-flex justify-space-between align-center mb-4">
          <h3 class="text-h6 font-weight-bold text-primary">Notificaciones</h3>
          <v-btn variant="text" color="primary" size="small" class="text-none font-weight-bold">Ver todas</v-btn>
        </div>
        <v-card elevation="0" rounded="xl" class="border pa-2 h-100">
          <v-list lines="two" bg-color="transparent" class="py-0">
            <v-list-item v-for="(notificacion, index) in notificaciones" :key="index" :class="{'border-b': index < notificaciones.length - 1}">
              <template v-slot:prepend>
                <v-avatar :color="notificacion.color" size="48" class="mr-4 text-white">
                  <v-icon>{{ notificacion.icono }}</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="text-body-2 font-weight-bold text-grey-darken-3 mb-1">{{ notificacion.titulo }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption text-grey-darken-1">{{ notificacion.subtitulo }}</v-list-item-subtitle>
              <template v-slot:append>
                <div class="d-flex align-center h-100">
                  <div style="width: 8px; height: 8px; border-radius: 50%; background-color: #9cc516;"></div>
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- Footer -->
    <div class="mt-8 d-flex flex-column flex-md-row justify-space-between align-center bg-grey-lighten-4 pa-4 rounded-xl">
      <div class="d-flex align-center gap-2 mb-2 mb-md-0 text-primary">
        <v-icon color="secondary">mdi-shield-check-outline</v-icon>
        <span class="text-caption font-weight-medium">Tus datos están protegidos con los más altos estándares de seguridad.</span>
      </div>
      <div class="text-caption font-weight-medium text-primary d-flex gap-2">
        <a href="#" class="text-decoration-none text-primary opacity-80 hover-opacity-100">Política de privacidad</a>
        <span class="opacity-40">|</span>
        <a href="#" class="text-decoration-none text-primary opacity-80 hover-opacity-100">Términos y condiciones</a>
      </div>
    </div>

  </LayoutPrincipal>
</template>

<script setup>
import { ref, computed } from 'vue'
import LayoutPrincipal from '../layouts/LayoutPrincipal.vue'
import { useAlmacenAutenticacion } from '../stores/autenticacion.store'

const almacenAuth = useAlmacenAutenticacion()

const accesosRapidos = [
  { titulo: 'Mis citas', descripcion: 'Consulta y gestiona tus citas médicas', icono: 'mdi-calendar-multiselect', ruta: '/citas' },
  { titulo: 'Resultados', descripcion: 'Consulta tus resultados de exámenes', icono: 'mdi-flask', ruta: '/resultados' },
  { titulo: 'Historia clínica', descripcion: 'Revisa tu información clínica', icono: 'mdi-folder-account', ruta: '/historia' },
  { titulo: 'Medicamentos', descripcion: 'Consulta tus medicamentos formulados', icono: 'mdi-pill', ruta: '/medicamentos' },
]

// Mock de próxima cita
const proximaCita = ref(true)
const mesProximaCita = 'MAY'
const diaProximaCita = '28'
const anioProximaCita = '2024'
const horaProximaCita = '10:00 a. m.'

// Mock de notificaciones
const notificaciones = [
  { titulo: 'Tu cita del 28 de mayo está confirmada', subtitulo: 'Hace 2 horas', icono: 'mdi-calendar-check', color: 'primary' },
  { titulo: 'Resultados disponibles', subtitulo: 'Examen de laboratorio • Hace 1 día', icono: 'mdi-flask', color: 'secondary' },
  { titulo: 'Tu factura electrónica ya está disponible', subtitulo: 'Hace 3 días', icono: 'mdi-receipt-text-outline', color: 'primary' },
]
</script>

<style scoped>
.border {
  border: 1px solid #EAECEF !important;
}

.border-b {
  border-bottom: 1px solid #EAECEF !important;
}

.acceso-card:hover {
  border-color: rgb(var(--v-theme-secondary)) !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
  transform: translateY(-2px);
}

.absolute-bottom-right {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.hover-opacity-100:hover {
  opacity: 1 !important;
}

.z-index-1 {
  z-index: 1;
}
</style>
