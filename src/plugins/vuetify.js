import { createVuetify } from 'vuetify'
import * as componentes from 'vuetify/components'
import * as directivas from 'vuetify/directives'
import { es } from 'vuetify/locale'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

const temaPortalPaciente = {
  dark: false,
  colors: {
    background: '#f6f8f9',
    surface: '#FFFFFF',
    'surface-variant': '#EAECEF',
    primary: '#075c39',
    'primary-darken-1': '#05472b',
    secondary: '#9cc516',
    'secondary-darken-1': '#7da010',
    error: '#EF5350',
    info: '#29B6F6',
    success: '#4CAF50',
    warning: '#FFA726',
    'on-background': '#1a2b3c',
    'on-surface': '#1a2b3c',
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
  },
}

const vuetify = createVuetify({
  components: componentes,
  directives: directivas,
  locale: {
    locale: 'es',
    messages: { es },
  },
  theme: {
    defaultTheme: 'temaPortalPaciente',
    themes: { temaPortalPaciente },
  },
  defaults: {
    VBtn: { variant: 'elevated', rounded: 'lg' },
    VCard: { rounded: 'xl' },
    VTextField: { variant: 'outlined', density: 'comfortable' },
    VSelect: { variant: 'outlined', density: 'comfortable' },
    VTextarea: { variant: 'outlined', density: 'comfortable' },
  },
})

export default vuetify
