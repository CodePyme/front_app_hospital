import { createRouter, createWebHistory } from 'vue-router'
import Configuracion from '../views/Configuracion.vue'
import { useAlmacenAutenticacion } from '../stores/autenticacion.store'

const rutas = [
  // Rutas públicas
  {
    path: '/iniciar-sesion',
    name: 'iniciar-sesion',
    component: () => import('../views/autenticacion/IniciarSesion.vue'),
    meta: { requiereAuth: false, layout: 'autenticacion' },
  },

  // Rutas protegidas
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiereAuth: true },
  },
  {
    path: '/pacientes',
    name: 'lista-pacientes',
    component: () => import('../views/pacientes/ListaPacientes.vue'),
    meta: { requiereAuth: true },
  },
  {
    path: '/pacientes/:id',
    name: 'detalle-paciente',
    component: () => import('../views/pacientes/DetallePaciente.vue'),
    meta: { requiereAuth: true },
  },
  {
    path: '/citas',
    name: 'citas',
    component: () => import('../views/citas/ListaCitas.vue'),
    meta: { requiereAuth: true, permiso: 'citas.ver' },
  },
  {
    path: '/resultados',
    name: 'resultados',
    component: () => import('../views/resultados/Resultados.vue'),
    meta: { requiereAuth: true, permiso: 'resultados.ver' },
  },
  {
    path: '/historia',
    name: 'historia',
    component: () => import('../views/historia/HistoriaClinica.vue'),
    meta: { requiereAuth: true, permiso: 'historia.ver' },
  },
  {
    path: '/medicamentos',
    name: 'medicamentos',
    component: () => import('../views/medicamentos/Medicamentos.vue'),
    meta: { requiereAuth: true, permiso: 'medicamentos.ver' },
  },
  {
    path: '/citas/:id',
    name: 'detalle-cita',
    component: () => import('../views/citas/DetalleCita.vue'),
    meta: { requiereAuth: true, permiso: 'citas.ver' },
  },

  // Módulos de Administración (Plataforma)
  {
    path: '/usuarios',
    name: 'usuarios',
    component: () => import('../views/usuarios/GestionUsuarios.vue'),
    meta: { requiereAuth: true, permiso: 'usuarios.ver' },
  },
  {
    path: '/roles',
    name: 'roles',
    component: () => import('../views/roles/GestionRoles.vue'),
    meta: { requiereAuth: true, permiso: 'roles.ver' },
  },
  {
    path: '/permisos',
    name: 'permisos',
    component: () => import('../views/permisos/GestionPermisos.vue'),
    meta: { requiereAuth: true, permiso: 'permisos.ver' },
  },

  // Rutas de configuración y super admin
  {
    path: '/configuracion',
    name: 'configuracion',
    component: Configuracion,
    meta: { requiereAuth: true, permiso: 'configuracion.ver', soloAdmin: true },
  },
  {
    path: '/tenants',
    name: 'gestion-tenants',
    component: () => import('../views/tenants/GestionTenants.vue'),
    meta: { requiereAuth: true, soloSuperAdmin: true },
  },

  // Ruta por defecto
  {
    path: '/:catchAll(.*)',
    redirect: '/',
  },
]

const enrutador = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: rutas,
})

// Guardia de navegación global
enrutador.beforeEach((hacia, desde, siguiente) => {
  const almacenAuth = useAlmacenAutenticacion()
  const requiereAuth = hacia.meta.requiereAuth !== false
  const CORREO_SUPER_ADMIN = 'admin@codepyme.com'

  const esAdmin =
    almacenAuth.usuario?.rol === 'administrador' ||
    almacenAuth.usuario?.correoElectronico === CORREO_SUPER_ADMIN ||
    almacenAuth.usuario?.correoElectronico === 'cristian@codepyme.com'

  // Módulo exclusivo: Tenants solo existe y es visible para admin@codepyme.com
  if (hacia.path === '/tenants' || hacia.name === 'gestion-tenants' || hacia.meta.soloSuperAdmin) {
    if (almacenAuth.usuario?.correoElectronico !== CORREO_SUPER_ADMIN) {
      return siguiente({ name: 'dashboard' })
    }
  }

  if (requiereAuth && !almacenAuth.estaAutenticado) {
    siguiente({ name: 'iniciar-sesion' })
  } else if (!requiereAuth && almacenAuth.estaAutenticado && hacia.name === 'iniciar-sesion') {
    siguiente({ name: 'dashboard' })
  } else if (hacia.meta.soloAdmin && !esAdmin) {
    siguiente({ name: 'dashboard' })
  } else if (hacia.meta.permiso && !almacenAuth.tienePermiso(hacia.meta.permiso)) {
    // Si no tiene el permiso requerido por la ruta, se le deniega el paso al recurso
    siguiente({ name: 'dashboard' })
  } else {
    siguiente()
  }
})

export default enrutador
