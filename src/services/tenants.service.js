import clienteApi from './api.service'

export const servicioTenants = {
  /**
   * Obtener lista de tenants paginada
   */
  async obtenerTodos(pagina = 1, limite = 10) {
    const respuesta = await clienteApi.get('/tenants', {
      params: { pagina, limite },
    })
    return respuesta.data
  },

  /**
   * Obtener un tenant por ID
   */
  async obtenerPorId(id) {
    const respuesta = await clienteApi.get(`/tenants/${id}`)
    return respuesta.data
  },

  /**
   * Crear un nuevo tenant
   */
  async crear(datos) {
    const respuesta = await clienteApi.post('/tenants', datos)
    return respuesta.data
  },

  /**
   * Actualizar datos de un tenant
   */
  async actualizar(id, datos) {
    const respuesta = await clienteApi.patch(`/tenants/${id}`, datos)
    return respuesta.data
  },

  /**
   * Activar o desactivar un tenant
   */
  async toggleActivo(id) {
    const respuesta = await clienteApi.patch(`/tenants/${id}/toggle-activo`)
    return respuesta.data
  },

  /**
   * Eliminar un tenant
   */
  async eliminar(id) {
    const respuesta = await clienteApi.delete(`/tenants/${id}`)
    return respuesta.data
  },
}
