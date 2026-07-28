<template>
  <LayoutPrincipal>
    <!-- Encabezado -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h2 class="text-h5 font-weight-bold">Pacientes</h2>
        <p class="text-medium-emphasis">Gestión de pacientes registrados</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="abrirDialogoCrear">
        Nuevo Paciente
      </v-btn>
    </div>

    <!-- Barra de búsqueda -->
    <v-card rounded="xl" class="mb-4">
      <v-card-text class="pa-4">
        <v-text-field
          v-model="terminoBusqueda"
          label="Buscar por nombre, apellido o documento..."
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
          @keyup.enter="ejecutarBusqueda"
          @click:clear="limpiarBusqueda"
        />
      </v-card-text>
    </v-card>

    <!-- Tabla de pacientes -->
    <v-card rounded="xl">
      <v-data-table
        :headers="columnas"
        :items="almacenPacientes.listaPacientes"
        :loading="almacenPacientes.cargando"
        loading-text="Cargando pacientes..."
        no-data-text="No hay pacientes registrados"
        item-value="id"
        hover
      >
        <!-- Columna nombre completo -->
        <template v-slot:item.nombres="{ item }">
          <div class="d-flex align-center gap-2 py-2">
            <v-avatar color="primary" size="36">
              <span class="text-body-2 font-weight-bold">
                {{ item.nombres.charAt(0) }}{{ item.apellidos.charAt(0) }}
              </span>
            </v-avatar>
            <div>
              <p class="font-weight-medium mb-0">{{ item.nombres }} {{ item.apellidos }}</p>
              <p class="text-caption text-medium-emphasis mb-0">{{ item.correoElectronico }}</p>
            </div>
          </div>
        </template>

        <!-- Columna estado -->
        <template v-slot:item.estado="{ item }">
          <v-chip
            :color="item.estado === 'activo' ? 'success' : 'error'"
            size="small"
            variant="tonal"
          >
            {{ item.estado }}
          </v-chip>
        </template>

        <!-- Columna género -->
        <template v-slot:item.genero="{ item }">
          <v-icon :icon="iconoGenero(item.genero)" size="18" class="mr-1" />
          {{ item.genero }}
        </template>

        <!-- Columna acciones -->
        <template v-slot:item.acciones="{ item }">
          <div class="d-flex gap-1">
            <v-tooltip text="Ver detalle">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-eye"
                  size="small"
                  variant="text"
                  color="info"
                  :to="`/pacientes/${item.id}`"
                />
              </template>
            </v-tooltip>
            <v-tooltip text="Editar">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  color="warning"
                  @click="abrirDialogoEditar(item)"
                />
              </template>
            </v-tooltip>
            <v-tooltip text="Eliminar">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  @click="solicitarEliminacion(item)"
                />
              </template>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>

      <!-- Paginación -->
      <v-divider />
      <div class="d-flex align-center justify-space-between pa-4">
        <span class="text-caption text-medium-emphasis">
          Total: {{ almacenPacientes.total }} pacientes
        </span>
        <v-pagination
          v-model="paginaActual"
          :length="totalPaginas"
          :total-visible="5"
          density="compact"
          @update:model-value="cambiarPagina"
        />
      </div>
    </v-card>

    <!-- Diálogo crear/editar paciente -->
    <v-dialog v-model="dialogoVisible" max-width="700" persistent scrollable>
      <v-card rounded="xl">
        <v-card-title class="d-flex align-center pa-5">
          <v-icon :color="modoEdicion ? 'warning' : 'primary'" class="mr-2">
            {{ modoEdicion ? 'mdi-pencil' : 'mdi-plus' }}
          </v-icon>
          {{ modoEdicion ? 'Editar Paciente' : 'Nuevo Paciente' }}
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" @click="cerrarDialogo" />
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <v-form ref="refFormulario" v-model="formularioValido">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formulario.nombres"
                  label="Nombres *"
                  :rules="[(v) => !!v || 'Los nombres son requeridos']"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formulario.apellidos"
                  label="Apellidos *"
                  :rules="[(v) => !!v || 'Los apellidos son requeridos']"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="formulario.tipoDocumento"
                  label="Tipo de documento"
                  :items="tiposDocumento"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formulario.numeroDocumento"
                  label="Número de documento *"
                  :rules="[(v) => !!v || 'El número de documento es requerido']"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formulario.fechaNacimiento"
                  label="Fecha de nacimiento *"
                  type="date"
                  :rules="[(v) => !!v || 'La fecha es requerida']"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="formulario.genero"
                  label="Género"
                  :items="opcionesGenero"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="formulario.correoElectronico" label="Correo electrónico" type="email" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="formulario.telefono" label="Teléfono" />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="formulario.direccion" label="Dirección" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="formulario.ciudad" label="Ciudad" />
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="formulario.observaciones" label="Observaciones" rows="2" />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-5">
          <v-spacer />
          <v-btn variant="text" @click="cerrarDialogo">Cancelar</v-btn>
          <v-btn
            color="primary"
            :loading="almacenPacientes.cargando"
            :disabled="!formularioValido"
            @click="guardarPaciente"
          >
            {{ modoEdicion ? 'Actualizar' : 'Crear Paciente' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </LayoutPrincipal>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import LayoutPrincipal from '../../layouts/LayoutPrincipal.vue'
import { useAlmacenPacientes } from '../../stores/pacientes.store'
import { usarAlertas } from '../../composables/usarAlertas'

const almacenPacientes = useAlmacenPacientes()
const { confirmarEliminacion, mostrarExito, mostrarError } = usarAlertas()

const terminoBusqueda = ref('')
const paginaActual = ref(1)
const dialogoVisible = ref(false)
const modoEdicion = ref(false)
const formularioValido = ref(false)
const refFormulario = ref(null)
const pacienteEditandoId = ref(null)

const tiposDocumento = ['cedula', 'pasaporte', 'tarjeta_identidad', 'nit']
const opcionesGenero = ['masculino', 'femenino', 'otro']

const columnas = [
  { title: 'Paciente', key: 'nombres', sortable: true },
  { title: 'Documento', key: 'numeroDocumento', sortable: false },
  { title: 'Género', key: 'genero', sortable: false },
  { title: 'Teléfono', key: 'telefono', sortable: false },
  { title: 'Estado', key: 'estado', sortable: false },
  { title: 'Acciones', key: 'acciones', sortable: false, align: 'center' },
]

const formulario = reactive({
  nombres: '',
  apellidos: '',
  tipoDocumento: 'cedula',
  numeroDocumento: '',
  fechaNacimiento: '',
  genero: 'otro',
  correoElectronico: '',
  telefono: '',
  direccion: '',
  ciudad: '',
  observaciones: '',
})

const totalPaginas = computed(() =>
  Math.ceil(almacenPacientes.total / almacenPacientes.limitePorPagina),
)

function iconoGenero(genero) {
  const iconos = { masculino: 'mdi-gender-male', femenino: 'mdi-gender-female', otro: 'mdi-gender-non-binary' }
  return iconos[genero] || 'mdi-account'
}

function limpiarFormulario() {
  Object.assign(formulario, {
    nombres: '', apellidos: '', tipoDocumento: 'cedula', numeroDocumento: '',
    fechaNacimiento: '', genero: 'otro', correoElectronico: '', telefono: '',
    direccion: '', ciudad: '', observaciones: '',
  })
  refFormulario.value?.reset()
}

function abrirDialogoCrear() {
  modoEdicion.value = false
  pacienteEditandoId.value = null
  limpiarFormulario()
  dialogoVisible.value = true
}

function abrirDialogoEditar(paciente) {
  modoEdicion.value = true
  pacienteEditandoId.value = paciente.id
  Object.assign(formulario, {
    nombres: paciente.nombres, apellidos: paciente.apellidos,
    tipoDocumento: paciente.tipoDocumento, numeroDocumento: paciente.numeroDocumento,
    fechaNacimiento: paciente.fechaNacimiento?.split('T')[0] || paciente.fechaNacimiento,
    genero: paciente.genero, correoElectronico: paciente.correoElectronico || '',
    telefono: paciente.telefono || '', direccion: paciente.direccion || '',
    ciudad: paciente.ciudad || '', observaciones: paciente.observaciones || '',
  })
  dialogoVisible.value = true
}

function cerrarDialogo() {
  dialogoVisible.value = false
  limpiarFormulario()
}

async function guardarPaciente() {
  const { valid } = await refFormulario.value.validate()
  if (!valid) return
  try {
    if (modoEdicion.value) {
      await almacenPacientes.actualizarPaciente(pacienteEditandoId.value, { ...formulario })
      await mostrarExito('Paciente actualizado correctamente')
    } else {
      await almacenPacientes.crearPaciente({ ...formulario })
      await mostrarExito('Paciente creado correctamente')
    }
    cerrarDialogo()
  } catch (err) {
    mostrarError(err.response?.data?.message || 'Error al guardar el paciente')
  }
}

async function solicitarEliminacion(paciente) {
  const confirmado = await confirmarEliminacion(
    `al paciente ${paciente.nombres} ${paciente.apellidos}`,
  )
  if (!confirmado) return
  try {
    await almacenPacientes.eliminarPaciente(paciente.id)
    await mostrarExito('Paciente eliminado correctamente')
  } catch (err) {
    mostrarError(err.response?.data?.message || 'Error al eliminar el paciente')
  }
}

async function cambiarPagina(pagina) {
  await almacenPacientes.obtenerPacientes(pagina, almacenPacientes.limitePorPagina)
}

async function ejecutarBusqueda() {
  if (terminoBusqueda.value?.trim()) {
    await almacenPacientes.buscarPacientes(terminoBusqueda.value)
  } else {
    await almacenPacientes.obtenerPacientes(1)
  }
}

async function limpiarBusqueda() {
  terminoBusqueda.value = ''
  await almacenPacientes.obtenerPacientes(1)
}

onMounted(() => almacenPacientes.obtenerPacientes())
</script>
