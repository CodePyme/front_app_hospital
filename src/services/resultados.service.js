import clienteApi from './api.service'

export const servicioResultados = {
  /**
   * Obtiene el listado de órdenes de laboratorio para el paciente en sesión
   */
  async obtenerOrdenes(params = {}) {
    const respuesta = await clienteApi.get('/resultados', { params })
    return respuesta.data
  },

  /**
   * Obtiene el detalle (estudios, analitos, PDF) de una orden seleccionada
   */
  async obtenerDetalleOrden(internalNumber, clientCode = '') {
    const respuesta = await clienteApi.post('/resultados/detalle', {
      internalNumber,
      clientCode,
    })
    return respuesta.data
  },

  /**
   * Genera la URL para descargar/visualizar el PDF proxy desde el backend
   */
  obtenerUrlPdf(urlRelativa) {
    if (!urlRelativa) return ''
    const urlBase = clienteApi.defaults.baseURL || 'http://localhost:3000/api/v1'
    return `${urlBase}/resultados/pdf?url=${encodeURIComponent(urlRelativa)}`
  },

  /**
   * Descarga el PDF como Blob para forzar la descarga directa del archivo en el navegador
   */
  async descargarPdfBlob(urlRelativa) {
    const urlFull = this.obtenerUrlPdf(urlRelativa)
    const respuesta = await clienteApi.get(urlFull, { responseType: 'blob' })
    return respuesta.data
  },
}
