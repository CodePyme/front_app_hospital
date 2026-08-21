import clienteApi from './api.service'

const RUTA_AUTENTICACION = '/autenticacion'

export const servicioAutenticacion = {
  async solicitarOtp(datosPaciente) {
    const respuesta = await clienteApi.post(`${RUTA_AUTENTICACION}/solicitar-otp`, datosPaciente)
    return respuesta.data
  },

  async verificarOtp(datosVerificacion) {
    const respuesta = await clienteApi.post(`${RUTA_AUTENTICACION}/verificar-otp`, datosVerificacion)
    return respuesta.data
  },

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
