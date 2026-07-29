<template>
  <LayoutPrincipal>
    
    <!-- Tarjeta del Paciente (Encabezado) -->
    <v-card elevation="0" class="border rounded-xl mb-6 bg-white overflow-hidden">
      <div class="d-flex flex-column flex-md-row">
        
        <!-- Info Principal -->
        <div class="pa-4 pa-sm-6 d-flex flex-column flex-sm-row align-center align-sm-start text-center text-sm-left flex-grow-1 border-e-md">
          <v-avatar color="green-lighten-4" size="80" class="mr-0 mr-sm-6 mb-4 mb-sm-0 flex-shrink-0">
            <v-icon color="secondary" size="48">mdi-account</v-icon>
          </v-avatar>
          
          <div class="flex-grow-1">
            <h2 class="text-h4 font-weight-bold text-primary mb-2">Juan Pérez</h2>
            
            <div class="d-flex flex-wrap justify-center justify-sm-start align-center gap-1 gap-sm-3 text-body-2 text-grey-darken-3 mb-3 font-weight-medium">
              <span>CC 1.234.567.890</span>
              <span class="text-grey-lighten-1 d-none d-sm-inline">|</span>
              <span>35 años</span>
              <span class="text-grey-lighten-1 d-none d-sm-inline">|</span>
              <span>Masculino</span>
              <span class="text-grey-lighten-1 d-none d-sm-inline">|</span>
              <span>O+</span>
            </div>
            
            <div class="d-flex flex-wrap justify-center justify-sm-start align-center gap-2 gap-sm-4 text-caption text-grey-darken-1">
              <div class="d-flex align-center gap-1">
                <v-icon size="16">mdi-calendar-blank-outline</v-icon> 15/06/1989
              </div>
              <div class="d-flex align-center gap-1">
                <v-icon size="16">mdi-phone-outline</v-icon> 300 123 4567
              </div>
              <div class="d-flex align-center gap-1">
                <v-icon size="16">mdi-email-outline</v-icon> juanperez@email.com
              </div>
            </div>
          </div>
        </div>

        <!-- Alerta Información Importante -->
        <div class="pa-4 pa-sm-6 w-100" style="max-width: 100%; @media (min-width: 600px) { max-width: 450px; }">
          <v-card elevation="0" class="h-100 bg-green-lighten-5 rounded-lg border pa-4 d-flex align-center cursor-pointer hover-card info-importante-card">
            <v-avatar color="white" size="36" class="mr-3 border-secondary">
              <v-icon color="secondary" size="20">mdi-shield-plus-outline</v-icon>
            </v-avatar>
            
            <div class="flex-grow-1 text-caption text-primary" style="line-height: 1.4">
              <div class="text-subtitle-2 font-weight-bold mb-1">Información importante</div>
              <div><span class="font-weight-bold text-grey-darken-3">Alergias:</span> Penicilina, Ácaros del polvo</div>
              <div><span class="font-weight-bold text-grey-darken-3">Enfermedades:</span> Hipertensión arterial</div>
              <div><span class="font-weight-bold text-grey-darken-3">Medicamentos actuales:</span> Losartán 50 mg cada 12 h</div>
            </div>
            
            <v-icon color="grey-darken-1" size="20" class="ml-2">mdi-chevron-right</v-icon>
          </v-card>
        </div>
      </div>
    </v-card>

    <!-- Navegación de Pestañas -->
    <div class="border-b mb-6">
      <div class="d-flex flex-wrap gap-2">
        <div 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab-item d-flex align-center gap-2 pa-3 font-weight-bold cursor-pointer text-subtitle-2', { 'active-tab': tab.active }]"
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
              Paciente con antecedentes de hipertensión arterial controlada. Sin antecedentes quirúrgicos. No fuma. Realiza actividad física 3 veces por semana.
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
import { ref } from 'vue'
import LayoutPrincipal from '../../layouts/LayoutPrincipal.vue'

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

// Línea de tiempo (Mocks exactos)
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

.border-e-md {
  border-right: 1px solid #EAECEF !important;
}
@media (max-width: 959px) {
  .border-e-md {
    border-right: none !important;
    border-bottom: 1px solid #EAECEF !important;
  }
}

.border-b-light {
  border-bottom: 1px solid rgba(0,0,0,0.05) !important;
}

.border-secondary {
  border: 1px solid rgb(var(--v-theme-secondary)) !important;
}

.lh-1 {
  line-height: 1.1 !important;
}

.hover-underline:hover {
  text-decoration: underline !important;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Tabs */
.tab-item {
  color: #78909c; /* grey-darken-1 */
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
  padding-bottom: 12px !important;
}
.tab-item:hover {
  color: rgb(var(--v-theme-primary));
}
.tab-item.active-tab {
  color: rgb(var(--v-theme-primary));
  border-bottom-color: rgb(var(--v-theme-primary));
}

/* Tarjetas interactivas */
.hover-card {
  transition: transform 0.2s, box-shadow 0.2s;
}
.hover-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
}

.info-importante-card {
  border-left: 4px solid rgb(var(--v-theme-secondary)) !important;
}

.indicator-card {
  background-color: #FAFAFA;
}

/* Timeline Custom CSS */
.timeline-item {
  position: relative;
}

.timeline-node {
  width: 16px;
  margin-top: 10px;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: relative;
  z-index: 2;
}

.timeline-line {
  width: 2px;
  background-color: #EAECEF;
  margin-top: 4px;
  margin-bottom: -14px; /* Connects to next dot */
  z-index: 1;
}

.event-card {
  transition: all 0.2s;
}
.event-card:hover {
  border-color: rgba(var(--v-theme-secondary), 0.5) !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03) !important;
}

.event-btn {
  transition: background-color 0.2s;
}
.event-card:hover .event-btn {
  background-color: rgb(var(--v-theme-secondary)) !important;
  color: white !important;
}
</style>
