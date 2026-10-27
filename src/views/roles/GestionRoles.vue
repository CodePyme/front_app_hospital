<template>
  <LayoutPrincipal>
    <!-- Encabezado de la página -->
    <div class="d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between mb-4 mb-sm-6 gap-3 border-b pb-4">
      <div>
        <div class="d-flex align-center flex-wrap gap-2 mb-1">
          <v-icon icon="mdi-shield-account-outline" color="primary" size="28" />
          <h1 class="text-h5 font-weight-bold text-primary mb-0">Gestión de Roles</h1>
          <v-chip color="primary" variant="tonal" size="small" class="font-weight-bold">
            Administración
          </v-chip>
        </div>
        <p class="text-caption text-medium-emphasis mb-0">
          Administra los roles del sistema y asocia los permisos permitidos para cada perfil de acceso
        </p>
      </div>
      <div class="w-100 w-sm-auto">
        <v-btn
          color="primary"
          rounded="pill"
          prepend-icon="mdi-plus"
          class="text-none font-weight-bold px-5 w-100 w-sm-auto"
          elevation="0"
          @click="abrirModalCrear"
        >
          Nuevo Rol
        </v-btn>
      </div>
    </div>

    <!-- Estadísticas Rápidas (Grid Adaptable) -->
    <v-row class="mb-3 mb-sm-4" dense>
      <v-col cols="12" sm="4">
        <v-card rounded="xl" color="primary" variant="tonal" elevation="0">
          <v-card-text class="d-flex align-center gap-3 pa-3 pa-sm-4">
            <v-icon icon="mdi-shield-account-outline" size="32" color="primary" />
            <div>
              <p class="text-caption text-medium-emphasis mb-0">Total de roles</p>
              <p class="text-h6 font-weight-bold mb-0 text-primary">{{ listaRoles.length }}</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" sm="4">
        <v-card rounded="xl" color="secondary" variant="tonal" elevation="0">
          <v-card-text class="d-flex align-center gap-3 pa-3 pa-sm-4">
            <v-icon icon="mdi-shield-lock-outline" size="32" color="secondary-darken-1" />
            <div>
              <p class="text-caption text-medium-emphasis mb-0">Del sistema</p>
              <p class="text-h6 font-weight-bold mb-0 text-secondary-darken-1">
                {{ listaRoles.filter((r) => r.esSistema).length }}
              </p>
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
                {{ listaRoles.filter((r) => r.activo).length }}
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
          <v-col cols="12" sm="8">
            <v-text-field
              v-model="busqueda"
              prepend-inner-icon="mdi-magnify"
              placeholder="Buscar rol por nombre, código..."
              hide-details
              density="compact"
              variant="outlined"
              color="primary"
              rounded="lg"
              clearable
            />
          </v-col>
          <v-col cols="12" sm="4" class="text-sm-end mt-2 mt-sm-0">
            <v-btn
              variant="tonal"
              color="primary"
              rounded="pill"
              size="small"
              prepend-icon="mdi-refresh"
              class="text-none font-weight-bold w-100 w-sm-auto"
              :loading="cargando"
              @click="cargarRoles"
            >
              Actualizar
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- ESTADO: Cargando -->
    <div v-if="cargando" class="text-center pa-8 bg-white rounded-xl border">
      <v-progress-circular indeterminate color="primary" size="40" width="3" />
      <div class="text-caption text-medium-emphasis mt-3">Consultando roles...</div>
    </div>

    <!-- ESTADO: Sin datos -->
    <div v-else-if="rolesFiltrados.length === 0" class="text-center pa-8 bg-white rounded-xl border">
      <v-icon icon="mdi-shield-off-outline" size="48" color="grey" class="mb-2" />
      <div class="text-subtitle-1 font-weight-bold text-primary mb-1">No se encontraron roles</div>
      <div class="text-caption text-medium-emphasis">No hay roles que coincidan con la búsqueda actual.</div>
    </div>

    <template v-else>
      <!-- VISTA MÓVIL (PANTALLAS PEQUEÑAS / CELULARES): Lista de Tarjetas 100% Ajustables Sin Scroll -->
      <div class="d-md-none">
        <v-card
          v-for="item in rolesPaginadosMovil"
          :key="item.id"
          class="mb-3 rounded-xl border bg-white overflow-hidden tarjeta-movil"
          elevation="0"
        >
          <div class="pa-4">
            <!-- Fila Superior: Título, Badge de Sistema y Estado -->
            <div class="d-flex justify-space-between align-start gap-2 mb-2">
              <div class="flex-grow-1">
                <div class="d-flex align-center flex-wrap gap-1">
                  <span class="text-subtitle-1 font-weight-bold text-primary" style="word-break: break-word;">
                    {{ item.nombre }}
                  </span>
                  <v-chip
                    v-if="item.esSistema"
                    size="x-small"
                    color="primary"
                    variant="flat"
                    class="font-weight-bold text-white text-uppercase"
                  >
                    Sistema
                  </v-chip>
                </div>
                <div class="text-caption text-medium-emphasis mt-1">
                  Código: <code class="bg-surface-variant px-1 rounded text-primary">{{ item.codigo }}</code>
                </div>
              </div>
              <v-chip
                size="small"
                :color="item.activo ? 'success' : 'grey'"
                variant="tonal"
                class="font-weight-medium flex-shrink-0"
              >
                {{ item.activo ? 'Activo' : 'Inactivo' }}
              </v-chip>
            </div>

            <!-- Descripción si existe -->
            <p v-if="item.descripcion" class="text-body-2 text-medium-emphasis mb-3" style="line-height: 1.35;">
              {{ item.descripcion }}
            </p>

            <!-- Fila de Chips de Métricas -->
            <div class="d-flex flex-wrap gap-2 mb-3">
              <v-chip size="small" variant="tonal" color="primary" class="font-weight-medium">
                <v-icon start icon="mdi-account-group-outline" size="14" />
                {{ item.totalUsuarios }} usuario(s)
              </v-chip>
              <v-chip size="small" variant="tonal" color="secondary" class="font-weight-bold text-primary">
                <v-icon start icon="mdi-key-outline" size="14" />
                {{ item.totalPermisos }} permiso(s)
              </v-chip>
            </div>

            <v-divider class="my-2 border-opacity-25" />

            <!-- Acciones Móviles (Botones Táctiles Cómodos) -->
            <div class="d-flex justify-end gap-2 pt-1">
              <v-btn
                v-if="!item.esSistema"
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
            :items="rolesFiltrados"
            :items-per-page="10"
            hover
            no-data-text="No hay roles disponibles"
          >
            <!-- Columna Nombre y Código -->
            <template #item.nombre="{ item }">
              <div class="py-2">
                <div class="font-weight-bold text-primary d-flex align-center gap-2">
                  {{ item.nombre }}
                  <v-chip
                    v-if="item.esSistema"
                    size="x-small"
                    color="primary"
                    variant="flat"
                    class="text-uppercase font-weight-bold text-white"
                  >
                    <v-icon start icon="mdi-shield-lock" size="12" />
                    Sistema
                  </v-chip>
                </div>
                <div class="text-caption text-medium-emphasis">
                  Código: <code class="bg-surface-variant px-1 rounded text-primary">{{ item.codigo }}</code>
                  <span v-if="item.descripcion"> &bull; {{ item.descripcion }}</span>
                </div>
              </div>
            </template>

            <!-- Columna Usuarios Asignados -->
            <template #item.totalUsuarios="{ item }">
              <v-chip size="small" variant="tonal" color="primary" class="font-weight-medium">
                <v-icon start icon="mdi-account-group-outline" size="14" />
                {{ item.totalUsuarios }} usuario(s)
              </v-chip>
            </template>

            <!-- Columna Permisos Asociados -->
            <template #item.totalPermisos="{ item }">
              <v-chip size="small" variant="tonal" color="secondary" class="font-weight-bold text-primary">
                <v-icon start icon="mdi-key-outline" size="14" />
                {{ item.totalPermisos }} permiso(s)
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
                  title="Editar rol y permisos"
                  @click="abrirModalEditar(item)"
                />
                <v-btn
                  v-if="!item.esSistema"
                  icon="mdi-trash-can-outline"
                  size="small"
                  variant="text"
                  color="error"
                  title="Eliminar rol"
                  @click="confirmarEliminar(item)"
                />
              </div>
            </template>
          </v-data-table>
        </v-card>
      </div>
    </template>

    <!-- Modal Crear / Editar Rol con Gestión de Permisos (Totalmente Responsive) -->
    <v-dialog v-model="modalAbierto" max-width="840" persistent scrollable>
      <v-card class="rounded-xl">
        <v-card-title class="d-flex justify-space-between align-center py-3 px-4 px-sm-5 border-b bg-white">
          <div class="d-flex align-center gap-2">
            <v-icon icon="mdi-shield-check-outline" color="primary" />
            <span class="text-subtitle-1 text-sm-h6 font-weight-bold text-primary">
              {{ esEdicion ? 'Editar Rol y Permisos' : 'Crear Nuevo Rol' }}
            </span>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" color="primary" @click="cerrarModal" />
        </v-card-title>

        <v-card-text class="pa-3 pa-sm-5 bg-background" style="max-height: 72vh;">
          <v-form ref="formularioRef" v-model="formularioValido">
            <!-- Datos básicos del Rol -->
            <v-card class="pa-3 pa-sm-4 rounded-xl border bg-white mb-3" elevation="0">
              <div class="text-subtitle-2 font-weight-bold text-primary mb-3 d-flex align-center gap-2">
                <v-icon icon="mdi-information-outline" size="18" color="primary" />
                Información del Rol
              </div>
              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formulario.nombre"
                    label="Nombre del Rol *"
                    placeholder="ej. Auditor Clínico"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                    rounded="lg"
                    :rules="[reglas.requerido]"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formulario.codigo"
                    label="Código Único *"
                    placeholder="ej. auditor_clinico"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                    rounded="lg"
                    :disabled="esEdicion && formulario.esSistema"
                    :rules="[reglas.requerido, reglas.codigo]"
                    hint="Identificador en minúsculas sin espacios"
                    persistent-hint
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="formulario.descripcion"
                    label="Descripción del perfil"
                    placeholder="Describe las funciones de este rol..."
                    variant="outlined"
                    color="primary"
                    rows="2"
                    rounded="lg"
                  />
                </v-col>
                <v-col cols="12">
                  <v-switch
                    v-model="formulario.activo"
                    label="Rol activo para asignación"
                    color="primary"
                    density="compact"
                    :disabled="esEdicion && formulario.esSistema"
                    hide-details
                  />
                </v-col>
              </v-row>
            </v-card>

            <!-- Asignación de Permisos Agrupados por Módulo -->
            <v-card class="pa-3 pa-sm-4 rounded-xl border bg-white" elevation="0">
              <div class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center mb-3 gap-2">
                <div>
                  <div class="text-subtitle-2 font-weight-bold text-primary d-flex align-center gap-2">
                    <v-icon icon="mdi-key-outline" size="18" color="primary" />
                    Permisos Asignados al Rol
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ formulario.permisoIds.length }} permisos seleccionados
                  </div>
                </div>
                <div class="d-flex gap-2">
                  <v-btn
                    size="x-small"
                    variant="tonal"
                    color="primary"
                    rounded="pill"
                    class="text-none font-weight-bold"
                    @click="marcarTodosLosPermisos"
                  >
                    Marcar todos
                  </v-btn>
                  <v-btn
                    size="x-small"
                    variant="tonal"
                    color="grey-darken-1"
                    rounded="pill"
                    class="text-none"
                    @click="desmarcarTodosLosPermisos"
                  >
                    Desmarcar
                  </v-btn>
                </div>
              </div>

              <!-- Loading permisos -->
              <div v-if="cargandoPermisos" class="text-center py-6">
                <v-progress-circular indeterminate color="primary" />
                <div class="text-caption text-medium-emphasis mt-2">Cargando permisos disponibles...</div>
              </div>

              <!-- Acordeón por Módulo -->
              <div v-else>
                <v-expansion-panels variant="accordion" multiple>
                  <v-expansion-panel
                    v-for="(permisosModulo, modulo) in permisosAgrupados"
                    :key="modulo"
                    rounded="lg"
                    class="mb-2 border elevation-0"
                  >
                    <v-expansion-panel-title class="py-2 px-3 px-sm-4">
                      <div class="d-flex align-center justify-space-between w-100 pr-2">
                        <div class="d-flex align-center gap-2">
                          <v-icon :icon="iconoModulo(modulo)" size="18" color="primary" />
                          <span class="text-body-2 font-weight-bold text-capitalize text-primary">
                            Módulo {{ modulo }}
                          </span>
                        </div>
                        <v-chip size="x-small" variant="tonal" color="primary" class="font-weight-bold">
                          {{ contarPermisosModuloSeleccionados(permisosModulo) }} / {{ permisosModulo.length }}
                        </v-chip>
                      </div>
                    </v-expansion-panel-title>

                    <v-expansion-panel-text class="pa-2 pa-sm-3 bg-white">
                      <div class="d-flex justify-end mb-2">
                        <v-btn
                          size="x-small"
                          variant="text"
                          color="primary"
                          class="text-none font-weight-bold"
                          @click="toggleModulo(permisosModulo)"
                        >
                          {{ sonTodosDelModuloSeleccionados(permisosModulo) ? 'Desmarcar módulo' : 'Marcar todo' }}
                        </v-btn>
                      </div>

                      <v-row dense>
                        <v-col
                          v-for="permiso in permisosModulo"
                          :key="permiso.id"
                          cols="12"
                          sm="6"
                        >
                          <v-checkbox
                            v-model="formulario.permisoIds"
                            :value="permiso.id"
                            color="primary"
                            density="compact"
                            hide-details
                            class="mb-1"
                          >
                            <template #label>
                              <div style="word-break: break-word;">
                                <div class="text-body-2 font-weight-medium text-grey-darken-3" style="line-height: 1.25;">
                                  {{ permiso.nombre }}
                                </div>
                                <div class="text-caption text-medium-emphasis">
                                  <code>{{ permiso.codigo }}</code>
                                </div>
                              </div>
                            </template>
                          </v-checkbox>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </div>
            </v-card>
          </v-form>
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
            :loading="guardando"
            @click="guardarRol"
          >
            {{ esEdicion ? 'Actualizar Rol' : 'Crear Rol' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </LayoutPrincipal>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import LayoutPrincipal from '../../layouts/LayoutPrincipal.vue'
import { servicioRoles } from '../../services/roles.service'
import { servicioPermisos } from '../../services/permisos.service'
import { usarAlertas } from '../../composables/usarAlertas'

const { mostrarAlerta, confirmarEliminacion } = usarAlertas()

const cargando = ref(false)
const cargandoPermisos = ref(false)
const guardando = ref(false)
const listaRoles = ref([])
const catalogoPermisos = ref([])
const busqueda = ref('')

// Paginación móvil
const paginaActualMovil = ref(1)
const limitePorPaginaMovil = ref(6)

const modalAbierto = ref(false)
const esEdicion = ref(false)
const idEdicion = ref(null)
const formularioRef = ref(null)
const formularioValido = ref(false)

const formulario = ref({
  nombre: '',
  codigo: '',
  descripcion: '',
  activo: true,
  esSistema: false,
  permisoIds: [],
})

const reglas = {
  requerido: (v) => !!v || 'Este campo es obligatorio',
  codigo: (v) => !/\s/.test(v) || 'El código no puede contener espacios',
}

const columnas = [
  { title: 'Rol / Perfil', key: 'nombre', align: 'start', sortable: true },
  { title: 'Usuarios', key: 'totalUsuarios', align: 'center', sortable: true },
  { title: 'Permisos', key: 'totalPermisos', align: 'center', sortable: true },
  { title: 'Estado', key: 'activo', align: 'center', sortable: true },
  { title: 'Acciones', key: 'acciones', align: 'end', sortable: false },
]

const rolesFiltrados = computed(() => {
  if (!busqueda.value) return listaRoles.value
  const q = busqueda.value.toLowerCase().trim()
  return listaRoles.value.filter(
    (r) =>
      r.nombre?.toLowerCase().includes(q) ||
      r.codigo?.toLowerCase().includes(q) ||
      r.descripcion?.toLowerCase().includes(q),
  )
})

// Paginación reactiva para vista móvil
const totalPaginasMovil = computed(() => {
  return Math.ceil(rolesFiltrados.value.length / limitePorPaginaMovil.value) || 1
})

const rolesPaginadosMovil = computed(() => {
  const inicio = (paginaActualMovil.value - 1) * limitePorPaginaMovil.value
  return rolesFiltrados.value.slice(inicio, inicio + limitePorPaginaMovil.value)
})

const permisosAgrupados = computed(() => {
  const agrupados = {}
  for (const p of catalogoPermisos.value) {
    if (!agrupados[p.modulo]) {
      agrupados[p.modulo] = []
    }
    agrupados[p.modulo].push(p)
  }
  return agrupados
})

function iconoModulo(modulo) {
  const iconos = {
    dashboard: 'mdi-view-dashboard-outline',
    pacientes: 'mdi-account-multiple-outline',
    citas: 'mdi-calendar-blank-outline',
    resultados: 'mdi-pulse',
    historia: 'mdi-file-document-outline',
    medicamentos: 'mdi-pill',
    usuarios: 'mdi-account-cog-outline',
    roles: 'mdi-shield-account-outline',
    permisos: 'mdi-key-outline',
    configuracion: 'mdi-palette-outline',
  }
  return iconos[modulo] || 'mdi-folder-outline'
}

function contarPermisosModuloSeleccionados(permisosModulo) {
  const idsModulo = new Set(permisosModulo.map((p) => p.id))
  return formulario.value.permisoIds.filter((id) => idsModulo.has(id)).length
}

function sonTodosDelModuloSeleccionados(permisosModulo) {
  return permisosModulo.every((p) => formulario.value.permisoIds.includes(p.id))
}

function toggleModulo(permisosModulo) {
  const todosMarcados = sonTodosDelModuloSeleccionados(permisosModulo)
  const idsModulo = permisosModulo.map((p) => p.id)

  if (todosMarcados) {
    formulario.value.permisoIds = formulario.value.permisoIds.filter(
      (id) => !idsModulo.includes(id),
    )
  } else {
    const nuevos = new Set([...formulario.value.permisoIds, ...idsModulo])
    formulario.value.permisoIds = Array.from(nuevos)
  }
}

function marcarTodosLosPermisos() {
  formulario.value.permisoIds = catalogoPermisos.value.map((p) => p.id)
}

function desmarcarTodosLosPermisos() {
  formulario.value.permisoIds = []
}

async function cargarRoles() {
  cargando.value = true
  try {
    const res = await servicioRoles.obtenerTodos()
    listaRoles.value = res.datos || []
  } catch (err) {
    mostrarAlerta('error', 'Error', err.response?.data?.mensaje || 'Error al cargar roles')
  } finally {
    cargando.value = false
  }
}

async function cargarCatalogoPermisos() {
  cargandoPermisos.value = true
  try {
    const res = await servicioPermisos.obtenerTodos()
    catalogoPermisos.value = res.datos || []
  } catch (err) {
    console.error('Error al cargar catálogo de permisos', err)
  } finally {
    cargandoPermisos.value = false
  }
}

function abrirModalCrear() {
  esEdicion.value = false
  idEdicion.value = null
  formulario.value = {
    nombre: '',
    codigo: '',
    descripcion: '',
    activo: true,
    esSistema: false,
    permisoIds: [],
  }
  modalAbierto.value = true
}

function abrirModalEditar(rol) {
  esEdicion.value = true
  idEdicion.value = rol.id

  const idsPermisos = (rol.permisos || []).map((p) => p.id)

  formulario.value = {
    nombre: rol.nombre,
    codigo: rol.codigo,
    descripcion: rol.descripcion || '',
    activo: rol.activo,
    esSistema: rol.esSistema,
    permisoIds: idsPermisos,
  }
  modalAbierto.value = true
}

function cerrarModal() {
  modalAbierto.value = false
}

async function guardarRol() {
  if (formularioRef.value) {
    const { valid } = await formularioRef.value.validate()
    if (!valid) return
  } else if (!formularioValido.value) {
    return
  }
  guardando.value = true
  try {
    const payload = {
      nombre: formulario.value.nombre,
      codigo: formulario.value.codigo,
      descripcion: formulario.value.descripcion,
      activo: formulario.value.activo,
      permisoIds: formulario.value.permisoIds,
    }

    if (esEdicion.value) {
      await servicioRoles.actualizar(idEdicion.value, payload)
      mostrarAlerta('success', 'Actualizado', 'Rol modificado exitosamente')
    } else {
      await servicioRoles.crear(payload)
      mostrarAlerta('success', 'Creado', 'Rol creado exitosamente')
    }
    cerrarModal()
    await cargarRoles()
  } catch (err) {
    mostrarAlerta('error', 'Error', err.response?.data?.mensaje || 'Error al guardar rol')
  } finally {
    guardando.value = false
  }
}

async function confirmarEliminar(rol) {
  const confirmado = await confirmarEliminacion(`el rol "${rol.nombre}"`)
  if (!confirmado) return

  try {
    await servicioRoles.eliminar(rol.id)
    mostrarAlerta('success', 'Eliminado', 'Rol eliminado exitosamente')
    await cargarRoles()
  } catch (err) {
    mostrarAlerta('error', 'No se pudo eliminar', err.response?.data?.mensaje || 'Error al eliminar rol')
  }
}

onMounted(async () => {
  await Promise.all([cargarRoles(), cargarCatalogoPermisos()])
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
