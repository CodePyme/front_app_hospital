import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { servicioAutenticacion } from '../services/autenticacion.service'

const CLAVE_TOKEN = 'portal_paciente_token'
const CLAVE_USUARIO = 'portal_paciente_usuario'
const CLAVE_PACIENTE = 'portal_paciente_datos'

export const useAlmacenAutenticacion = defineStore('autenticacion', () => {
  // Estado
  const token = ref(localStorage.getItem(CLAVE_TOKEN) || null)
  const usuario = ref(JSON.parse(localStorage.getItem(CLAVE_USUARIO) || 'null'))
  const paciente = ref(JSON.parse(localStorage.getItem(CLAVE_PACIENTE) || 'null'))
  const cargando = ref(false)
  const error = ref(null)

  // Getters
  const estaAutenticado = computed(() => !!token.value)
  const nombreCompleto = computed(() => {
    if (paciente.value) {
      return `${paciente.value.nombres} ${paciente.value.apellidos}`.trim()
    }
    return usuario.value ? `${usuario.value.nombres} ${usuario.value.apellidos}`.trim() : ''
  })
  const rolUsuario = computed(() => usuario.value?.rol || '')
  const esSuperAdmin = computed(
    () => usuario.value?.correoElectronico === 'admin@codepyme.com',
  )

  // Acciones
  async function solicitarOtp(datos) {
    cargando.value = true
    error.value = null
    try {
      const respuesta = await servicioAutenticacion.solicitarOtp(datos)
      return respuesta
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al solicitar el código de autenticación'
      throw err
    } finally {
      cargando.value = false
    }
  }

  async function verificarOtp(datos) {
    cargando.value = true
    error.value = null
    try {
      const respuesta = await servicioAutenticacion.verificarOtp(datos)
      token.value = respuesta.datos.token
      usuario.value = respuesta.datos.usuario
      paciente.value = respuesta.datos.paciente || null
      localStorage.setItem(CLAVE_TOKEN, token.value)
      localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario.value))
      if (paciente.value) {
        localStorage.setItem(CLAVE_PACIENTE, JSON.stringify(paciente.value))
      }
      return respuesta
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al verificar el código dinámico'
      throw err
    } finally {
      cargando.value = false
    }
  }

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
    paciente.value = null
    error.value = null
    localStorage.removeItem(CLAVE_TOKEN)
    localStorage.removeItem(CLAVE_USUARIO)
    localStorage.removeItem(CLAVE_PACIENTE)
  }

  return {
    token,
    usuario,
    paciente,
    cargando,
    error,
    estaAutenticado,
    nombreCompleto,
    rolUsuario,
    esSuperAdmin,
    solicitarOtp,
    verificarOtp,
    iniciarSesion,
    obtenerPerfil,
    cerrarSesion,
  }
})
