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
    meta: { requiereAutenticacion: true },
  },
  {
    path: '/resultados',
    name: 'resultados',
    component: () => import('../views/resultados/Resultados.vue'),
    meta: { requiereAutenticacion: true },
  },
  {
    path: '/historia',
    name: 'historia',
    component: () => import('../views/historia/HistoriaClinica.vue'),
    meta: { requiereAutenticacion: true },
  },
  {
    path: '/medicamentos',
    name: 'medicamentos',
    component: () => import('../views/medicamentos/Medicamentos.vue'),
    meta: { requiereAutenticacion: true },
  },
  {
    path: '/citas/:id',
    name: 'detalle-cita',
    component: () => import('../views/citas/DetalleCita.vue'),
    meta: { requiereAuth: true },
  },

  // Rutas de super admin (solo admin@codepyme.com)
  {
    path: '/configuracion',
    name: 'configuracion',
    component: Configuracion,
    meta: { requiereAutenticacion: true, roles: ['administrador'] },
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

  if (requiereAuth && !almacenAuth.estaAutenticado) {
    siguiente({ name: 'iniciar-sesion' })
  } else if (!requiereAuth && almacenAuth.estaAutenticado && hacia.name === 'iniciar-sesion') {
    siguiente({ name: 'dashboard' })
  } else if (hacia.meta.soloSuperAdmin && almacenAuth.usuario?.correoElectronico !== CORREO_SUPER_ADMIN) {
    // Redirigir al dashboard si no es super admin
    siguiente({ name: 'dashboard' })
  } else {
    siguiente()
  }
})

export default enrutador
