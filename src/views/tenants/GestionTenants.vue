<template>
  <LayoutPrincipal>
    <!-- Encabezado -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <div class="d-flex align-center gap-2 mb-1">
          <v-icon icon="mdi-domain" color="primary" size="28" />
          <h2 class="text-h5 font-weight-bold">Gestión de Tenants</h2>
          <v-chip color="deep-purple" variant="tonal" size="small" prepend-icon="mdi-shield-crown">
            Super Admin
          </v-chip>
        </div>
        <p class="text-medium-emphasis">
          Administra los clientes (clínicas / instituciones) del sistema multi-tenant
        </p>
      </div>
      <v-btn
        id="btn-nuevo-tenant"
        color="primary"
        prepend-icon="mdi-plus"
        @click="abrirDialogoCrear"
      >
        Nuevo Tenant
      </v-btn>
    </div>

    <!-- Estadísticas rápidas -->
    <v-row class="mb-4">
      <v-col cols="12" sm="4">
        <v-card rounded="xl" color="primary" variant="tonal">
          <v-card-text class="d-flex align-center gap-3 pa-4">
            <v-icon icon="mdi-domain" size="36" />
            <div>
              <p class="text-caption text-medium-emphasis mb-0">Total tenants</p>
              <p class="text-h5 font-weight-bold mb-0">{{ total }}</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card rounded="xl" color="success" variant="tonal">
          <v-card-text class="d-flex align-center gap-3 pa-4">
            <v-icon icon="mdi-check-circle" size="36" />
            <div>
              <p class="text-caption text-medium-emphasis mb-0">Activos</p>
              <p class="text-h5 font-weight-bold mb-0">{{ tenants.filter((t) => t.activo).length }}</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card rounded="xl" color="error" variant="tonal">
          <v-card-text class="d-flex align-center gap-3 pa-4">
            <v-icon icon="mdi-close-circle" size="36" />
            <div>
              <p class="text-caption text-medium-emphasis mb-0">Inactivos</p>
              <p class="text-h5 font-weight-bold mb-0">{{ tenants.filter((t) => !t.activo).length }}</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tabla de tenants -->
    <v-card rounded="xl">
      <v-data-table
        :headers="columnas"
        :items="tenants"
        :loading="cargando"
        loading-text="Cargando tenants..."
        no-data-text="No hay tenants registrados"
        item-value="id"
        hover
      >
        <!-- Columna tenant (nombre + dominio) -->
        <template v-slot:item.nombre="{ item }">
          <div class="d-flex align-center gap-3 py-2">
            <v-avatar
              :color="item.activo ? 'primary' : 'grey'"
              size="40"
              rounded="lg"
            >
              <span class="text-body-2 font-weight-bold text-white">
                {{ item.nombre.substring(0, 2).toUpperCase() }}
              </span>
            </v-avatar>
            <div>
              <p class="font-weight-semibold mb-0">{{ item.nombre }}</p>
              <p class="text-caption text-medium-emphasis mb-0">
                <v-icon icon="mdi-web" size="12" class="mr-1" />{{ item.dominio }}
              </p>
            </div>
          </div>
        </template>

        <!-- Columna base de datos -->
        <template v-slot:item.dbDatabase="{ item }">
          <v-chip
            variant="outlined"
            size="small"
            prepend-icon="mdi-database"
            color="info"
          >
            {{ item.dbDatabase }}
          </v-chip>
        </template>

        <!-- Columna host:port -->
        <template v-slot:item.dbHost="{ item }">
          <span class="text-caption font-weight-mono">
            {{ item.dbHost }}:{{ item.dbPort }}
          </span>
        </template>

        <!-- Columna estado -->
        <template v-slot:item.activo="{ item }">
          <v-chip
            :color="item.activo ? 'success' : 'error'"
            size="small"
            variant="tonal"
            :prepend-icon="item.activo ? 'mdi-check-circle' : 'mdi-close-circle'"
          >
            {{ item.activo ? 'Activo' : 'Inactivo' }}
          </v-chip>
        </template>

        <!-- Columna fecha creación -->
        <template v-slot:item.creadoEn="{ item }">
          <span class="text-caption text-medium-emphasis">
            {{ formatearFecha(item.creadoEn) }}
          </span>
        </template>

        <!-- Columna acciones -->
        <template v-slot:item.acciones="{ item }">
          <div class="d-flex gap-1">
            <v-tooltip :text="item.activo ? 'Desactivar' : 'Activar'">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  :icon="item.activo ? 'mdi-toggle-switch' : 'mdi-toggle-switch-off'"
                  size="small"
                  variant="text"
                  :color="item.activo ? 'success' : 'grey'"
                  :loading="toggleandoId === item.id"
                  @click="cambiarEstadoTenant(item)"
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
        <span class="text-caption text-medium-emphasis">Total: {{ total }} tenants</span>
        <v-pagination
          v-model="paginaActual"
          :length="totalPaginas"
          :total-visible="5"
          density="compact"
          @update:model-value="cambiarPagina"
        />
      </div>
    </v-card>

    <!-- Diálogo crear/editar tenant -->
    <v-dialog v-model="dialogoVisible" max-width="700" persistent scrollable>
      <v-card rounded="xl">
        <!-- Cabecera del diálogo -->
        <v-card-title class="d-flex align-center pa-5">
          <v-icon :color="modoEdicion ? 'warning' : 'primary'" class="mr-2">
            {{ modoEdicion ? 'mdi-pencil' : 'mdi-domain-plus' }}
          </v-icon>
          {{ modoEdicion ? 'Editar Tenant' : 'Nuevo Tenant' }}
          <v-spacer />
          <v-btn id="btn-cerrar-dialogo" icon="mdi-close" variant="text" @click="cerrarDialogo" />
        </v-card-title>
        <v-divider />

        <v-card-text class="pa-5">
          <v-form ref="refFormulario" v-model="formularioValido">
            <!-- Sección: Información del tenant -->
            <p class="text-caption font-weight-bold text-primary text-uppercase mb-3">
              <v-icon icon="mdi-information" size="14" class="mr-1" />
              Información del tenant
            </p>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  id="campo-nombre"
                  v-model="formulario.nombre"
                  label="Nombre del tenant *"
                  prepend-inner-icon="mdi-domain"
                  :rules="[(v) => !!v || 'El nombre es requerido']"
                  placeholder="Clínica San Juan"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  id="campo-slug"
                  v-model="formulario.slug"
                  label="Slug *"
                  prepend-inner-icon="mdi-tag"
                  :rules="[
                    (v) => !!v || 'El slug es requerido',
                    (v) => /^[a-z0-9-]+$/.test(v) || 'Solo letras minúsculas, números y guiones',
                  ]"
                  placeholder="clinica-san-juan"
                  hint="Identificador único (solo minúsculas, números y guiones)"
                  persistent-hint
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  id="campo-dominio"
                  v-model="formulario.dominio"
                  label="Dominio *"
                  prepend-inner-icon="mdi-web"
                  :rules="[(v) => !!v || 'El dominio es requerido']"
                  placeholder="clinica-san-juan.com"
                  hint="Dominio completo sin protocolo (ej: clinica.com)"
                  persistent-hint
                />
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <!-- Sección: Configuración de base de datos -->
            <p class="text-caption font-weight-bold text-info text-uppercase mb-3">
              <v-icon icon="mdi-database" size="14" class="mr-1" />
              Base de datos del tenant
            </p>
            <v-row>
              <v-col cols="12" sm="8">
                <v-text-field
                  id="campo-db-host"
                  v-model="formulario.dbHost"
                  label="Host de la BD *"
                  prepend-inner-icon="mdi-server"
                  :rules="[(v) => !!v || 'El host es requerido']"
                  placeholder="127.0.0.1"
                />
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  id="campo-db-port"
                  v-model.number="formulario.dbPort"
                  label="Puerto *"
                  type="number"
                  :rules="[(v) => !!v || 'El puerto es requerido']"
                  placeholder="5432"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  id="campo-db-database"
                  v-model="formulario.dbDatabase"
                  label="Nombre de la BD *"
                  prepend-inner-icon="mdi-database"
                  :rules="[
                    (v) => !!v || 'El nombre de la BD es requerido',
                    (v) => /^[a-z0-9_]+$/.test(v) || 'Solo letras minúsculas, números y guiones bajos',
                  ]"
                  placeholder="portal_paciente_clinica_san_juan"
                  hint="Nombre de la base de datos exclusiva para este tenant"
                  persistent-hint
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  id="campo-db-username"
                  v-model="formulario.dbUsername"
                  label="Usuario BD *"
                  prepend-inner-icon="mdi-account-key"
                  :rules="[(v) => !!v || 'El usuario es requerido']"
                  placeholder="admin"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  id="campo-db-password"
                  v-model="formulario.dbPassword"
                  label="Contraseña BD *"
                  prepend-inner-icon="mdi-lock"
                  :type="mostrarContrasena ? 'text' : 'password'"
                  :append-inner-icon="mostrarContrasena ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="mostrarContrasena = !mostrarContrasena"
                  :rules="[(v) => !!v || 'La contraseña es requerida']"
                  placeholder="••••••••"
                />
              </v-col>
            </v-row>

            <v-divider class="my-4" />

            <!-- Estado -->
            <div class="d-flex align-center gap-3">
              <v-switch
                v-model="formulario.activo"
                :label="formulario.activo ? 'Tenant activo' : 'Tenant inactivo'"
                color="success"
                hide-details
                inset
              />
              <span class="text-caption text-medium-emphasis">
                {{ formulario.activo ? 'El tenant estará disponible inmediatamente' : 'El tenant no podrá acceder al sistema' }}
              </span>
            </div>
          </v-form>
        </v-card-text>

        <v-divider />
        <v-card-actions class="pa-5">
          <v-spacer />
          <v-btn variant="text" @click="cerrarDialogo">Cancelar</v-btn>
          <v-btn
            id="btn-guardar-tenant"
            color="primary"
            :loading="guardando"
            :disabled="!formularioValido"
            prepend-icon="mdi-content-save"
            @click="guardarTenant"
          >
            {{ modoEdicion ? 'Actualizar' : 'Crear Tenant' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </LayoutPrincipal>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import LayoutPrincipal from '../../layouts/LayoutPrincipal.vue'
import { servicioTenants } from '../../services/tenants.service'
import { usarAlertas } from '../../composables/usarAlertas'

const { confirmarEliminacion, mostrarExito, mostrarError } = usarAlertas()

// Estado
const tenants = ref([])
const cargando = ref(false)
const guardando = ref(false)
const total = ref(0)
const paginaActual = ref(1)
const limitePorPagina = ref(10)
const dialogoVisible = ref(false)
const modoEdicion = ref(false)
const formularioValido = ref(false)
const refFormulario = ref(null)
const tenantEditandoId = ref(null)
const toggleandoId = ref(null)
const mostrarContrasena = ref(false)

// Columnas de la tabla
const columnas = [
  { title: 'Tenant', key: 'nombre', sortable: true },
  { title: 'Base de datos', key: 'dbDatabase', sortable: false },
  { title: 'Servidor', key: 'dbHost', sortable: false },
  { title: 'Estado', key: 'activo', sortable: false },
  { title: 'Creado', key: 'creadoEn', sortable: true },
  { title: 'Acciones', key: 'acciones', sortable: false, align: 'center' },
]

// Formulario reactivo
const formulario = reactive({
  nombre: '',
  slug: '',
  dominio: '',
  dbHost: '127.0.0.1',
  dbPort: 5432,
  dbDatabase: '',
  dbUsername: 'admin',
  dbPassword: '',
  activo: true,
})

const totalPaginas = computed(() =>
  Math.ceil(total.value / limitePorPagina.value),
)

// Formatear fecha legible
function formatearFecha(fecha) {
  if (!fecha) return '-'
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date(fecha))
}

// Limpiar formulario
function limpiarFormulario() {
  Object.assign(formulario, {
    nombre: '',
    slug: '',
    dominio: '',
    dbHost: '127.0.0.1',
    dbPort: 5432,
    dbDatabase: '',
    dbUsername: 'admin',
    dbPassword: '',
    activo: true,
  })
  mostrarContrasena.value = false
  refFormulario.value?.reset()
}

// Auto-generar slug desde el nombre
function generarSlug(nombre) {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .trim()
}

// Watchers: auto-completar slug al escribir nombre
import { watch } from 'vue'
watch(
  () => formulario.nombre,
  (nuevoNombre) => {
    if (!modoEdicion.value && nuevoNombre) {
      formulario.slug = generarSlug(nuevoNombre)
    }
  },
)

// CRUD actions
async function cargarTenants(pagina = 1) {
  cargando.value = true
  try {
    const respuesta = await servicioTenants.obtenerTodos(pagina, limitePorPagina.value)
    tenants.value = respuesta.datos
    total.value = respuesta.total
    paginaActual.value = pagina
  } catch (err) {
    mostrarError(err.response?.data?.message || 'Error al cargar tenants')
  } finally {
    cargando.value = false
  }
}

function abrirDialogoCrear() {
  modoEdicion.value = false
  tenantEditandoId.value = null
  limpiarFormulario()
  dialogoVisible.value = true
}

function abrirDialogoEditar(tenant) {
  modoEdicion.value = true
  tenantEditandoId.value = tenant.id
  Object.assign(formulario, {
    nombre: tenant.nombre,
    slug: tenant.slug,
    dominio: tenant.dominio,
    dbHost: tenant.dbHost,
    dbPort: tenant.dbPort,
    dbDatabase: tenant.dbDatabase,
    dbUsername: tenant.dbUsername,
    dbPassword: tenant.dbPassword,
    activo: tenant.activo,
  })
  mostrarContrasena.value = false
  dialogoVisible.value = true
}

function cerrarDialogo() {
  dialogoVisible.value = false
  limpiarFormulario()
}

async function guardarTenant() {
  const { valid } = await refFormulario.value.validate()
  if (!valid) return

  guardando.value = true
  try {
    if (modoEdicion.value) {
      await servicioTenants.actualizar(tenantEditandoId.value, { ...formulario })
      await mostrarExito('Tenant actualizado correctamente')
    } else {
      await servicioTenants.crear({ ...formulario })
      await mostrarExito('Tenant creado correctamente')
    }
    cerrarDialogo()
    await cargarTenants(paginaActual.value)
  } catch (err) {
    mostrarError(err.response?.data?.message || 'Error al guardar el tenant')
  } finally {
    guardando.value = false
  }
}

async function cambiarEstadoTenant(tenant) {
  toggleandoId.value = tenant.id
  try {
    await servicioTenants.toggleActivo(tenant.id)
    await cargarTenants(paginaActual.value)
  } catch (err) {
    mostrarError('Error al cambiar el estado del tenant')
  } finally {
    toggleandoId.value = null
  }
}

async function solicitarEliminacion(tenant) {
  const confirmado = await confirmarEliminacion(`el tenant "${tenant.nombre}"`)
  if (!confirmado) return
  try {
    await servicioTenants.eliminar(tenant.id)
    await mostrarExito('Tenant eliminado correctamente')
    await cargarTenants(paginaActual.value)
  } catch (err) {
    mostrarError(err.response?.data?.message || 'Error al eliminar el tenant')
  }
}

async function cambiarPagina(pagina) {
  await cargarTenants(pagina)
}

onMounted(() => cargarTenants())
</script>
