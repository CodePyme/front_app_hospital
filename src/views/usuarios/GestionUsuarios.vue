<template>
  <LayoutPrincipal>
    <!-- Encabezado de la página -->
    <div class="d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between mb-4 mb-sm-6 gap-3 border-b pb-4">
      <div>
        <div class="d-flex align-center flex-wrap gap-2 mb-1">
          <v-icon icon="mdi-account-cog-outline" color="primary" size="28" />
          <h1 class="text-h5 font-weight-bold text-primary mb-0">Usuarios de Plataforma</h1>
          <v-chip color="primary" variant="tonal" size="small" class="font-weight-bold">
            Administración
          </v-chip>
        </div>
        <p class="text-caption text-medium-emphasis mb-0">
          Administración de cuentas para el personal administrativo y clínico. Los pacientes se autentican vía clave dinámica OTP.
        </p>
      </div>
      <div class="w-100 w-sm-auto">
        <v-btn
          color="primary"
          rounded="pill"
          prepend-icon="mdi-account-plus-outline"
          class="text-none font-weight-bold px-5 w-100 w-sm-auto"
          elevation="0"
          @click="abrirModalCrear"
        >
          Nuevo Usuario
        </v-btn>
      </div>
    </div>

    <!-- Estadísticas Rápidas -->
    <v-row class="mb-3 mb-sm-4" dense>
      <v-col cols="12" sm="4">
        <v-card rounded="xl" color="primary" variant="tonal" elevation="0">
          <v-card-text class="d-flex align-center gap-3 pa-3 pa-sm-4">
            <v-icon icon="mdi-account-multiple-outline" size="32" color="primary" />
            <div>
              <p class="text-caption text-medium-emphasis mb-0">Personal de plataforma</p>
              <p class="text-h6 font-weight-bold mb-0 text-primary">{{ usuariosVisibles.length }}</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" sm="4">
        <v-card rounded="xl" color="secondary" variant="tonal" elevation="0">
          <v-card-text class="d-flex align-center gap-3 pa-3 pa-sm-4">
            <v-icon icon="mdi-shield-check-outline" size="32" color="secondary-darken-1" />
            <div>
              <p class="text-caption text-medium-emphasis mb-0">Roles asignados</p>
              <p class="text-h6 font-weight-bold mb-0 text-secondary-darken-1">{{ rolesUtilizados }}</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6" sm="4">
        <v-card rounded="xl" color="success" variant="tonal" elevation="0">
          <v-card-text class="d-flex align-center gap-3 pa-3 pa-sm-4">
            <v-icon icon="mdi-account-check-outline" size="32" color="success" />
            <div>
              <p class="text-caption text-medium-emphasis mb-0">Usuarios activos</p>
              <p class="text-h6 font-weight-bold mb-0 text-success">
                {{ usuariosVisibles.filter((u) => u.activo).length }}
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
              placeholder="Buscar por nombre, correo..."
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
              v-model="filtroRol"
              :items="rolesDisponiblesFiltro"
              item-title="nombre"
              item-value="id"
              label="Filtrar por rol"
              prepend-inner-icon="mdi-shield-outline"
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
              @click="cargarUsuarios"
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
      <div class="text-caption text-medium-emphasis mt-3">Consultando usuarios de plataforma...</div>
    </div>

    <!-- ESTADO: Sin datos -->
    <div v-else-if="usuariosFiltrados.length === 0" class="text-center pa-8 bg-white rounded-xl border">
      <v-icon icon="mdi-account-off-outline" size="48" color="grey" class="mb-2" />
      <div class="text-subtitle-1 font-weight-bold text-primary mb-1">No se encontraron usuarios</div>
      <div class="text-caption text-medium-emphasis">No hay personal que coincida con los filtros actuales.</div>
    </div>

    <template v-else>
      <!-- VISTA MÓVIL (PANTALLAS PEQUEÑAS / CELULARES): Lista de Tarjetas 100% Ajustables Sin Scroll -->
      <div class="d-md-none">
        <v-card
          v-for="item in usuariosPaginadosMovil"
          :key="item.id"
          class="mb-3 rounded-xl border bg-white overflow-hidden tarjeta-movil"
          elevation="0"
        >
          <div class="pa-4">
            <!-- Fila Superior: Avatar, Nombre y Estado -->
            <div class="d-flex justify-space-between align-start gap-3 mb-2">
              <div class="d-flex align-center gap-3">
                <v-avatar color="primary" variant="tonal" size="40" class="font-weight-bold text-primary flex-shrink-0">
                  {{ iniciales(item.nombres, item.apellidos) }}
                </v-avatar>
                <div>
                  <div class="font-weight-bold text-primary text-subtitle-1" style="word-break: break-word; line-height: 1.25;">
                    {{ item.nombres }} {{ item.apellidos }}
                  </div>
                  <div class="text-caption text-medium-emphasis" style="word-break: break-all;">
                    {{ item.correoElectronico }}
                  </div>
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

            <!-- Fila de Chips: Rol y Permisos Directos -->
            <div class="d-flex flex-wrap gap-2 mb-3">
              <v-chip
                size="small"
                variant="tonal"
                color="primary"
                class="font-weight-bold text-capitalize"
              >
                <v-icon start icon="mdi-shield-check-outline" size="14" />
                {{ item.rolEntidad?.nombre || item.rol }}
              </v-chip>

              <v-chip
                v-if="item.permisosDirectos && item.permisosDirectos.length > 0"
                size="small"
                variant="tonal"
                color="secondary"
                class="font-weight-bold text-primary"
                @click="verDetallePermisos(item)"
              >
                <v-icon start icon="mdi-key-plus" size="14" />
                +{{ item.permisosDirectos.length }} directos
              </v-chip>
              <v-chip v-else size="small" variant="text" class="text-caption text-medium-emphasis px-1">
                Sin permisos directos adicionales
              </v-chip>
            </div>

            <v-divider class="my-2 border-opacity-25" />

            <!-- Acciones Móviles (Botones Táctiles) -->
            <div class="d-flex justify-end align-center gap-1 pt-1">
              <v-btn
                v-if="item.correoElectronico !== 'admin@codepyme.com'"
                color="error"
                variant="text"
                size="small"
                rounded="pill"
                icon="mdi-trash-can-outline"
                title="Eliminar usuario"
                @click="confirmarEliminar(item)"
              />
              <v-btn
                color="secondary-darken-1"
                variant="tonal"
                size="small"
                rounded="pill"
                class="text-none font-weight-bold px-3"
                prepend-icon="mdi-lock-reset"
                @click="abrirModalContrasena(item)"
              >
                Clave
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
            :items="usuariosFiltrados"
            :items-per-page="10"
            hover
            no-data-text="No hay usuarios administrativos registrados"
          >
            <!-- Columna Usuario / Nombre -->
            <template #item.usuario="{ item }">
              <div class="d-flex align-center gap-3 py-2">
                <v-avatar color="primary" variant="tonal" size="38" class="font-weight-bold text-primary">
                  {{ iniciales(item.nombres, item.apellidos) }}
                </v-avatar>
                <div>
                  <div class="font-weight-bold text-primary d-flex align-center gap-1">
                    {{ item.nombres }} {{ item.apellidos }}
                    <v-chip
                      v-if="item.correoElectronico === 'admin@codepyme.com'"
                      size="x-small"
                      color="primary"
                      variant="flat"
                      class="font-weight-bold text-white ml-1"
                    >
                      Super Admin
                    </v-chip>
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ item.correoElectronico }}
                  </div>
                </div>
              </div>
            </template>

            <!-- Columna Rol Asignado -->
            <template #item.rol="{ item }">
              <v-chip
                size="small"
                variant="tonal"
                color="primary"
                class="font-weight-bold text-capitalize"
              >
                <v-icon start icon="mdi-shield-check-outline" size="14" />
                {{ item.rolEntidad?.nombre || item.rol }}
              </v-chip>
            </template>

            <!-- Columna Permisos Directos Asignados -->
            <template #item.permisosDirectos="{ item }">
              <div class="d-flex align-center gap-1">
                <v-chip
                  v-if="item.permisosDirectos && item.permisosDirectos.length > 0"
                  size="small"
                  variant="tonal"
                  color="secondary"
                  class="font-weight-bold text-primary cursor-pointer"
                  @click="verDetallePermisos(item)"
                >
                  <v-icon start icon="mdi-key-plus" size="14" />
                  +{{ item.permisosDirectos.length }} directos
                </v-chip>
                <span v-else class="text-caption text-medium-emphasis">
                  Solo los del rol
                </span>
              </div>
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
                  title="Editar usuario y permisos"
                  @click="abrirModalEditar(item)"
                />
                <v-btn
                  icon="mdi-lock-reset"
                  size="small"
                  variant="text"
                  color="secondary-darken-1"
                  title="Cambiar contraseña"
                  @click="abrirModalContrasena(item)"
                />
                <v-btn
                  v-if="item.correoElectronico !== 'admin@codepyme.com'"
                  icon="mdi-trash-can-outline"
                  size="small"
                  variant="text"
                  color="error"
                  title="Eliminar usuario"
                  @click="confirmarEliminar(item)"
                />
              </div>
            </template>
          </v-data-table>
        </v-card>
      </div>
    </template>

    <!-- Modal Crear / Editar Usuario -->
    <v-dialog v-model="modalAbierto" max-width="840" persistent scrollable>
      <v-card class="rounded-xl">
        <v-card-title class="d-flex justify-space-between align-center py-3 px-4 px-sm-5 border-b bg-white">
          <div class="d-flex align-center gap-2">
            <v-icon icon="mdi-account-cog-outline" color="primary" />
            <span class="text-subtitle-1 text-sm-h6 font-weight-bold text-primary">
              {{ esEdicion ? 'Editar Usuario de Plataforma' : 'Crear Usuario de Plataforma' }}
            </span>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" color="primary" @click="cerrarModal" />
        </v-card-title>

        <v-card-text class="pa-3 pa-sm-5 bg-background" style="max-height: 72vh;">
          <v-form ref="formularioRef" v-model="formularioValido">
            <!-- Datos Personales y Acceso -->
            <v-card class="pa-3 pa-sm-4 rounded-xl border bg-white mb-3" elevation="0">
              <div class="text-subtitle-2 font-weight-bold text-primary mb-3 d-flex align-center gap-2">
                <v-icon icon="mdi-account-outline" size="18" color="primary" />
                Datos de la Cuenta
              </div>
              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formulario.nombres"
                    label="Nombres *"
                    placeholder="ej. María José"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                    rounded="lg"
                    :rules="[reglas.requerido]"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formulario.apellidos"
                    label="Apellidos *"
                    placeholder="ej. Gómez Pérez"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                    rounded="lg"
                    :rules="[reglas.requerido]"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formulario.correoElectronico"
                    label="Correo Corporativo *"
                    type="email"
                    placeholder="ej. maria.gomez@clinica.com"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                    rounded="lg"
                    :rules="[reglas.requerido, reglas.email]"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="formulario.rolId"
                    :items="listaRoles"
                    item-title="nombre"
                    item-value="id"
                    label="Rol Asignado *"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                    rounded="lg"
                    :rules="[reglas.requerido]"
                    hint="Determina los permisos base del usuario"
                    persistent-hint
                  />
                </v-col>
                <v-col cols="12" sm="6" v-if="!esEdicion">
                  <v-text-field
                    v-model="formulario.contrasena"
                    label="Contraseña de Acceso *"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                    rounded="lg"
                    :rules="[reglas.requerido, reglas.longitudMinima]"
                  />
                </v-col>
                <v-col cols="12" sm="6" v-else>
                  <v-text-field
                    v-model="formulario.contrasena"
                    label="Nueva Contraseña (Opcional)"
                    type="password"
                    placeholder="Dejar en blanco para conservar actual"
                    variant="outlined"
                    density="comfortable"
                    color="primary"
                    rounded="lg"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-switch
                    v-model="formulario.activo"
                    label="Usuario activo para login"
                    color="primary"
                    density="compact"
                    hide-details
                  />
                </v-col>
              </v-row>
            </v-card>

            <!-- Asignación de Permisos Directos al Usuario -->
            <v-card class="pa-3 pa-sm-4 rounded-xl border bg-white" elevation="0">
              <div class="mb-3">
                <div class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center gap-2">
                  <div>
                    <div class="text-subtitle-2 font-weight-bold text-primary d-flex align-center gap-2">
                      <v-icon icon="mdi-key-plus" size="18" color="primary" />
                      Permisos Directos Adicionales
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ formulario.permisoIds.length }} permisos asignados directamente
                    </div>
                  </div>
                  <div v-if="formulario.permisoIds.length > 0">
                    <v-btn
                      size="x-small"
                      variant="tonal"
                      color="grey-darken-1"
                      rounded="pill"
                      class="text-none"
                      @click="formulario.permisoIds = []"
                    >
                      Limpiar directos
                    </v-btn>
                  </div>
                </div>

                <!-- Aviso informativo sobre rol seleccionado -->
                <v-alert
                  v-if="rolSeleccionado"
                  type="info"
                  variant="tonal"
                  color="primary"
                  density="compact"
                  class="mt-3 rounded-lg text-caption"
                >
                  El rol <strong>{{ rolSeleccionado.nombre }}</strong> ya otorga <strong>{{ rolSeleccionado.permisos?.length || 0 }} permisos</strong> automáticamente.
                  Los permisos marcados con "Del Rol" ya están activos para este usuario.
                </v-alert>
              </div>

              <!-- Acordeón de Permisos para Asignación Directa -->
              <v-expansion-panels variant="accordion" multiple>
                <v-expansion-panel
                  v-for="(permisosModulo, modulo) in permisosAgrupados"
                  :key="modulo"
                  rounded="lg"
                  class="mb-2 border elevation-0"
                >
                  <v-expansion-panel-title class="py-2 px-3 px-sm-4">
                    <div class="d-flex align-center justify-space-between w-100 pr-2">
                      <span class="text-body-2 font-weight-bold text-capitalize text-primary">
                        Módulo {{ modulo }}
                      </span>
                      <v-chip size="x-small" variant="tonal" color="primary" class="font-weight-bold">
                        {{ contarDirectosModulo(permisosModulo) }} directos
                      </v-chip>
                    </div>
                  </v-expansion-panel-title>

                  <v-expansion-panel-text class="pa-2 pa-sm-3 bg-white">
                    <v-row dense>
                      <v-col
                        v-for="permiso in permisosModulo"
                        :key="permiso.id"
                        cols="12"
                        sm="6"
                      >
                        <div class="d-flex align-center justify-space-between p-1">
                          <v-checkbox
                            v-model="formulario.permisoIds"
                            :value="permiso.id"
                            color="primary"
                            density="compact"
                            hide-details
                            :disabled="estaEnRol(permiso.id)"
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

                          <v-chip
                            v-if="estaEnRol(permiso.id)"
                            size="x-small"
                            color="secondary"
                            class="text-primary font-weight-bold flex-shrink-0"
                            variant="flat"
                          >
                            Del Rol
                          </v-chip>
                        </div>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
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
            @click="guardarUsuario"
          >
            {{ esEdicion ? 'Actualizar Usuario' : 'Crear Usuario' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Rápido de Cambio de Contraseña -->
    <v-dialog v-model="modalContrasenaAbierto" max-width="440" persistent>
      <v-card class="rounded-xl">
        <v-card-title class="d-flex justify-space-between align-center py-3 px-4 px-sm-5 border-b bg-white">
          <span class="text-subtitle-1 text-sm-h6 font-weight-bold text-primary">Cambiar Contraseña</span>
          <v-btn icon="mdi-close" variant="text" size="small" color="primary" @click="modalContrasenaAbierto = false" />
        </v-card-title>
        <v-card-subtitle class="px-4 px-sm-5 pt-3 text-caption text-medium-emphasis">
          Usuario: <strong class="text-primary">{{ usuarioSeleccionado?.nombres }} {{ usuarioSeleccionado?.apellidos }}</strong>
        </v-card-subtitle>

        <v-card-text class="px-4 px-sm-5 py-3">
          <v-text-field
            v-model="nuevaContrasena"
            label="Nueva Contraseña *"
            type="password"
            placeholder="Mínimo 6 caracteres"
            variant="outlined"
            density="comfortable"
            color="primary"
            rounded="lg"
            :rules="[reglas.requerido, reglas.longitudMinima]"
          />
        </v-card-text>

        <v-divider />

        <v-card-actions class="px-4 px-sm-5 py-3 justify-end gap-2 bg-white">
          <v-btn variant="text" rounded="pill" color="grey-darken-1" class="text-none font-weight-bold" @click="modalContrasenaAbierto = false">
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            rounded="pill"
            class="text-none font-weight-bold px-5"
            :loading="guardandoContrasena"
            :disabled="!nuevaContrasena || nuevaContrasena.length < 6"
            @click="guardarNuevaContrasena"
          >
            Actualizar Contraseña
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </LayoutPrincipal>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import LayoutPrincipal from '../../layouts/LayoutPrincipal.vue'
import { servicioUsuarios } from '../../services/usuarios.service'
import { servicioRoles } from '../../services/roles.service'
import { servicioPermisos } from '../../services/permisos.service'
import { useAlmacenAutenticacion } from '../../stores/autenticacion.store'
import { usarAlertas } from '../../composables/usarAlertas'

const almacenAuth = useAlmacenAutenticacion()
const CORREO_SUPER_ADMIN = 'admin@codepyme.com'
const esSuperAdmin = computed(
  () => almacenAuth.usuario?.correoElectronico === CORREO_SUPER_ADMIN,
)

const { mostrarAlerta, confirmarEliminacion } = usarAlertas()

const cargando = ref(false)
const guardando = ref(false)
const guardandoContrasena = ref(false)
const listaUsuarios = ref([])
const listaRoles = ref([])
const catalogoPermisos = ref([])

const busqueda = ref('')
const filtroRol = ref(null)

// Paginación móvil
const paginaActualMovil = ref(1)
const limitePorPaginaMovil = ref(6)

const modalAbierto = ref(false)
const esEdicion = ref(false)
const idEdicion = ref(null)
const formularioRef = ref(null)
const formularioValido = ref(false)

const modalContrasenaAbierto = ref(false)
const usuarioSeleccionado = ref(null)
const nuevaContrasena = ref('')

const formulario = ref({
  nombres: '',
  apellidos: '',
  correoElectronico: '',
  contrasena: '',
  rolId: null,
  activo: true,
  permisoIds: [],
})

const reglas = {
  requerido: (v) => !!v || 'Este campo es obligatorio',
  email: (v) => /.+@.+\..+/.test(v) || 'Ingresa un correo electrónico válido',
  longitudMinima: (v) => (v && v.length >= 6) || 'Mínimo 6 caracteres',
}

const columnas = [
  { title: 'Usuario / Correo', key: 'usuario', align: 'start', sortable: true },
  { title: 'Rol Asignado', key: 'rol', align: 'start', sortable: true },
  { title: 'Permisos Directos', key: 'permisosDirectos', align: 'center', sortable: false },
  { title: 'Estado', key: 'activo', align: 'center', sortable: true },
  { title: 'Acciones', key: 'acciones', align: 'end', sortable: false },
]

const rolesDisponiblesFiltro = computed(() => {
  return listaRoles.value.map((r) => ({ id: r.id, nombre: r.nombre }))
})

const usuariosVisibles = computed(() => {
  return listaUsuarios.value.filter((u) => {
    if (!esSuperAdmin.value && u.correoElectronico === CORREO_SUPER_ADMIN) {
      return false
    }
    return true
  })
})

const rolesUtilizados = computed(() => {
  const setRoles = new Set(usuariosVisibles.value.map((u) => u.rolId).filter(Boolean))
  return setRoles.size
})

const usuariosFiltrados = computed(() => {
  return usuariosVisibles.value.filter((u) => {
    if (filtroRol.value && u.rolId !== filtroRol.value) return false

    if (!busqueda.value) return true
    const q = busqueda.value.toLowerCase().trim()
    const nombreCompleto = `${u.nombres} ${u.apellidos}`.toLowerCase()
    const correo = (u.correoElectronico || '').toLowerCase()
    const rolNombre = (u.rolEntidad?.nombre || u.rol || '').toLowerCase()

    return nombreCompleto.includes(q) || correo.includes(q) || rolNombre.includes(q)
  })
})

// Paginación para móvil
const totalPaginasMovil = computed(() => {
  return Math.ceil(usuariosFiltrados.value.length / limitePorPaginaMovil.value) || 1
})

const usuariosPaginadosMovil = computed(() => {
  const inicio = (paginaActualMovil.value - 1) * limitePorPaginaMovil.value
  return usuariosFiltrados.value.slice(inicio, inicio + limitePorPaginaMovil.value)
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

const rolSeleccionado = computed(() => {
  if (!formulario.value.rolId) return null
  return listaRoles.value.find((r) => r.id === formulario.value.rolId)
})

function estaEnRol(permisoId) {
  if (!rolSeleccionado.value || !Array.isArray(rolSeleccionado.value.permisos)) return false
  return rolSeleccionado.value.permisos.some((p) => p.id === permisoId)
}

function contarDirectosModulo(permisosModulo) {
  const idsModulo = new Set(permisosModulo.map((p) => p.id))
  return formulario.value.permisoIds.filter((id) => idsModulo.has(id)).length
}

function iniciales(nombres = '', apellidos = '') {
  const n = nombres.trim()[0] || ''
  const a = apellidos.trim()[0] || ''
  return `${n}${a}`.toUpperCase()
}

async function cargarUsuarios() {
  cargando.value = true
  try {
    const res = await servicioUsuarios.obtenerTodos(false) // solo de plataforma
    listaUsuarios.value = res.datos || []
  } catch (err) {
    mostrarAlerta('error', 'Error', err.response?.data?.mensaje || 'Error al cargar usuarios')
  } finally {
    cargando.value = false
  }
}

async function cargarRolesYPermisos() {
  try {
    const [resRoles, resPermisos] = await Promise.all([
      servicioRoles.obtenerTodos(),
      servicioPermisos.obtenerTodos(),
    ])
    listaRoles.value = resRoles.datos || []
    catalogoPermisos.value = resPermisos.datos || []
  } catch (err) {
    console.error('Error al cargar datos auxiliares', err)
  }
}

function abrirModalCrear() {
  esEdicion.value = false
  idEdicion.value = null
  const primerRol = listaRoles.value.length > 0 ? listaRoles.value[0].id : null
  formulario.value = {
    nombres: '',
    apellidos: '',
    correoElectronico: '',
    contrasena: '',
    rolId: primerRol,
    activo: true,
    permisoIds: [],
  }
  modalAbierto.value = true
}

function abrirModalEditar(usuario) {
  esEdicion.value = true
  idEdicion.value = usuario.id

  const idsDirectos = (usuario.permisosDirectos || []).map((p) => p.id)

  formulario.value = {
    nombres: usuario.nombres || '',
    apellidos: usuario.apellidos || '',
    correoElectronico: usuario.correoElectronico || '',
    contrasena: '',
    rolId: usuario.rolId || usuario.rolEntidad?.id || null,
    activo: usuario.activo !== undefined ? usuario.activo : true,
    permisoIds: idsDirectos,
  }
  modalAbierto.value = true
  nextTick(async () => {
    if (formularioRef.value) {
      await formularioRef.value.validate?.()
    }
  })
}

function cerrarModal() {
  modalAbierto.value = false
}

async function guardarUsuario() {
  if (formularioRef.value) {
    const { valid } = await formularioRef.value.validate()
    if (!valid) return
  } else if (!formularioValido.value) {
    return
  }

  guardando.value = true
  try {
    const payload = {
      nombres: (formulario.value.nombres || '').trim(),
      apellidos: (formulario.value.apellidos || '').trim(),
      correoElectronico: (formulario.value.correoElectronico || '').trim(),
      rolId: formulario.value.rolId,
      activo: Boolean(formulario.value.activo),
      permisoIds: formulario.value.permisoIds || [],
    }

    if (formulario.value.contrasena && formulario.value.contrasena.trim().length >= 6) {
      payload.contrasena = formulario.value.contrasena.trim()
    }

    if (esEdicion.value) {
      await servicioUsuarios.actualizar(idEdicion.value, payload)
      mostrarAlerta('success', 'Actualizado', 'Usuario modificado exitosamente')
    } else {
      await servicioUsuarios.crear(payload)
      mostrarAlerta('success', 'Creado', 'Usuario creado exitosamente')
    }
    cerrarModal()
    await cargarUsuarios()
  } catch (err) {
    mostrarAlerta('error', 'Error', err.response?.data?.mensaje || 'Error al guardar usuario')
  } finally {
    guardando.value = false
  }
}

function abrirModalContrasena(usuario) {
  usuarioSeleccionado.value = usuario
  nuevaContrasena.value = ''
  modalContrasenaAbierto.value = true
}

async function guardarNuevaContrasena() {
  if (!nuevaContrasena.value || nuevaContrasena.value.length < 6) return
  guardandoContrasena.value = true
  try {
    await servicioUsuarios.cambiarContrasena(usuarioSeleccionado.value.id, nuevaContrasena.value)
    mostrarAlerta('success', 'Contraseña Actualizada', 'Se ha cambiado la contraseña correctamente')
    modalContrasenaAbierto.value = false
  } catch (err) {
    mostrarAlerta('error', 'Error', err.response?.data?.mensaje || 'Error al actualizar contraseña')
  } finally {
    guardandoContrasena.value = false
  }
}

async function confirmarEliminar(usuario) {
  const confirmado = await confirmarEliminacion(`el usuario "${usuario.nombres} ${usuario.apellidos}"`)
  if (!confirmado) return

  try {
    await servicioUsuarios.eliminar(usuario.id)
    mostrarAlerta('success', 'Eliminado', 'Usuario removido exitosamente')
    await cargarUsuarios()
  } catch (err) {
    mostrarAlerta('error', 'No se pudo eliminar', err.response?.data?.mensaje || 'Error al eliminar usuario')
  }
}

function verDetallePermisos(usuario) {
  abrirModalEditar(usuario)
}

onMounted(async () => {
  await Promise.all([cargarUsuarios(), cargarRolesYPermisos()])
})
</script>

<style scoped>
.gap-1 { gap: 4px; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.cursor-pointer { cursor: pointer; }
.tarjeta-movil {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.tarjeta-movil:active {
  transform: scale(0.99);
}
</style>
