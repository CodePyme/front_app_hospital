import { defineStore } from 'pinia'
import { ref } from 'vue'
import { servicioCitas } from '../services/citas.service'

export const useAlmacenCitas = defineStore('citas', () => {
  // Estado
  const listaCitas = ref([])
  const citaActual = ref(null)
  const total = ref(0)
  const paginaActual = ref(1)
  const limitePorPagina = ref(10)
  const cargando = ref(false)
  const error = ref(null)

  // Acciones
  async function obtenerMisCitas() {
    cargando.value = true
    error.value = null
    try {
      const respuesta = await servicioCitas.obtenerMisCitas()
      listaCitas.value = respuesta.datos || []
      total.value = listaCitas.value.length
      return listaCitas.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al obtener la agenda de citas'
      throw err
    } finally {
      cargando.value = false
    }
  }

  async function cancelarCitaSap(datos) {
    cargando.value = true
    error.value = null
    try {
      const respuesta = await servicioCitas.cancelarCitaSap(datos)
      await obtenerMisCitas()
      return respuesta
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cancelar la cita médica'
      throw err
    } finally {
      cargando.value = false
    }
  }

  async function obtenerCitas(pagina = 1, limite = 10) {
    cargando.value = true
    error.value = null
    try {
      const respuesta = await servicioCitas.obtenerTodas(pagina, limite)
      listaCitas.value = respuesta.datos || []
      total.value = respuesta.total || listaCitas.value.length
      paginaActual.value = respuesta.pagina || 1
      limitePorPagina.value = respuesta.limite || 10
      return listaCitas.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al obtener citas'
      throw err
    } finally {
      cargando.value = false
    }
  }

  async function obtenerCitaPorId(id) {
    cargando.value = true
    error.value = null
    try {
      const respuesta = await servicioCitas.obtenerPorId(id)
      citaActual.value = respuesta.datos
      return respuesta.datos
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al obtener cita'
      throw err
    } finally {
      cargando.value = false
    }
  }

  async function obtenerCitasPorPaciente(pacienteId) {
    cargando.value = true
    error.value = null
    try {
      const respuesta = await servicioCitas.obtenerPorPaciente(pacienteId)
      listaCitas.value = respuesta.datos
      total.value = respuesta.datos.length
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al obtener citas del paciente'
      throw err
    } finally {
      cargando.value = false
    }
  }

  async function crearCita(datosCita) {
    cargando.value = true
    error.value = null
    try {
      const respuesta = await servicioCitas.crear(datosCita)
      await obtenerCitas(paginaActual.value, limitePorPagina.value)
      return respuesta
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al crear cita'
      throw err
    } finally {
      cargando.value = false
    }
  }

  async function actualizarCita(id, datosCita) {
    cargando.value = true
    error.value = null
    try {
      const respuesta = await servicioCitas.actualizar(id, datosCita)
      citaActual.value = respuesta.datos
      return respuesta
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al actualizar cita'
      throw err
    } finally {
      cargando.value = false
    }
  }

  async function cancelarCita(id) {
    cargando.value = true
    error.value = null
    try {
      const respuesta = await servicioCitas.cancelar(id)
      await obtenerCitas(paginaActual.value, limitePorPagina.value)
      return respuesta
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cancelar cita'
      throw err
    } finally {
      cargando.value = false
    }
  }

  async function eliminarCita(id) {
    cargando.value = true
    error.value = null
    try {
      await servicioCitas.eliminar(id)
      await obtenerCitas(paginaActual.value, limitePorPagina.value)
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al eliminar cita'
      throw err
    } finally {
      cargando.value = false
    }
  }

  function limpiarCitaActual() {
    citaActual.value = null
  }

  return {
    listaCitas,
    citaActual,
    total,
    paginaActual,
    limitePorPagina,
    cargando,
    error,
    obtenerMisCitas,
    cancelarCitaSap,
    obtenerCitas,
    obtenerCitaPorId,
    obtenerCitasPorPaciente,
    crearCita,
    actualizarCita,
    cancelarCita,
    eliminarCita,
    limpiarCitaActual,
  }
})
