import { alertaSwal } from '../plugins/sweetalert2'

export function usarAlertas() {
  async function confirmarEliminacion(nombreElemento = 'este elemento') {
    const resultado = await alertaSwal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará ${nombreElemento} de forma permanente.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    })
    return resultado.isConfirmed
  }

  async function confirmarCancelacion(nombreElemento = 'esta cita') {
    const resultado = await alertaSwal.fire({
      title: '¿Cancelar cita?',
      text: `Se cancelará ${nombreElemento}. Esta acción no se puede deshacer.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener',
    })
    return resultado.isConfirmed
  }

  function mostrarExito(mensaje, titulo = '¡Éxito!') {
    return alertaSwal.fire({
      title: titulo,
      text: mensaje,
      icon: 'success',
      timer: 2500,
      showConfirmButton: false,
    })
  }

  function mostrarError(mensaje, titulo = 'Error') {
    return alertaSwal.fire({
      title: titulo,
      text: mensaje,
      icon: 'error',
    })
  }

  function mostrarAdvertencia(mensaje, titulo = 'Advertencia') {
    return alertaSwal.fire({
      title: titulo,
      text: mensaje,
      icon: 'warning',
    })
  }

  function mostrarInfo(mensaje, titulo = 'Información') {
    return alertaSwal.fire({
      title: titulo,
      text: mensaje,
      icon: 'info',
    })
  }

  return {
    confirmarEliminacion,
    confirmarCancelacion,
    mostrarExito,
    mostrarError,
    mostrarAdvertencia,
    mostrarInfo,
  }
}
