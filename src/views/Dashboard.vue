<template>
  <LayoutPrincipal>
    <div class="mb-6 mt-2">
      <h1 class="text-h4 font-weight-bold text-primary mb-1">¡Hola, {{ primerNombre }}!</h1>
      <p class="text-grey-darken-1 text-body-1">Bienvenido a tu portal de servicios de salud</p>
    </div>

    <!-- Banner Hero -->
    <v-card class="mb-8 overflow-hidden position-relative" rounded="xl" color="#f4f9f1" elevation="0" style="border: 1px solid #e2ebd9;">
      <v-row no-gutters>
        <v-col cols="12" md="6" class="pa-8 d-flex flex-column justify-center z-index-1">
          <h2 class="text-h4 text-md-h3 font-weight-bold mb-2 text-primary" style="line-height: 1.2;">
            Tu salud, <br />
            <span class="text-secondary">nuestra prioridad</span>
          </h2>
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

    <!-- Servicios disponibles -->
    <h2 class="text-subtitle-1 font-weight-black text-slate-900 text-uppercase mb-4" style="letter-spacing: 0.05em;">
      SERVICIOS DISPONIBLES
    </h2>
    <v-row class="mb-8">
      <v-col cols="12" sm="6" md="4" v-for="servicio in serviciosDisponibles" :key="servicio.titulo">
        <v-card :to="servicio.ruta" class="h-100 tarjeta-servicio border transition-swing" elevation="0" rounded="xl">
          <v-card-text class="pa-6 d-flex flex-column h-100">
            <!-- Icono con fondo redondeado -->
            <div class="caja-icono-servicio mb-5" :style="{ backgroundColor: servicio.colorFondo }">
              <v-icon size="28" :color="servicio.colorIcono">{{ servicio.icono }}</v-icon>
            </div>

            <!-- Título y descripción -->
            <div class="text-h6 font-weight-bold text-slate-800 mb-1">{{ servicio.titulo }}</div>
            <div class="text-body-2 text-medium-emphasis mb-6" style="line-height: 1.4;">{{ servicio.descripcion }}</div>

            <!-- Acción INGRESAR > -->
            <div class="mt-auto d-flex align-center text-primary font-weight-black text-caption link-ingresar" style="letter-spacing: 0.06em;">
              <span>INGRESAR</span>
              <v-icon size="16" class="ml-1">mdi-chevron-right</v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Columnas inferiores: Próxima cita y Notificaciones -->
    <v-row>
      <!-- Próxima Cita en Vivo -->
      <v-col cols="12" md="6">
        <div class="d-flex justify-space-between align-center mb-4">
          <h2 class="text-h6 font-weight-bold text-primary">Próxima cita</h2>
          <v-btn variant="text" color="primary" size="small" class="text-none font-weight-bold" to="/citas">Ver todas</v-btn>
        </div>
        <v-card elevation="0" rounded="xl" class="border pa-6 h-100 d-flex align-center">
          <div v-if="cargandoCitas" class="text-center w-100 py-6">
            <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
          </div>
          <div v-else-if="citaDestacada" class="d-flex flex-column flex-sm-row w-100 align-center align-sm-start text-center text-sm-left gap-4">
            <!-- Bloque fecha -->
            <v-card color="primary" rounded="lg" class="text-center text-white flex-shrink-0" width="85" height="95" elevation="0">
              <div class="text-caption font-weight-bold pt-2 text-uppercase opacity-80">{{ obtenerMes(citaDestacada.fecha || citaDestacada.fechaCita) }}</div>
              <div class="text-h4 font-weight-bold pb-1">{{ obtenerDia(citaDestacada.fecha || citaDestacada.fechaCita) }}</div>
              <div class="text-caption opacity-80 pb-2" style="margin-top:-6px">{{ obtenerAnio(citaDestacada.fecha || citaDestacada.fechaCita) }}</div>
            </v-card>
            
            <!-- Detalles -->
            <div class="ml-sm-4 flex-grow-1">
              <div class="d-flex align-center gap-2 mb-1 justify-center justify-sm-start">
                <span class="text-subtitle-1 font-weight-bold text-primary">{{ citaDestacada.especialidad || 'Consulta Médica' }}</span>
                <v-chip size="x-small" :color="citaDestacada.modoAtencion === 'Virtual' ? 'purple' : 'teal'" variant="tonal">
                  {{ citaDestacada.modoAtencion || 'Presencial' }}
                </v-chip>
              </div>
              <div class="text-body-2 text-grey-darken-2 mb-2">{{ citaDestacada.medicoTratante || citaDestacada.medicoResponsable || 'Médico Tratante' }}</div>
              <div class="d-flex align-center justify-center justify-sm-start gap-1 text-body-2 text-primary mb-1">
                <v-icon size="16">mdi-clock-outline</v-icon>
                <span>{{ formatearHora(citaDestacada.hora || citaDestacada.horaInicio) }}</span>
              </div>
              <div v-if="citaDestacada.ubicacion || citaDestacada.descUnidadEdificio" class="d-flex align-center justify-center justify-sm-start gap-1 text-body-2 text-primary">
                <v-icon size="16">mdi-map-marker-outline</v-icon>
                <span>{{ citaDestacada.ubicacion }} {{ citaDestacada.descUnidadEdificio ? '- ' + citaDestacada.descUnidadEdificio : '' }}</span>
              </div>
            </div>

            <!-- Icono decorativo -->
            <v-icon size="80" color="#f4f9f1" class="ml-auto d-none d-sm-block">mdi-calendar-clock-outline</v-icon>
          </div>
          <div v-else class="text-center w-100 py-8 text-grey-darken-1">
            <v-icon size="36" color="grey-lighten-1" class="mb-2">mdi-calendar-blank-outline</v-icon>
            <div>No tienes citas próximas programadas.</div>
          </div>
        </v-card>
      </v-col>

      <!-- Notificaciones -->
      <v-col cols="12" md="6">
        <div class="d-flex justify-space-between align-center mb-4">
          <h2 class="text-h6 font-weight-bold text-primary">Notificaciones</h2>
          <v-btn variant="text" color="primary" size="small" class="text-none font-weight-bold">Ver todas</v-btn>
        </div>
        <v-card elevation="0" rounded="xl" class="border pa-2 h-100">
          <v-list lines="two">
            <v-list-item
              v-for="(notif, i) in notificaciones"
              :key="i"
              :class="{ 'border-b': i < notificaciones.length - 1 }"
              class="py-3 px-4"
            >
              <template v-slot:prepend>
                <v-avatar :color="notif.color === 'primary' ? 'green-lighten-5' : 'light-green-lighten-5'" class="mr-3">
                  <v-icon :color="notif.color === 'primary' ? 'primary' : 'secondary'">{{ notif.icono }}</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-medium text-body-2 text-primary">{{ notif.titulo }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption text-grey-darken-1">{{ notif.subtitulo }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </LayoutPrincipal>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import LayoutPrincipal from '../layouts/LayoutPrincipal.vue'
import { useAlmacenAutenticacion } from '../stores/autenticacion.store'
import { useAlmacenCitas } from '../stores/citas.store'

const almacenAuth = useAlmacenAutenticacion()
const almacenCitas = useAlmacenCitas()
const cargandoCitas = ref(false)

const primerNombre = computed(() => {
  const nombres = almacenAuth.paciente?.nombres || almacenAuth.usuario?.nombres || 'Paciente'
  return nombres.trim().split(/\s+/)[0]
})

const serviciosDisponibles = [
  {
    titulo: 'Historia Clínica',
    descripcion: 'Evoluciones y epicrisis médicas.',
    icono: 'mdi-file-document-outline',
    colorIcono: '#059669',
    colorFondo: '#ecfdf5',
    ruta: '/historia',
  },
  {
    titulo: 'Citas Médicas',
    descripcion: 'Programación y cancelación.',
    icono: 'mdi-calendar-blank-outline',
    colorIcono: '#2563eb',
    colorFondo: '#eff6ff',
    ruta: '/citas',
  },
  {
    titulo: 'Ayudas Diagnósticas',
    descripcion: 'Laboratorios e imágenes.',
    icono: 'mdi-pulse',
    colorIcono: '#7c3aed',
    colorFondo: '#f5f3ff',
    ruta: '/resultados',
  },
]

const citaDestacada = computed(() => {
  if (almacenCitas.listaCitas && almacenCitas.listaCitas.length > 0) {
    return almacenCitas.listaCitas[0]
  }
  return null
})

const mesesCortos = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']

function obtenerMes(fecha) {
  if (!fecha) return '---'
  const partes = fecha.split('-')
  if (partes.length === 3) {
    const mesIndex = parseInt(partes[1], 10) - 1
    return mesesCortos[mesIndex] || '---'
  }
  const obj = new Date(fecha)
  return isNaN(obj.getTime()) ? '---' : mesesCortos[obj.getMonth()]
}

function obtenerDia(fecha) {
  if (!fecha) return '--'
  const partes = fecha.split('-')
  if (partes.length === 3) {
    return partes[2]
  }
  const obj = new Date(fecha)
  return isNaN(obj.getTime()) ? '--' : String(obj.getDate()).padStart(2, '0')
}

function obtenerAnio(fecha) {
  if (!fecha) return '----'
  const partes = fecha.split('-')
  if (partes.length === 3) {
    return partes[0]
  }
  const obj = new Date(fecha)
  return isNaN(obj.getTime()) ? '----' : String(obj.getFullYear())
}

function formatearHora(hora) {
  if (!hora) return 'Por definir'
  const partes = hora.split(':')
  if (partes.length >= 2) {
    let horas = parseInt(partes[0], 10)
    const minutos = partes[1]
    const ampm = horas >= 12 ? 'p. m.' : 'a. m.'
    horas = horas % 12
    horas = horas ? horas : 12
    return `${String(horas).padStart(2, '0')}:${minutos} ${ampm}`
  }
  return hora
}

// Mock de notificaciones
const notificaciones = [
  { titulo: 'Tu agenda médica está sincronizada con SAP', subtitulo: 'Actualizado recientemente', icono: 'mdi-calendar-check', color: 'primary' },
  { titulo: 'Resultados de ayudas diagnósticas disponibles', subtitulo: 'Laboratorios e imágenes', icono: 'mdi-pulse', color: 'secondary' },
  { titulo: 'Historia clínica disponible para consulta', subtitulo: 'Evoluciones y epicrisis', icono: 'mdi-file-document-outline', color: 'primary' },
]

onMounted(async () => {
  cargandoCitas.value = true
  try {
    await almacenCitas.obtenerMisCitas()
  } catch (e) {
    // Ignorar si no está autenticado o error
  } finally {
    cargandoCitas.value = false
  }
})
</script>

<style scoped>
.border {
  border: 1px solid #EAECEF !important;
}

.border-b {
  border-bottom: 1px solid #EAECEF !important;
}

.tarjeta-servicio {
  background-color: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  transition: all 0.25s ease-in-out !important;
}

.tarjeta-servicio:hover {
  border-color: rgb(var(--v-theme-primary)) !important;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03) !important;
  transform: translateY(-3px);
}

.caja-icono-servicio {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.link-ingresar {
  transition: all 0.2s ease-in-out;
}

.tarjeta-servicio:hover .link-ingresar {
  transform: translateX(4px);
}

.hover-opacity-100:hover {
  opacity: 1 !important;
}

.z-index-1 {
  z-index: 1;
}
</style>
