<template>
  <LayoutPrincipal>
    <div class="d-flex align-center gap-3 mb-6">
      <v-btn icon="mdi-arrow-left" variant="text" to="/citas" />
      <div>
        <h2 class="text-h5 font-weight-bold">Detalle de Cita</h2>
        <p class="text-medium-emphasis" v-if="almacenCitas.citaActual">
          {{ formatearFecha(almacenCitas.citaActual.fechaCita) }}
        </p>
      </div>
    </div>

    <div v-if="almacenCitas.cargando && !almacenCitas.citaActual" class="text-center py-16">
      <v-progress-circular indeterminate color="secondary" size="64" />
    </div>

    <template v-else-if="almacenCitas.citaActual">
      <v-row>
        <v-col cols="12" md="5">
          <v-card rounded="xl" class="pa-5">
            <div class="d-flex justify-space-between align-center mb-4">
              <h3 class="text-h6 font-weight-bold">Información de la cita</h3>
              <v-chip :color="colorEstado(almacenCitas.citaActual.estado)" variant="tonal">
                {{ almacenCitas.citaActual.estado }}
              </v-chip>
            </div>

            <v-list density="compact" bg-color="transparent">
              <v-list-item prepend-icon="mdi-calendar" title="Fecha"
                :subtitle="formatearFecha(almacenCitas.citaActual.fechaCita)" />
              <v-list-item prepend-icon="mdi-clock" title="Horario"
                :subtitle="`${almacenCitas.citaActual.horaInicio} - ${almacenCitas.citaActual.horaFin}`" />
              <v-list-item prepend-icon="mdi-medical-bag" title="Tipo"
                :subtitle="almacenCitas.citaActual.tipoCita?.replace('_', ' ')" />
              <v-list-item prepend-icon="mdi-doctor" title="Médico"
                :subtitle="almacenCitas.citaActual.medicoResponsable || 'No asignado'" />
              <v-list-item prepend-icon="mdi-hospital-building" title="Especialidad"
                :subtitle="almacenCitas.citaActual.especialidad || 'No especificada'" />
              <v-list-item prepend-icon="mdi-door" title="Consultorio"
                :subtitle="almacenCitas.citaActual.consultorio || 'No especificado'" />
            </v-list>

            <v-divider class="my-4" />

            <div v-if="almacenCitas.citaActual.motivoConsulta" class="mb-3">
              <p class="text-caption text-medium-emphasis mb-1">Motivo de consulta</p>
              <p class="text-body-2">{{ almacenCitas.citaActual.motivoConsulta }}</p>
            </div>

            <div class="d-flex gap-2 mt-4">
              <v-btn
                v-if="!['cancelada','completada'].includes(almacenCitas.citaActual.estado)"
                color="warning"
                variant="tonal"
                flex
                @click="solicitarCancelacion"
              >
                <v-icon start>mdi-calendar-remove</v-icon> Cancelar
              </v-btn>
              <v-btn color="error" variant="tonal" flex @click="solicitarEliminacion">
                <v-icon start>mdi-delete</v-icon> Eliminar
              </v-btn>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="7" v-if="almacenCitas.citaActual.paciente">
          <v-card rounded="xl" class="pa-5">
            <h3 class="text-h6 font-weight-bold mb-4">
              <v-icon color="primary" class="mr-2">mdi-account</v-icon>
              Datos del paciente
            </h3>
            <v-list density="compact" bg-color="transparent">
              <v-list-item prepend-icon="mdi-account" title="Nombre completo"
                :subtitle="`${almacenCitas.citaActual.paciente.nombres} ${almacenCitas.citaActual.paciente.apellidos}`" />
              <v-list-item prepend-icon="mdi-card-account-details" title="Documento"
                :subtitle="`${almacenCitas.citaActual.paciente.tipoDocumento}: ${almacenCitas.citaActual.paciente.numeroDocumento}`" />
              <v-list-item prepend-icon="mdi-email" title="Correo"
                :subtitle="almacenCitas.citaActual.paciente.correoElectronico || 'No registrado'" />
              <v-list-item prepend-icon="mdi-phone" title="Teléfono"
                :subtitle="almacenCitas.citaActual.paciente.telefono || 'No registrado'" />
            </v-list>
            <v-btn
              color="primary"
              variant="tonal"
              class="mt-4"
              :to="`/pacientes/${almacenCitas.citaActual.paciente.id}`"
            >
              <v-icon start>mdi-account-details</v-icon> Ver perfil completo
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </LayoutPrincipal>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LayoutPrincipal from '../../layouts/LayoutPrincipal.vue'
import { useAlmacenCitas } from '../../stores/citas.store'
import { usarAlertas } from '../../composables/usarAlertas'

const ruta = useRoute()
const enrutador = useRouter()
const almacenCitas = useAlmacenCitas()
const { confirmarEliminacion, confirmarCancelacion, mostrarExito, mostrarError } = usarAlertas()

function colorEstado(estado) {
  const colores = {
    programada: 'info', confirmada: 'primary', en_atencion: 'warning',
    completada: 'success', cancelada: 'error', no_asistio: 'grey',
  }
  return colores[estado] || 'default'
}

function formatearFecha(fecha) {
  if (!fecha) return ''
  return new Date(fecha + 'T00:00:00').toLocaleDateString('es-CO', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

async function solicitarCancelacion() {
  const cita = almacenCitas.citaActual
  const confirmado = await confirmarCancelacion(`la cita del ${formatearFecha(cita.fechaCita)}`)
  if (!confirmado) return
  try {
    await almacenCitas.cancelarCita(cita.id)
    await mostrarExito('Cita cancelada correctamente')
    await almacenCitas.obtenerCitaPorId(cita.id)
  } catch (err) {
    mostrarError(err.response?.data?.message || 'Error al cancelar la cita')
  }
}

async function solicitarEliminacion() {
  const cita = almacenCitas.citaActual
  const confirmado = await confirmarEliminacion(`la cita del ${formatearFecha(cita.fechaCita)}`)
  if (!confirmado) return
  try {
    await almacenCitas.eliminarCita(cita.id)
    await mostrarExito('Cita eliminada correctamente')
    enrutador.push({ name: 'lista-citas' })
  } catch (err) {
    mostrarError(err.response?.data?.message || 'Error al eliminar la cita')
  }
}

onMounted(() => almacenCitas.obtenerCitaPorId(ruta.params.id))
</script>
