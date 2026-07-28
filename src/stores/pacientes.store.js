import { defineStore } from 'pinia'
import { ref } from 'vue'
import { servicioPacientes } from '../services/pacientes.service'

export const useAlmacenPacientes = defineStore('pacientes', () => {
  // Estado
  const listaPacientes = ref([])
  const pacienteActual = ref(null)
  const total = ref(0)
  const paginaActual = ref(1)
  const limitePorPagina = ref(10)
  const cargando = ref(false)
  const error = ref(null)

  // Acciones
  async function obtenerPacientes(pagina = 1, limite = 10) {
    cargando.value = true
    error.value = null
    try {
      const respuesta = await servicioPacientes.obtenerTodos(pagina, limite)
      listaPacientes.value = respuesta.datos
      total.value = respuesta.total
      paginaActual.value = respuesta.pagina
      limitePorPagina.value = respuesta.limite
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al obtener pacientes'
      throw err
    } finally {
      cargando.value = false
    }
  }

  async function obtenerPacientePorId(id) {
    cargando.value = true
    error.value = null
    try {
      const respuesta = await servicioPacientes.obtenerPorId(id)
      pacienteActual.value = respuesta.datos
      return respuesta.datos
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al obtener paciente'
      throw err
    } finally {
      cargando.value = false
    }
  }

  async function buscarPacientes(termino) {
    cargando.value = true
    error.value = null
    try {
      const respuesta = await servicioPacientes.buscar(termino)
      listaPacientes.value = respuesta.datos
      total.value = respuesta.datos.length
    } catch (err) {
      error.value = err.response?.data?.message || 'Error en la búsqueda'
      throw err
    } finally {
      cargando.value = false
    }
  }

  async function crearPaciente(datosPaciente) {
    cargando.value = true
    error.value = null
    try {
      const respuesta = await servicioPacientes.crear(datosPaciente)
      await obtenerPacientes(paginaActual.value, limitePorPagina.value)
      return respuesta
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al crear paciente'
      throw err
    } finally {
      cargando.value = false
    }
  }

  async function actualizarPaciente(id, datosPaciente) {
    cargando.value = true
    error.value = null
    try {
      const respuesta = await servicioPacientes.actualizar(id, datosPaciente)
      pacienteActual.value = respuesta.datos
      return respuesta
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al actualizar paciente'
      throw err
    } finally {
      cargando.value = false
    }
  }

  async function eliminarPaciente(id) {
    cargando.value = true
    error.value = null
    try {
      await servicioPacientes.eliminar(id)
      await obtenerPacientes(paginaActual.value, limitePorPagina.value)
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al eliminar paciente'
      throw err
    } finally {
      cargando.value = false
    }
  }

  function limpiarPacienteActual() {
    pacienteActual.value = null
  }

  return {
    listaPacientes,
    pacienteActual,
    total,
    paginaActual,
    limitePorPagina,
    cargando,
    error,
    obtenerPacientes,
    obtenerPacientePorId,
    buscarPacientes,
    crearPaciente,
    actualizarPaciente,
    eliminarPaciente,
    limpiarPacienteActual,
  }
})
