import clienteApi from './api.service'

const RUTA_AUTENTICACION = '/autenticacion'

export const servicioAutenticacion = {
  async iniciarSesion(credenciales) {
    const respuesta = await clienteApi.post(`${RUTA_AUTENTICACION}/iniciar-sesion`, credenciales)
    return respuesta.data
  },

  async registrarUsuario(datosUsuario) {
    const respuesta = await clienteApi.post(`${RUTA_AUTENTICACION}/registrar`, datosUsuario)
    return respuesta.data
  },

  async obtenerPerfil() {
    const respuesta = await clienteApi.get(`${RUTA_AUTENTICACION}/perfil`)
    return respuesta.data
  },
}
