import clienteApi from './api.service'

const RUTA_CITAS = '/citas'

export const servicioCitas = {
  async obtenerTodas(pagina = 1, limite = 10) {
    const respuesta = await clienteApi.get(RUTA_CITAS, {
      params: { pagina, limite },
    })
    return respuesta.data
  },

  async obtenerPorId(id) {
    const respuesta = await clienteApi.get(`${RUTA_CITAS}/${id}`)
    return respuesta.data
  },

  async obtenerPorPaciente(pacienteId) {
    const respuesta = await clienteApi.get(`${RUTA_CITAS}/paciente/${pacienteId}`)
    return respuesta.data
  },

  async crear(datosCita) {
    const respuesta = await clienteApi.post(RUTA_CITAS, datosCita)
    return respuesta.data
  },

  async actualizar(id, datosCita) {
    const respuesta = await clienteApi.patch(`${RUTA_CITAS}/${id}`, datosCita)
    return respuesta.data
  },

  async cancelar(id) {
    const respuesta = await clienteApi.patch(`${RUTA_CITAS}/${id}/cancelar`)
    return respuesta.data
  },

  async eliminar(id) {
    const respuesta = await clienteApi.delete(`${RUTA_CITAS}/${id}`)
    return respuesta.data
  },
}
