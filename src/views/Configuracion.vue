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
                            <v-text-field v-model="formulario.nombreEntidad" label="Nombre de la Entidad"
                                placeholder="Ej: Clínica Sanitas" variant="outlined" color="primary" class="mb-2"
                                :rules="[v => !!v || 'El nombre es requerido']"></v-text-field>

                            <v-text-field v-model="formulario.logoUrl" label="URL del Logo (Opcional)"
                                placeholder="https://ejemplo.com/logo.png" variant="outlined" color="primary"
                                class="mb-6" hint="Proporciona el enlace directo a la imagen del logo de tu clínica."
                                persistent-hint></v-text-field>

                            <h3 class="text-subtitle-1 font-weight-bold mb-4 text-primary mt-6">Paleta de Colores</h3>
                            <v-row>
                                <!-- Color Primario -->
                                <v-col cols="12" sm="6">
                                    <div class="color-field-label text-body-2 text-medium-emphasis mb-2">Color Primario
                                    </div>
                                    <v-menu v-model="menuColorPrimario" :close-on-content-click="false"
                                        location="bottom start">
                                        <template v-slot:activator="{ props }">
                                            <div class="color-trigger" v-bind="props">
                                                <div class="color-swatch"
                                                    :style="{ backgroundColor: formulario.colorPrimario }"></div>
                                                <div class="color-trigger-info">
                                                    <span class="color-hex-label">{{
                                                        formulario.colorPrimario.toUpperCase() }}</span>
                                                    <span class="color-trigger-hint">Clic para cambiar</span>
                                                </div>
                                                <v-icon size="18" color="grey-darken-1">mdi-chevron-down</v-icon>
                                            </div>
                                        </template>

                                        <v-card rounded="xl" elevation="4" class="picker-card">
                                            <v-color-picker v-model="formulario.colorPrimario" mode="hex"
                                                :modes="['hex']" show-swatches :swatches="paletaColores"
                                                swatches-max-height="120" />
                                            <div class="picker-actions pa-3 pt-0">
                                                <v-btn block color="primary" variant="tonal" rounded="pill" size="small"
                                                    class="text-none" @click="menuColorPrimario = false">
                                                    Aplicar color
                                                </v-btn>
                                            </div>
                                        </v-card>
                                    </v-menu>
                                </v-col>

                                <!-- Color Secundario -->
                                <v-col cols="12" sm="6">
                                    <div class="color-field-label text-body-2 text-medium-emphasis mb-2">Color
                                        Secundario</div>
                                    <v-menu v-model="menuColorSecundario" :close-on-content-click="false"
                                        location="bottom start">
                                        <template v-slot:activator="{ props }">
                                            <div class="color-trigger" v-bind="props">
                                                <div class="color-swatch"
                                                    :style="{ backgroundColor: formulario.colorSecundario }"></div>
                                                <div class="color-trigger-info">
                                                    <span class="color-hex-label">{{
                                                        formulario.colorSecundario.toUpperCase() }}</span>
                                                    <span class="color-trigger-hint">Clic para cambiar</span>
                                                </div>
                                                <v-icon size="18" color="grey-darken-1">mdi-chevron-down</v-icon>
                                            </div>
                                        </template>

                                        <v-card rounded="xl" elevation="4" class="picker-card">
                                            <v-color-picker v-model="formulario.colorSecundario" mode="hex"
                                                :modes="['hex']" show-swatches :swatches="paletaColores"
                                                swatches-max-height="120" />
                                            <div class="picker-actions pa-3 pt-0">
                                                <v-btn block color="primary" variant="tonal" rounded="pill" size="small"
                                                    class="text-none" @click="menuColorSecundario = false">
                                                    Aplicar color
                                                </v-btn>
                                            </div>
                                        </v-card>
                                    </v-menu>
                                </v-col>
                            </v-row>

                            <div class="d-flex justify-end mt-6">
                                <v-btn color="primary" type="submit" size="large" rounded="pill"
                                    class="text-none font-weight-bold px-8" :loading="guardando">
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
                    <v-card-title
                        class="pa-4 text-subtitle-2 text-grey-darken-1 font-weight-bold text-uppercase border-b">
                        Vista Previa
                    </v-card-title>
                    <v-card-text class="pa-6">
                        <!-- Sidebar Preview -->
                        <div class="rounded-xl overflow-hidden mb-6"
                            style="width: 200px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                            <div :style="{ backgroundColor: formulario.colorPrimario }" class="pa-4 text-center">
                                <v-img v-if="formulario.logoUrl" :src="formulario.logoUrl" max-height="40" contain
                                    class="mb-2" />
                                <v-icon v-else icon="mdi-heart-pulse" size="40" color="white" class="mb-2" />
                                <div class="text-white text-caption font-weight-bold lh-1">{{ formulario.nombreEntidad
                                    || 'Nombre'
                                    }}</div>
                            </div>
                            <div class="bg-white pa-2">
                                <div class="rounded-lg pa-2 mb-1 d-flex align-center gap-2"
                                    :style="{ backgroundColor: formulario.colorSecundario, color: formulario.colorPrimario }">
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
const menuColorPrimario = ref(false)
const menuColorSecundario = ref(false)

const formulario = ref({
    nombreEntidad: '',
    logoUrl: '',
    colorPrimario: '#075c39',
    colorSecundario: '#9cc516'
})

// Paleta de colores sugeridos para el sector salud
const paletaColores = [
    ['#075c39', '#0a7a4e', '#0d9e65', '#10c27c'],
    ['#9cc516', '#b8d81c', '#d4eb22', '#e8f55a'],
    ['#1565C0', '#1976D2', '#1E88E5', '#42A5F5'],
    ['#6A1B9A', '#7B1FA2', '#8E24AA', '#AB47BC'],
    ['#C62828', '#D32F2F', '#E53935', '#EF5350'],
    ['#E65100', '#EF6C00', '#F57C00', '#FF9800'],
    ['#263238', '#37474F', '#455A64', '#546E7A'],
    ['#FFFFFF', '#F5F5F5', '#EEEEEE', '#E0E0E0'],
]

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

/* Trigger button que abre el picker */
.color-trigger {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border: 1px solid rgba(0, 0, 0, 0.23);
    border-radius: 8px;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
    background: white;
    user-select: none;
}

.color-trigger:hover {
    border-color: rgba(0, 0, 0, 0.6);
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
}

/* Cuadro de muestra de color */
.color-swatch {
    width: 36px;
    height: 36px;
    border-radius: 6px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    flex-shrink: 0;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.15);
}

.color-trigger-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.color-hex-label {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
    color: #1a1a1a;
    font-family: monospace;
}

.color-trigger-hint {
    font-size: 11px;
    color: #9e9e9e;
}

/* Card del picker */
.picker-card {
    overflow: hidden;
}

.picker-card :deep(.v-color-picker) {
    box-shadow: none !important;
}

.picker-actions {
    background: white;
}
</style>
