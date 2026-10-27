import clienteApi from './api.service'

const RUTA_USUARIOS = '/usuarios'

export const servicioUsuarios = {
  async obtenerTodos(incluirPacientes = false) {
    const respuesta = await clienteApi.get(RUTA_USUARIOS, {
      params: { incluirPacientes },
    })
    return respuesta.data
  },

  async obtenerPorId(id) {
    const respuesta = await clienteApi.get(`${RUTA_USUARIOS}/${id}`)
    return respuesta.data
  },

  async crear(datos) {
    const respuesta = await clienteApi.post(RUTA_USUARIOS, datos)
    return respuesta.data
  },

  async actualizar(id, datos) {
    const respuesta = await clienteApi.put(`${RUTA_USUARIOS}/${id}`, datos)
    return respuesta.data
  },

  async cambiarContrasena(id, nuevaContrasena) {
    const respuesta = await clienteApi.put(`${RUTA_USUARIOS}/${id}/cambiar-contrasena`, {
      nuevaContrasena,
    })
    return respuesta.data
  },

  async eliminar(id) {
    const respuesta = await clienteApi.delete(`${RUTA_USUARIOS}/${id}`)
    return respuesta.data
  },
}
