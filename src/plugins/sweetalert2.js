import Swal from 'sweetalert2'

const configuracionBase = {
  confirmButtonColor: '#2196F3',
  cancelButtonColor: '#546E7A',
  background: '#162030',
  color: '#E8EDF2',
  buttonsStyling: true,
  customClass: {
    popup: 'swal-portal-paciente',
    confirmButton: 'swal-btn-confirmar',
    cancelButton: 'swal-btn-cancelar',
  },
}

export const alertaSwal = Swal.mixin(configuracionBase)

export default {
  install(app) {
    app.config.globalProperties.$swal = alertaSwal
  },
}
