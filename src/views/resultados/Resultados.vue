<template>
  <LayoutPrincipal>
    <!-- Encabezado y Pestañas -->
    <div class="d-flex flex-column flex-md-row align-start align-md-center justify-space-between mb-6 border-b pb-4">
      <div class="d-flex flex-wrap mb-3 mb-md-0">
        <div class="text-subtitle-1 font-weight-bold text-primary border-b-primary pb-1 cursor-pointer mr-4 mb-2" style="border-bottom: 3px solid rgb(var(--v-theme-primary));">Mis resultados</div>
        <div class="text-subtitle-1 text-grey-darken-1 cursor-pointer hover-text-primary mb-2">Imágenes diagnósticas</div>
      </div>
      <v-chip color="secondary" variant="flat" class="text-primary px-4 w-100 w-md-auto py-2 h-auto" style="white-space: normal;">
        <div class="d-flex align-center">
          <v-icon start size="20" class="flex-shrink-0">mdi-shield-check-outline</v-icon>
          <div class="text-caption" style="line-height: 1.1">
            <div class="font-weight-bold">Tus resultados están protegidos</div>
            <div class="font-weight-regular">y solo tú puedes verlos.</div>
          </div>
        </div>
      </v-chip>
    </div>

    <!-- Barra de Filtros -->
    <v-row class="mb-4">
      <v-col cols="12" md="3" sm="6">
        <v-select
          label="Todos los tipos"
          :items="['Todos los tipos', 'Laboratorio', 'Imágenes', 'Patología']"
          variant="outlined"
          density="comfortable"
          bg-color="white"
          hide-details
        ></v-select>
      </v-col>
      <v-col cols="12" md="2" sm="6">
        <v-text-field
          label="Desde"
          type="date"
          variant="outlined"
          density="comfortable"
          bg-color="white"
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="2" sm="6">
        <v-text-field
          label="Hasta"
          type="date"
          variant="outlined"
          density="comfortable"
          bg-color="white"
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="5" sm="6">
        <v-text-field
          placeholder="Buscar examen o laboratorio..."
          variant="outlined"
          density="comfortable"
          bg-color="white"
          hide-details
          append-inner-icon="mdi-magnify"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Contenido Principal -->
    <v-row>
      <!-- Columna Izquierda: Lista de Exámenes -->
      <v-col cols="12" md="5" lg="4">
        <h3 class="text-subtitle-1 font-weight-bold text-primary mb-4">Lista de resultados</h3>
        
        <v-card 
          v-for="examen in listaExamenes" 
          :key="examen.id"
          elevation="0" 
          :class="['border rounded-xl d-flex align-center pa-4 mb-3 cursor-pointer examen-card', { 'active-card': examen.id === examenSeleccionado?.id }]"
          @click="seleccionarExamen(examen)"
        >
          <v-avatar :color="examen.id === examenSeleccionado?.id ? 'green-lighten-4' : 'green-lighten-5'" size="56" class="mr-4">
            <v-icon color="secondary" size="28">{{ examen.icono }}</v-icon>
          </v-avatar>
          
          <div class="flex-grow-1">
            <div class="text-body-1 font-weight-bold text-primary lh-1 mb-1">{{ examen.titulo }}</div>
            <div class="text-caption text-grey-darken-3 mb-1">{{ examen.laboratorio }}</div>
            <div class="text-caption text-grey-darken-1">{{ formatearFecha(examen.fecha) }} • {{ examen.hora }} a. m.</div>
          </div>

          <div class="d-flex align-center gap-2">
            <v-chip color="secondary" variant="flat" size="small" class="font-weight-bold text-primary px-3">
              {{ examen.estado }}
            </v-chip>
            <v-icon color="grey-darken-1">mdi-chevron-right</v-icon>
          </div>
        </v-card>

        <v-btn variant="outlined" color="primary" block rounded="pill" class="text-none font-weight-bold mt-4 mb-6 bg-white" append-icon="mdi-chevron-down">
          Ver más resultados
        </v-btn>
      </v-col>

      <!-- Columna Derecha: Detalle del Examen -->
      <v-col cols="12" md="7" lg="8">
        <div v-if="examenSeleccionado" class="pl-md-4">
          
          <!-- Cabecera del Detalle -->
          <v-chip color="green-lighten-4" text-color="primary" class="font-weight-bold mb-2 text-caption px-3" size="small" variant="flat">
            {{ examenSeleccionado.categoria }}
          </v-chip>
          
          <div class="d-flex flex-column flex-md-row justify-space-between align-start mb-6 gap-4">
            <div class="w-100">
              <h2 class="text-h4 font-weight-bold text-primary mb-4">{{ examenSeleccionado.titulo }}</h2>
              
              <div class="d-flex align-start align-sm-center gap-2 text-grey-darken-3 mb-2">
                <v-icon size="18" color="grey-darken-1" class="mt-1 mt-sm-0 flex-shrink-0">mdi-calendar-blank-outline</v-icon>
                <span>{{ formatearFecha(examenSeleccionado.fecha) }} • {{ examenSeleccionado.hora }} a. m.</span>
              </div>
              <div class="d-flex align-start align-sm-center gap-2 text-grey-darken-3 mb-2">
                <v-icon size="18" color="grey-darken-1" class="mt-1 mt-sm-0 flex-shrink-0">mdi-flask-outline</v-icon>
                <span>{{ examenSeleccionado.laboratorio }}</span>
              </div>
              <div class="d-flex align-start align-sm-center gap-2 text-grey-darken-3">
                <v-icon size="18" color="grey-darken-1" class="mt-1 mt-sm-0 flex-shrink-0">mdi-account-outline</v-icon>
                <span>Ordenado por: {{ examenSeleccionado.medico }}</span>
              </div>
            </div>
            
            <div class="d-flex flex-column w-100 w-md-auto mt-2 mt-md-0">
              <v-btn color="secondary" rounded="pill" elevation="0" class="text-primary font-weight-bold text-none px-6 w-100 w-md-auto mb-3">
                <v-icon start>mdi-download</v-icon> Descargar PDF
              </v-btn>
              <v-btn variant="outlined" color="grey-darken-1" rounded="pill" class="text-none font-weight-bold bg-white px-6 w-100 w-md-auto">
                <v-icon start>mdi-history</v-icon> Ver histórico
              </v-btn>
            </div>
          </div>

          <!-- Tabla de Resultados -->
          <v-card elevation="0" class="border rounded-xl bg-white overflow-hidden mb-6">
            <div class="pa-6 border-b">
              <div class="d-flex justify-space-between align-center mb-2">
                <h3 class="text-subtitle-1 font-weight-bold text-primary">Resumen de resultados</h3>
                <v-chip color="secondary" variant="flat" size="small" class="font-weight-bold text-primary px-4">
                  {{ examenSeleccionado.resultadoGlobal }}
                </v-chip>
              </div>
              <p class="text-body-2 text-grey-darken-1 mb-0">{{ examenSeleccionado.mensajeResumen }}</p>
            </div>
            
            <v-data-table
              v-if="examenSeleccionado.parametros"
              :headers="columnasParametros"
              :items="examenSeleccionado.parametros"
              class="bg-transparent"
              mobile-breakpoint="md"
              hover
            >
              <template v-slot:bottom></template>
              
              <template v-slot:item.nombre="{ item }">
                <span class="text-grey-darken-2">{{ item.nombre }}</span>
              </template>
              
              <template v-slot:item.resultado="{ item }">
                <span class="text-grey-darken-3 font-weight-medium">{{ item.resultado }}</span>
              </template>
              
              <template v-slot:item.referencia="{ item }">
                <span class="text-grey-darken-1">{{ item.referencia }}</span>
              </template>
              
              <template v-slot:item.estado="{ item }">
                <div :class="['status-dot mx-auto', `bg-${colorDot(item.estado)}`]"></div>
              </template>
            </v-data-table>
            
            <div v-else class="pa-6 text-center text-grey-darken-1">
              No hay parámetros detallados para este examen.
            </div>

            <!-- Alerta Informativa -->
            <div class="pa-4 bg-green-lighten-5 d-flex align-center gap-3">
              <v-icon color="secondary" size="24">mdi-stethoscope</v-icon>
              <div class="text-caption text-primary" style="line-height: 1.3">
                <span class="font-weight-bold">Este resultado debe ser interpretado por tu médico tratante.</span><br>
                Si tienes dudas, agenda una cita.
              </div>
            </div>
          </v-card>
        </div>

        <div v-else class="h-100 d-flex flex-column align-center justify-center text-grey-lighten-1 pa-10">
          <v-icon size="64" class="mb-4">mdi-file-document-outline</v-icon>
          <div class="text-h6 text-grey-darken-1">Selecciona un examen para ver los detalles</div>
        </div>
      </v-col>
    </v-row>

    <!-- Footer de Seguridad -->
    <v-card elevation="0" class="mt-8 pa-4 rounded-xl d-flex align-center justify-space-between flex-wrap gap-4" style="background-color: #E6F0EB;">
      <div class="d-flex align-center gap-4">
        <v-avatar color="primary" size="48">
          <v-icon color="secondary" size="24">mdi-shield-lock-outline</v-icon>
        </v-avatar>
        <div>
          <div class="text-subtitle-1 font-weight-bold text-primary lh-1 mb-1">La seguridad de tu información es nuestra prioridad</div>
          <div class="text-caption text-primary">Tus datos están protegidos con los más altos estándares de seguridad y confidencialidad.</div>
        </div>
      </div>
      <div class="d-flex gap-4">
        <a href="#" class="text-primary text-caption text-decoration-none font-weight-bold hover-underline">Política de privacidad</a>
        <span class="text-primary opacity-50">|</span>
        <a href="#" class="text-primary text-caption text-decoration-none font-weight-bold hover-underline">Términos y condiciones</a>
      </div>
    </v-card>
    <div class="mb-10"></div> <!-- Espaciador final -->
  </LayoutPrincipal>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LayoutPrincipal from '../../layouts/LayoutPrincipal.vue'

// Columnas para la tabla de parámetros
const columnasParametros = [
  { title: 'Parámetro', key: 'nombre', sortable: false },
  { title: 'Resultado', key: 'resultado', sortable: false },
  { title: 'Valores de referencia', key: 'referencia', sortable: false },
  { title: 'Estado', key: 'estado', align: 'center', sortable: false },
]

// Mock Data idéntica a la imagen
const listaExamenes = ref([
  {
    id: 1,
    titulo: 'Hemograma completo',
    laboratorio: 'Laboratorio Clínico Central',
    fecha: '2024-05-20',
    hora: '08:45',
    icono: 'mdi-test-tube',
    estado: 'Completado',
    categoria: 'Laboratorio',
    medico: 'Dra. Laura Martínez',
    resultadoGlobal: 'Normal',
    mensajeResumen: 'Tus resultados se encuentran dentro de los valores de referencia establecidos.',
    parametros: [
      { nombre: 'Leucocitos', resultado: '7.250 /mm³', referencia: '4.000 - 10.000', estado: 'normal' },
      { nombre: 'Eritrocitos', resultado: '4.85 mill/mm³', referencia: '4.20 - 5.40', estado: 'normal' },
      { nombre: 'Hemoglobina', resultado: '14.2 g/dL', referencia: '13.0 - 17.0', estado: 'normal' },
      { nombre: 'Hematocrito', resultado: '42.1 %', referencia: '40.0 - 50.0', estado: 'normal' },
      { nombre: 'Plaquetas', resultado: '256.000 /mm³', referencia: '150.000 - 450.000', estado: 'normal' }
    ]
  },
  {
    id: 2,
    titulo: 'Perfil lipídico',
    laboratorio: 'Laboratorio Clínico Central',
    fecha: '2024-05-15',
    hora: '07:30',
    icono: 'mdi-microscope',
    estado: 'Completado',
    categoria: 'Laboratorio',
    medico: 'Dr. Andrés Gómez',
    resultadoGlobal: 'Normal',
    mensajeResumen: 'Valores normales. Mantén una dieta saludable.',
    parametros: [
      { nombre: 'Colesterol Total', resultado: '185 mg/dL', referencia: '< 200', estado: 'normal' },
      { nombre: 'Triglicéridos', resultado: '120 mg/dL', referencia: '< 150', estado: 'normal' },
    ]
  },
  {
    id: 3,
    titulo: 'Glucosa en ayunas',
    laboratorio: 'Laboratorio Clínico Central',
    fecha: '2024-05-10',
    hora: '07:15',
    icono: 'mdi-water-outline',
    estado: 'Completado',
    categoria: 'Laboratorio',
    medico: 'Dra. Laura Martínez',
    resultadoGlobal: 'Atención',
    mensajeResumen: 'El valor se encuentra ligeramente elevado.',
    parametros: [
      { nombre: 'Glucosa basal', resultado: '105 mg/dL', referencia: '70 - 100', estado: 'alerta' }
    ]
  },
  {
    id: 4,
    titulo: 'Radiografía de tórax',
    laboratorio: 'Centro de Imágenes Médicas',
    fecha: '2024-05-05',
    hora: '09:00',
    icono: 'mdi-image-outline',
    estado: 'Completado',
    categoria: 'Imágenes',
    medico: 'Dr. Carlos Rojas',
    resultadoGlobal: 'Normal',
    mensajeResumen: 'No se observan anomalías pleuropulmonares.',
    parametros: null
  },
  {
    id: 5,
    titulo: 'Electrocardiograma',
    laboratorio: 'Cardiología del Valle',
    fecha: '2024-05-02',
    hora: '10:30',
    icono: 'mdi-heart-pulse',
    estado: 'Completado',
    categoria: 'Examen Físico',
    medico: 'Dra. Ana Torres',
    resultadoGlobal: 'Normal',
    mensajeResumen: 'Ritmo sinusal normal. Eje normal.',
    parametros: null
  }
])

const examenSeleccionado = ref(null)

function seleccionarExamen(examen) {
  examenSeleccionado.value = examen
}

function formatearFecha(fechaStr) {
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  const partes = fechaStr.split('-') // "2024-05-20"
  if (partes.length !== 3) return fechaStr
  const dia = parseInt(partes[2], 10)
  const mes = meses[parseInt(partes[1], 10) - 1]
  const anio = partes[0]
  return `${dia} de ${mes} de ${anio}`
}

function colorDot(estado) {
  return estado === 'normal' ? 'secondary' : 'warning'
}

onMounted(() => {
  if (listaExamenes.value.length > 0) {
    seleccionarExamen(listaExamenes.value[0])
  }
})
</script>

<style scoped>
.border {
  border: 1px solid #EAECEF !important;
}

.border-b {
  border-bottom: 1px solid #EAECEF !important;
}

.border-b-light {
  border-bottom: 1px solid rgba(0,0,0,0.05) !important;
}

.lh-1 {
  line-height: 1.1 !important;
}

.hover-text-primary:hover {
  color: rgb(var(--v-theme-primary)) !important;
}

.hover-underline:hover {
  text-decoration: underline !important;
}

.examen-card {
  transition: all 0.2s;
  background-color: #ffffff;
}

.examen-card:hover {
  border-color: rgba(var(--v-theme-secondary), 0.5) !important;
}

.active-card {
  border-color: rgba(var(--v-theme-secondary), 0.5) !important;
  border-left: 6px solid rgb(var(--v-theme-secondary)) !important;
  background-color: rgba(var(--v-theme-secondary), 0.05);
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

/* Ajustes de select y text-field transparentes */
.v-field__overlay {
  background-color: transparent !important;
}
</style>
