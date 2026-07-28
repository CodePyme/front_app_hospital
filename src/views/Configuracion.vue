<template>
  <LayoutPrincipal>
    <div class="mb-6">
      <h2 class="text-h5 font-weight-bold text-primary">Configuración de Marca</h2>
      <p class="text-medium-emphasis">Personaliza la apariencia del portal para tus pacientes.</p>
    </div>

    <v-row>
      <v-col cols="12" md="8">
        <v-card rounded="xl" elevation="0" class="border">
          <v-card-text class="pa-6">
            <v-form ref="formularioConfig" @submit.prevent="guardar">
              <h3 class="text-subtitle-1 font-weight-bold mb-4 text-primary">Información General</h3>
              <v-text-field
                v-model="formulario.nombreEntidad"
                label="Nombre de la Entidad"
                placeholder="Ej: Clínica Sanitas"
                variant="outlined"
                color="primary"
                class="mb-2"
                :rules="[v => !!v || 'El nombre es requerido']"
              ></v-text-field>

              <v-text-field
                v-model="formulario.logoUrl"
                label="URL del Logo (Opcional)"
                placeholder="https://ejemplo.com/logo.png"
                variant="outlined"
                color="primary"
                class="mb-6"
                hint="Proporciona el enlace directo a la imagen del logo de tu clínica."
                persistent-hint
              ></v-text-field>

              <h3 class="text-subtitle-1 font-weight-bold mb-4 text-primary mt-6">Paleta de Colores</h3>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formulario.colorPrimario"
                    label="Color Primario (Hexadecimal)"
                    variant="outlined"
                    color="primary"
                  >
                    <template v-slot:prepend-inner>
                      <div class="color-preview" :style="{ backgroundColor: formulario.colorPrimario }"></div>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formulario.colorSecundario"
                    label="Color Secundario (Hexadecimal)"
                    variant="outlined"
                    color="primary"
                  >
                    <template v-slot:prepend-inner>
                      <div class="color-preview" :style="{ backgroundColor: formulario.colorSecundario }"></div>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>

              <div class="d-flex justify-end mt-6">
                <v-btn
                  color="primary"
                  type="submit"
                  size="large"
                  rounded="pill"
                  class="text-none font-weight-bold px-8"
                  :loading="guardando"
                >
                  Guardar cambios
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Vista previa -->
      <v-col cols="12" md="4">
        <v-card rounded="xl" elevation="0" class="border bg-grey-lighten-4 h-100">
          <v-card-title class="pa-4 text-subtitle-2 text-grey-darken-1 font-weight-bold text-uppercase border-b">
            Vista Previa
          </v-card-title>
          <v-card-text class="pa-6">
            <!-- Sidebar Preview -->
            <div 
              class="rounded-xl overflow-hidden mb-6" 
              style="width: 200px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.1);"
            >
              <div :style="{ backgroundColor: formulario.colorPrimario }" class="pa-4 text-center">
                <v-img v-if="formulario.logoUrl" :src="formulario.logoUrl" max-height="40" contain class="mb-2" />
                <v-icon v-else icon="mdi-heart-pulse" size="40" color="white" class="mb-2" />
                <div class="text-white text-caption font-weight-bold lh-1">{{ formulario.nombreEntidad || 'Nombre' }}</div>
              </div>
              <div class="bg-white pa-2">
                <div 
                  class="rounded-lg pa-2 mb-1 d-flex align-center gap-2" 
                  :style="{ backgroundColor: formulario.colorSecundario, color: formulario.colorPrimario }"
                >
                  <v-icon size="16">mdi-home</v-icon>
                  <span class="text-caption font-weight-bold">Inicio</span>
                </div>
                <div class="pa-2 d-flex align-center gap-2 text-grey-darken-1">
                  <v-icon size="16">mdi-calendar</v-icon>
                  <span class="text-caption font-weight-bold">Citas</span>
                </div>
              </div>
            </div>

            <div class="text-center text-caption text-grey-darken-1">
              Así se verá el menú principal de tu portal para los pacientes.
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </LayoutPrincipal>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import LayoutPrincipal from '../layouts/LayoutPrincipal.vue'
import { useAlmacenConfiguracion } from '../stores/configuracion.store'
import { usarAlertas } from '../composables/usarAlertas'

const almacenConfiguracion = useAlmacenConfiguracion()
const temaVuetify = useTheme()
const { mostrarExito, mostrarError } = usarAlertas()

const formularioConfig = ref(null)
const guardando = ref(false)

const formulario = ref({
  nombreEntidad: '',
  logoUrl: '',
  colorPrimario: '#075c39',
  colorSecundario: '#9cc516'
})

onMounted(() => {
  formulario.value = {
    nombreEntidad: almacenConfiguracion.nombreEntidad,
    logoUrl: almacenConfiguracion.logoUrl,
    colorPrimario: almacenConfiguracion.colorPrimario,
    colorSecundario: almacenConfiguracion.colorSecundario
  }
})

async function guardar() {
  const esValido = await formularioConfig.value?.validate()
  if (!esValido.valid) return

  try {
    guardando.value = true
    await almacenConfiguracion.guardarConfiguracion(formulario.value)
    
    // Aplicar inmediatamente al tema
    temaVuetify.themes.value.temaPortalPaciente.colors.primary = formulario.value.colorPrimario
    temaVuetify.themes.value.temaPortalPaciente.colors['primary-darken-1'] = formulario.value.colorPrimario
    temaVuetify.themes.value.temaPortalPaciente.colors.secondary = formulario.value.colorSecundario
    temaVuetify.themes.value.temaPortalPaciente.colors['secondary-darken-1'] = formulario.value.colorSecundario

    mostrarExito('Configuración de marca actualizada')
  } catch (error) {
    mostrarError('Error al guardar la configuración: ' + error.message)
  } finally {
    guardando.value = false
  }
}
</script>

<style scoped>
.border {
  border: 1px solid #EAECEF !important;
}

.border-b {
  border-bottom: 1px solid #EAECEF !important;
}

.color-preview {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid rgba(0,0,0,0.1);
  margin-right: 8px;
}
</style>
