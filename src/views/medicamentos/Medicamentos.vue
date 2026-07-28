<template>
  <LayoutPrincipal>
    
    <!-- Banner Superior (Información importante) -->
    <v-card elevation="0" class="border rounded-xl mb-6 bg-green-lighten-5 overflow-hidden position-relative">
      <div class="d-flex align-center pa-6">
        <v-avatar color="white" size="80" class="mr-6 border-secondary flex-shrink-0" style="border: 2px solid rgb(var(--v-theme-secondary));">
          <v-icon color="secondary" size="40" style="transform: rotate(45deg);">mdi-pill</v-icon>
        </v-avatar>
        
        <div class="flex-grow-1 z-index-1">
          <h2 class="text-subtitle-1 font-weight-bold text-primary mb-1">Información importante</h2>
          <div class="text-caption text-grey-darken-3 mb-1">Toma tus medicamentos según la indicación médica.</div>
          <div class="text-caption text-grey-darken-3">Si presentas alguna reacción adversa, contacta a tu médico.</div>
        </div>

        <!-- Botón cerrar (derecha) -->
        <div class="align-self-start z-index-1 ml-4">
          <v-btn icon="mdi-close" variant="text" size="small" color="grey-darken-1"></v-btn>
        </div>

        <!-- Ilustración simulada (absoluta a la derecha) -->
        <div class="position-absolute d-none d-md-flex" style="right: 50px; bottom: -20px; opacity: 0.9;">
          <v-icon color="green-lighten-3" size="140" style="margin-right: -40px;">mdi-bottle-tonic-plus</v-icon>
          <v-icon color="green-lighten-4" size="100" style="margin-top: 40px; margin-right: -20px; transform: rotate(15deg);">mdi-pill-multiple</v-icon>
          <v-icon color="secondary" size="80" style="margin-top: 60px; opacity: 0.4;">mdi-leaf</v-icon>
        </div>
      </div>
    </v-card>

    <!-- Navegación de Pestañas -->
    <div class="border-b mb-6 overflow-x-auto hide-scrollbar">
      <div class="d-flex" style="min-width: 600px;">
        <div 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab-item pa-3 font-weight-bold cursor-pointer text-subtitle-2', { 'active-tab': tab.active }]"
        >
          {{ tab.titulo }}
        </div>
      </div>
    </div>

    <!-- Barra de Filtros -->
    <v-row class="mb-4">
      <v-col cols="12" md="3" sm="6">
        <v-select
          :items="['Todos los estados', 'Activos', 'Inactivos', 'Suspendidos']"
          model-value="Todos los estados"
          variant="outlined"
          density="comfortable"
          bg-color="white"
          hide-details
        ></v-select>
      </v-col>
      <v-col cols="12" md="3" sm="6">
        <v-select
          :items="['Todos los tipos', 'Oral', 'Inyectable', 'Tópico']"
          model-value="Todos los tipos"
          variant="outlined"
          density="comfortable"
          bg-color="white"
          hide-details
        ></v-select>
      </v-col>
      <v-col cols="12" md="4" sm="8">
        <v-text-field
          placeholder="Buscar medicamento, principio activo..."
          variant="outlined"
          density="comfortable"
          bg-color="white"
          hide-details
          append-inner-icon="mdi-magnify"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="2" sm="4">
        <v-btn color="secondary" block height="48" class="text-primary font-weight-bold text-none rounded-lg" elevation="0">
          <v-icon start>mdi-download</v-icon> Descargar lista
        </v-btn>
      </v-col>
    </v-row>

    <!-- Contenido Principal -->
    <v-row>
      <!-- Columna Izquierda: Lista de Medicamentos -->
      <v-col cols="12" md="7" lg="8">
        <h3 class="text-subtitle-1 font-weight-bold text-primary mb-4">Medicamentos actuales</h3>
        
        <v-card 
          v-for="med in medicamentos" 
          :key="med.id"
          elevation="0" 
          class="border rounded-xl d-flex align-center pa-5 mb-4 bg-white med-card"
        >
          <!-- Icono Izquierda -->
          <v-avatar color="green-lighten-5" size="64" class="mr-5 flex-shrink-0">
            <v-icon :color="med.iconoColor" size="32" :style="{ transform: med.rotate ? 'rotate(45deg)' : 'none' }">{{ med.icono }}</v-icon>
          </v-avatar>
          
          <!-- Información Central -->
          <div class="flex-grow-1">
            <div class="text-subtitle-1 font-weight-bold text-primary lh-1 mb-1">{{ med.nombre }}</div>
            <div class="text-caption text-grey-darken-3 mb-2 font-weight-medium">Vía {{ med.via }} • {{ med.forma }}</div>
            
            <div class="d-flex align-center gap-4 text-caption text-grey-darken-1">
              <div class="d-flex align-center gap-1">
                <v-icon size="16">mdi-calendar-clock-outline</v-icon> {{ med.frecuencia }}
              </div>
              <div class="d-flex align-center gap-1" v-if="med.duracion">
                • {{ med.duracion }}
              </div>
            </div>
          </div>

          <!-- Estado y Acciones (Derecha) -->
          <div class="d-flex flex-column align-end justify-center pl-4 border-s ml-4" style="min-width: 130px; height: 100%;">
            <div class="d-flex justify-space-between w-100 align-start mb-2">
              <v-chip color="green-lighten-4" text-color="secondary" variant="flat" size="small" class="font-weight-bold px-3">
                Activo
              </v-chip>
              <v-btn icon="mdi-dots-vertical" variant="text" size="small" color="grey-darken-1" class="mt-n2 mr-n2"></v-btn>
            </div>
            <div class="text-caption text-grey-darken-1 w-100 text-left">Desde el {{ med.fechaInicio }}</div>
          </div>
        </v-card>

        <div class="text-center mt-2 mb-6">
          <v-btn variant="text" color="primary" class="font-weight-bold text-none" append-icon="mdi-chevron-down">
            Ver todos mis medicamentos
          </v-btn>
        </div>
      </v-col>

      <!-- Columna Derecha: Widgets -->
      <v-col cols="12" md="5" lg="4">
        
        <!-- Próxima Toma -->
        <h3 class="text-subtitle-1 font-weight-bold text-primary mb-4">Próxima toma</h3>
        <v-card elevation="0" class="border rounded-xl bg-white mb-6 pa-5">
          <div class="d-flex align-start mb-5">
            <v-avatar color="green-lighten-5" size="56" class="mr-4">
              <v-icon color="secondary" size="28">mdi-alarm</v-icon>
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-bold text-primary lh-1 mb-1">Losartán 50 mg</div>
              <div class="text-body-2 text-grey-darken-3 mb-2">1 tableta</div>
              <div class="d-flex align-center gap-1 text-caption font-weight-medium text-grey-darken-1">
                <v-icon size="16" color="secondary">mdi-clock-outline</v-icon>
                Hoy, 8:00 p. m.
              </div>
            </div>
          </div>
          <v-btn color="secondary" block rounded="lg" class="text-primary font-weight-bold text-none" elevation="0">
            <v-icon start>mdi-check-circle-outline</v-icon> Marcar como tomada
          </v-btn>
        </v-card>

        <!-- Recordatorios activos -->
        <div class="d-flex justify-space-between align-center mb-4">
          <h3 class="text-subtitle-1 font-weight-bold text-primary">Recordatorios activos</h3>
          <a href="#" class="text-secondary text-caption font-weight-bold text-decoration-none">Ver todos</a>
        </div>
        <v-card elevation="0" class="border rounded-xl bg-white mb-6">
          <v-list class="pa-0">
            <v-list-item v-for="(rec, index) in recordatorios" :key="index" :class="{'border-b-light': index !== recordatorios.length - 1}" class="pa-4 hover-bg">
              <template v-slot:prepend>
                <v-icon color="secondary" size="20" class="mr-3">mdi-bell-outline</v-icon>
              </template>
              
              <v-list-item-title class="text-body-2 text-grey-darken-3 font-weight-medium">{{ rec.nombre }}</v-list-item-title>
              
              <template v-slot:append>
                <v-chip v-if="rec.horaEspecial" color="green-lighten-5" text-color="grey-darken-3" variant="flat" size="small" class="font-weight-medium px-2">
                  {{ rec.horaEspecial }}
                </v-chip>
                <span v-else class="text-caption font-weight-medium text-grey-darken-3" style="background-color: #F5F7F9; padding: 4px 8px; border-radius: 4px;">
                  {{ rec.hora }}
                </span>
              </template>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- Renovación de fórmula -->
        <v-card elevation="0" class="border rounded-xl bg-white pa-5 d-flex align-start gap-4 hover-card">
          <v-avatar color="green-lighten-5" size="56" class="flex-shrink-0">
            <v-icon color="secondary" size="28">mdi-calendar-text-outline</v-icon>
          </v-avatar>
          <div>
            <div class="text-subtitle-2 font-weight-bold text-primary mb-1">¿Necesitas renovar tu fórmula?</div>
            <div class="text-caption text-grey-darken-1 mb-3" style="line-height: 1.3">
              Si ya terminaste tus medicamentos o necesitas una nueva fórmula, solicita una cita con tu médico.
            </div>
            <v-btn color="secondary" size="small" rounded="lg" class="text-primary font-weight-bold text-none px-4" elevation="0">
              <v-icon start size="16">mdi-calendar-plus</v-icon> Agendar cita
            </v-btn>
          </div>
        </v-card>

      </v-col>
    </v-row>

    <!-- Footer de Seguridad -->
    <v-card elevation="0" class="mt-8 pa-4 rounded-xl d-flex align-center justify-space-between flex-wrap gap-4" style="background-color: #E6F0EB;">
      <div class="d-flex align-center gap-4">
        <v-avatar color="white" size="36">
          <v-icon color="secondary" size="18">mdi-shield-check-outline</v-icon>
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
  { id: 'mis-medicamentos', titulo: 'Mis medicamentos', active: true },
  { id: 'recetas', titulo: 'Recetas anteriores', active: false },
  { id: 'recordatorios', titulo: 'Recordatorios', active: false },
])

// Mocks de medicamentos actuales
const medicamentos = ref([
  {
    id: 1,
    nombre: 'Losartán 50 mg',
    via: 'oral',
    forma: 'Tableta',
    frecuencia: 'Cada 12 horas',
    duracion: '30 días',
    fechaInicio: '20/05/2024',
    icono: 'mdi-pill',
    iconoColor: 'secondary',
    rotate: true
  },
  {
    id: 2,
    nombre: 'Atorvastatina 20 mg',
    via: 'oral',
    forma: 'Tableta',
    frecuencia: 'Cada 24 horas',
    duracion: '30 días',
    fechaInicio: '15/05/2024',
    icono: 'mdi-circle',
    iconoColor: 'amber-darken-1',
    rotate: false
  },
  {
    id: 3,
    nombre: 'Omeprazol 20 mg',
    via: 'oral',
    forma: 'Cápsula',
    frecuencia: 'Cada 24 horas antes del desayuno',
    duracion: '30 días',
    fechaInicio: '10/05/2024',
    icono: 'mdi-circle-half-full',
    iconoColor: 'primary',
    rotate: true
  },
  {
    id: 4,
    nombre: 'Salbutamol 100 mcg',
    via: 'inhalación',
    forma: 'Aerosol',
    frecuencia: '2 inhalaciones cada 8 horas',
    duracion: 'Según necesidad',
    fechaInicio: '05/05/2024',
    icono: 'mdi-spray',
    iconoColor: 'secondary',
    rotate: false
  }
])

// Mocks de recordatorios
const recordatorios = ref([
  { nombre: 'Losartán 50 mg', hora: '8:00 a. m.' },
  { nombre: 'Atorvastatina 20 mg', hora: '9:00 p. m.' },
  { nombre: 'Omeprazol 20 mg', hora: '7:00 a. m.' },
  { nombre: 'Salbutamol 100 mcg', horaEspecial: 'Según necesidad' }
])
</script>

<style scoped>
.border {
  border: 1px solid #EAECEF !important;
}

.border-b {
  border-bottom: 1px solid #EAECEF !important;
}

.border-s {
  border-left: 1px solid #EAECEF !important;
}

.border-b-light {
  border-bottom: 1px solid rgba(0,0,0,0.05) !important;
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

.z-index-1 {
  z-index: 1;
  position: relative;
}

/* Tabs */
.tab-item {
  color: #78909c; /* grey-darken-1 */
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
  padding-bottom: 12px !important;
  margin-right: 24px;
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

.hover-bg:hover {
  background-color: #f6f8f9;
}

.med-card {
  transition: all 0.2s;
}
.med-card:hover {
  border-color: rgba(var(--v-theme-secondary), 0.5) !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03) !important;
}

/* Ajustes de select y text-field transparentes */
.v-field__overlay {
  background-color: transparent !important;
}
</style>
