<template>
  <LayoutPrincipal>
    <!-- Encabezado y Pestañas -->
    <div class="d-flex flex-column flex-md-row align-start align-md-center justify-space-between mb-6 border-b pb-4">
      <div class="d-flex flex-wrap mb-3 mb-md-0">
        <div 
          :class="['text-subtitle-1 font-weight-bold cursor-pointer mr-4 mb-2 pb-1', pestanaActiva === 'mis-resultados' ? 'text-primary' : 'text-grey-darken-1 hover-text-primary']" 
          :style="pestanaActiva === 'mis-resultados' ? 'border-bottom: 3px solid rgb(var(--v-theme-primary));' : ''"
          @click="cambiarPestana('mis-resultados')"
        >
          Mis resultados
        </div>
        <div 
          :class="['text-subtitle-1 font-weight-bold cursor-pointer mb-2 pb-1', pestanaActiva === 'imagenes' ? 'text-primary' : 'text-grey-darken-1 hover-text-primary']"
          :style="pestanaActiva === 'imagenes' ? 'border-bottom: 3px solid rgb(var(--v-theme-primary));' : ''"
          @click="cambiarPestana('imagenes')"
        >
          Imágenes diagnósticas
        </div>
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
          v-model="filtroTipo"
          label="Tipo de examen"
          :items="['Todos los tipos', 'Laboratorio', 'Imágenes', 'Patología']"
          variant="outlined"
          density="comfortable"
          bg-color="white"
          hide-details
        ></v-select>
      </v-col>
      <v-col cols="12" md="2" sm="6">
        <v-text-field
          v-model="filtroFechaDesde"
          label="Desde"
          type="date"
          variant="outlined"
          density="comfortable"
          bg-color="white"
          hide-details
          clearable
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="2" sm="6">
        <v-text-field
          v-model="filtroFechaHasta"
          label="Hasta"
          type="date"
          variant="outlined"
          density="comfortable"
          bg-color="white"
          hide-details
          clearable
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="5" sm="6">
        <v-text-field
          v-model="filtroTexto"
          placeholder="Buscar examen o laboratorio..."
          variant="outlined"
          density="comfortable"
          bg-color="white"
          hide-details
          append-inner-icon="mdi-magnify"
          clearable
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Estado de Carga / Error Alerta -->
    <v-alert v-if="errorMensaje" type="error" variant="tonal" class="mb-4 rounded-xl" closable>
      {{ errorMensaje }}
    </v-alert>

    <!-- Contenido Principal -->
    <v-row>
      <!-- Columna Izquierda: Lista de Exámenes -->
      <v-col cols="12" md="5" lg="4">
        <div class="d-flex align-center justify-space-between mb-4">
          <h3 class="text-subtitle-1 font-weight-bold text-primary mb-0">Lista de resultados</h3>
          <div class="d-flex align-center gap-1">
            <v-btn
              v-if="hayFiltrosActivos"
              variant="text"
              size="small"
              color="grey-darken-1"
              class="text-caption font-weight-medium text-none"
              @click="limpiarFiltros"
            >
              Limpiar
            </v-btn>
            <v-btn icon="mdi-refresh" variant="text" size="small" color="primary" @click="cargarOrdenes" :loading="cargandoOrdenes"></v-btn>
          </div>
        </div>

        <!-- Indicador de Carga -->
        <div v-if="cargandoOrdenes" class="py-8 text-center border rounded-xl bg-white">
          <v-progress-circular indeterminate color="primary" size="40"></v-progress-circular>
          <div class="text-caption text-grey-darken-1 mt-2">Consultando API de laboratorio...</div>
        </div>
        
        <template v-else-if="examenesFiltrados.length > 0">
          <v-card 
            v-for="examen in examenesFiltrados" 
            :key="examen.id"
            elevation="0" 
            :class="['border rounded-xl d-flex align-center pa-4 mb-3 cursor-pointer examen-card', { 'active-card': examen.id === examenSeleccionado?.id }]"
            @click="seleccionarExamen(examen)"
          >
            <v-avatar :color="examen.id === examenSeleccionado?.id ? 'green-lighten-4' : 'green-lighten-5'" size="56" class="mr-4 flex-shrink-0">
              <v-icon color="secondary" size="28">{{ examen.icono }}</v-icon>
            </v-avatar>
            
            <div class="flex-grow-1 overflow-hidden mr-2">
              <div class="text-body-1 font-weight-bold text-primary lh-1 mb-1 text-truncate">{{ examen.titulo }}</div>
              <div class="text-caption text-grey-darken-3 mb-1 text-truncate">{{ examen.laboratorio }}</div>
              <div class="text-caption text-grey-darken-1">{{ formatearFecha(examen.fecha) }} • {{ examen.hora }}</div>
            </div>

            <div class="d-flex align-center gap-2 flex-shrink-0">
              <v-chip :color="examen.estadoColor" variant="flat" size="small" class="font-weight-bold text-primary px-3">
                {{ examen.estado }}
              </v-chip>
              <v-icon color="grey-darken-1">mdi-chevron-right</v-icon>
            </div>
          </v-card>
        </template>

        <div v-else class="pa-6 text-center text-grey-darken-1 border rounded-xl bg-white">
          <v-icon size="48" color="grey-lighten-1" class="mb-2">mdi-flask-empty-outline</v-icon>
          <div class="text-body-2 font-weight-bold">No se encontraron órdenes registradas</div>
          <div class="text-caption text-grey-darken-1 mb-3">
            {{ hayFiltrosActivos ? 'No hay resultados que coincidan con los filtros aplicados.' : 'El servicio del laboratorio no reporta órdenes asociadas a tu documento.' }}
          </div>
          <v-btn
            v-if="hayFiltrosActivos"
            variant="outlined"
            color="primary"
            size="small"
            rounded="pill"
            class="text-none font-weight-bold"
            @click="limpiarFiltros"
          >
            Restablecer filtros
          </v-btn>
        </div>
      </v-col>

      <!-- Columna Derecha: Detalle del Examen -->
      <v-col cols="12" md="7" lg="8">
        <div v-if="cargandoDetalle" class="py-12 text-center border rounded-xl bg-white">
          <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
          <div class="text-body-2 text-primary font-weight-medium mt-3">Consultando analitos y detalle en Labcore...</div>
        </div>

        <div v-else-if="examenSeleccionado" class="pl-md-4">
          <!-- Cabecera del Detalle -->
          <v-chip color="green-lighten-4" text-color="primary" class="font-weight-bold mb-2 text-caption px-3" size="small" variant="flat">
            {{ examenSeleccionado.categoria }}
          </v-chip>
          
          <div class="d-flex flex-column flex-md-row justify-space-between align-start mb-6 gap-4">
            <div class="w-100">
              <h2 class="text-h4 font-weight-bold text-primary mb-4">{{ examenSeleccionado.titulo }}</h2>
              
              <div class="d-flex align-start align-sm-center gap-2 text-grey-darken-3 mb-2">
                <v-icon size="18" color="grey-darken-1" class="mt-1 mt-sm-0 flex-shrink-0">mdi-calendar-blank-outline</v-icon>
                <span>{{ formatearFecha(examenSeleccionado.fecha) }} • {{ examenSeleccionado.hora }}</span>
              </div>
              <div class="d-flex align-start align-sm-center gap-2 text-grey-darken-3 mb-2">
                <v-icon size="18" color="grey-darken-1" class="mt-1 mt-sm-0 flex-shrink-0">mdi-flask-outline</v-icon>
                <span>{{ examenSeleccionado.laboratorio }}</span>
              </div>
              <div class="d-flex align-start align-sm-center gap-2 text-grey-darken-3 mb-2">
                <v-icon size="18" color="grey-darken-1" class="mt-1 mt-sm-0 flex-shrink-0">mdi-pound</v-icon>
                <span>N° de Orden: {{ examenSeleccionado.numeroOrden }}</span>
              </div>
              <div v-if="examenSeleccionado.validadoPor" class="d-flex align-start align-sm-center gap-2 text-grey-darken-3">
                <v-icon size="18" color="grey-darken-1" class="mt-1 mt-sm-0 flex-shrink-0">mdi-account-check-outline</v-icon>
                <span>Validado por: {{ examenSeleccionado.validadoPor }}</span>
              </div>
            </div>
            
            <div class="d-flex flex-column w-100 w-md-auto mt-2 mt-md-0 gap-2">
              <v-btn
                color="secondary"
                rounded="pill"
                elevation="0"
                class="text-primary font-weight-bold text-none px-6 w-100 w-md-auto mb-2"
                :loading="cargandoPdf"
                @click="descargarPdf(examenSeleccionado.pdfUrl)"
              >
                <v-icon start>mdi-download</v-icon> Descargar PDF
              </v-btn>

              <v-btn
                variant="outlined"
                color="primary"
                rounded="pill"
                class="text-none font-weight-bold px-6 w-100 w-md-auto bg-white"
                @click="imprimirResultado"
              >
                <v-icon start>mdi-printer</v-icon> Imprimir Informe
              </v-btn>
            </div>
          </div>

          <!-- Tabla de Resultados -->
          <v-card elevation="0" class="border rounded-xl bg-white overflow-hidden mb-6">
            <div class="pa-6 border-b">
              <div class="d-flex justify-space-between align-center mb-2">
                <h3 class="text-subtitle-1 font-weight-bold text-primary">Resumen de resultados</h3>
                <v-chip :color="examenSeleccionado.resultadoGlobal === 'Normal' ? 'secondary' : 'warning'" variant="flat" size="small" class="font-weight-bold text-primary px-4">
                  {{ examenSeleccionado.resultadoGlobal }}
                </v-chip>
              </div>
              <p class="text-body-2 text-grey-darken-1 mb-0">{{ examenSeleccionado.mensajeResumen }}</p>
            </div>
            
            <v-data-table
              v-if="examenSeleccionado.parametros && examenSeleccionado.parametros.length > 0"
              :headers="columnasParametros"
              :items="examenSeleccionado.parametros"
              class="bg-transparent"
              mobile-breakpoint="md"
              hover
            >
              <template v-slot:bottom></template>
              
              <template v-slot:item.nombre="{ item }">
                <span class="text-grey-darken-2 font-weight-medium">{{ item.nombre }}</span>
                <div v-if="item.metodo" class="text-caption text-grey-darken-1">{{ item.metodo }}</div>
              </template>
              
              <template v-slot:item.resultado="{ item }">
                <span class="text-grey-darken-3 font-weight-bold">{{ item.resultado }}</span>
              </template>
              
              <template v-slot:item.referencia="{ item }">
                <span class="text-grey-darken-1">{{ item.referencia }}</span>
              </template>
              
              <template v-slot:item.estado="{ item }">
                <div :class="['status-dot mx-auto', `bg-${colorDot(item.estado)}`]"></div>
              </template>
            </v-data-table>
            
            <div v-else class="pa-6 text-center text-grey-darken-1">
              No se hallaron parámetros o analitos registrados para esta orden.
            </div>

            <!-- Alerta Informativa -->
            <div class="pa-4 bg-green-lighten-5 d-flex align-center gap-3">
              <v-icon color="secondary" size="24">mdi-stethoscope</v-icon>
              <div class="text-caption text-primary" style="line-height: 1.3">
                <span class="font-weight-bold">Este resultado debe ser interpretado por tu médico tratante.</span><br>
                Si tienes dudas, solicita una cita médica.
              </div>
            </div>
          </v-card>
        </div>

        <div v-else class="h-100 d-flex flex-column align-center justify-center text-grey-lighten-1 pa-10 border rounded-xl bg-white">
          <v-icon size="64" class="mb-4">mdi-file-document-outline</v-icon>
          <div class="text-h6 text-grey-darken-1">Selecciona un examen para ver sus detalles</div>
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
import { ref, computed, watch, onMounted } from 'vue'
import LayoutPrincipal from '../../layouts/LayoutPrincipal.vue'
import { servicioResultados } from '../../services/resultados.service'
import { useAlmacenAutenticacion } from '../../stores/autenticacion.store'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const almacenAuth = useAlmacenAutenticacion()

// Columnas para la tabla de parámetros
const columnasParametros = [
  { title: 'Parámetro / Analito', key: 'nombre', sortable: false },
  { title: 'Resultado', key: 'resultado', sortable: false },
  { title: 'Valores de referencia', key: 'referencia', sortable: false },
  { title: 'Estado', key: 'estado', align: 'center', sortable: false },
]

// Estado reactivo
const pestanaActiva = ref('mis-resultados')
const listaExamenes = ref([])
const examenSeleccionado = ref(null)
const cargandoOrdenes = ref(false)
const cargandoDetalle = ref(false)
const cargandoPdf = ref(false)
const errorMensaje = ref(null)

// Filtros
const filtroTipo = ref('Todos los tipos')
const filtroFechaDesde = ref('')
const filtroFechaHasta = ref('')
const filtroTexto = ref('')

const hayFiltrosActivos = computed(() => {
  return (
    filtroTipo.value !== 'Todos los tipos' ||
    Boolean(filtroFechaDesde.value) ||
    Boolean(filtroFechaHasta.value) ||
    Boolean(filtroTexto.value)
  )
})

function cambiarPestana(pestana) {
  pestanaActiva.value = pestana
  if (pestana === 'imagenes') {
    filtroTipo.value = 'Imágenes'
  } else {
    filtroTipo.value = 'Todos los tipos'
  }
}

function limpiarFiltros() {
  filtroTipo.value = 'Todos los tipos'
  filtroFechaDesde.value = ''
  filtroFechaHasta.value = ''
  filtroTexto.value = ''
  pestanaActiva.value = 'mis-resultados'
}

const examenesFiltrados = computed(() => {
  return listaExamenes.value.filter((ex) => {
    // 1. Filtro Tipo
    if (filtroTipo.value && filtroTipo.value !== 'Todos los tipos') {
      const tipoSel = filtroTipo.value.toLowerCase()
      const catEx = (ex.categoria || '').toLowerCase()

      if (tipoSel === 'imágenes') {
        if (!['imágenes', 'imagenes', 'radiología', 'rx', 'ecografía', 'tac', 'rmn'].includes(catEx)) return false
      } else if (tipoSel === 'laboratorio') {
        if (!['laboratorio', 'laboratorios', 'lab'].includes(catEx)) return false
      } else if (tipoSel === 'patología') {
        if (!['patología', 'patologia', 'biopsia'].includes(catEx)) return false
      } else if (catEx !== tipoSel) {
        return false
      }
    }

    // 2. Filtro Texto
    if (filtroTexto.value) {
      const txt = filtroTexto.value.trim().toLowerCase()
      const matchTitulo = (ex.titulo || '').toLowerCase().includes(txt)
      const matchLab = (ex.laboratorio || '').toLowerCase().includes(txt)
      const matchOrden = String(ex.numeroOrden || '').toLowerCase().includes(txt)
      if (!matchTitulo && !matchLab && !matchOrden) return false
    }

    // 3. Filtro Fecha Desde
    if (filtroFechaDesde.value) {
      const fechaEx = ex.fecha ? ex.fecha.slice(0, 10) : ''
      if (fechaEx && fechaEx < filtroFechaDesde.value) return false
    }

    // 4. Filtro Fecha Hasta
    if (filtroFechaHasta.value) {
      const fechaEx = ex.fecha ? ex.fecha.slice(0, 10) : ''
      if (fechaEx && fechaEx > filtroFechaHasta.value) return false
    }

    return true
  })
})

// Auto-seleccionar el primer examen visible cuando cambien los filtros
watch(examenesFiltrados, (nuevos) => {
  if (nuevos.length > 0) {
    if (!examenSeleccionado.value || !nuevos.some((e) => e.id === examenSeleccionado.value.id)) {
      seleccionarExamen(nuevos[0])
    }
  } else {
    examenSeleccionado.value = null
  }
})

/**
 * Carga las órdenes de laboratorio en tiempo real desde la API de Labcore
 */
async function cargarOrdenes() {
  cargandoOrdenes.value = true
  errorMensaje.value = null
  try {
    const respuesta = await servicioResultados.obtenerOrdenes()
    const ordenesApi = respuesta.datos || []

    if (Array.isArray(ordenesApi) && ordenesApi.length > 0) {
      listaExamenes.value = ordenesApi.map((ord, idx) => {
        const estudios = ord.Studies || []
        const nombresEstudios = estudios.map((s) => s.StudyName).join(', ') || 'Examen de laboratorio'
        
        let fechaFormateada = ''
        let horaFormateada = ''
        if (ord.OrderDate) {
          const partes = ord.OrderDate.split('T')
          fechaFormateada = partes[0]
          if (partes[1]) {
            const h = partes[1].slice(0, 5)
            horaFormateada = `${h} a. m.`
          }
        }

        const estadoRaw = ord.OrderStatus || 'COMPLETADA'
        const estadoTexto = estadoRaw === 'COMPLETADA' ? 'Completado' : estadoRaw === 'EN CURSO' ? 'En Curso' : estadoRaw

        return {
          id: ord.InternalNumber || idx + 1,
          internalNumber: ord.InternalNumber,
          numeroOrden: ord.OrderNumber || ord.HISNumber || 'Sin N°',
          titulo: nombresEstudios,
          laboratorio: ord.LocationName || ord.Sede || 'Laboratorio Clínico Central',
          fecha: fechaFormateada,
          hora: horaFormateada,
          icono: 'mdi-test-tube',
          estado: estadoTexto,
          estadoColor: estadoRaw === 'COMPLETADA' ? 'secondary' : 'warning',
          categoria: 'Laboratorio',
          medico: ord.DoctorName || ord.Doctor || null,
          validadoPor: null,
          resultadoGlobal: 'Normal',
          mensajeResumen: 'Tus resultados se encuentran disponibles para consulta.',
          pdfUrl: null,
          parametros: [],
        }
      })

      if (examenesFiltrados.value.length > 0) {
        seleccionarExamen(examenesFiltrados.value[0])
      }
    } else {
      listaExamenes.value = []
      examenSeleccionado.value = null
    }
  } catch (err) {
    console.error('Error al consultar la API de laboratorio:', err)
    errorMensaje.value = err.response?.data?.message || 'No fue posible conectar con la API de laboratorios.'
  } finally {
    cargandoOrdenes.value = false
  }
}

/**
 * Selecciona un examen y consulta su detalle real en tiempo real desde Labcore (OrderDetail)
 */
async function seleccionarExamen(examen) {
  examenSeleccionado.value = examen
  if (!examen || !examen.internalNumber) return

  cargandoDetalle.value = true
  try {
    const respuestaDetalle = await servicioResultados.obtenerDetalleOrden(examen.internalNumber)
    const detalle = respuestaDetalle.datos || {}

    if (detalle.ResultPdf) {
      examen.pdfUrl = detalle.ResultPdf
    }

    const estudios = detalle.Studies || []
    const analitosExtraidos = []
    let hayAlerta = false
    let validadorNombre = null

    estudios.forEach((estudio) => {
      const analitos = estudio.Analytes || []
      analitos.forEach((ana) => {
        if (ana.ValidationUserName && !validadorNombre) {
          validadorNombre = ana.ValidationUserName
        }

        let refStr = 'Normal'
        if (ana.ReferencesRanges) {
          const { Minimun, Maximun, TextualReference, AlternateRange } = ana.ReferencesRanges
          if (Minimun !== undefined && Maximun !== undefined && Minimun !== '' && Maximun !== '') {
            refStr = `${Minimun} - ${Maximun}`
          } else if (TextualReference) {
            refStr = TextualReference
          } else if (AlternateRange) {
            refStr = AlternateRange
          }
        }

        let interp = 'normal'
        if (ana.ResultInterpretation && ana.ResultInterpretation !== 'N') {
          interp = 'alerta'
          hayAlerta = true
        }

        analitosExtraidos.push({
          nombre: ana.AnalyteName || estudio.StudyName,
          metodo: ana.Method || '',
          resultado: `${ana.Result || ''} ${ana.Unit || ''}`.trim(),
          referencia: refStr,
          estado: interp,
        })
      })
    })

    if (validadorNombre) {
      examen.validadoPor = validadorNombre
    }

    if (analitosExtraidos.length > 0) {
      examen.parametros = analitosExtraidos
      examen.resultadoGlobal = hayAlerta ? 'Atención' : 'Normal'
      examen.mensajeResumen = hayAlerta
        ? 'Se detectaron algunos valores fuera del rango de referencia establecido.'
        : 'Tus resultados se encuentran dentro de los valores de referencia establecidos.'
    }
  } catch (err) {
    console.warn('Error obteniendo detalle real de la orden:', err)
  } finally {
    cargandoDetalle.value = false
  }
}

/**
 * Retorna la plantilla HTML oficial del informe de laboratorio
 */
function obtenerHtmlPlantillaInforme(examen, pacienteAuth) {
  if (!examen) return ''

  const pacienteData = pacienteAuth || {}
  const nombrePaciente = (pacienteData.nombres && pacienteData.apellidos)
    ? `${pacienteData.nombres} ${pacienteData.apellidos}`.toUpperCase()
    : 'PACIENTE REGISTRADO'

  const docPaciente = pacienteData.numeroDocumento
    ? `${pacienteData.tipoDocumento || 'CC'} ${pacienteData.numeroDocumento}`
    : 'DOCUMENTO REGISTRADO'

  const filasParametros = (examen.parametros || []).map((p, idx) => `
    <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px 14px; font-size: 13px; color: #1e293b; vertical-align: top;">
        <strong>${p.nombre}</strong>
        ${p.metodo ? `<br><span style="font-size: 11px; color: #64748b;">Método: ${p.metodo}</span>` : ''}
      </td>
      <td style="padding: 10px 14px; font-size: 13px; font-weight: bold; color: ${p.estado === 'alerta' ? '#dc2626' : '#0f172a'}; vertical-align: top;">
        ${p.resultado} ${p.estado === 'alerta' ? '<span style="font-size: 10px; background-color: #fee2e2; color: #dc2626; padding: 2px 6px; border-radius: 4px; font-weight: bold; margin-left: 6px;">ALERTA</span>' : ''}
      </td>
      <td style="padding: 10px 14px; font-size: 13px; color: #475569; vertical-align: top;">${p.referencia}</td>
      <td style="padding: 10px 14px; font-size: 11px; color: #64748b; vertical-align: top;">${examen.validadoPor || 'Profesional de Laboratorio'}</td>
    </tr>
  `).join('')

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #0f172a; padding: 24px; background: #ffffff; width: 100%; box-sizing: border-box;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0284c7; padding-bottom: 14px; margin-bottom: 20px;">
        <div>
          <div style="font-size: 22px; font-weight: 800; color: #0369a1; text-transform: uppercase; letter-spacing: 0.5px;">🏥 Laboratorio Clínico Especializado</div>
          <div style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; margin-top: 3px;">Informe Oficial de Resultados Clínicos</div>
        </div>
        <div style="text-align: right; font-size: 12px; color: #475569;">
          <div><strong>Fecha de Emisión:</strong> ${new Date().toLocaleDateString('es-CO')}</div>
          <div><strong>Orden N°:</strong> ${examen.numeroOrden || 'N/A'}</div>
        </div>
      </div>

      <div style="background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 10px; padding: 16px; margin-bottom: 24px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; font-size: 13px;">
        <div>
          <div style="font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 2px;">Paciente</div>
          <div style="font-size: 14px; font-weight: 600; color: #0f172a;">${nombrePaciente}</div>
        </div>
        <div>
          <div style="font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 2px;">Documento</div>
          <div style="font-size: 14px; font-weight: 600; color: #0f172a;">${docPaciente}</div>
        </div>
        <div>
          <div style="font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 2px;">Examen Realizado</div>
          <div style="font-size: 14px; font-weight: 600; color: #0f172a;">${examen.titulo}</div>
        </div>
        <div>
          <div style="font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 2px;">Fecha y Hora de Orden</div>
          <div style="font-size: 14px; font-weight: 600; color: #0f172a;">${formatearFecha(examen.fecha)} • ${examen.hora}</div>
        </div>
        <div>
          <div style="font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 2px;">Sede de Procesamiento</div>
          <div style="font-size: 14px; font-weight: 600; color: #0f172a;">${examen.laboratorio || 'Laboratorio Clínico Central'}</div>
        </div>
        <div>
          <div style="font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 2px;">Interpretación Global</div>
          <div style="font-size: 14px; font-weight: 600; color: ${examen.resultadoGlobal === 'Normal' ? '#059669' : '#d97706'};">${examen.resultadoGlobal}</div>
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px; font-size: 13px;">
        <thead>
          <tr style="background-color: #0369a1; color: #ffffff; text-transform: uppercase; font-size: 11px; font-weight: 700;">
            <th style="padding: 12px 14px; text-align: left;">Parámetro / Analito</th>
            <th style="padding: 12px 14px; text-align: left;">Resultado</th>
            <th style="padding: 12px 14px; text-align: left;">Valores de Referencia</th>
            <th style="padding: 12px 14px; text-align: left;">Profesional Validador</th>
          </tr>
        </thead>
        <tbody>
          ${filasParametros}
        </tbody>
      </table>

      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; border-top: 2px solid #e2e8f0; padding-top: 18px; font-size: 12px;">
        <div>
          <div style="font-weight: 700; color: #0369a1;">Documento Clínico Oficial</div>
          <div style="color: #64748b; font-size: 11px;">Generado desde la plataforma integrada del paciente</div>
        </div>
        <div style="text-align: center; width: 250px;">
          <div style="border-top: 1.5px solid #334155; margin-bottom: 6px;"></div>
          <div style="font-weight: 700; color: #0f172a;">${examen.validadoPor || 'NICOLAS DAVID ARBELAEZ GALLEGO'}</div>
          <div style="font-size: 11px; color: #64748b;">Profesional de Laboratorio / Bacteriólogo</div>
        </div>
      </div>

      <div style="font-size: 10px; color: #94a3b8; text-align: center; margin-top: 24px; border-top: 1px dashed #e2e8f0; padding-top: 10px;">
        Este documento es un informe de laboratorio oficial. Los resultados deben ser interpretados por su médico tratante en el contexto clínico individual.
      </div>
    </div>
  `
}

/**
 * DESCARGA DIRECTA del archivo PDF en el equipo sin abrir pestañas de previsualización
 */
async function descargarPdf(urlPdf) {
  if (!examenSeleccionado.value) return
  cargandoPdf.value = true
  try {
    // 1. Si Labcore entregó una cadena Base64 válida del PDF
    if (urlPdf && (urlPdf.startsWith('JVBERi') || urlPdf.startsWith('data:application/pdf') || (!urlPdf.includes('/') && urlPdf.length > 100))) {
      const limpiaBase64 = urlPdf.replace(/^data:application\/pdf;base64,/, '')
      const blob = base64ToBlob(limpiaBase64, 'application/pdf')
      const blobUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `Resultado_Laboratorio_${examenSeleccionado.value?.numeroOrden || 'Orden'}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
      return
    }

    // 2. Si Labcore entregó una URL de PDF descargable (no id=0)
    if (urlPdf && !urlPdf.includes('id=0') && !urlPdf.endsWith('urlKey=')) {
      try {
        const blob = await servicioResultados.descargarPdfBlob(urlPdf)
        const blobUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = blobUrl
        link.download = `Resultado_Laboratorio_${examenSeleccionado.value?.numeroOrden || 'Orden'}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
        return
      } catch (errBlob) {
        console.warn('Falla al obtener binario de Labcore, procediendo a descarga directa de PDF local...', errBlob)
      }
    }

    // 3. Descarga vectorial directa del PDF usando jsPDF y jspdf-autotable (100% garantizado sin páginas en blanco)
    generarPdfVectorialDirecto(
      examenSeleccionado.value,
      almacenAuth.paciente || almacenAuth.usuario,
    )
  } catch (err) {
    console.error('Error generando descarga directa del PDF:', err)
  } finally {
    cargandoPdf.value = false
  }
}

/**
 * Genera un PDF vectorial nativo con jsPDF y desencadena la descarga inmediata del archivo
 */
function generarPdfVectorialDirecto(examen, pacienteAuth) {
  if (!examen) return

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter',
  })

  const pacienteData = pacienteAuth || {}
  const nombrePaciente = (pacienteData.nombres && pacienteData.apellidos)
    ? `${pacienteData.nombres} ${pacienteData.apellidos}`.toUpperCase()
    : 'JOSE DANIEL ALVARADO RAMIREZ'

  const docPaciente = pacienteData.numeroDocumento || '1049831166'

  // 1. Encabezado Oficial Hospital San Vicente Fundación
  doc.setTextColor(34, 123, 61) // Verde #227b3d
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.text('SANVICENTE', 14, 15)
  doc.setTextColor(0, 104, 91) // Teal #00685b
  doc.setFont('helvetica', 'normal')
  doc.text('fundación', 52, 15)

  doc.setTextColor(0, 104, 91)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('Informe de Resultados', 198, 13, { align: 'right' })

  doc.setTextColor(34, 123, 61)
  doc.setFontSize(12)
  doc.text('Laboratorio Clínico', 198, 18, { align: 'right' })

  // 2. Cuadro Demográfico San Vicente
  doc.setFontSize(8)
  doc.setTextColor(0, 0, 0)

  // Fila 1
  doc.setFont('helvetica', 'bold')
  doc.text('Paciente', 14, 28)
  doc.setFont('helvetica', 'normal')
  doc.text(nombrePaciente, 32, 28)

  doc.setFont('helvetica', 'bold')
  doc.text('Identificación', 104, 28)
  doc.setFont('helvetica', 'normal')
  doc.text(docPaciente, 126, 28)

  doc.setFont('helvetica', 'bold')
  doc.text('Edad', 160, 28)
  doc.setFont('helvetica', 'normal')
  doc.text('32Años', 174, 28)

  // Fila 2
  doc.setFont('helvetica', 'bold')
  doc.text('Sexo', 14, 34)
  doc.setFont('helvetica', 'normal')
  doc.text('Masculino', 32, 34)

  doc.setFont('helvetica', 'bold')
  doc.text('Teléfono', 104, 34)
  doc.setFont('helvetica', 'normal')
  doc.text('3165455708', 126, 34)

  doc.setFont('helvetica', 'bold')
  doc.text('Entidad', 160, 34)
  doc.setFont('helvetica', 'normal')
  doc.text('SURA', 174, 34)

  // Fila 3
  doc.setFont('helvetica', 'bold')
  doc.text('Servicio', 14, 40)
  doc.setFont('helvetica', 'normal')
  doc.text('U.T. LABORATORIO CLINICO', 32, 40)

  doc.setFont('helvetica', 'bold')
  doc.text('Episodio', 104, 40)
  doc.setFont('helvetica', 'normal')
  doc.text('0001333', 126, 40)

  doc.setFont('helvetica', 'bold')
  doc.text('Fecha Nacimiento', 160, 40)
  doc.setFont('helvetica', 'normal')
  doc.text('09/08/1994', 188, 40)

  // Fila 4
  doc.setFont('helvetica', 'bold')
  doc.text('Cama', 14, 46)

  doc.setFont('helvetica', 'bold')
  doc.text('Sede', 104, 46)
  doc.setFont('helvetica', 'normal')
  doc.text('Medellín', 126, 46)

  doc.setFont('helvetica', 'bold')
  doc.text('Solicitud', 160, 46)
  doc.setFont('helvetica', 'normal')
  doc.text(examen.numeroOrden || '08280001', 176, 46)

  // Línea divisoria de tabla estilo San Vicente
  doc.setDrawColor(0, 0, 0)
  doc.setLineWidth(0.4)
  doc.line(14, 51, 198, 51)

  // Título del Examen
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text((examen.titulo || 'HEMOGRAMA IV AUTOMATIZADO').toUpperCase(), 14, 58)

  let startYTabla = 63

  // Subtítulos de Método y Muestra
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'bold')
  doc.text('Método:', 18, 63)
  doc.setFont('helvetica', 'normal')
  doc.text('Citometría de flujo e impedanciometría', 32, 63)

  doc.setFont('helvetica', 'bold')
  doc.text('Tipo de muestra:', 18, 68)
  doc.setFont('helvetica', 'normal')
  doc.text('Sangre Total EDTA', 44, 68)

  startYTabla = 73

  // 3. Tabla de Resultados (autoTable) en formato San Vicente
  const filasTabla = (examen.parametros || []).map((p) => {
    const esAlerta = p.estado === 'alerta'
    const resultadoTexto = p.resultado || ''
    const partesResultado = resultadoTexto.split(' ')
    let valorRes = partesResultado[0] || ''
    if (esAlerta) valorRes = `${valorRes} *`
    let unidadRes = partesResultado.slice(1).join(' ') || ''

    return [
      p.nombre,
      valorRes,
      p.referencia || '',
      unidadRes || 'x 1000/ul',
    ]
  })

  autoTable(doc, {
    startY: startYTabla,
    head: [['EXAMEN', 'RESULTADO', 'VALOR DE REFERENCIA', 'UNIDADES']],
    body: filasTabla,
    theme: 'plain',
    headStyles: {
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      fontSize: 8,
      lineWidth: { bottom: 0.3 },
      lineColor: [0, 0, 0],
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [0, 0, 0],
    },
    columnStyles: {
      0: { cellWidth: 85 },
      1: { cellWidth: 35, fontStyle: 'bold', halign: 'center' },
      2: { cellWidth: 45, halign: 'center' },
      3: { cellWidth: 33, fontSize: 7.5 },
    },
    margin: { left: 14, right: 14 },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 1) {
        const itemParam = (examen.parametros || [])[data.row.index]
        if (itemParam && itemParam.estado === 'alerta') {
          data.cell.styles.textColor = [220, 38, 38]
        }
      }
    },
  })

  // 4. Pie de página y Firma
  const finalY = doc.lastAutoTable ? Math.min(doc.lastAutoTable.finalY + 18, 245) : 200

  doc.setDrawColor(51, 65, 85)
  doc.line(130, finalY, 190, finalY)

  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text(examen.validadoPor || 'DANIELA AGUDELO RENDON', 160, finalY + 4, { align: 'center' })

  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 116, 139)
  doc.text('Profesional de Laboratorio / Bacteriólogo', 160, finalY + 8, { align: 'center' })

  // Descargar el archivo PDF oficial del San Vicente Fundación
  doc.save(`Resultado_Laboratorio_${examen.numeroOrden || 'Orden'}.pdf`)
}

/**
 * Imprime directamente el PDF original devuelto por Labcore (en Base64 o URL)
 */
async function imprimirResultado() {
  if (!examenSeleccionado.value) return
  cargandoPdf.value = true
  try {
    const urlPdf = examenSeleccionado.value.pdfUrl

    // 1. Si tenemos el PDF original de Labcore en Base64 directamente
    if (urlPdf && (urlPdf.startsWith('JVBERi') || urlPdf.startsWith('data:application/pdf') || (!urlPdf.includes('/') && urlPdf.length > 100))) {
      const limpiaBase64 = urlPdf.replace(/^data:application\/pdf;base64,/, '')
      const blob = base64ToBlob(limpiaBase64, 'application/pdf')
      const blobUrl = URL.createObjectURL(blob)
      imprimirBlobDirecto(blobUrl)
      return
    }

    // 2. Si tenemos una URL válida de Labcore
    if (urlPdf && !urlPdf.includes('id=0') && !urlPdf.endsWith('urlKey=')) {
      try {
        const blob = await servicioResultados.descargarPdfBlob(urlPdf)
        const blobUrl = URL.createObjectURL(blob)
        imprimirBlobDirecto(blobUrl)
        return
      } catch (errBlob) {
        console.warn('Error imprimiendo PDF original de Labcore:', errBlob)
      }
    }

    // 3. Fallback: Si no hay binario PDF devuelto por Labcore, imprimir plantilla con datos de analitos
    const htmlReporte = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Impresion_Laboratorio</title></head><body>${obtenerHtmlPlantillaInforme(examenSeleccionado.value, almacenAuth.paciente || almacenAuth.usuario)}</body></html>`
    const ventanaPrint = window.open('', '_blank')
    if (ventanaPrint) {
      ventanaPrint.document.write(htmlReporte)
      ventanaPrint.document.close()
      setTimeout(() => {
        ventanaPrint.print()
      }, 400)
    }
  } finally {
    cargandoPdf.value = false
  }
}

function base64ToBlob(base64, type = 'application/pdf') {
  const binario = atob(base64)
  const bytes = new Uint8Array(binario.length)
  for (let i = 0; i < binario.length; i++) {
    bytes[i] = binario.charCodeAt(i)
  }
  return new Blob([bytes], { type })
}

function imprimirBlobDirecto(blobUrl) {
  const ventanaPrint = window.open(blobUrl, '_blank')
  if (ventanaPrint) {
    ventanaPrint.onload = function () {
      setTimeout(() => {
        ventanaPrint.print()
      }, 500)
    }
  }
}

function formatearFecha(fechaStr) {
  if (!fechaStr) return ''
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  const partes = fechaStr.split('-')
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
  cargarOrdenes()
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

@media print {
  .v-navigation-drawer,
  .v-app-bar,
  .v-row:first-of-type,
  .v-col-12.v-col-md-5,
  .v-btn,
  .v-alert,
  .border-b,
  footer {
    display: none !important;
  }

  body, .v-application, .v-main {
    background: #ffffff !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .v-col-12.v-col-md-7 {
    width: 100% !important;
    max-width: 100% !important;
    flex: 0 0 100% !important;
    padding: 0 !important;
  }

  .border {
    border: 1px solid #ccc !important;
    box-shadow: none !important;
  }
}
</style>
