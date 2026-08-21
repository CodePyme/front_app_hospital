import clienteApi from './api.service'

const RUTA_PACIENTES = '/pacientes'

export const servicioPacientes = {
  async obtenerTodos(pagina = 1, limite = 10) {
    const respuesta = await clienteApi.get(RUTA_PACIENTES, {
      params: { pagina, limite },
    })
    return respuesta.data
  },

  async obtenerPorId(id) {
    const respuesta = await clienteApi.get(`${RUTA_PACIENTES}/${id}`)
    return respuesta.data
  },

  async obtenerMiPerfil() {
    const respuesta = await clienteApi.get(`${RUTA_PACIENTES}/mi-perfil`)
    return respuesta.data
  },

  async buscar(termino) {
    const respuesta = await clienteApi.get(`${RUTA_PACIENTES}/buscar`, {
      params: { termino },
    })
    return respuesta.data
  },

  async consultarPorEpisodio(episodio) {
    const respuesta = await clienteApi.get(`${RUTA_PACIENTES}/episodio/${episodio}`)
    return respuesta.data
  },

  async crear(datosPaciente) {
    const respuesta = await clienteApi.post(RUTA_PACIENTES, datosPaciente)
    return respuesta.data
  },

  async actualizar(id, datosPaciente) {
    const respuesta = await clienteApi.patch(`${RUTA_PACIENTES}/${id}`, datosPaciente)
    return respuesta.data
  },

  async eliminar(id) {
    const respuesta = await clienteApi.delete(`${RUTA_PACIENTES}/${id}`)
    return respuesta.data
  },
}
