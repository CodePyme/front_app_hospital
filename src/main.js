import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import enrutador from './router'
import vuetify from './plugins/vuetify'
import pluginSweetAlert2 from './plugins/sweetalert2'

const aplicacion = createApp(App)

aplicacion.use(createPinia())
aplicacion.use(enrutador)
aplicacion.use(vuetify)
aplicacion.use(pluginSweetAlert2)

aplicacion.mount('#app')
