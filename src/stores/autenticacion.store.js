import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { servicioAutenticacion } from '../services/autenticacion.service'

const CLAVE_TOKEN = 'portal_paciente_token'
const CLAVE_USUARIO = 'portal_paciente_usuario'

export const useAlmacenAutenticacion = defineStore('autenticacion', () => {
  // Estado
  const token = ref(localStorage.getItem(CLAVE_TOKEN) || null)
  const usuario = ref(JSON.parse(localStorage.getItem(CLAVE_USUARIO) || 'null'))
  const cargando = ref(false)
  const error = ref(null)

  // Getters
  const estaAutenticado = computed(() => !!token.value)
  const nombreCompleto = computed(() =>
    usuario.value ? `${usuario.value.nombres} ${usuario.value.apellidos}` : '',
  )
  const rolUsuario = computed(() => usuario.value?.rol || '')
  const esSuperAdmin = computed(
    () => usuario.value?.correoElectronico === 'admin@codepyme.com',
  )

  // Acciones
  async function iniciarSesion(correoElectronico, contrasena) {
    cargando.value = true
    error.value = null
    try {
      const respuesta = await servicioAutenticacion.iniciarSesion({
        correoElectronico,
        contrasena,
      })
      token.value = respuesta.datos.token
      usuario.value = respuesta.datos.usuario
      localStorage.setItem(CLAVE_TOKEN, token.value)
      localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario.value))
      return respuesta
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al iniciar sesión'
      throw err
    } finally {
      cargando.value = false
    }
  }

  async function obtenerPerfil() {
    cargando.value = true
    try {
      const respuesta = await servicioAutenticacion.obtenerPerfil()
      usuario.value = respuesta.datos
      localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario.value))
    } catch (err) {
      cerrarSesion()
    } finally {
      cargando.value = false
    }
  }

  function cerrarSesion() {
    token.value = null
    usuario.value = null
    error.value = null
    localStorage.removeItem(CLAVE_TOKEN)
    localStorage.removeItem(CLAVE_USUARIO)
  }

  return {
    token,
    usuario,
    cargando,
    error,
    estaAutenticado,
    nombreCompleto,
    rolUsuario,
    esSuperAdmin,
    iniciarSesion,
    obtenerPerfil,
    cerrarSesion,
  }
})
