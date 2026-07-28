<template>
  <LayoutPrincipal>
    <!-- Controles superiores -->
    <div class="d-flex align-center justify-space-between mb-6 border-b pb-4">
      <div class="d-flex gap-4">
        <div class="text-subtitle-1 font-weight-bold text-primary border-b-primary pb-1" style="border-bottom: 3px solid rgb(var(--v-theme-primary));">Mis citas</div>
        <div class="text-subtitle-1 text-grey-darken-1 cursor-pointer hover-text-primary">Agendar cita</div>
        <div class="text-subtitle-1 text-grey-darken-1 cursor-pointer hover-text-primary">Historial de citas</div>
      </div>
      <v-btn color="secondary" rounded="pill" class="text-primary font-weight-bold px-6 text-none" prepend-icon="mdi-plus" elevation="0" @click="abrirDialogoCrear">
        Agendar nueva cita
      </v-btn>
    </div>

    <!-- Filtros -->
    <v-row class="mb-4">
      <v-col cols="12" md="3" sm="6">
        <v-select
          label="Todas las citas"
          :items="['Todas las citas', 'Próximas', 'Pasadas']"
          variant="outlined"
          density="comfortable"
          bg-color="white"
          hide-details
          prepend-inner-icon="mdi-calendar-check-outline"
        ></v-select>
      </v-col>
      <v-col cols="12" md="2" sm="6">
        <v-text-field
          label="Desde"
          type="date"
          variant="outlined"
          density="comfortable"
          bg-color="white"
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="2" sm="6">
        <v-text-field
          label="Hasta"
          type="date"
          variant="outlined"
          density="comfortable"
          bg-color="white"
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="5" sm="6">
        <v-text-field
          placeholder="Buscar por médico, especialidad o sede..."
          variant="outlined"
          density="comfortable"
          bg-color="white"
          hide-details
          append-inner-icon="mdi-magnify"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <!-- Columna Principal: Lista de Citas -->
      <v-col cols="12" md="8">
        
        <div v-if="almacenCitas.cargando" class="text-center pa-10">
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>

        <div v-else-if="almacenCitas.listaCitas.length === 0" class="text-center pa-10 bg-white rounded-xl border">
          <v-icon size="48" color="grey-lighten-1" class="mb-4">mdi-calendar-blank</v-icon>
          <div class="text-h6 text-grey-darken-1">No tienes citas agendadas</div>
        </div>

        <template v-else>
          <!-- Próximas Citas -->
          <div v-if="proximaCita" class="mb-8">
            <h3 class="text-subtitle-1 font-weight-bold text-primary mb-4">Próximas citas</h3>
            
            <v-card elevation="0" class="border rounded-xl d-flex overflow-hidden cita-card">
              <!-- Bloque Fecha -->
              <div class="bg-primary text-white d-flex flex-column align-center justify-center pa-4 text-center date-block" style="width: 110px; flex-shrink: 0;">
                <div class="text-caption font-weight-bold text-uppercase opacity-80">{{ obtenerMes(proximaCita.fechaCita) }}</div>
                <div class="text-h4 font-weight-black lh-1 my-1">{{ obtenerDia(proximaCita.fechaCita) }}</div>
                <div class="text-caption font-weight-bold opacity-80">{{ obtenerAnio(proximaCita.fechaCita) }}</div>
              </div>

              <!-- Bloque Detalles -->
              <div class="d-flex align-center flex-grow-1 pa-5 bg-white">
                <v-avatar color="green-lighten-5" size="64" class="mr-5 border-secondary">
                  <v-icon color="secondary" size="32">mdi-calendar-clock</v-icon>
                </v-avatar>
                
                <div class="flex-grow-1">
                  <div class="text-subtitle-1 font-weight-bold text-primary lh-1 mb-1">{{ proximaCita.especialidad || (proximaCita.tipoCita ? proximaCita.tipoCita.replace('_', ' ') : 'Consulta General') }}</div>
                  <div class="text-body-2 text-grey-darken-3 mb-2">{{ proximaCita.medicoResponsable || 'Médico por asignar' }}</div>
                  
                  <div class="d-flex align-center gap-4 text-caption text-grey-darken-1 font-weight-medium">
                    <div class="d-flex align-center gap-1">
                      <v-icon size="16" color="primary">mdi-clock-outline</v-icon>
                      {{ proximaCita.horaInicio || '08:00' }} a. m.
                    </div>
                    <div class="d-flex align-center gap-1">
                      <v-icon size="16" color="primary">mdi-map-marker-outline</v-icon>
                      Sede Principal - Piso 2
                    </div>
                    <div class="d-flex align-center gap-1">
                      <v-icon size="16" color="primary">mdi-door</v-icon>
                      Consultorio {{ proximaCita.consultorio || '203' }}
                    </div>
                  </div>
                </div>

                <div class="d-flex flex-column align-end">
                  <v-chip :color="colorEstado(proximaCita.estado)" size="small" class="font-weight-bold text-uppercase px-4 mb-2">
                    {{ proximaCita.estado }}
                  </v-chip>
                  <v-btn icon="mdi-dots-vertical" variant="text" color="grey-darken-1" size="small"></v-btn>
                </div>
              </div>
            </v-card>
          </div>

          <!-- Otras Citas -->
          <div v-if="otrasCitas.length > 0">
            <h3 class="text-subtitle-1 font-weight-bold text-primary mb-4">Otras citas</h3>
            
            <v-card v-for="cita in otrasCitas" :key="cita.id" elevation="0" class="border rounded-xl d-flex overflow-hidden mb-3 cita-card">
              <!-- Bloque Fecha -->
              <div class="bg-primary text-white d-flex flex-column align-center justify-center pa-2 text-center date-block" style="width: 80px; flex-shrink: 0;">
                <div class="text-caption font-weight-bold text-uppercase opacity-80" style="font-size: 0.7rem !important;">{{ obtenerMes(cita.fechaCita) }}</div>
                <div class="text-h5 font-weight-black lh-1 my-1">{{ obtenerDia(cita.fechaCita) }}</div>
                <div class="text-caption font-weight-bold opacity-80" style="font-size: 0.7rem !important;">{{ obtenerAnio(cita.fechaCita) }}</div>
              </div>

              <!-- Bloque Detalles -->
              <div class="d-flex align-center flex-grow-1 pa-4 bg-white">
                <v-avatar color="green-lighten-5" size="50" class="mr-4">
                  <v-icon color="secondary" size="24">{{ iconoEspecialidad(cita.especialidad) }}</v-icon>
                </v-avatar>
                
                <div class="flex-grow-1">
                  <div class="text-body-2 font-weight-bold text-primary lh-1 mb-1">{{ cita.especialidad || (cita.tipoCita ? cita.tipoCita.replace('_', ' ') : 'Consulta') }}</div>
                  <div class="text-caption text-grey-darken-3 mb-1">{{ cita.medicoResponsable || 'Médico por asignar' }}</div>
                  
                  <div class="d-flex align-center gap-3 text-caption text-grey-darken-1">
                    <div class="d-flex align-center gap-1">
                      <v-icon size="14" color="grey">mdi-clock-outline</v-icon>
                      {{ cita.horaInicio || '10:00' }} a. m.
                    </div>
                    <div class="d-flex align-center gap-1">
                      <v-icon size="14" color="grey">mdi-map-marker-outline</v-icon>
                      Sede Principal
                    </div>
                  </div>
                </div>

                <div class="d-flex align-center gap-2">
                  <v-chip :color="colorEstado(cita.estado)" size="small" variant="tonal" class="font-weight-bold text-uppercase px-3">
                    {{ cita.estado }}
                  </v-chip>
                  <v-btn icon="mdi-chevron-right" variant="text" color="grey-darken-1" size="small"></v-btn>
                </div>
              </div>
            </v-card>
          </div>

          <div class="text-center mt-6">
            <v-btn variant="text" color="primary" class="font-weight-bold text-none" append-icon="mdi-chevron-down">
              Ver todas mis citas
            </v-btn>
          </div>
        </template>
      </v-col>

      <!-- Columna Lateral: Widgets -->
      <v-col cols="12" md="4">
        
        <!-- Widget: Agendar cita rápida -->
        <v-card elevation="0" class="border rounded-xl bg-white mb-4">
          <v-card-text class="pa-5">
            <h3 class="text-subtitle-1 font-weight-bold text-primary mb-1">Agendar cita rápida</h3>
            <p class="text-caption text-grey-darken-1 mb-4">Encuentra el especialista que necesitas</p>
            
            <v-select label="Especialidad" :items="['Medicina General', 'Odontología', 'Cardiología']" variant="outlined" density="compact" prepend-inner-icon="mdi-stethoscope" hide-details class="mb-3"></v-select>
            <v-select label="Sede" :items="['Sede Principal', 'Sede Norte', 'Sede Sur']" variant="outlined" density="compact" prepend-inner-icon="mdi-map-marker-outline" hide-details class="mb-3"></v-select>
            <v-select label="Fecha preferida" :items="['Lo antes posible', 'Esta semana', 'Próxima semana']" variant="outlined" density="compact" prepend-inner-icon="mdi-calendar-outline" hide-details class="mb-4"></v-select>
            
            <v-btn color="secondary" block rounded="lg" class="text-primary font-weight-bold text-none" elevation="0">
              <v-icon start>mdi-magnify</v-icon> Buscar disponibilidad
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Widget: Accesos rápidos -->
        <v-card elevation="0" class="border rounded-xl bg-white mb-4">
          <v-card-text class="pa-5">
            <h3 class="text-subtitle-1 font-weight-bold text-primary mb-4">Accesos rápidos</h3>
            
            <v-list class="pa-0 bg-transparent">
              <v-list-item class="px-0 py-2 border-b-light cursor-pointer hover-bg">
                <template v-slot:prepend>
                  <v-avatar color="green-lighten-5" size="40" class="mr-3">
                    <v-icon color="primary" size="20">mdi-clipboard-text-outline</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-bold text-primary">Preparación para tu cita</v-list-item-title>
                <v-list-item-subtitle class="text-caption text-grey-darken-1">Recomendaciones importantes</v-list-item-subtitle>
                <template v-slot:append><v-icon size="16" color="grey-darken-1">mdi-chevron-right</v-icon></template>
              </v-list-item>

              <v-list-item class="px-0 py-2 border-b-light cursor-pointer hover-bg">
                <template v-slot:prepend>
                  <v-avatar color="green-lighten-5" size="40" class="mr-3">
                    <v-icon color="primary" size="20">mdi-calendar-remove-outline</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-bold text-primary">Reagendar o cancelar</v-list-item-title>
                <v-list-item-subtitle class="text-caption text-grey-darken-1">Gestiona tus citas fácilmente</v-list-item-subtitle>
                <template v-slot:append><v-icon size="16" color="grey-darken-1">mdi-chevron-right</v-icon></template>
              </v-list-item>

              <v-list-item class="px-0 py-2 border-b-light cursor-pointer hover-bg">
                <template v-slot:prepend>
                  <v-avatar color="green-lighten-5" size="40" class="mr-3">
                    <v-icon color="primary" size="20">mdi-help-circle-outline</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-bold text-primary">Preguntas frecuentes</v-list-item-title>
                <v-list-item-subtitle class="text-caption text-grey-darken-1">Resuelve tus dudas</v-list-item-subtitle>
                <template v-slot:append><v-icon size="16" color="grey-darken-1">mdi-chevron-right</v-icon></template>
              </v-list-item>

              <v-list-item class="px-0 py-2 cursor-pointer hover-bg">
                <template v-slot:prepend>
                  <v-avatar color="green-lighten-5" size="40" class="mr-3">
                    <v-icon color="primary" size="20">mdi-phone-outline</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-bold text-primary">Contáctanos</v-list-item-title>
                <v-list-item-subtitle class="text-caption text-grey-darken-1">Estamos para ayudarte</v-list-item-subtitle>
                <template v-slot:append><v-icon size="16" color="grey-darken-1">mdi-chevron-right</v-icon></template>
              </v-list-item>
            </v-list>

          </v-card-text>
        </v-card>

        <!-- Banner Alerta -->
        <v-card elevation="0" class="border rounded-xl bg-white d-flex align-center pa-4">
          <v-avatar color="green-lighten-5" size="56" class="mr-4">
            <v-icon color="secondary" size="28">mdi-calendar-check</v-icon>
          </v-avatar>
          <div class="flex-grow-1">
            <div class="text-subtitle-2 font-weight-bold text-primary mb-1">¡No olvides tu cita!</div>
            <div class="text-caption text-grey-darken-1" style="line-height: 1.2;">Llega 15 minutos antes y lleva tu documento de identidad.</div>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" color="grey"></v-btn>
        </v-card>

      </v-col>
    </v-row>

    <!-- Diálogo crear cita -->
    <v-dialog v-model="dialogoVisible" max-width="650" persistent scrollable>
      <v-card rounded="xl">
        <v-card-title class="d-flex align-center pa-5 bg-primary text-white">
          <v-icon color="white" class="mr-2">mdi-calendar-plus</v-icon>
          Nueva Cita
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" color="white" @click="cerrarDialogo" />
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-form ref="refFormulario" v-model="formularioValido">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formulario.pacienteId"
                  label="ID del Paciente *"
                  placeholder="UUID del paciente"
                  :rules="[(v) => !!v || 'El ID del paciente es requerido']"
                  hint="Puedes obtener el ID desde la lista de pacientes"
                  persistent-hint
                  variant="outlined" color="primary"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="formulario.fechaCita" label="Fecha *" type="date"
                  :rules="[(v) => !!v || 'La fecha es requerida']" variant="outlined" color="primary" />
              </v-col>
              <v-col cols="6" sm="3">
                <v-text-field v-model="formulario.horaInicio" label="Hora inicio *" type="time"
                  :rules="[(v) => !!v || 'Requerido']" variant="outlined" color="primary" />
              </v-col>
              <v-col cols="6" sm="3">
                <v-text-field v-model="formulario.horaFin" label="Hora fin *" type="time"
                  :rules="[(v) => !!v || 'Requerido']" variant="outlined" color="primary" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="formulario.tipoCita" label="Tipo de cita" :items="tiposCita" variant="outlined" color="primary" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="formulario.medicoResponsable" label="Médico responsable" variant="outlined" color="primary" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="formulario.especialidad" label="Especialidad" variant="outlined" color="primary" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="formulario.consultorio" label="Consultorio" variant="outlined" color="primary" />
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="formulario.motivoConsulta" label="Motivo de consulta" rows="2" variant="outlined" color="primary" />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-5 bg-grey-lighten-4">
          <v-spacer />
          <v-btn variant="text" @click="cerrarDialogo" class="text-none">Cancelar</v-btn>
          <v-btn color="secondary" class="text-primary font-weight-bold px-6 text-none" rounded="pill" elevation="0" :loading="almacenCitas.cargando"
            :disabled="!formularioValido" @click="guardarCita">
            Confirmar cita
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
const { confirmarEliminacion, confirmarCancelacion, mostrarExito, mostrarError } = usarAlertas()

const dialogoVisible = ref(false)
const formularioValido = ref(false)
const refFormulario = ref(null)

const tiposCita = ['consulta_general', 'especialista', 'urgencias', 'control', 'procedimiento']

const formulario = reactive({
  pacienteId: '', fechaCita: '', horaInicio: '', horaFin: '',
  tipoCita: 'consulta_general', medicoResponsable: '',
  especialidad: '', consultorio: '', motivoConsulta: '',
})

// Computed para mostrar datos visuales en el dashboard
const proximaCita = computed(() => {
  if (almacenCitas.listaCitas && almacenCitas.listaCitas.length > 0) {
    // Tomamos la primera cita como próxima
    return almacenCitas.listaCitas[0]
  }
  return null
})

const otrasCitas = computed(() => {
  if (almacenCitas.listaCitas && almacenCitas.listaCitas.length > 1) {
    // Tomamos el resto de citas para la lista inferior
    return almacenCitas.listaCitas.slice(1)
  }
  return []
})

// Funciones de utilidad visual
const mesesCortos = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']

function obtenerMes(fecha) {
  if (!fecha) return 'ENE'
  const obj = new Date(fecha + 'T00:00:00')
  return mesesCortos[obj.getMonth()]
}

function obtenerDia(fecha) {
  if (!fecha) return '01'
  const obj = new Date(fecha + 'T00:00:00')
  return String(obj.getDate()).padStart(2, '0')
}

function obtenerAnio(fecha) {
  if (!fecha) return '2024'
  const obj = new Date(fecha + 'T00:00:00')
  return obj.getFullYear()
}

function colorEstado(estado) {
  const colores = {
    programada: '#e0e0e0', confirmada: '#e8f5e9', en_atencion: '#fff8e1',
    completada: '#e8f5e9', cancelada: '#ffebee', no_asistio: '#f5f5f5',
  }
  return colores[estado] || '#f5f5f5'
}

function iconoEspecialidad(especialidad) {
  const especialidadLower = (especialidad || '').toLowerCase()
  if (especialidadLower.includes('odontología') || especialidadLower.includes('dental')) return 'mdi-tooth'
  if (especialidadLower.includes('cardiología') || especialidadLower.includes('corazón')) return 'mdi-heart-pulse'
  if (especialidadLower.includes('oftalmología') || especialidadLower.includes('ojos')) return 'mdi-eye-outline'
  if (especialidadLower.includes('pediatría') || especialidadLower.includes('niños')) return 'mdi-baby-face-outline'
  return 'mdi-stethoscope' // default
}

function limpiarFormulario() {
  Object.assign(formulario, {
    pacienteId: '', fechaCita: '', horaInicio: '', horaFin: '',
    tipoCita: 'consulta_general', medicoResponsable: '',
    especialidad: '', consultorio: '', motivoConsulta: '',
  })
  refFormulario.value?.reset()
}

function abrirDialogoCrear() {
  limpiarFormulario()
  dialogoVisible.value = true
}

function cerrarDialogo() {
  dialogoVisible.value = false
  limpiarFormulario()
}

async function guardarCita() {
  const { valid } = await refFormulario.value.validate()
  if (!valid) return
  try {
    await almacenCitas.crearCita({ ...formulario })
    await mostrarExito('Cita creada correctamente')
    cerrarDialogo()
  } catch (err) {
    mostrarError(err.response?.data?.message || 'Error al crear la cita')
  }
}

onMounted(() => {
  almacenCitas.obtenerCitas(1, 10)
})
</script>

<style scoped>
.border {
  border: 1px solid #EAECEF !important;
}

.border-b {
  border-bottom: 1px solid #EAECEF !important;
}

.border-b-light {
  border-bottom: 1px solid rgba(0,0,0,0.05) !important;
}

.border-secondary {
  border: 2px solid rgb(var(--v-theme-secondary));
}

.lh-1 {
  line-height: 1.1 !important;
}

.hover-text-primary:hover {
  color: rgb(var(--v-theme-primary)) !important;
}

.hover-bg:hover {
  background-color: #f6f8f9;
  border-radius: 8px;
}

.cita-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.cita-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important;
}

.date-block {
  border-right: 1px dashed rgba(255,255,255,0.3);
}

/* Ajustes de select y text-field transparentes en el sidebar */
.v-field__overlay {
  background-color: transparent !important;
}
</style>
