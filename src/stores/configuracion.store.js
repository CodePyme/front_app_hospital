import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useTheme } from 'vuetify'
import clienteApi from '../services/api.service'

export const useAlmacenConfiguracion = defineStore('configuracion', () => {
  const nombreEntidad = ref('Salud Plus')
  const logoUrl = ref('')
  const colorPrimario = ref('#075c39')
  const colorSecundario = ref('#9cc516')
  const cargando = ref(true)

  async function cargarConfiguracion(temaVuetify) {
    try {
      cargando.value = true
      const respuesta = await clienteApi.get('/configuracion')
      const datos = respuesta.data?.datos
      
      if (datos) {
        nombreEntidad.value = datos.nombreEntidad || 'Salud Plus'
        logoUrl.value = datos.logoUrl || ''
        colorPrimario.value = datos.colorPrimario || '#075c39'
        colorSecundario.value = datos.colorSecundario || '#9cc516'

        // Aplicar los colores al tema de Vuetify
        if (temaVuetify) {
          temaVuetify.themes.value.temaPortalPaciente.colors.primary = colorPrimario.value
          temaVuetify.themes.value.temaPortalPaciente.colors['primary-darken-1'] = colorPrimario.value
          temaVuetify.themes.value.temaPortalPaciente.colors.secondary = colorSecundario.value
          temaVuetify.themes.value.temaPortalPaciente.colors['secondary-darken-1'] = colorSecundario.value
        }
      }
    } catch (error) {
      console.error('Error al cargar la configuración de branding:', error)
    } finally {
      cargando.value = false
    }
  }

  async function guardarConfiguracion(nuevaConfig) {
    const respuesta = await clienteApi.patch('/configuracion', nuevaConfig)
    const datos = respuesta.data?.datos
    
    if (datos) {
      nombreEntidad.value = datos.nombreEntidad
      logoUrl.value = datos.logoUrl
      colorPrimario.value = datos.colorPrimario
      colorSecundario.value = datos.colorSecundario
      return datos
    }
    throw new Error(respuesta.data?.mensaje || 'Error al guardar configuración')
  }

  return {
    nombreEntidad,
    logoUrl,
    colorPrimario,
    colorSecundario,
    cargando,
    cargarConfiguracion,
    guardarConfiguracion,
  }
})
