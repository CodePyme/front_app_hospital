<template>
    <LayoutAutenticacion>
        <v-row class="fill-height" align="center" justify="center" style="min-height: 100vh; padding: 20px 0;">
            <v-col cols="12" sm="10" md="6" lg="4" xl="3">
                <!-- Logo y título corporativo -->
                <div class="text-center mb-6">
                    <template v-if="almacenConfiguracion.logoUrl">
                        <v-img :src="almacenConfiguracion.logoUrl" max-height="65" max-width="180" contain
                            class="mx-auto mb-3" />
                    </template>
                    <template v-else>
                        <div class="logo-fallback-circulo mx-auto mb-3">
                            <v-icon icon="mdi-hospital-building" size="36" color="primary" />
                        </div>
                    </template>
                    <h1 class="text-h5 font-weight-bold text-primary mb-1">{{ almacenConfiguracion.nombreEntidad }}</h1>
                    <p class="text-caption text-medium-emphasis">Portal de Servicios al Paciente</p>
                </div>

                <!-- Tarjeta Principal -->
                <v-card elevation="4" class="tarjeta-autenticacion rounded-xl">
                    <v-card-text class="pa-7 pa-sm-8">

                        <!-- ==================================================== -->
                        <!-- VISTA 1: IDENTIFICACIÓN DEL PACIENTE (PASO 1)       -->
                        <!-- ==================================================== -->
                        <div v-if="pasoActual === 1 && modoIngreso === 'paciente'">
                            <v-form ref="refFormularioPaso1" @submit.prevent="solicitarCodigoOtp"
                                v-model="formPaso1Valido">
                                <!-- Tipo de Documento -->
                                <div class="etiqueta-campo">TIPO DE DOCUMENTO *</div>
                                <v-select v-model="formularioPaciente.tipoDocumento" :items="tiposDocumento"
                                    item-title="texto" item-value="valor" variant="outlined" density="comfortable"
                                    class="mb-3 rounded-lg" :rules="[v => !!v || 'Selecciona el tipo de documento']"
                                    :disabled="almacenAuth.cargando" hide-details="auto" />

                                <!-- Número de Documento -->
                                <div class="etiqueta-campo">NÚMERO DE DOCUMENTO *</div>
                                <v-text-field v-model="formularioPaciente.numeroDocumento" placeholder="1234567890"
                                    variant="outlined" density="comfortable" class="mb-3"
                                    :rules="[v => !!v || 'El número de documento es requerido']"
                                    :disabled="almacenAuth.cargando" autocomplete="username" hide-details="auto" />

                                <!-- Fecha de Nacimiento -->
                                <div class="etiqueta-campo">FECHA DE NACIMIENTO *</div>
                                <v-text-field v-model="formularioPaciente.fechaNacimiento" type="date"
                                    variant="outlined" density="comfortable" append-inner-icon="mdi-calendar"
                                    class="mb-5" :rules="[v => !!v || 'La fecha de nacimiento es requerida']"
                                    :disabled="almacenAuth.cargando" hide-details="auto" />

                                <!-- Alerta de Error -->
                                <v-alert v-if="almacenAuth.error" type="error" variant="tonal" density="compact"
                                    class="mb-4 text-caption" closable @click:close="almacenAuth.error = null">
                                    {{ almacenAuth.error }}
                                </v-alert>

                                <!-- Botón Continuar -->
                                <v-btn type="submit" color="primary" size="large" block rounded="pill"
                                    class="btn-accion font-weight-bold text-capitalize mt-2"
                                    :loading="almacenAuth.cargando"
                                    :disabled="!formPaso1Valido || almacenAuth.cargando">
                                    Continuar
                                    <v-icon end size="18">mdi-arrow-right</v-icon>
                                </v-btn>
                            </v-form>

                            <!-- Enlace a Acceso Administrativo -->
                            <div class="text-center mt-5">
                                <v-btn variant="plain" size="small" class="text-caption text-medium-emphasis text-none"
                                    @click="cambiarModo('admin')">
                                    <v-icon start size="16">mdi-shield-account</v-icon>
                                    ¿Eres médico o administrador? Ingresa aquí
                                </v-btn>
                            </div>
                        </div>

                        <!-- ==================================================== -->
                        <!-- VISTA 2: CLAVE DINÁMICA / OTP 4 DÍGITOS (PASO 2)     -->
                        <!-- ==================================================== -->
                        <div v-else-if="pasoActual === 2 && modoIngreso === 'paciente'">
                            <!-- Ícono Llave Verde -->
                            <div class="text-center mb-3">
                                <div class="icono-llave-circulo mx-auto">
                                    <v-icon icon="mdi-key-variant" size="30" color="primary" />
                                </div>
                            </div>

                            <!-- Título y subtítulo -->
                            <div class="text-center mb-3">
                                <h2 class="text-h5 font-weight-black text-slate-800 mb-2">Clave Dinámica</h2>
                                <p class="text-caption text-medium-emphasis px-2">
                                    Ingresa la clave dinámica enviada a tu correo electrónico
                                    <strong v-if="correoDestino" class="text-primary d-block mt-1">{{ correoDestino
                                        }}</strong>
                                    <span v-else>y número de celular registrado.</span>
                                </p>
                            </div>

                            <!-- Alerta de 5 segundos con el correo de destino -->
                            <v-alert
                                v-if="mostrarAvisoCorreo"
                                type="success"
                                variant="tonal"
                                density="comfortable"
                                class="mb-4 text-caption font-weight-bold"
                                rounded="lg"
                                closable
                                @click:close="mostrarAvisoCorreo = false"
                            >
                                <v-icon start size="18">mdi-email-check-outline</v-icon>
                                Clave enviada a: <strong>{{ correoDestino }}</strong>
                            </v-alert>

                            <!-- Badge Clave Temporal -->
                            <div class="text-center mb-6">
                                <span class="badge-temporal">
                                    <v-icon size="14" start color="#b45309">mdi-clock-outline</v-icon>
                                    LA CLAVE ES TEMPORAL
                                </span>
                            </div>

                            <!-- Casillas de 4 Dígitos OTP -->
                            <div class="caja-digitos-otp mb-5">
                                <input v-for="(digito, indice) in 4" :key="indice" :ref="el => casillasOtp[indice] = el"
                                    v-model="digitosOtp[indice]" type="text" inputmode="numeric" pattern="[0-9]*"
                                    maxlength="1" class="input-digito-otp"
                                    :class="{ 'tiene-valor': digitosOtp[indice] !== '' }"
                                    @input="alEscribirDigito(indice, $event)"
                                    @keydown.backspace="alBorrarDigito(indice, $event)" @paste="alPegarCodigo($event)"
                                    :disabled="almacenAuth.cargando" />
                            </div>

                            <!-- Alerta de Error OTP -->
                            <v-alert v-if="almacenAuth.error" type="error" variant="tonal" density="compact"
                                class="mb-4 text-caption" closable @click:close="almacenAuth.error = null">
                                {{ almacenAuth.error }}
                            </v-alert>

                            <!-- Botones de Acción (Regresar / Ingresar) -->
                            <v-row dense class="mt-2">
                                <v-col cols="5">
                                    <v-btn variant="tonal" color="grey-darken-1" size="large" block rounded="pill"
                                        class="btn-regresar font-weight-bold text-uppercase" @click="regresarPaso1"
                                        :disabled="almacenAuth.cargando">
                                        REGRESAR
                                    </v-btn>
                                </v-col>
                                <v-col cols="7">
                                    <v-btn color="primary" size="large" block rounded="pill"
                                        class="btn-accion font-weight-bold text-capitalize"
                                        :loading="almacenAuth.cargando" :disabled="!otpCompleto || almacenAuth.cargando"
                                        @click="verificarCodigoOtp">
                                        Ingresar
                                        <v-icon end size="18">mdi-check-circle-outline</v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>

                            <!-- Reenvío de código con temporizador -->
                            <div class="text-center mt-5">
                                <span v-if="segundosRestantes > 0" class="text-caption text-medium-emphasis">
                                    Reenviar código en <strong>{{ segundosRestantes }}s</strong>
                                </span>
                                <v-btn v-else variant="plain" size="small" color="primary"
                                    class="text-caption font-weight-bold text-none" :disabled="almacenAuth.cargando"
                                    @click="solicitarCodigoOtp">
                                    <v-icon start size="14">mdi-refresh</v-icon>
                                    ¿No recibiste el código? Reenviar
                                </v-btn>
                            </div>
                        </div>

                        <!-- ==================================================== -->
                        <!-- VISTA 3: ACCESO ADMINISTRATIVO (CONTRASEÑA)          -->
                        <!-- ==================================================== -->
                        <div v-else-if="modoIngreso === 'admin'">
                            <div class="text-center mb-4">
                                <h2 class="text-h6 font-weight-bold text-primary">Acceso Administrativo</h2>
                                <p class="text-caption text-medium-emphasis">Personal médico y administradores</p>
                            </div>

                            <v-form ref="refFormularioAdmin" @submit.prevent="iniciarSesionAdmin"
                                v-model="formAdminValido">
                                <!-- Correo -->
                                <div class="etiqueta-campo">CORREO ELECTRÓNICO *</div>
                                <v-text-field v-model="formularioAdmin.correoElectronico" type="email"
                                    placeholder="admin@hospital.com" variant="outlined" density="comfortable"
                                    prepend-inner-icon="mdi-email-outline" class="mb-3"
                                    :rules="[v => !!v || 'El correo es requerido', v => /.+@.+\..+/.test(v) || 'Correo no válido']"
                                    :disabled="almacenAuth.cargando" autocomplete="email" hide-details="auto" />

                                <!-- Contraseña -->
                                <div class="etiqueta-campo">CONTRASEÑA *</div>
                                <v-text-field v-model="formularioAdmin.contrasena"
                                    :type="mostrarContrasena ? 'text' : 'password'" placeholder="••••••••"
                                    variant="outlined" density="comfortable" prepend-inner-icon="mdi-lock-outline"
                                    :append-inner-icon="mostrarContrasena ? 'mdi-eye-off' : 'mdi-eye'"
                                    @click:append-inner="mostrarContrasena = !mostrarContrasena" class="mb-5"
                                    :rules="[v => !!v || 'La contraseña es requerida']" :disabled="almacenAuth.cargando"
                                    autocomplete="current-password" hide-details="auto" />

                                <!-- Alerta de error -->
                                <v-alert v-if="almacenAuth.error" type="error" variant="tonal" density="compact"
                                    class="mb-4 text-caption" closable @click:close="almacenAuth.error = null">
                                    {{ almacenAuth.error }}
                                </v-alert>

                                <!-- Botón de ingreso admin -->
                                <v-btn type="submit" color="primary" size="large" block rounded="pill"
                                    class="btn-accion font-weight-bold mt-2" :loading="almacenAuth.cargando"
                                    :disabled="!formAdminValido || almacenAuth.cargando">
                                    <v-icon start>mdi-login</v-icon>
                                    Iniciar sesión
                                </v-btn>
                            </v-form>

                            <div class="text-center mt-5">
                                <v-btn variant="plain" size="small" class="text-caption text-medium-emphasis text-none"
                                    @click="cambiarModo('paciente')">
                                    <v-icon start size="16">mdi-arrow-left</v-icon>
                                    Volver a ingreso de Pacientes (OTP)
                                </v-btn>
                            </div>
                        </div>

                    </v-card-text>
                </v-card>

                <p class="text-center text-medium-emphasis text-caption mt-5">
                    Portal Paciente © {{ anioActual }}
                </p>
            </v-col>
        </v-row>
    </LayoutAutenticacion>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAlmacenAutenticacion } from '../../stores/autenticacion.store'
import { useAlmacenConfiguracion } from '../../stores/configuracion.store'
import { usarAlertas } from '../../composables/usarAlertas'
import LayoutAutenticacion from '../../layouts/LayoutAutenticacion.vue'

const enrutador = useRouter()
const almacenAuth = useAlmacenAutenticacion()
const almacenConfiguracion = useAlmacenConfiguracion()
const { mostrarExito, mostrarError } = usarAlertas()

const anioActual = new Date().getFullYear()

// Modos y Pasos
const modoIngreso = ref('paciente') // 'paciente' | 'admin'
const pasoActual = ref(1) // 1 = Formulario | 2 = OTP 4 dígitos
const correoDestino = ref('')
const mostrarAvisoCorreo = ref(false)
let temporizadorAviso = null
const segundosRestantes = ref(0)
let intervaloTemporizador = null

// Formularios
const refFormularioPaso1 = ref(null)
const formPaso1Valido = ref(false)
const refFormularioAdmin = ref(null)
const formAdminValido = ref(false)
const mostrarContrasena = ref(false)

const formularioPaciente = reactive({
    tipoDocumento: 'CC',
    numeroDocumento: '',
    fechaNacimiento: '',
})

const formularioAdmin = reactive({
    correoElectronico: '',
    contrasena: '',
})

const tiposDocumento = [
    { texto: 'Cédula de ciudadanía', valor: 'CC' },
    { texto: 'Tarjeta de identidad', valor: 'TI' },
    { texto: 'Cédula de extranjería', valor: 'CE' },
    { texto: 'Registro civil', valor: 'RC' },
    { texto: 'Pasaporte', valor: 'PA' },
    { texto: 'Permiso por Protección Temporal', valor: 'PT' },
    { texto: 'Permiso Especial de Permanencia', valor: 'PE' },
    { texto: 'Adulto sin identificación', valor: 'AS' },
    { texto: 'Menor sin identificación', valor: 'MS' },
    { texto: 'Salvoconducto', valor: 'SC' },
]

// Gestión de los 4 dígitos OTP
const digitosOtp = reactive(['', '', '', ''])
const casillasOtp = ref([])

const otpCompleto = computed(() => {
    return digitosOtp.every(d => d !== '' && !isNaN(d))
})

const codigoOtpUnido = computed(() => {
    return digitosOtp.join('')
})

function iniciarTemporizador(segundos = 60) {
    if (intervaloTemporizador) clearInterval(intervaloTemporizador)
    segundosRestantes.value = segundos
    intervaloTemporizador = setInterval(() => {
        if (segundosRestantes.value > 0) {
            segundosRestantes.value--
        } else {
            clearInterval(intervaloTemporizador)
        }
    }, 1000)
}

function cambiarModo(nuevoModo) {
    almacenAuth.error = null
    modoIngreso.value = nuevoModo
    pasoActual.value = 1
}

function regresarPaso1() {
    almacenAuth.error = null
    mostrarAvisoCorreo.value = false
    if (temporizadorAviso) clearTimeout(temporizadorAviso)
    pasoActual.value = 1
    digitosOtp[0] = ''
    digitosOtp[1] = ''
    digitosOtp[2] = ''
    digitosOtp[3] = ''
}

// Paso 1: Solicitar OTP
async function solicitarCodigoOtp() {
    almacenAuth.error = null
    if (refFormularioPaso1.value) {
        const { valid } = await refFormularioPaso1.value.validate()
        if (!valid) return
    }

    try {
        const respuesta = await almacenAuth.solicitarOtp({
            tipoDocumento: formularioPaciente.tipoDocumento,
            numeroDocumento: formularioPaciente.numeroDocumento.trim(),
            fechaNacimiento: formularioPaciente.fechaNacimiento,
        })

        correoDestino.value =
            respuesta.datos?.correoDestino ||
            respuesta.datos?.correoEnmascarado ||
            ''

        // Mostrar aviso del correo por exactamente 5 segundos
        mostrarAvisoCorreo.value = true
        if (temporizadorAviso) clearTimeout(temporizadorAviso)
        temporizadorAviso = setTimeout(() => {
            mostrarAvisoCorreo.value = false
        }, 5000)

        pasoActual.value = 2
        iniciarTemporizador(60)

        // Foco en la primera casilla
        await nextTick()
        if (casillasOtp.value[0]) {
            casillasOtp.value[0].focus()
        }
    } catch (error) {
        // El error se maneja en el store
    }
}

// Control de inputs de OTP
function alEscribirDigito(indice, evento) {
    const valor = evento.target.value.replace(/\D/g, '')
    digitosOtp[indice] = valor ? valor.slice(-1) : ''

    if (digitosOtp[indice] && indice < 3) {
        nextTick(() => {
            if (casillasOtp.value[indice + 1]) {
                casillasOtp.value[indice + 1].focus()
            }
        })
    }

    if (otpCompleto.value) {
        verificarCodigoOtp()
    }
}

function alBorrarDigito(indice, evento) {
    if (!digitosOtp[indice] && indice > 0) {
        nextTick(() => {
            if (casillasOtp.value[indice - 1]) {
                casillasOtp.value[indice - 1].focus()
            }
        })
    }
}

function alPegarCodigo(evento) {
    evento.preventDefault()
    const pegado = (evento.clipboardData || window.clipboardData).getData('text').trim()
    const soloNumeros = pegado.replace(/\D/g, '').slice(0, 4)

    for (let i = 0; i < 4; i++) {
        digitosOtp[i] = soloNumeros[i] || ''
    }

    const primerVacio = digitosOtp.findIndex(d => d === '')
    nextTick(() => {
        if (primerVacio !== -1 && casillasOtp.value[primerVacio]) {
            casillasOtp.value[primerVacio].focus()
        } else if (casillasOtp.value[3]) {
            casillasOtp.value[3].focus()
        }
    })

    if (otpCompleto.value) {
        verificarCodigoOtp()
    }
}

// Paso 2: Verificar OTP
async function verificarCodigoOtp() {
    if (!otpCompleto.value) return
    almacenAuth.error = null

    try {
        await almacenAuth.verificarOtp({
            tipoDocumento: formularioPaciente.tipoDocumento,
            numeroDocumento: formularioPaciente.numeroDocumento.trim(),
            codigoOtp: codigoOtpUnido.value,
        })

        await mostrarExito('¡Bienvenido al Portal Paciente!', '¡Acceso concedido!')
        enrutador.push({ name: 'dashboard' })
    } catch (error) {
        // Limpiar casillas para reintentar
        digitosOtp[0] = ''
        digitosOtp[1] = ''
        digitosOtp[2] = ''
        digitosOtp[3] = ''
        await nextTick()
        if (casillasOtp.value[0]) {
            casillasOtp.value[0].focus()
        }
    }
}

// Login tradicional (Admin)
async function iniciarSesionAdmin() {
    const { valid } = await refFormularioAdmin.value.validate()
    if (!valid) return

    try {
        await almacenAuth.iniciarSesion(
            formularioAdmin.correoElectronico,
            formularioAdmin.contrasena,
        )
        await mostrarExito('¡Bienvenido al sistema!', '¡Sesión iniciada!')
        enrutador.push({ name: 'dashboard' })
    } catch (error) {
        // El error se maneja en el store
    }
}
</script>

<style scoped>
.tarjeta-autenticacion {
    background: #ffffff !important;
    border: 1px solid rgba(0, 0, 0, 0.06) !important;
    box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02) !important;
}

.logo-fallback-circulo {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: rgba(7, 92, 57, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
}

.etiqueta-campo {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: #64748b;
    margin-bottom: 6px;
    text-transform: uppercase;
}

.btn-accion {
    height: 48px !important;
    font-size: 0.95rem !important;
    letter-spacing: 0.02em;
    box-shadow: 0 4px 12px rgba(7, 92, 57, 0.25) !important;
}

.btn-regresar {
    height: 48px !important;
    font-size: 0.85rem !important;
    letter-spacing: 0.05em;
    background-color: #f1f5f9 !important;
    color: #475569 !important;
}

/* Clave Dinámica */
.icono-llave-circulo {
    width: 58px;
    height: 58px;
    border-radius: 50%;
    background: rgba(7, 92, 57, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
}

.badge-temporal {
    display: inline-flex;
    align-items: center;
    background-color: #fffbeb;
    border: 1px solid #fef3c7;
    color: #b45309;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    padding: 5px 14px;
    border-radius: 20px;
}

/* Cajas de entrada OTP */
.caja-digitos-otp {
    display: flex;
    justify-content: center;
    gap: 12px;
}

.input-digito-otp {
    width: 54px;
    height: 62px;
    font-size: 1.75rem;
    font-weight: 800;
    text-align: center;
    color: #1e293b;
    background-color: #f8fafc;
    border: 2px solid #e2e8f0;
    border-radius: 14px;
    outline: none;
    transition: all 0.2s ease-in-out;
}

.input-digito-otp:focus {
    background-color: #ffffff;
    border-color: rgb(var(--v-theme-primary));
    box-shadow: 0 0 0 4px rgba(7, 92, 57, 0.12);
}

.input-digito-otp.tiene-valor {
    border-color: rgb(var(--v-theme-primary));
    background-color: #ffffff;
}

@media (max-width: 600px) {
    .input-digito-otp {
        width: 46px;
        height: 54px;
        font-size: 1.5rem;
    }
}
</style>
