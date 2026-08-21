<template>
  <LayoutPrincipal>
    <!-- Controles superiores -->
    <div class="d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between mb-6 border-b pb-4">
      <div>
        <h1 class="text-h5 font-weight-bold text-primary mb-1">Citas Médicas</h1>
        <p class="text-caption text-grey-darken-1">Consulta y gestiona tu agenda de citas programadas en San Vicente Fundación</p>
      </div>
      <v-btn
        color="primary"
        rounded="pill"
        variant="tonal"
        class="font-weight-bold px-5 text-none mt-3 mt-sm-0"
        prepend-icon="mdi-refresh"
        :loading="almacenCitas.cargando"
        @click="cargarCitas"
      >
        Actualizar agenda
      </v-btn>
    </div>

    <!-- Barra de Búsqueda -->
    <v-row class="mb-4">
      <v-col cols="12" sm="8" md="6">
        <v-text-field
          v-model="filtroBusqueda"
          placeholder="Buscar por médico, especialidad, consultorio..."
          variant="outlined"
          density="comfortable"
          bg-color="white"
          rounded="lg"
          hide-details
          prepend-inner-icon="mdi-magnify"
          clearable
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <!-- Columna Principal: Lista de Citas -->
      <v-col cols="12" md="8">
        <!-- Cargando -->
        <div v-if="almacenCitas.cargando" class="text-center pa-12 bg-white rounded-xl border">
          <v-progress-circular indeterminate color="primary" size="48" width="4"></v-progress-circular>
          <div class="text-body-2 text-grey-darken-1 mt-4">Consultando tu agenda médica en el sistema...</div>
        </div>

        <!-- Sin citas -->
        <div v-else-if="!citasFiltradas || citasFiltradas.length === 0" class="text-center pa-12 bg-white rounded-xl border">
          <v-avatar color="#f4f9f1" size="72" class="mb-4 text-primary">
            <v-icon size="40">mdi-calendar-check-outline</v-icon>
          </v-avatar>
          <div class="text-h6 font-weight-bold text-primary mb-1">No tienes citas programadas</div>
          <div class="text-body-2 text-grey-darken-1 mb-4" style="max-width: 400px; margin: 0 auto;">
            En este momento no cuentas con citas pendientes en tu agenda médica.
          </div>
        </div>

        <template v-else>
          <!-- Próxima Cita Destacada -->
          <div v-if="proximaCita" class="mb-6">
            <div class="d-flex align-center justify-space-between mb-3">
              <h2 class="text-subtitle-1 font-weight-bold text-primary d-flex align-center gap-2">
                <v-icon color="secondary" size="20">mdi-star</v-icon>
                Tu próxima cita más cercana
              </h2>
              <span class="text-caption text-grey-darken-1">Cita ID: {{ proximaCita.idCita || proximaCita.id }}</span>
            </div>

            <v-card elevation="0" class="border rounded-xl d-flex flex-column flex-sm-row overflow-hidden tarjeta-cita proxima-destacada">
              <!-- Bloque Fecha -->
              <div class="bg-primary text-white d-flex flex-column align-center justify-center pa-4 text-center date-block" style="min-width: 110px;">
                <div class="text-caption font-weight-bold text-uppercase opacity-80">{{ obtenerMes(proximaCita.fecha || proximaCita.fechaCita) }}</div>
                <div class="text-h4 font-weight-black my-1">{{ obtenerDia(proximaCita.fecha || proximaCita.fechaCita) }}</div>
                <div class="text-caption font-weight-bold opacity-80">{{ obtenerAnio(proximaCita.fecha || proximaCita.fechaCita) }}</div>
              </div>

              <!-- Bloque Detalles -->
              <div class="d-flex flex-column flex-sm-row align-start align-sm-center flex-grow-1 pa-5 bg-white gap-4">
                <div class="flex-grow-1">
                  <div class="d-flex align-center gap-2 mb-1 flex-wrap">
                    <span class="text-h6 font-weight-bold text-primary">{{ proximaCita.especialidad || 'Consulta Médica' }}</span>
                    <v-chip
                      size="x-small"
                      :color="proximaCita.modoAtencion === 'Virtual' ? 'purple' : 'teal'"
                      variant="tonal"
                      class="font-weight-bold text-uppercase"
                    >
                      <v-icon start size="12">{{ proximaCita.modoAtencion === 'Virtual' ? 'mdi-video' : 'mdi-domain' }}</v-icon>
                      {{ proximaCita.modoAtencion || 'Presencial' }}
                    </v-chip>
                  </div>

                  <div class="text-body-2 font-weight-medium text-grey-darken-3 mb-3">
                    <v-icon size="16" color="primary" class="mr-1">mdi-account-tie</v-icon>
                    {{ proximaCita.medicoTratante || proximaCita.medicoResponsable || 'Médico Tratante' }}
                  </div>

                  <div class="d-flex flex-wrap align-center gap-4 text-caption text-grey-darken-1 font-weight-medium mb-3">
                    <div class="d-flex align-center gap-1">
                      <v-icon size="16" color="primary">mdi-clock-outline</v-icon>
                      {{ formatearHora(proximaCita.hora || proximaCita.horaInicio) }}
                    </div>
                    <div v-if="proximaCita.ubicacion || proximaCita.descUnidadEdificio" class="d-flex align-center gap-1">
                      <v-icon size="16" color="primary">mdi-map-marker-outline</v-icon>
                      <span>{{ proximaCita.ubicacion }} {{ proximaCita.descUnidadEdificio ? '- ' + proximaCita.descUnidadEdificio : '' }}</span>
                    </div>
                    <div v-if="proximaCita.aseguradora" class="d-flex align-center gap-1">
                      <v-icon size="16" color="primary">mdi-shield-check-outline</v-icon>
                      <span>{{ proximaCita.aseguradora }}</span>
                    </div>
                  </div>

                  <!-- Botón Cancelar Cita -->
                  <div class="d-flex justify-end pt-1">
                    <v-btn
                      variant="tonal"
                      color="error"
                      size="small"
                      rounded="pill"
                      prepend-icon="mdi-calendar-remove"
                      class="text-none font-weight-bold px-4"
                      @click="abrirModalCancelar(proximaCita)"
                    >
                      Cancelar esta cita
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-card>
          </div>

          <!-- Resto de la Agenda -->
          <div v-if="otrasCitas.length > 0">
            <h2 class="text-subtitle-1 font-weight-bold text-primary mb-3">Otras citas agendadas ({{ otrasCitas.length }})</h2>

            <v-card
              v-for="cita in otrasCitas"
              :key="cita.idCita || cita.id"
              elevation="0"
              class="border rounded-xl d-flex flex-column flex-sm-row overflow-hidden mb-3 tarjeta-cita"
            >
              <!-- Bloque Fecha -->
              <div class="bg-grey-lighten-4 text-primary d-flex flex-column align-center justify-center pa-3 text-center date-block-light" style="min-width: 90px;">
                <div class="text-caption font-weight-bold text-uppercase opacity-70">{{ obtenerMes(cita.fecha || cita.fechaCita) }}</div>
                <div class="text-h5 font-weight-black my-1 text-primary">{{ obtenerDia(cita.fecha || cita.fechaCita) }}</div>
                <div class="text-caption font-weight-bold opacity-70">{{ obtenerAnio(cita.fecha || cita.fechaCita) }}</div>
              </div>

              <!-- Bloque Detalles -->
              <div class="d-flex flex-column flex-sm-row align-start align-sm-center flex-grow-1 pa-4 bg-white gap-3">
                <div class="flex-grow-1">
                  <div class="d-flex align-center gap-2 mb-1 flex-wrap">
                    <span class="text-subtitle-1 font-weight-bold text-primary">{{ cita.especialidad || 'Consulta Médica' }}</span>
                    <v-chip
                      size="x-small"
                      :color="cita.modoAtencion === 'Virtual' ? 'purple' : 'teal'"
                      variant="tonal"
                      class="font-weight-bold text-uppercase"
                    >
                      <v-icon start size="12">{{ cita.modoAtencion === 'Virtual' ? 'mdi-video' : 'mdi-domain' }}</v-icon>
                      {{ cita.modoAtencion || 'Presencial' }}
                    </v-chip>
                  </div>

                  <div class="text-body-2 text-grey-darken-3 mb-2">
                    <v-icon size="15" color="primary" class="mr-1">mdi-account-tie</v-icon>
                    {{ cita.medicoTratante || cita.medicoResponsable || 'Médico Tratante' }}
                  </div>

                  <div class="d-flex flex-wrap align-center gap-3 text-caption text-grey-darken-1 mb-2">
                    <div class="d-flex align-center gap-1">
                      <v-icon size="14" color="primary">mdi-clock-outline</v-icon>
                      {{ formatearHora(cita.hora || cita.horaInicio) }}
                    </div>
                    <div v-if="cita.ubicacion || cita.descUnidadEdificio" class="d-flex align-center gap-1">
                      <v-icon size="14" color="primary">mdi-map-marker-outline</v-icon>
                      <span>{{ cita.ubicacion }} {{ cita.descUnidadEdificio ? '- ' + cita.descUnidadEdificio : '' }}</span>
                    </div>
                    <div v-if="cita.aseguradora" class="d-flex align-center gap-1">
                      <v-icon size="14" color="primary">mdi-shield-check-outline</v-icon>
                      <span>{{ cita.aseguradora }}</span>
                    </div>
                  </div>

                  <!-- Botón Cancelar -->
                  <div class="d-flex justify-end pt-1">
                    <v-btn
                      variant="tonal"
                      color="error"
                      size="small"
                      rounded="pill"
                      prepend-icon="mdi-calendar-remove"
                      class="text-none font-weight-bold px-3"
                      @click="abrirModalCancelar(cita)"
                    >
                      Cancelar cita
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-card>
          </div>
        </template>
      </v-col>

      <!-- Columna Lateral: Información de Apoyo -->
      <v-col cols="12" md="4">
        <!-- Tarjeta de Información -->
        <v-card elevation="0" class="border rounded-xl bg-white mb-4">
          <v-card-text class="pa-5">
            <h3 class="text-subtitle-1 font-weight-bold text-primary mb-3 d-flex align-center gap-2">
              <v-icon color="primary" size="20">mdi-information-outline</v-icon>
              Recomendaciones
            </h3>

            <v-list density="compact" class="pa-0 bg-transparent">
              <v-list-item class="px-0 py-2">
                <template v-slot:prepend>
                  <v-avatar color="#f4f9f1" size="32" class="mr-3">
                    <v-icon size="16" color="secondary">mdi-clock-fast</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-caption font-weight-bold">Puntualidad</v-list-item-title>
                <v-list-item-subtitle class="text-caption text-grey-darken-1">Presentarse 20 minutos antes de la hora programada.</v-list-item-subtitle>
              </v-list-item>

              <v-list-item class="px-0 py-2">
                <template v-slot:prepend>
                  <v-avatar color="#f4f9f1" size="32" class="mr-3">
                    <v-icon size="16" color="secondary">mdi-card-account-details-outline</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-caption font-weight-bold">Documentos</v-list-item-title>
                <v-list-item-subtitle class="text-caption text-grey-darken-1">Llevar tu documento de identidad y autorización de tu EPS si aplica.</v-list-item-subtitle>
              </v-list-item>

              <v-list-item class="px-0 py-2">
                <template v-slot:prepend>
                  <v-avatar color="#f4f9f1" size="32" class="mr-3">
                    <v-icon size="16" color="secondary">mdi-video-check</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-caption font-weight-bold">Citas Virtuales</v-list-item-title>
                <v-list-item-subtitle class="text-caption text-grey-darken-1">Verifica tu conexión y cámara antes de iniciar la teleconsulta.</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <!-- Sede y Contacto -->
        <v-card elevation="0" class="border rounded-xl bg-white pa-5">
          <h3 class="text-subtitle-1 font-weight-bold text-primary mb-2">Línea de Atención</h3>
          <p class="text-caption text-grey-darken-1 mb-4">
            Para dudas sobre tus citas o reprogramaciones, comunícate con nuestras líneas de atención:
          </p>
          <div class="d-flex align-center gap-2 text-body-2 font-weight-bold text-primary mb-2">
            <v-icon size="18" color="secondary">mdi-phone</v-icon>
            <span>(604) 444 13 33 (Medellín)</span>
          </div>
          <div class="d-flex align-center gap-2 text-body-2 font-weight-bold text-primary">
            <v-icon size="18" color="secondary">mdi-phone</v-icon>
            <span>(604) 569 88 88 (Rionegro)</span>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo Modal de Cancelación de Cita con Auditoría -->
    <v-dialog v-model="dialogoCancelarVisible" max-width="540" persistent>
      <v-card rounded="xl">
        <v-card-title class="d-flex align-center pa-5 bg-red-lighten-5 text-red-darken-4">
          <v-avatar color="red-lighten-4" size="36" class="mr-3">
            <v-icon color="red-darken-3" size="20">mdi-calendar-remove</v-icon>
          </v-avatar>
          <span class="text-subtitle-1 font-weight-bold">Cancelar Cita Médica</span>
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" size="small" color="grey-darken-1" @click="cerrarModalCancelar" />
        </v-card-title>

        <v-card-text class="pa-5">
          <!-- Resumen de la cita a cancelar -->
          <div v-if="citaSeleccionada" class="pa-4 bg-grey-lighten-4 rounded-lg mb-4 border">
            <div class="text-subtitle-2 font-weight-bold text-primary mb-1">
              {{ citaSeleccionada.especialidad || 'Consulta Médica' }}
            </div>
            <div class="text-caption text-grey-darken-2 mb-1">
              <strong>Médico:</strong> {{ citaSeleccionada.medicoTratante || citaSeleccionada.medicoResponsable || 'Médico Tratante' }}
            </div>
            <div class="text-caption text-grey-darken-2 mb-1">
              <strong>Fecha y Hora:</strong> {{ citaSeleccionada.fecha }} a las {{ formatearHora(citaSeleccionada.hora) }}
            </div>
            <div v-if="citaSeleccionada.ubicacion || citaSeleccionada.descUnidadEdificio" class="text-caption text-grey-darken-2">
              <strong>Lugar:</strong> {{ citaSeleccionada.ubicacion }} {{ citaSeleccionada.descUnidadEdificio ? '- ' + citaSeleccionada.descUnidadEdificio : '' }}
            </div>
          </div>

          <v-form ref="refFormCancelacion" v-model="formCancelacionValido">
            <!-- Selector de Motivo Oficial SAP -->
            <v-select
              v-model="formularioCancelacion.idMotivo"
              label="Motivo de cancelación *"
              :items="motivosCancelacion"
              item-title="texto"
              item-value="valor"
              :rules="[(v) => !!v || 'Debe seleccionar un motivo de cancelación']"
              variant="outlined"
              density="comfortable"
              color="primary"
              class="mb-3"
            ></v-select>

            <!-- Observaciones Adicionales -->
            <v-textarea
              v-model="formularioCancelacion.observaciones"
              label="Observaciones o comentarios adicionales (opcional)"
              placeholder="Explica brevemente la razón de la cancelación..."
              variant="outlined"
              density="comfortable"
              color="primary"
              rows="3"
              hide-details
            ></v-textarea>
          </v-form>

          <v-alert type="warning" variant="tonal" density="compact" class="mt-4 text-caption" rounded="lg">
            Esta acción liberará el espacio en la agenda médica de la institución. Quedará registro de auditoría de esta solicitud.
          </v-alert>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4 bg-grey-lighten-5">
          <v-spacer />
          <v-btn variant="text" @click="cerrarModalCancelar" class="text-none font-weight-medium">
            Volver
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            rounded="pill"
            class="text-none font-weight-bold px-5"
            :loading="procesandoCancelacion"
            :disabled="!formularioCancelacion.idMotivo"
            @click="confirmarCancelacionCita"
          >
            Confirmar cancelación
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </LayoutPrincipal>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import LayoutPrincipal from '../../layouts/LayoutPrincipal.vue'
import { useAlmacenCitas } from '../../stores/citas.store'
import { usarAlertas } from '../../composables/usarAlertas'

const almacenCitas = useAlmacenCitas()
const { mostrarExito, mostrarError } = usarAlertas()

const filtroBusqueda = ref('')

// Modal y Cancelación
const dialogoCancelarVisible = ref(false)
const citaSeleccionada = ref(null)
const procesandoCancelacion = ref(false)
const formCancelacionValido = ref(false)
const refFormCancelacion = ref(null)

const motivosCancelacion = [
  { valor: 'M11', texto: 'Paciente no puede asistir / No acepta cita' },
  { valor: 'M02', texto: 'Condición clínica del paciente' },
  { valor: 'M09', texto: 'Mejoría en el estado de salud' },
  { valor: 'N22', texto: 'No preparado para la cita/consulta' },
  { valor: 'N23', texto: 'Paciente hospitalizado' },
  { valor: 'N26', texto: 'Inconvenientes de transporte o económicos' },
]

const formularioCancelacion = reactive({
  idMotivo: 'M11',
  observaciones: '',
})

function abrirModalCancelar(cita) {
  citaSeleccionada.value = cita
  formularioCancelacion.idMotivo = 'M11'
  formularioCancelacion.observaciones = ''
  dialogoCancelarVisible.value = true
}

function cerrarModalCancelar() {
  dialogoCancelarVisible.value = false
  citaSeleccionada.value = null
}

async function confirmarCancelacionCita() {
  if (!citaSeleccionada.value) return

  procesandoCancelacion.value = true
  try {
    const idCita = citaSeleccionada.value.idCita || citaSeleccionada.value.id

    const respuesta = await almacenCitas.cancelarCitaSap({
      idCita,
      idMotivo: formularioCancelacion.idMotivo,
      observaciones: formularioCancelacion.observaciones,
      datosCita: { ...citaSeleccionada.value },
    })

    await mostrarExito(respuesta?.mensaje || 'La cita ha sido cancelada exitosamente.')
    cerrarModalCancelar()
  } catch (error) {
    const mensaje = error.response?.data?.message || error.message || 'No fue posible cancelar la cita.'
    mostrarError(mensaje)
  } finally {
    procesandoCancelacion.value = false
  }
}

const citasFiltradas = computed(() => {
  let resultado = Array.isArray(almacenCitas.listaCitas) ? almacenCitas.listaCitas : []

  if (filtroBusqueda.value && filtroBusqueda.value.trim() !== '') {
    const q = filtroBusqueda.value.toLowerCase()
    resultado = resultado.filter(c => {
      const esp = (c.especialidad || '').toLowerCase()
      const med = (c.medicoTratante || c.medicoResponsable || '').toLowerCase()
      const ubi = (c.ubicacion || '').toLowerCase()
      const uni = (c.descUnidadEdificio || '').toLowerCase()
      const aseguradora = (c.aseguradora || '').toLowerCase()
      return esp.includes(q) || med.includes(q) || ubi.includes(q) || uni.includes(q) || aseguradora.includes(q)
    })
  }

  return resultado
})

const proximaCita = computed(() => {
  if (citasFiltradas.value && citasFiltradas.value.length > 0) {
    return citasFiltradas.value[0]
  }
  return null
})

const otrasCitas = computed(() => {
  if (citasFiltradas.value && citasFiltradas.value.length > 1) {
    return citasFiltradas.value.slice(1)
  }
  return []
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

async function cargarCitas() {
  await almacenCitas.obtenerMisCitas()
}

onMounted(() => {
  cargarCitas()
})
</script>

<style scoped>
.border {
  border: 1px solid #e2e8f0 !important;
}

.border-b {
  border-bottom: 1px solid #e2e8f0 !important;
}

.tarjeta-cita {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.tarjeta-cita:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.05) !important;
}

.proxima-destacada {
  border-color: rgba(var(--v-theme-primary), 0.3) !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04) !important;
}

.date-block {
  border-right: 1px dashed rgba(255, 255, 255, 0.3);
}

.date-block-light {
  border-right: 1px dashed #cbd5e1;
}
</style>
