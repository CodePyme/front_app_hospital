<template>
  <LayoutPrincipal>
    <!-- Encabezado de la página -->
    <div class="d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between mb-4 mb-sm-6 gap-3 border-b pb-4">
      <div>
        <div class="d-flex align-center flex-wrap gap-2 mb-1">
          <v-icon icon="mdi-key-outline" color="primary" size="28" />
          <h1 class="text-h5 font-weight-bold text-primary mb-0">Catálogo de Permisos</h1>
          <v-chip color="primary" variant="tonal" size="small" class="font-weight-bold">
            Administración
          </v-chip>
        </div>
        <p class="text-caption text-medium-emphasis mb-0">
          Permisos del sistema para restringir y controlar el acceso a los módulos y acciones del portal
        </p>
      </div>
      <div class="d-flex flex-wrap gap-2 w-100 w-sm-auto">
        <v-btn
          color="primary"
          variant="tonal"
          rounded="pill"
          prepend-icon="mdi-sync"
          class="text-none font-weight-bold px-4 flex-grow-1 flex-sm-grow-0"
          :loading="sincronizando"
          @click="sincronizarCatalogo"
        >
          Sincronizar
        </v-btn>
        <v-btn
          color="primary"
          rounded="pill"
          prepend-icon="mdi-plus"
          class="text-none font-weight-bold px-5 flex-grow-1 flex-sm-grow-0"
          elevation="0"
          @click="abrirModalCrear"
        >
          Nuevo Permiso
        </v-btn>
      </div>
    </div>

    <!-- Estadísticas Rápidas -->
    <v-row class="mb-3 mb-sm-4" dense>
      <v-col cols="12" sm="4">
        <v-card rounded="xl" color="primary" variant="tonal" elevation="0">
          <v-card-text class="d-flex align-center gap-3 pa-3 pa-sm-4">
            <v-icon icon="mdi-key-outline" size="32" color="primary" />
            <div>
              <p class="text-caption text-medium-emphasis mb-0">Total permisos</p>
              <p class="text-h6 font-weight-bold mb-0 text-primary">{{ listaPermisos.length }}</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" sm="4">
        <v-card rounded="xl" color="secondary" variant="tonal" elevation="0">
          <v-card-text class="d-flex align-center gap-3 pa-3 pa-sm-4">
            <v-icon icon="mdi-view-grid-outline" size="32" color="secondary-darken-1" />
            <div>
              <p class="text-caption text-medium-emphasis mb-0">Módulos</p>
              <p class="text-h6 font-weight-bold mb-0 text-secondary-darken-1">{{ modulosDisponibles.length }}</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" sm="4">
        <v-card rounded="xl" color="success" variant="tonal" elevation="0">
          <v-card-text class="d-flex align-center gap-3 pa-3 pa-sm-4">
            <v-icon icon="mdi-check-circle-outline" size="32" color="success" />
            <div>
              <p class="text-caption text-medium-emphasis mb-0">Activos</p>
              <p class="text-h6 font-weight-bold mb-0 text-success">
                {{ listaPermisos.filter((p) => p.activo).length }}
              </p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Barra de Filtros y Búsqueda -->
    <v-card class="mb-4 mb-sm-5 rounded-xl border bg-white" elevation="0">
      <v-card-text class="pa-3 pa-sm-4">
        <v-row dense align="center">
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="busqueda"
              prepend-inner-icon="mdi-magnify"
              placeholder="Buscar por código, nombre..."
              hide-details
              density="compact"
              variant="outlined"
              color="primary"
              rounded="lg"
              clearable
            />
          </v-col>
          <v-col cols="8" sm="4">
            <v-select
              v-model="filtroModulo"
              :items="modulosDisponibles"
              label="Filtrar por módulo"
              prepend-inner-icon="mdi-view-grid-outline"
              hide-details
              density="compact"
              variant="outlined"
              color="primary"
              rounded="lg"
              clearable
            />
          </v-col>
          <v-col cols="4" sm="2" class="text-end">
            <v-btn
              variant="tonal"
              color="primary"
              rounded="pill"
              size="small"
              prepend-icon="mdi-refresh"
              class="text-none font-weight-bold w-100"
              :loading="cargando"
              @click="cargarPermisos"
            >
              Recargar
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- ESTADO: Cargando -->
    <div v-if="cargando" class="text-center pa-8 bg-white rounded-xl border">
      <v-progress-circular indeterminate color="primary" size="40" width="3" />
      <div class="text-caption text-medium-emphasis mt-3">Consultando permisos...</div>
    </div>

    <!-- ESTADO: Sin datos -->
    <div v-else-if="permisosFiltrados.length === 0" class="text-center pa-8 bg-white rounded-xl border">
      <v-icon icon="mdi-key-remove" size="48" color="grey" class="mb-2" />
      <div class="text-subtitle-1 font-weight-bold text-primary mb-1">No se encontraron permisos</div>
      <div class="text-caption text-medium-emphasis">No hay permisos que coincidan con los filtros actuales.</div>
    </div>

    <template v-else>
      <!-- VISTA MÓVIL (PANTALLAS PEQUEÑAS / CELULARES): Lista de Tarjetas 100% Ajustables Sin Scroll -->
      <div class="d-md-none">
        <v-card
          v-for="item in permisosPaginadosMovil"
          :key="item.id"
          class="mb-3 rounded-xl border bg-white overflow-hidden tarjeta-movil"
          elevation="0"
        >
          <div class="pa-4">
            <!-- Fila Superior: Código y Estado -->
            <div class="d-flex justify-space-between align-start gap-2 mb-2">
              <v-chip size="small" variant="tonal" color="primary" class="font-weight-bold">
                <v-icon start icon="mdi-code-tags" size="14" />
                {{ item.codigo }}
              </v-chip>
              <v-chip
                size="small"
                :color="item.activo ? 'success' : 'grey'"
                variant="tonal"
                class="font-weight-medium flex-shrink-0"
              >
                {{ item.activo ? 'Activo' : 'Inactivo' }}
              </v-chip>
            </div>

            <!-- Nombre del Permiso -->
            <div class="text-subtitle-1 font-weight-bold text-primary mb-1" style="word-break: break-word;">
              {{ item.nombre }}
            </div>

            <!-- Módulo en chip -->
            <div class="mb-2">
              <v-chip size="x-small" variant="tonal" color="secondary" class="text-uppercase font-weight-bold text-primary">
                Módulo: {{ item.modulo }}
              </v-chip>
            </div>

            <!-- Descripción si existe -->
            <p v-if="item.descripcion" class="text-body-2 text-medium-emphasis mb-3" style="line-height: 1.35;">
              {{ item.descripcion }}
            </p>

            <v-divider class="my-2 border-opacity-25" />

            <!-- Acciones Móviles -->
            <div class="d-flex justify-end gap-2 pt-1">
              <v-btn
                color="error"
                variant="tonal"
                size="small"
                rounded="pill"
                class="text-none font-weight-bold"
                prepend-icon="mdi-trash-can-outline"
                @click="confirmarEliminar(item)"
              >
                Eliminar
              </v-btn>
              <v-btn
                color="primary"
                variant="elevated"
                size="small"
                rounded="pill"
                class="text-none font-weight-bold px-4"
                prepend-icon="mdi-pencil-outline"
                @click="abrirModalEditar(item)"
              >
                Editar
              </v-btn>
            </div>
          </div>
        </v-card>

        <!-- Paginador para Móvil -->
        <div v-if="totalPaginasMovil > 1" class="d-flex justify-center my-4">
          <v-pagination
            v-model="paginaActualMovil"
            :length="totalPaginasMovil"
            :total-visible="4"
            density="comfortable"
            color="primary"
            rounded="circle"
          />
        </div>
      </div>

      <!-- VISTA ESCRITORIO (PANTALLAS MEDIANAS / GRANDES): Tabla Tradicional -->
      <div class="d-none d-md-block">
        <v-card class="rounded-xl border bg-white" elevation="0">
          <v-data-table
            :headers="columnas"
            :items="permisosFiltrados"
            :items-per-page="15"
            hover
            no-data-text="No se encontraron permisos registrados"
          >
            <!-- Columna Código -->
            <template #item.codigo="{ item }">
              <v-chip size="small" variant="tonal" color="primary" class="font-weight-bold">
                <v-icon start icon="mdi-code-tags" size="14" />
                {{ item.codigo }}
              </v-chip>
            </template>

            <!-- Columna Nombre -->
            <template #item.nombre="{ item }">
              <div class="font-weight-bold text-primary">{{ item.nombre }}</div>
              <div class="text-caption text-medium-emphasis">{{ item.descripcion || 'Sin descripción' }}</div>
            </template>

            <!-- Columna Módulo -->
            <template #item.modulo="{ item }">
              <v-chip
                size="small"
                variant="tonal"
                color="secondary"
                class="text-uppercase font-weight-bold text-primary"
              >
                {{ item.modulo }}
              </v-chip>
            </template>

            <!-- Columna Estado -->
            <template #item.activo="{ item }">
              <v-chip
                size="small"
                :color="item.activo ? 'success' : 'grey'"
                variant="tonal"
                class="font-weight-medium"
              >
                <v-icon start :icon="item.activo ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline'" size="14" />
                {{ item.activo ? 'Activo' : 'Inactivo' }}
              </v-chip>
            </template>

            <!-- Columna Acciones -->
            <template #item.acciones="{ item }">
              <div class="d-flex justify-end gap-1">
                <v-btn
                  icon="mdi-pencil-outline"
                  size="small"
                  variant="text"
                  color="primary"
                  title="Editar permiso"
                  @click="abrirModalEditar(item)"
                />
                <v-btn
                  icon="mdi-trash-can-outline"
                  size="small"
                  variant="text"
                  color="error"
                  title="Eliminar permiso"
                  @click="confirmarEliminar(item)"
                />
              </div>
            </template>
          </v-data-table>
        </v-card>
      </div>
    </template>

    <!-- Modal Crear / Editar Permiso -->
    <v-dialog v-model="modalAbierto" max-width="560" persistent>
      <v-card class="rounded-xl">
        <v-card-title class="d-flex justify-space-between align-center py-3 px-4 px-sm-5 border-b bg-white">
          <div class="d-flex align-center gap-2">
            <v-icon icon="mdi-key-outline" color="primary" />
            <span class="text-subtitle-1 text-sm-h6 font-weight-bold text-primary">
              {{ esEdicion ? 'Editar Permiso' : 'Nuevo Permiso' }}
            </span>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" color="primary" @click="cerrarModal" />
        </v-card-title>

        <v-form ref="formularioRef" v-model="formularioValido" @submit.prevent="guardarPermiso">
          <v-card-text class="pa-3 pa-sm-5 bg-background">
            <v-card class="pa-3 pa-sm-4 rounded-xl border bg-white" elevation="0">
              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formulario.codigo"
                    label="Código único *"
                    placeholder="ej. citas.ver"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                    rounded="lg"
                    :rules="[reglas.requerido, reglas.codigo]"
                    hint="Formato: modulo.accion"
                    persistent-hint
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formulario.modulo"
                    label="Módulo *"
                    placeholder="ej. citas, usuarios"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                    rounded="lg"
                    :rules="[reglas.requerido]"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formulario.nombre"
                    label="Nombre legible *"
                    placeholder="ej. Ver Citas Médicas"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                    rounded="lg"
                    :rules="[reglas.requerido]"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="formulario.descripcion"
                    label="Descripción funcional"
                    placeholder="Describe qué acción permite este permiso..."
                    variant="outlined"
                    color="primary"
                    rows="2"
                    rounded="lg"
                  />
                </v-col>
                <v-col cols="12">
                  <v-switch
                    v-model="formulario.activo"
                    label="Permiso activo"
                    color="primary"
                    density="compact"
                    hide-details
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-card-text>

          <v-divider />

          <v-card-actions class="px-4 px-sm-5 py-3 justify-end gap-2 bg-white">
            <v-btn variant="text" rounded="pill" color="grey-darken-1" class="text-none font-weight-bold" @click="cerrarModal">
              Cancelar
            </v-btn>
            <v-btn
              color="primary"
              variant="elevated"
              rounded="pill"
              class="text-none font-weight-bold px-5"
              type="submit"
              :loading="guardando"
            >
              {{ esEdicion ? 'Actualizar' : 'Crear Permiso' }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </LayoutPrincipal>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import LayoutPrincipal from '../../layouts/LayoutPrincipal.vue'
import { servicioPermisos } from '../../services/permisos.service'
import { usarAlertas } from '../../composables/usarAlertas'

const { mostrarAlerta, confirmarEliminacion } = usarAlertas()

const cargando = ref(false)
const sincronizando = ref(false)
const guardando = ref(false)
const listaPermisos = ref([])
const busqueda = ref('')
const filtroModulo = ref(null)

// Paginación móvil
const paginaActualMovil = ref(1)
const limitePorPaginaMovil = ref(8)

const modalAbierto = ref(false)
const esEdicion = ref(false)
const idEdicion = ref(null)
const formularioRef = ref(null)
const formularioValido = ref(false)

const formulario = ref({
  codigo: '',
  nombre: '',
  modulo: '',
  descripcion: '',
  activo: true,
})

const reglas = {
  requerido: (v) => !!v || 'Este campo es obligatorio',
  codigo: (v) => !/\s/.test(v) || 'El código no puede contener espacios',
}

const columnas = [
  { title: 'Código', key: 'codigo', align: 'start', sortable: true },
  { title: 'Nombre / Detalle', key: 'nombre', align: 'start', sortable: true },
  { title: 'Módulo', key: 'modulo', align: 'start', sortable: true },
  { title: 'Estado', key: 'activo', align: 'center', sortable: true },
  { title: 'Acciones', key: 'acciones', align: 'end', sortable: false },
]

const modulosDisponibles = computed(() => {
  const modulos = new Set(listaPermisos.value.map((p) => p.modulo))
  return Array.from(modulos).sort()
})

const permisosFiltrados = computed(() => {
  return listaPermisos.value.filter((p) => {
    const coincideModulo = !filtroModulo.value || p.modulo === filtroModulo.value
    if (!coincideModulo) return false

    if (!busqueda.value) return true
    const q = busqueda.value.toLowerCase().trim()
    return (
      p.codigo?.toLowerCase().includes(q) ||
      p.nombre?.toLowerCase().includes(q) ||
      p.descripcion?.toLowerCase().includes(q)
    )
  })
})

// Paginación para móvil
const totalPaginasMovil = computed(() => {
  return Math.ceil(permisosFiltrados.value.length / limitePorPaginaMovil.value) || 1
})

const permisosPaginadosMovil = computed(() => {
  const inicio = (paginaActualMovil.value - 1) * limitePorPaginaMovil.value
  return permisosFiltrados.value.slice(inicio, inicio + limitePorPaginaMovil.value)
})

async function cargarPermisos() {
  cargando.value = true
  try {
    const res = await servicioPermisos.obtenerTodos()
    listaPermisos.value = res.datos || []
  } catch (err) {
    mostrarAlerta('error', 'Error', err.response?.data?.mensaje || 'Error al cargar permisos')
  } finally {
    cargando.value = false
  }
}

async function sincronizarCatalogo() {
  sincronizando.value = true
  try {
    const res = await servicioPermisos.sincronizarCatalogo()
    mostrarAlerta('success', 'Catálogo sincronizado', res.mensaje || 'Se han actualizado los permisos del sistema')
    await cargarPermisos()
  } catch (err) {
    mostrarAlerta('error', 'Error', err.response?.data?.mensaje || 'Error al sincronizar')
  } finally {
    sincronizando.value = false
  }
}

function abrirModalCrear() {
  esEdicion.value = false
  idEdicion.value = null
  formulario.value = {
    codigo: '',
    nombre: '',
    modulo: '',
    descripcion: '',
    activo: true,
  }
  modalAbierto.value = true
}

function abrirModalEditar(permiso) {
  esEdicion.value = true
  idEdicion.value = permiso.id
  formulario.value = {
    codigo: permiso.codigo,
    nombre: permiso.nombre,
    modulo: permiso.modulo,
    descripcion: permiso.descripcion || '',
    activo: permiso.activo,
  }
  modalAbierto.value = true
}

function cerrarModal() {
  modalAbierto.value = false
}

async function guardarPermiso() {
  if (formularioRef.value) {
    const { valid } = await formularioRef.value.validate()
    if (!valid) return
  } else if (!formularioValido.value) {
    return
  }
  guardando.value = true
  try {
    if (esEdicion.value) {
      await servicioPermisos.actualizar(idEdicion.value, formulario.value)
      mostrarAlerta('success', 'Actualizado', 'Permiso modificado exitosamente')
    } else {
      await servicioPermisos.crear(formulario.value)
      mostrarAlerta('success', 'Creado', 'Permiso creado exitosamente')
    }
    cerrarModal()
    await cargarPermisos()
  } catch (err) {
    mostrarAlerta('error', 'Error', err.response?.data?.mensaje || 'Error al guardar permiso')
  } finally {
    guardando.value = false
  }
}

async function confirmarEliminar(permiso) {
  const confirmado = await confirmarEliminacion(`el permiso "${permiso.nombre}" (${permiso.codigo})`)
  if (!confirmado) return

  try {
    await servicioPermisos.eliminar(permiso.id)
    mostrarAlerta('success', 'Eliminado', 'Permiso eliminado con éxito')
    await cargarPermisos()
  } catch (err) {
    mostrarAlerta('error', 'No se pudo eliminar', err.response?.data?.mensaje || 'Error al eliminar')
  }
}

onMounted(() => {
  cargarPermisos()
})
</script>

<style scoped>
.gap-1 { gap: 4px; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.tarjeta-movil {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.tarjeta-movil:active {
  transform: scale(0.99);
}
</style>
