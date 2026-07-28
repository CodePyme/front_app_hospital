<template>
  <LayoutPrincipal>
    <!-- Encabezado -->
    <div class="d-flex align-center gap-3 mb-6">
      <v-btn icon="mdi-arrow-left" variant="text" to="/pacientes" />
      <div>
        <h2 class="text-h5 font-weight-bold">Detalle del Paciente</h2>
        <p class="text-medium-emphasis" v-if="almacenPacientes.pacienteActual">
          {{ almacenPacientes.pacienteActual.nombres }}
          {{ almacenPacientes.pacienteActual.apellidos }}
        </p>
      </div>
    </div>

    <!-- Cargando -->
    <div v-if="almacenPacientes.cargando && !almacenPacientes.pacienteActual" class="text-center py-16">
      <v-progress-circular indeterminate color="primary" size="64" />
    </div>

    <template v-else-if="almacenPacientes.pacienteActual">
      <v-row>
        <!-- Info principal -->
        <v-col cols="12" md="4">
          <v-card rounded="xl" class="text-center pa-6">
            <v-avatar color="primary" size="80" class="mb-4">
              <span class="text-h4 font-weight-bold">
                {{ almacenPacientes.pacienteActual.nombres.charAt(0) }}
                {{ almacenPacientes.pacienteActual.apellidos.charAt(0) }}
              </span>
            </v-avatar>
            <h3 class="text-h6 font-weight-bold">
              {{ almacenPacientes.pacienteActual.nombres }}
              {{ almacenPacientes.pacienteActual.apellidos }}
            </h3>
            <p class="text-medium-emphasis text-body-2 mb-3">
              {{ almacenPacientes.pacienteActual.correoElectronico }}
            </p>
            <v-chip
              :color="almacenPacientes.pacienteActual.estado === 'activo' ? 'success' : 'error'"
              variant="tonal"
              class="mb-4"
            >
              {{ almacenPacientes.pacienteActual.estado }}
            </v-chip>
            <v-divider class="mb-4" />
            <v-list density="compact" bg-color="transparent">
              <v-list-item
                prepend-icon="mdi-card-account-details"
                :title="almacenPacientes.pacienteActual.tipoDocumento"
                :subtitle="almacenPacientes.pacienteActual.numeroDocumento"
              />
              <v-list-item
                prepend-icon="mdi-phone"
                title="Teléfono"
                :subtitle="almacenPacientes.pacienteActual.telefono || 'No registrado'"
              />
              <v-list-item
                prepend-icon="mdi-map-marker"
                title="Ciudad"
                :subtitle="almacenPacientes.pacienteActual.ciudad || 'No registrado'"
              />
            </v-list>
            <v-btn color="warning" variant="tonal" block class="mt-4" @click="dialogoEditar = true">
              <v-icon start>mdi-pencil</v-icon> Editar paciente
            </v-btn>
          </v-card>
        </v-col>

        <!-- Citas del paciente -->
        <v-col cols="12" md="8">
          <v-card rounded="xl">
            <v-card-title class="d-flex align-center pa-5">
              <v-icon color="secondary" class="mr-2">mdi-calendar-check</v-icon>
              Citas del paciente
              <v-spacer />
              <v-btn color="secondary" size="small" prepend-icon="mdi-plus" @click="dialogoCita = true">
                Nueva cita
              </v-btn>
            </v-card-title>
            <v-divider />
            <v-card-text class="pa-0">
              <div v-if="almacenCitas.cargando" class="text-center py-8">
                <v-progress-circular indeterminate color="secondary" />
              </div>
              <v-list v-else-if="almacenCitas.listaCitas.length" lines="two">
                <v-list-item
                  v-for="cita in almacenCitas.listaCitas"
                  :key="cita.id"
                  :to="`/citas/${cita.id}`"
                >
                  <template v-slot:prepend>
                    <v-icon :color="colorEstadoCita(cita.estado)">mdi-calendar</v-icon>
                  </template>
                  <v-list-item-title>
                    {{ formatearFecha(cita.fechaCita) }} — {{ cita.horaInicio }} a {{ cita.horaFin }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ cita.tipoCita }} • {{ cita.medicoResponsable || 'Sin médico asignado' }}
                  </v-list-item-subtitle>
                  <template v-slot:append>
                    <v-chip :color="colorEstadoCita(cita.estado)" size="small" variant="tonal">
                      {{ cita.estado }}
                    </v-chip>
                  </template>
                </v-list-item>
              </v-list>
              <div v-else class="text-center py-8 text-medium-emphasis">
                <v-icon size="48" class="mb-2">mdi-calendar-blank</v-icon>
                <p>Sin citas registradas</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Diálogo nueva cita rápida -->
    <v-dialog v-model="dialogoCita" max-width="600" persistent>
      <v-card rounded="xl">
        <v-card-title class="pa-5">
          <v-icon color="secondary" class="mr-2">mdi-calendar-plus</v-icon>
          Nueva Cita
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" @click="dialogoCita = false" />
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-form ref="refFormCita" v-model="citaValida">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="formularioCita.fechaCita" label="Fecha *" type="date"
                  :rules="[(v) => !!v || 'La fecha es requerida']" />
              </v-col>
              <v-col cols="12" sm="3">
                <v-text-field v-model="formularioCita.horaInicio" label="Hora inicio *" type="time"
                  :rules="[(v) => !!v || 'Requerido']" />
              </v-col>
              <v-col cols="12" sm="3">
                <v-text-field v-model="formularioCita.horaFin" label="Hora fin *" type="time"
                  :rules="[(v) => !!v || 'Requerido']" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="formularioCita.tipoCita" label="Tipo de cita"
                  :items="tiposCita" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="formularioCita.medicoResponsable" label="Médico responsable" />
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="formularioCita.motivoConsulta" label="Motivo de consulta" rows="2" />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-5">
          <v-spacer />
          <v-btn variant="text" @click="dialogoCita = false">Cancelar</v-btn>
          <v-btn color="secondary" :loading="almacenCitas.cargando" :disabled="!citaValida" @click="crearCitaRapida">
            Crear Cita
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </LayoutPrincipal>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import LayoutPrincipal from '../../layouts/LayoutPrincipal.vue'
import { useAlmacenPacientes } from '../../stores/pacientes.store'
import { useAlmacenCitas } from '../../stores/citas.store'
import { usarAlertas } from '../../composables/usarAlertas'

const ruta = useRoute()
const almacenPacientes = useAlmacenPacientes()
const almacenCitas = useAlmacenCitas()
const { mostrarExito, mostrarError } = usarAlertas()

const dialogoEditar = ref(false)
const dialogoCita = ref(false)
const citaValida = ref(false)
const refFormCita = ref(null)

const tiposCita = ['consulta_general', 'especialista', 'urgencias', 'control', 'procedimiento']

const formularioCita = reactive({
  pacienteId: ruta.params.id,
  fechaCita: '',
  horaInicio: '',
  horaFin: '',
  tipoCita: 'consulta_general',
  medicoResponsable: '',
  motivoConsulta: '',
})

function colorEstadoCita(estado) {
  const colores = {
    programada: 'info', confirmada: 'primary', en_atencion: 'warning',
    completada: 'success', cancelada: 'error', no_asistio: 'error',
  }
  return colores[estado] || 'default'
}

function formatearFecha(fecha) {
  if (!fecha) return ''
  return new Date(fecha + 'T00:00:00').toLocaleDateString('es-CO', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

async function crearCitaRapida() {
  const { valid } = await refFormCita.value.validate()
  if (!valid) return
  try {
    await almacenCitas.crearCita({ ...formularioCita })
    await mostrarExito('Cita creada correctamente')
    dialogoCita.value = false
    await almacenCitas.obtenerCitasPorPaciente(ruta.params.id)
  } catch (err) {
    mostrarError(err.response?.data?.message || 'Error al crear la cita')
  }
}

onMounted(async () => {
  await almacenPacientes.obtenerPacientePorId(ruta.params.id)
  await almacenCitas.obtenerCitasPorPaciente(ruta.params.id)
})
</script>
