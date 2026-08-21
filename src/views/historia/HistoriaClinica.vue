<template>
  <LayoutPrincipal>
    <!-- Barra de Consulta por Episodio -->
    <v-card elevation="0" class="border rounded-xl mb-6 bg-white pa-4">
      <div class="d-flex flex-column flex-md-row align-start align-md-center justify-space-between gap-4">
        <div>
          <h1 class="text-h6 font-weight-bold text-primary mb-1 d-flex align-center gap-2">
            <v-icon color="secondary">mdi-folder-account-outline</v-icon>
            Historia Clínica y Consulta por Episodio
          </h1>
          <p class="text-caption text-grey-darken-1 mb-0">
            Consulta la información clínica y datos demográficos asociados a un episodio de atención en San Vicente Fundación.
          </p>
        </div>

        <div class="d-flex align-center gap-2 w-100 w-md-auto" style="min-width: 320px; max-width: 440px;">
          <v-text-field
            v-model="numeroEpisodio"
            placeholder="Número de episodio (ej. 0000017836)"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            bg-color="grey-lighten-5"
            prepend-inner-icon="mdi-numeric"
            clearable
            @keyup.enter="consultarEpisodio"
          ></v-text-field>
          <v-btn
            color="primary"
            variant="flat"
            rounded="lg"
            class="text-none font-weight-bold px-4"
            :loading="cargandoEpisodio"
            @click="consultarEpisodio"
          >
            Buscar
          </v-btn>
        </div>
      </div>
    </v-card>

    <!-- Tarjeta del Paciente con Datos Demográficos Reales de SAP PO -->
    <v-card elevation="0" class="border rounded-xl mb-6 bg-white pa-6">
      <div class="d-flex align-center justify-space-between flex-wrap gap-2 mb-4 pb-2 border-b">
        <h2 class="text-h5 font-weight-black text-primary text-uppercase letter-spacing-1">
          {{ datosPacienteActual.nombreCompleto || 'PACIENTE' }}
        </h2>
        <v-chip v-if="datosPacienteActual.episodio" color="secondary" variant="flat" size="small" class="font-weight-bold px-3">
          Episodio N.° {{ datosPacienteActual.episodio }}
        </v-chip>
      </div>

      <!-- Cuadrícula de Datos Demográficos Reales SAP PO -->
      <v-row dense class="datos-demograficos-grid text-caption">
        <!-- Fila 1 -->
        <v-col cols="12" sm="6" md="3" class="mb-3">
          <div class="text-caption font-weight-bold text-uppercase text-grey-darken-1 mb-1">Paciente N.°</div>
          <div class="text-body-1 font-weight-bold text-primary">{{ datosPacienteActual.numeroPaciente || '—' }}</div>
        </v-col>

        <v-col cols="12" sm="6" md="3" class="mb-3">
          <div class="text-caption font-weight-bold text-uppercase text-grey-darken-1 mb-1">Documento</div>
          <div class="text-body-1 font-weight-bold text-primary">{{ datosPacienteActual.tipoDocumento }} {{ datosPacienteActual.numeroDocumento }}</div>
        </v-col>

        <v-col cols="12" sm="6" md="3" class="mb-3">
          <div class="text-caption font-weight-bold text-uppercase text-grey-darken-1 mb-1">Tipo de documento</div>
          <div class="text-body-1 font-weight-bold text-primary">{{ datosPacienteActual.descDocumento || datosPacienteActual.tipoDocumento || 'Céd.Ciudadanía' }}</div>
        </v-col>

        <v-col cols="12" sm="6" md="3" class="mb-3">
          <div class="text-caption font-weight-bold text-uppercase text-grey-darken-1 mb-1">Fecha de nacimiento</div>
          <div class="text-body-1 font-weight-bold text-primary">{{ formatearFechaNac(datosPacienteActual.fechaNacimiento) }}</div>
        </v-col>

        <!-- Fila 2 -->
        <v-col cols="12" sm="6" md="3" class="mb-3">
          <div class="text-caption font-weight-bold text-uppercase text-grey-darken-1 mb-1">Edad</div>
          <div class="text-body-1 font-weight-bold text-primary">{{ datosPacienteActual.edad || '—' }}</div>
        </v-col>

        <v-col cols="12" sm="6" md="3" class="mb-3">
          <div class="text-caption font-weight-bold text-uppercase text-grey-darken-1 mb-1">Sexo</div>
          <div class="text-body-1 font-weight-bold text-primary text-uppercase">{{ datosPacienteActual.sexo || datosPacienteActual.genero || '—' }}</div>
        </v-col>

        <v-col cols="12" sm="6" md="3" class="mb-3">
          <div class="text-caption font-weight-bold text-uppercase text-grey-darken-1 mb-1">Teléfono principal</div>
          <div class="text-body-1 font-weight-bold text-primary">{{ datosPacienteActual.telefono || '—' }}</div>
        </v-col>

        <v-col cols="12" sm="6" md="3" class="mb-3">
          <div class="text-caption font-weight-bold text-uppercase text-grey-darken-1 mb-1">Correo electrónico</div>
          <div class="text-body-2 font-weight-bold text-primary text-truncate">{{ datosPacienteActual.correoElectronico || '—' }}</div>
        </v-col>

        <!-- Fila 3 -->
        <v-col cols="12" sm="12" md="6" class="mb-3">
          <div class="text-caption font-weight-bold text-uppercase text-grey-darken-1 mb-1">Dirección</div>
          <div class="text-body-2 font-weight-bold text-primary text-uppercase">{{ datosPacienteActual.direccionCompleta || datosPacienteActual.direccion || '—' }}</div>
        </v-col>

        <v-col cols="12" sm="6" md="3" class="mb-3">
          <div class="text-caption font-weight-bold text-uppercase text-grey-darken-1 mb-1">Servicio</div>
          <div class="text-body-1 font-weight-bold text-grey-darken-1">—</div>
        </v-col>

        <v-col cols="12" sm="6" md="3" class="mb-3">
          <div class="text-caption font-weight-bold text-uppercase text-grey-darken-1 mb-1">UO Médica</div>
          <div class="text-body-1 font-weight-bold text-grey-darken-1">—</div>
        </v-col>
      </v-row>
    </v-card>

    <!-- Navegación de Pestañas -->
    <div class="border-b mb-6">
      <div class="d-flex flex-wrap gap-2">
        <div 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab-item d-flex align-center gap-2 pa-3 font-weight-bold cursor-pointer text-subtitle-2', { 'active-tab': tab.active }]"
          @click="seleccionarTab(tab.id)"
        >
          <v-icon size="20">{{ tab.icono }}</v-icon>
          {{ tab.titulo }}
        </div>
      </div>
    </div>

    <v-row>
      <!-- Columna Izquierda: Resumen -->
      <v-col cols="12" md="4">
        
        <!-- Resumen de Salud -->
        <h3 class="text-subtitle-1 font-weight-bold text-primary mb-3">Resumen de salud</h3>
        <v-card elevation="0" class="border rounded-xl bg-white mb-6 pa-5 text-center">
          <div class="d-flex text-left mb-4">
            <v-avatar color="green-lighten-4" size="56" class="mr-4 flex-shrink-0">
              <v-icon color="secondary" size="28">mdi-calendar-clock-outline</v-icon>
            </v-avatar>
            <div class="text-caption text-grey-darken-2" style="line-height: 1.4">
              Paciente atendido en San Vicente Fundación. Consulta y evolución médica registrada en el sistema asistencial.
            </div>
          </div>
          <v-btn variant="text" color="primary" class="font-weight-bold text-none" append-icon="mdi-chevron-down">
            Ver más información
          </v-btn>
        </v-card>

        <!-- Indicadores de Salud -->
        <div class="d-flex justify-space-between align-center mb-3">
          <h3 class="text-subtitle-1 font-weight-bold text-primary">Indicadores de salud</h3>
          <a href="#" class="text-secondary text-caption font-weight-bold text-decoration-none">Ver detalle</a>
        </div>
        <v-card elevation="0" class="border rounded-xl bg-white mb-6 pa-4">
          <v-row dense>
            <v-col cols="4" v-for="(ind, index) in indicadores" :key="index">
              <div class="border rounded-lg pa-3 text-center h-100 d-flex flex-column align-center justify-center bg-grey-lighten-5 indicator-card">
                <v-icon color="secondary" size="24" class="mb-1">{{ ind.icono }}</v-icon>
                <div class="text-caption text-grey-darken-1 mb-1">{{ ind.titulo }}</div>
                <div class="text-subtitle-1 font-weight-black text-primary lh-1 mb-1">{{ ind.valor }} <span class="text-caption font-weight-medium text-grey-darken-1">{{ ind.unidad }}</span></div>
                <div class="text-caption font-weight-bold text-secondary" style="font-size: 0.65rem !important;">{{ ind.estado }}</div>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <!-- Profesionales de Salud -->
        <h3 class="text-subtitle-1 font-weight-bold text-primary mb-3">Profesionales de salud</h3>
        <v-card elevation="0" class="border rounded-xl bg-white mb-6">
          <v-list class="pa-0">
            <v-list-item v-for="(prof, index) in profesionales" :key="index" :class="{'border-b-light': index !== profesionales.length - 1}" class="pa-4">
              <template v-slot:prepend>
                <v-avatar color="green-lighten-4" size="40" class="mr-3">
                  <v-icon color="secondary" size="20">mdi-account-outline</v-icon>
                </v-avatar>
              </template>
              
              <v-list-item-title class="text-body-2 font-weight-bold text-primary">{{ prof.nombre }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption text-grey-darken-1">{{ prof.especialidad }}</v-list-item-subtitle>
              
              <template v-slot:append>
                <v-chip :color="prof.colorBadge" variant="flat" size="small" class="font-weight-bold px-2 text-caption">
                  {{ prof.badge }}
                </v-chip>
              </template>
            </v-list-item>
          </v-list>
          <div class="text-center pa-3 border-t">
            <v-btn variant="text" color="primary" class="font-weight-bold text-none" append-icon="mdi-chevron-down">
              Ver todos los profesionales
            </v-btn>
          </div>
        </v-card>

      </v-col>

      <!-- Columna Derecha: Línea de Tiempo -->
      <v-col cols="12" md="8">
        
        <div class="d-flex justify-space-between align-center mb-6 pl-md-4">
          <h3 class="text-subtitle-1 font-weight-bold text-primary">Actividad reciente</h3>
          <a href="#" class="text-secondary text-caption font-weight-bold text-decoration-none">Ver toda la actividad</a>
        </div>

        <div class="timeline-container pl-md-4">
          
          <div v-for="(evento, i) in actividadReciente" :key="i" class="timeline-item d-flex mb-6">
            
            <!-- Fecha (Izquierda) -->
            <div class="timeline-date d-flex flex-column align-center justify-start text-primary pt-2 mr-4 mr-md-6" style="width: 40px; flex-shrink: 0;">
              <div class="text-h6 font-weight-black lh-1">{{ evento.dia }}</div>
              <div class="text-caption font-weight-bold text-uppercase">{{ evento.mes }}</div>
              <div class="text-caption font-weight-medium opacity-70">{{ evento.anio }}</div>
            </div>

            <!-- Punto y Línea -->
            <div class="timeline-node d-flex flex-column align-center mr-4 mr-md-6">
              <div class="timeline-dot bg-secondary"></div>
              <div v-if="i !== actividadReciente.length - 1" class="timeline-line bg-grey-lighten-2 flex-grow-1"></div>
            </div>

            <!-- Tarjeta de Contenido -->
            <v-card elevation="0" class="border rounded-xl bg-white flex-grow-1 pa-4 d-flex flex-column flex-sm-row align-start align-sm-center event-card">
              <v-avatar color="green-lighten-5" size="48" class="mr-0 mr-sm-4 mb-3 mb-sm-0 flex-shrink-0">
                <v-icon color="secondary" size="24">{{ evento.icono }}</v-icon>
              </v-avatar>
              
              <div class="flex-grow-1 mr-0 mr-sm-4 mb-3 mb-sm-0 w-100">
                <div class="text-body-1 font-weight-bold text-primary lh-1 mb-1">{{ evento.titulo }}</div>
                <div class="text-caption text-grey-darken-3 mb-1 font-weight-medium">{{ evento.subtitulo }}</div>
                <div class="text-caption text-grey-darken-1">{{ evento.detalle }}</div>
              </div>

              <div class="d-flex align-center gap-2 align-self-start align-self-sm-center">
                <v-chip color="green-lighten-5" text-color="secondary" variant="flat" size="small" class="font-weight-bold px-3 event-btn cursor-pointer">
                  {{ evento.accion }}
                </v-chip>
                <v-icon color="grey-darken-1">mdi-chevron-right</v-icon>
              </div>
            </v-card>

          </div>
        </div>

      </v-col>
    </v-row>

    <!-- Footer de Seguridad -->
    <v-card elevation="0" class="mt-4 pa-4 rounded-xl d-flex align-center justify-space-between flex-wrap gap-4" style="background-color: #E6F0EB;">
      <div class="d-flex align-center gap-4">
        <v-avatar color="primary" size="36">
          <v-icon color="secondary" size="18">mdi-lock-outline</v-icon>
        </v-avatar>
        <div class="text-caption text-primary font-weight-medium">Tu información está protegida con los más altos estándares de seguridad y confidencialidad.</div>
      </div>
      <div class="d-flex gap-4">
        <a href="#" class="text-primary text-caption text-decoration-none font-weight-bold hover-underline">Política de privacidad</a>
        <span class="text-primary opacity-50">|</span>
        <a href="#" class="text-primary text-caption text-decoration-none font-weight-bold hover-underline">Términos y condiciones</a>
      </div>
    </v-card>
    <div class="mb-10"></div>
  </LayoutPrincipal>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import LayoutPrincipal from '../../layouts/LayoutPrincipal.vue'
import { useAlmacenAutenticacion } from '../../stores/autenticacion.store'
import { servicioPacientes } from '../../services/pacientes.service'
import { usarAlertas } from '../../composables/usarAlertas'

const almacenAuth = useAlmacenAutenticacion()
const { mostrarExito, mostrarError } = usarAlertas()

const numeroEpisodio = ref('')
const cargandoEpisodio = ref(false)

const datosPacienteActual = reactive({
  numeroPaciente: '',
  nombreCompleto: '',
  tipoDocumento: 'CC',
  descDocumento: 'Céd.Ciudadanía',
  numeroDocumento: '',
  edad: '',
  sexo: '',
  fechaNacimiento: '',
  telefono: '',
  correoElectronico: '',
  direccion: '',
  direccionCompleta: '',
  ciudad: '',
  episodio: '',
})

function formatearFechaNac(fecha) {
  if (!fecha) return '—'
  if (fecha.includes('/')) return fecha
  const partes = fecha.split('-')
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`
  }
  return fecha
}

async function cargarPerfilInicial() {
  try {
    const res = await servicioPacientes.obtenerMiPerfil()
    const datos = res.datos || {}
    actualizarDatosPaciente(datos)
  } catch (e) {
    // Si falla, fallback a la sesión básica
    if (almacenAuth.usuario) {
      datosPacienteActual.nombreCompleto = almacenAuth.nombreCompleto || 'Paciente'
      datosPacienteActual.correoElectronico = almacenAuth.usuario.correoElectronico || ''
      if (almacenAuth.usuario.tipoDocumento) datosPacienteActual.tipoDocumento = almacenAuth.usuario.tipoDocumento
      if (almacenAuth.usuario.numeroDocumento) datosPacienteActual.numeroDocumento = almacenAuth.usuario.numeroDocumento
    }
  }
}

function actualizarDatosPaciente(datos, episodio = '') {
  datosPacienteActual.numeroPaciente = datos.numeroPaciente || datos.Numero_paciente || ''
  datosPacienteActual.nombreCompleto =
    datos.nombreCompleto ||
    datos.Nombre_completo ||
    `${datos.nombres || datos.Primer_nombre || ''} ${datos.apellidos || datos.Primer_apellido || ''}`.trim() ||
    'Paciente'
  datosPacienteActual.tipoDocumento = datos.tipoDocumento || datos.Tipo_documento || 'CC'
  datosPacienteActual.descDocumento = datos.descDocumento || datos.Desc_documento || 'Céd.Ciudadanía'
  datosPacienteActual.numeroDocumento = datos.numeroDocumento || String(datos.Numero_documento || '')
  datosPacienteActual.edad = datos.edad || datos.Edad || '—'
  datosPacienteActual.sexo = datos.sexo || datos.Sexo || datos.genero || 'FEMENINO'
  datosPacienteActual.fechaNacimiento = datos.fechaNacimiento || datos.Fecha_nacimiento || ''
  datosPacienteActual.telefono = datos.telefono || datos.telefonoPrincipal || String(datos.Telefono_principal || '')
  datosPacienteActual.correoElectronico = datos.correoElectronico || datos.email || datos.Direcciones?.Email || ''
  datosPacienteActual.direccion = datos.direccion || datos.Direcciones?.Direccion || ''
  datosPacienteActual.direccionCompleta = datos.direccionCompleta || datos.direccion || ''
  datosPacienteActual.ciudad = datos.ciudad || datos.poblacion || datos.Direcciones?.Poblacion || ''
  datosPacienteActual.episodio = episodio
}

async function consultarEpisodio() {
  if (!numeroEpisodio.value || !numeroEpisodio.value.trim()) {
    mostrarError('Por favor ingresa un número de episodio válido.')
    return
  }

  cargandoEpisodio.value = true
  try {
    const res = await servicioPacientes.consultarPorEpisodio(numeroEpisodio.value.trim())
    const datos = res.datos || {}
    actualizarDatosPaciente(datos, numeroEpisodio.value.trim())
    mostrarExito(`Episodio ${numeroEpisodio.value.trim()} cargado exitosamente.`)
  } catch (error) {
    const msg = error.response?.data?.message || error.message || 'No fue posible encontrar el episodio especificado.'
    mostrarError(msg)
  } finally {
    cargandoEpisodio.value = false
  }
}

function seleccionarTab(id) {
  tabs.value.forEach(t => {
    t.active = t.id === id
  })
}

onMounted(() => {
  cargarPerfilInicial()
})

// Pestañas
const tabs = ref([
  { id: 'resumen', titulo: 'Resumen', icono: 'mdi-clipboard-text-outline', active: true },
  { id: 'antecedentes', titulo: 'Antecedentes', icono: 'mdi-heart-pulse', active: false },
  { id: 'consultas', titulo: 'Consultas', icono: 'mdi-stethoscope', active: false },
  { id: 'diagnosticos', titulo: 'Diagnósticos', icono: 'mdi-clipboard-plus-outline', active: false },
  { id: 'procedimientos', titulo: 'Procedimientos', icono: 'mdi-needle', active: false },
  { id: 'hospitalizaciones', titulo: 'Hospitalizaciones', icono: 'mdi-bed-outline', active: false },
  { id: 'documentos', titulo: 'Documentos', icono: 'mdi-folder-outline', active: false },
])

// Indicadores
const indicadores = ref([
  { titulo: 'Peso', valor: '72', unidad: 'kg', estado: 'Normal', icono: 'mdi-scale-bathroom' },
  { titulo: 'Talla', valor: '1.75', unidad: 'm', estado: 'Normal', icono: 'mdi-human-male-height' },
  { titulo: 'IMC', valor: '23.5', unidad: '', estado: 'Normal', icono: 'mdi-chart-arc' },
])

// Profesionales
const profesionales = ref([
  { nombre: 'Dra. Laura Martínez', especialidad: 'Medicina General', badge: 'Médico tratante', colorBadge: 'green-lighten-4' },
  { nombre: 'Dr. Andrés Gómez', especialidad: 'Cardiología', badge: 'Especialista', colorBadge: 'grey-lighten-3' },
])

// Línea de tiempo
const actividadReciente = ref([
  {
    dia: '20', mes: 'MAY', anio: '2024',
    icono: 'mdi-doctor',
    titulo: 'Consulta médica',
    subtitulo: 'Dra. Laura Martínez • Medicina General',
    detalle: 'Control de rutina. Refiere sentirse bien. Se ajusta medicación.',
    accion: 'Ver detalle'
  },
  {
    dia: '15', mes: 'MAY', anio: '2024',
    icono: 'mdi-flask-outline',
    titulo: 'Resultados de exámenes',
    subtitulo: 'Laboratorio Clínico Central',
    detalle: 'Hemograma, Perfil lipídico, Glicemia',
    accion: 'Ver resultados'
  },
  {
    dia: '10', mes: 'MAY', anio: '2024',
    icono: 'mdi-pill',
    titulo: 'Medicamentos formulados',
    subtitulo: 'Dra. Laura Martínez',
    detalle: 'Losartán 50 mg cada 12 horas',
    accion: 'Ver fórmula'
  },
  {
    dia: '05', mes: 'MAY', anio: '2024',
    icono: 'mdi-heart-pulse',
    titulo: 'Diagnóstico',
    subtitulo: 'Dra. Laura Martínez',
    detalle: 'Hipertensión esencial (primaria)',
    accion: 'Ver detalle'
  },
  {
    dia: '28', mes: 'ABR', anio: '2024',
    icono: 'mdi-clipboard-text-outline',
    titulo: 'Procedimiento',
    subtitulo: 'Enfermería',
    detalle: 'Toma de signos vitales',
    accion: 'Ver detalle'
  }
])
</script>

<style scoped>
.border {
  border: 1px solid #EAECEF !important;
}

.border-b {
  border-bottom: 1px solid #EAECEF !important;
}

.border-t {
  border-top: 1px solid #EAECEF !important;
}

.border-b-light {
  border-bottom: 1px solid #F4F5F7 !important;
}

.tab-item {
  color: #64748B;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-item:hover {
  color: rgb(var(--v-theme-primary));
}

.active-tab {
  color: rgb(var(--v-theme-primary)) !important;
  border-bottom: 2px solid rgb(var(--v-theme-secondary)) !important;
}

.indicator-card {
  transition: transform 0.2s;
}

.indicator-card:hover {
  transform: translateY(-2px);
}

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: 6px;
}

.timeline-line {
  width: 2px;
  min-height: 40px;
}

.event-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.event-card:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.event-btn {
  color: rgb(var(--v-theme-secondary)) !important;
}

.hover-underline:hover {
  text-decoration: underline !important;
}
</style>
