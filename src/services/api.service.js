import axios from 'axios'
import { useAlmacenAutenticacion } from '../stores/autenticacion.store'
import router from '../router'

const hostname = window.location.hostname
const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('local')

// API URL dinámica (fallback a VITE_URL_API o localhost)
const urlBase = import.meta.env.VITE_URL_API || (isLocalhost ? 'http://localhost:3000/api/v1' : `https://api.${hostname}/api/v1`)

const clienteApi = axios.create({
  baseURL: urlBase,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    // En desarrollo, enviamos el dominio del tenant simulado
    ...(isLocalhost ? { 'X-Tenant-Domain': import.meta.env.VITE_TENANT_DOMAIN || 'localhost' } : {}),
  },
})

// Interceptor de solicitud: agrega el token JWT automáticamente
clienteApi.interceptors.request.use(
  (configuracion) => {
    const almacenAuth = useAlmacenAutenticacion()
    if (almacenAuth.token) {
      configuracion.headers.Authorization = `Bearer ${almacenAuth.token}`
    }
    return configuracion
  },
  (error) => Promise.reject(error),
)

// Interceptor de respuesta: maneja errores 401 redirigiendo al login
clienteApi.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    if (error.response?.status === 401) {
      const almacenAuth = useAlmacenAutenticacion()
      almacenAuth.cerrarSesion()
      router.push({ name: 'iniciar-sesion' })
    }
    return Promise.reject(error)
  },
)

export default clienteApi
