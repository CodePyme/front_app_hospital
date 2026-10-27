import clienteApi from './api.service'

const RUTA_PERMISOS = '/permisos'

export const servicioPermisos = {
  async obtenerTodos() {
    const respuesta = await clienteApi.get(RUTA_PERMISOS)
    return respuesta.data
  },

  async obtenerAgrupados() {
    const respuesta = await clienteApi.get(`${RUTA_PERMISOS}/agrupados`)
    return respuesta.data
  },

  async obtenerPorId(id) {
    const respuesta = await clienteApi.get(`${RUTA_PERMISOS}/${id}`)
    return respuesta.data
  },

  async crear(datos) {
    const respuesta = await clienteApi.post(RUTA_PERMISOS, datos)
    return respuesta.data
  },

  async actualizar(id, datos) {
    const respuesta = await clienteApi.put(`${RUTA_PERMISOS}/${id}`, datos)
    return respuesta.data
  },

  async eliminar(id) {
    const respuesta = await clienteApi.delete(`${RUTA_PERMISOS}/${id}`)
    return respuesta.data
  },

  async sincronizarCatalogo() {
    const respuesta = await clienteApi.post(`${RUTA_PERMISOS}/sincronizar`)
    return respuesta.data
  },
}
