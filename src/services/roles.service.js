import clienteApi from './api.service'

const RUTA_ROLES = '/roles'

export const servicioRoles = {
  async obtenerTodos() {
    const respuesta = await clienteApi.get(RUTA_ROLES)
    return respuesta.data
  },

  async obtenerPorId(id) {
    const respuesta = await clienteApi.get(`${RUTA_ROLES}/${id}`)
    return respuesta.data
  },

  async crear(datos) {
    const respuesta = await clienteApi.post(RUTA_ROLES, datos)
    return respuesta.data
  },

  async actualizar(id, datos) {
    const respuesta = await clienteApi.put(`${RUTA_ROLES}/${id}`, datos)
    return respuesta.data
  },

  async eliminar(id) {
    const respuesta = await clienteApi.delete(`${RUTA_ROLES}/${id}`)
    return respuesta.data
  },
}
