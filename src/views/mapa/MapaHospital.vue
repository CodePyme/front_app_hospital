<template>
  <LayoutPrincipal>
    <div class="mapa-waze-contenedor" :class="{ 'modo-pantalla-completa': enModoNavegacion }">
      
      <!-- CONTENEDOR PRINCIPAL DEL MAPA (Ocupa la pantalla completa en celular) -->
      <div class="mapa-viewport-wrapper elevation-3 position-relative overflow-hidden">
        
        <!-- ============================================================== -->
        <!-- CAPA FLOTANTE SUPERIOR: CUANDO NO ESTÁ NAVEGANDO -->
        <!-- ============================================================== -->
        <div v-if="!enModoNavegacion" class="capa-superior-flotante">
          <!-- Barra de Búsqueda Rápida Estilo Google Maps -->
          <div class="barra-busqueda-card elevation-3 mb-2">
            <v-text-field
              v-model="terminoBusqueda"
              placeholder="¿A qué consultorio o sala vas? (ej: Pediatría, Urgencias, Rayos X)"
              prepend-inner-icon="mdi-magnify"
              clearable
              density="compact"
              variant="plain"
              hide-details
              class="buscador-input"
              @update:model-value="alBuscar"
              @click:clear="limpiarBusqueda"
            >
              <template v-slot:append-inner>
                <v-btn
                  icon
                  size="x-small"
                  :color="gpsActivo ? 'success' : 'grey-darken-1'"
                  variant="text"
                  :title="gpsActivo ? 'GPS en Vivo Activo' : 'Activar GPS'"
                  @click="solicitarUbicacionGps"
                >
                  <v-icon size="20">{{ gpsActivo ? 'mdi-crosshairs-gps' : 'mdi-crosshairs' }}</v-icon>
                </v-btn>
              </template>
            </v-text-field>

            <!-- Dropdown con resultados de búsqueda -->
            <v-card
              v-if="resultadosBusqueda.length > 0"
              class="resultados-dropdown elevation-8 rounded-b-xl border-t mt-1"
            >
              <v-list density="compact" class="py-1">
                <v-list-item
                  v-for="(res, index) in resultadosBusqueda"
                  :key="index"
                  :title="res.titulo"
                  :subtitle="res.subtitulo"
                  :prepend-icon="res.icono"
                  rounded="lg"
                  class="px-3"
                  @click="seleccionarResultadoBusqueda(res)"
                >
                  <template v-slot:append>
                    <v-btn
                      size="x-small"
                      color="primary"
                      variant="flat"
                      rounded="pill"
                      class="text-none font-weight-bold"
                    >
                      Guiarme
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>
          </div>

          <!-- Fila de Chips de Categorías (Texto Completo, NUNCA Cortado) -->
          <div class="chips-scroll-horizontal pb-1">
            <v-chip
              v-for="cat in categoriasFiltro"
              :key="cat.id"
              :color="categoriaActiva === cat.id ? 'primary' : undefined"
              :variant="categoriaActiva === cat.id ? 'flat' : 'outlined'"
              size="small"
              class="chip-categoria font-weight-bold"
              :class="{
                'chip-inactivo': categoriaActiva !== cat.id,
                'chip-activo elevation-2': categoriaActiva === cat.id
              }"
              @click="filtrarPorCategoria(cat.id)"
            >
              {{ cat.label }}
            </v-chip>
          </div>
        </div>

        <!-- ============================================================== -->
        <!-- CAPA FLOTANTE SUPERIOR: MODO NAVEGACIÓN ACTIVA (Google Maps / Waze) -->
        <!-- ============================================================== -->
        <v-fade-transition>
          <div v-if="enModoNavegacion && instruccionActual" class="hud-navegacion-google elevation-6">
            <div class="d-flex align-start gap-3">
              <!-- Icono de maniobra grande -->
              <div class="maniobra-icono-caja">
                <v-icon color="white" size="36">{{ instruccionActual.icono }}</v-icon>
              </div>

              <!-- Distancia y texto completo de instrucción SIN CORTAR -->
              <div class="flex-grow-1 overflow-hidden">
                <div class="d-flex align-center justify-space-between mb-1">
                  <span class="maniobra-distancia-texto font-weight-black">
                    {{ instruccionActual.distancia > 0 ? `En ${instruccionActual.distancia} metros` : 'Destino Alcanzado' }}
                  </span>
                  <span class="text-caption text-white opacity-80 font-weight-bold">
                    Paso {{ pasoActualIndex + 1 }} de {{ rutaCalculada?.instrucciones?.length || 1 }}
                  </span>
                </div>
                <!-- TEXTO COMPLETO SIN ELLIPSIS NI CORTES -->
                <div class="instruccion-texto-completo font-weight-bold text-white">
                  {{ instruccionActual.texto }}
                </div>
              </div>

              <!-- Botones de audio y salir -->
              <div class="d-flex flex-column gap-1">
                <v-btn
                  icon
                  size="small"
                  color="white"
                  variant="text"
                  aria-label="Repetir audio"
                  @click="pronunciarInstruccion(instruccionActual.texto)"
                >
                  <v-icon size="22">{{ vozActiva ? 'mdi-volume-high' : 'mdi-volume-off' }}</v-icon>
                </v-btn>
                <v-btn
                  icon
                  size="small"
                  color="white"
                  variant="text"
                  aria-label="Cerrar navegación"
                  @click="detenerNavegacion"
                >
                  <v-icon size="22">mdi-close</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </v-fade-transition>

        <!-- Indicador contextual: "Toca cualquier bloque" (solo cuando no navega) -->
        <div v-if="!enModoNavegacion" class="ayuda-tactil-movil">
          <v-icon size="14" class="mr-1">mdi-gesture-tap</v-icon>
          <span>Toca cualquier bloque para guiarte en vivo</span>
        </div>

        <!-- Botón Recentrar en mi posición GPS flotante (Estilo Google Maps) -->
        <div class="controles-mapa-flotantes">
          <v-btn
            icon
            size="small"
            color="white"
            class="elevation-3 mb-1"
            aria-label="Acercar mapa"
            @click="hacerZoom(0.2)"
          >
            <v-icon color="primary" size="20">mdi-plus</v-icon>
          </v-btn>
          <v-btn
            icon
            size="small"
            color="white"
            class="elevation-3 mb-1"
            aria-label="Alejar mapa"
            @click="hacerZoom(-0.2)"
          >
            <v-icon color="primary" size="20">mdi-minus</v-icon>
          </v-btn>
          <v-btn
            icon
            size="default"
            color="white"
            class="elevation-4 boton-recentrar-gps"
            aria-label="Recentrar en mi posición"
            @click="centrarEnMiPosicion"
          >
            <v-icon color="primary" size="24">mdi-crosshairs-gps</v-icon>
          </v-btn>
        </div>

        <!-- ============================================================== -->
        <!-- LIENZO SVG INTERACTIVO CON EL PLANO 3D ISOMÉTRICO -->
        <!-- ============================================================== -->
        <div
          ref="mapaScrollContainer"
          class="mapa-canvas-interactivo"
          :class="{ 'agarrando': estaArrastrando }"
          @mousedown="iniciarArrastre"
          @mousemove="arrastrarMapa"
          @mouseup="terminarArrastre"
          @mouseleave="terminarArrastre"
          @touchstart="iniciarToque"
          @touchmove="moverToque"
          @touchend="terminarArrastre"
        >
          <div
            class="mapa-transform-layer"
            :style="{
              transform: `translate(${panX}px, ${panY}px) scale(${nivelZoom})`,
              transformOrigin: 'top left'
            }"
          >
            <svg
              viewBox="0 0 1024 682"
              class="mapa-svg-root"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <filter id="sombra-edificio" x="-10%" y="-10%" width="130%" height="130%">
                  <feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity="0.3" />
                </filter>
                <filter id="brillo-seleccion" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#00E676" flood-opacity="0.95" />
                </filter>
                <filter id="brillo-ruta" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#00E676" flood-opacity="0.9" />
                </filter>

                <linearGradient id="gradienteRutaWaze" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#00C853" />
                  <stop offset="50%" stop-color="#00E676" />
                  <stop offset="100%" stop-color="#1DE9B6" />
                </linearGradient>
              </defs>

              <!-- IMAGEN 3D ISOMÉTRICA DE ALTA DEFINICIÓN (Imagen 2 del usuario) -->
              <image
                href="/mapa-hospital-3d.jpg"
                x="0"
                y="0"
                width="1024"
                height="682"
                preserveAspectRatio="none"
              />

              <!-- Red de Caminos Peatonales Interiores -->
              <g class="red-caminos-overlay" opacity="0.35">
                <line
                  v-for="(con, i) in conexionesGrafo"
                  :key="i"
                  :x1="nodosGrafo[con.de].x"
                  :y1="nodosGrafo[con.de].y"
                  :x2="nodosGrafo[con.a].x"
                  :y2="nodosGrafo[con.a].y"
                  stroke="#ffffff"
                  stroke-width="2.5"
                  stroke-dasharray="3,3"
                  stroke-linecap="round"
                />
              </g>

              <!-- BLOQUES CLICKEABLES CON 1 SOLO TOQUE -->
              <g class="bloques-interactivos">
                <g
                  v-for="bloque in bloquesMedellin"
                  :key="bloque.id"
                  class="grupo-bloque-interactivo cursor-pointer"
                  :class="{
                    'bloque-activo-destino': bloqueDestino?.id === bloque.id,
                    'bloque-atenuado': categoriaActiva !== 'todas' && bloque.categoria !== categoriaActiva
                  }"
                  @click.stop="alTocarBloque(bloque)"
                >
                  <template v-if="bloque.svgType === 'rect'">
                    <rect
                      :x="bloque.x"
                      :y="bloque.y"
                      :width="bloque.width"
                      :height="bloque.height"
                      :rx="bloque.rx || 6"
                      :fill="bloqueDestino?.id === bloque.id ? '#00E676' : bloque.color"
                      :fill-opacity="bloqueDestino?.id === bloque.id ? 0.45 : 0.08"
                      :stroke="bloqueDestino?.id === bloque.id ? '#00E676' : 'transparent'"
                      :stroke-width="bloqueDestino?.id === bloque.id ? 4 : 1"
                      :filter="bloqueDestino?.id === bloque.id ? 'url(#brillo-seleccion)' : 'none'"
                      class="transicion-bloque"
                    />
                  </template>

                  <template v-else-if="bloque.svgType === 'polygon'">
                    <polygon
                      :points="bloque.puntos"
                      :fill="bloqueDestino?.id === bloque.id ? '#00E676' : bloque.color"
                      :fill-opacity="bloqueDestino?.id === bloque.id ? 0.45 : 0.08"
                      :stroke="bloqueDestino?.id === bloque.id ? '#00E676' : 'transparent'"
                      :stroke-width="bloqueDestino?.id === bloque.id ? 4 : 1"
                      :filter="bloqueDestino?.id === bloque.id ? 'url(#brillo-seleccion)' : 'none'"
                      class="transicion-bloque"
                    />
                  </template>

                  <!-- Insignia flotante 3D del bloque -->
                  <g :transform="`translate(${bloque.centroX}, ${bloque.centroY})`" class="etiqueta-bloque">
                    <circle
                      r="13"
                      :fill="bloqueDestino?.id === bloque.id ? '#00C853' : '#ffffff'"
                      :stroke="bloqueDestino?.id === bloque.id ? '#ffffff' : '#1e293b'"
                      stroke-width="2"
                      class="sombra-badge"
                    />
                    <text
                      text-anchor="middle"
                      dominant-baseline="central"
                      font-size="11"
                      font-weight="900"
                      :fill="bloqueDestino?.id === bloque.id ? '#ffffff' : '#0f172a'"
                    >
                      {{ bloque.numero }}
                    </text>
                  </g>
                </g>
              </g>

              <!-- Puertas de Acceso (Entradas al Hospital) -->
              <g class="puntos-entradas">
                <g
                  v-for="entrada in entradasHospital"
                  :key="entrada.id"
                  :transform="`translate(${entrada.x}, ${entrada.y})`"
                  class="cursor-pointer grupo-entrada"
                  @click.stop="seleccionarEntradaComoOrigen(entrada)"
                >
                  <circle r="11" fill="#2E7D32" stroke="#ffffff" stroke-width="2" class="sombra-badge" />
                  <text
                    text-anchor="middle"
                    dominant-baseline="central"
                    font-size="8"
                    font-weight="bold"
                    fill="#ffffff"
                  >
                    IN
                  </text>
                </g>
              </g>

              <!-- TRAZADO DE RUTA ACTIVA TIPO WAZE / GOOGLE MAPS -->
              <g v-if="rutaCalculada && rutaCalculada.nodos.length > 1" class="capa-ruta-waze">
                <polyline
                  :points="rutaCalculada.polilinea"
                  fill="none"
                  stroke="#00E676"
                  stroke-width="12"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  opacity="0.4"
                  filter="url(#brillo-ruta)"
                />

                <polyline
                  :points="rutaCalculada.polilinea"
                  fill="none"
                  stroke="url(#gradienteRutaWaze)"
                  stroke-width="6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />

                <polyline
                  :points="rutaCalculada.polilinea"
                  fill="none"
                  stroke="#ffffff"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-dasharray="8,10"
                  class="linea-waze-flujo"
                />

                <g v-for="(nodo, idx) in rutaCalculada.nodos" :key="idx" :transform="`translate(${nodo.x}, ${nodo.y})`">
                  <circle
                    v-if="idx > 0 && idx < rutaCalculada.nodos.length - 1"
                    r="4"
                    fill="#ffffff"
                    stroke="#00C853"
                    stroke-width="2"
                  />
                </g>

                <!-- PIN DE DESTINO -->
                <g :transform="`translate(${puntoDestinoCoords.x}, ${puntoDestinoCoords.y})`" class="marcador-destino-pin">
                  <path
                    d="M 0,0 C -11,-15 -11,-26 0,-32 C 11,-26 11,-15 0,0 Z"
                    fill="#FF1744"
                    stroke="#ffffff"
                    stroke-width="2"
                    filter="url(#sombra-edificio)"
                  />
                  <circle cx="0" cy="-20" r="4.5" fill="#ffffff" />
                </g>
              </g>

              <!-- MARCADOR GPS EN VIVO "TÚ ESTÁS AQUÍ" (Sigue al paciente mientras camina) -->
              <g :transform="`translate(${posicionActualUsuario.x}, ${posicionActualUsuario.y})`" class="marcador-origen-gps">
                <g v-if="rumboGrados !== null" :transform="`rotate(${rumboGrados})`">
                  <path
                    d="M 0,0 L -18,-36 L 18,-36 Z"
                    fill="url(#gradienteRutaWaze)"
                    opacity="0.5"
                  />
                </g>
                <circle r="24" fill="#2979FF" fill-opacity="0.25" class="pulso-gps-radar" />
                <circle r="10" fill="#2979FF" stroke="#ffffff" stroke-width="2.5" />
                <circle r="4" fill="#ffffff" />
              </g>
            </svg>
          </div>
        </div>

        <!-- ============================================================== -->
        <!-- CAPA FLOTANTE INFERIOR: BARRA DE NAVEGACIÓN ACTIVA GOOGLE MAPS -->
        <!-- ============================================================== -->
        <v-fade-transition>
          <div v-if="enModoNavegacion" class="barra-navegacion-google-inferior elevation-8">
            <div class="d-flex align-center justify-space-between w-100 gap-2">
              <div>
                <div class="d-flex align-baseline gap-2">
                  <span class="tiempo-grande-texto text-green-darken-3 font-weight-black">
                    {{ rutaCalculada?.tiempoMinutos || 1 }} min
                  </span>
                  <span class="distancia-texto text-grey-darken-2 font-weight-bold">
                    ({{ rutaCalculada?.distanciaMetros || 0 }} m)
                  </span>
                </div>
                <div class="text-caption text-grey-darken-1 font-weight-medium">
                  Llegada est. {{ horaLlegadaEstimada }}
                  <span v-if="caminataSimulada" class="text-amber-darken-3 font-weight-bold ml-1">
                    • 🚶 Caminando
                  </span>
                </div>
              </div>

              <!-- Controles de Navegación Paso a Paso -->
              <div class="d-flex align-center gap-2">
                <v-btn
                  icon
                  size="small"
                  variant="outlined"
                  color="grey-darken-2"
                  :disabled="pasoActualIndex <= 0"
                  aria-label="Paso anterior"
                  @click="retrocederPaso"
                >
                  <v-icon size="18">mdi-chevron-left</v-icon>
                </v-btn>

                <v-btn
                  v-if="pasoActualIndex < (rutaCalculada?.instrucciones?.length || 1) - 1"
                  size="small"
                  color="primary"
                  variant="flat"
                  rounded="pill"
                  class="text-none font-weight-bold px-3"
                  @click="avanzarPaso"
                >
                  Siguiente
                  <v-icon end size="16">mdi-chevron-right</v-icon>
                </v-btn>
                <v-btn
                  v-else
                  size="small"
                  color="success"
                  variant="flat"
                  rounded="pill"
                  class="text-none font-weight-bold px-3"
                  @click="detenerNavegacion"
                >
                  ¡Llegaste!
                  <v-icon end size="16">mdi-check</v-icon>
                </v-btn>

                <!-- Botón rojo para salir de la ruta -->
                <v-btn
                  icon
                  size="small"
                  color="error"
                  variant="flat"
                  aria-label="Detener navegación"
                  @click="detenerNavegacion"
                >
                  <v-icon size="18">mdi-close</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </v-fade-transition>

        <!-- ============================================================== -->
        <!-- FICHA BOTTOM SHEET INFORMATIVA (CUANDO SE TOCA UN BLOQUE) -->
        <!-- ============================================================== -->
        <v-slide-y-reverse-transition>
          <div v-if="bloqueSeleccionado && !enModoNavegacion" class="ficha-bloque-flotante elevation-8">
            <div class="d-flex align-start justify-space-between gap-2 mb-2">
              <div class="d-flex align-center gap-2">
                <v-avatar :color="bloqueSeleccionado.color" size="38" class="text-white font-weight-bold text-subtitle-2">
                  {{ bloqueSeleccionado.numero }}
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-black text-grey-darken-4 lh-sm">
                    {{ bloqueSeleccionado.nombre }}
                  </div>
                  <div class="text-caption text-grey-darken-1">
                    {{ bloqueSeleccionado.descripcion }}
                  </div>
                </div>
              </div>
              <v-btn icon size="x-small" variant="text" @click="bloqueSeleccionado = null">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>

            <v-divider class="my-2" />

            <!-- Servicios del bloque -->
            <div class="mb-3">
              <div class="text-caption font-weight-bold text-grey-darken-3 mb-1">
                Servicios disponibles en este bloque ({{ bloqueSeleccionado.servicios.length }}):
              </div>
              <div class="chips-servicios-grid">
                <v-chip
                  v-for="(serv, sIndex) in bloqueSeleccionado.servicios"
                  :key="sIndex"
                  size="small"
                  class="font-weight-medium"
                >
                  {{ serv }}
                </v-chip>
              </div>
            </div>

            <!-- Botones de Acción -->
            <div class="d-flex align-center justify-space-between flex-wrap gap-2 pt-1">
              <div class="text-caption font-weight-bold text-grey-darken-2">
                🚶 {{ rutaCalculada?.tiempoMinutos || 1 }} min ({{ rutaCalculada?.distanciaMetros || 0 }} m)
              </div>

              <div class="d-flex align-center gap-2">
                <v-btn
                  size="small"
                  variant="tonal"
                  color="amber-darken-4"
                  rounded="pill"
                  prepend-icon="mdi-walk"
                  class="text-none font-weight-bold"
                  @click="iniciarCaminataSimulada"
                >
                  Simular Caminata
                </v-btn>

                <v-btn
                  size="small"
                  variant="flat"
                  color="primary"
                  rounded="pill"
                  prepend-icon="mdi-navigation"
                  class="text-none font-weight-bold px-4"
                  @click="iniciarNavegacionWaze"
                >
                  Iniciar Guía Waze
                </v-btn>
              </div>
            </div>
          </div>
        </v-slide-y-reverse-transition>

      </div>
    </div>
  </LayoutPrincipal>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import LayoutPrincipal from '../../layouts/LayoutPrincipal.vue'
import {
  SEDES_DISPONIBLES,
  ENTRADAS_HOSPITAL,
  BLOQUES_MEDELLIN,
  NODOS_GRAFO,
  CONEXIONES_GRAFO,
  CATEGORIAS_FILTRO,
  HOSPITAL_GPS,
  calcularRutaOptima,
  buscarDestinos,
  gpsACoordenadasCampus,
  calcularDistanciaGpsMetros,
  encontrarNodoMasCercano
} from '../../data/mapaMedellinData'

const ruta = useRoute()

// Catálogo de Datos
const entradasHospital = ref(ENTRADAS_HOSPITAL)
const bloquesMedellin = ref(BLOQUES_MEDELLIN)
const nodosGrafo = ref(NODOS_GRAFO)
const conexionesGrafo = ref(CONEXIONES_GRAFO)
const categoriasFiltro = ref(CATEGORIAS_FILTRO)
const categoriaActiva = ref('todas')

// Destino y Ruta
const origenSeleccionadoId = ref('node_sur_calle64')
const destinoSeleccionadoId = ref('node_b11_sur')
const rutaCalculada = ref(null)
const bloqueSeleccionado = ref(null)

// Modo Navegación Google Maps / Waze
const enModoNavegacion = ref(false)
const pasoActualIndex = ref(0)
const vozActiva = ref(true)

// GPS y Posición en Vivo
const gpsActivo = ref(false)
const estaEnCampus = ref(false)
const posicionActualUsuario = ref({ x: 470, y: 570 }) // Inicia en Puerta Calle 64
const rumboGrados = ref(null)
let watchIdGps = null

// Simulación de caminata continua
const caminataSimulada = ref(false)
let timerSimulacion = null
let indexPuntoSimulado = 0

// Búsqueda inteligente
const terminoBusqueda = ref('')
const resultadosBusqueda = ref([])

// Manipulación y Zoom del Mapa
const mapaScrollContainer = ref(null)
const nivelZoom = ref(1.0)
const panX = ref(0)
const panY = ref(0)
const estaArrastrando = ref(false)
const arrastreInicioX = ref(0)
const arrastreInicioY = ref(0)
const toqueInicialDist = ref(null)

const bloqueDestino = computed(() => {
  return bloquesMedellin.value.find(b => b.nodeId === destinoSeleccionadoId.value)
})

const puntoDestinoCoords = computed(() => {
  const n = nodosGrafo.value[destinoSeleccionadoId.value]
  return n ? { x: n.x, y: n.y } : { x: 755, y: 185 }
})

const instruccionActual = computed(() => {
  if (!rutaCalculada.value || !rutaCalculada.value.instrucciones) return null
  return rutaCalculada.value.instrucciones[pasoActualIndex.value] || null
})

const horaLlegadaEstimada = computed(() => {
  const ahora = new Date()
  const minutos = rutaCalculada.value?.tiempoMinutos || 1
  ahora.setMinutes(ahora.getMinutes() + minutos)
  return ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})

/**
 * TOCAR UN BLOQUE: Acción de 1 solo toque para fijar destino y comenzar guía
 */
function alTocarBloque(bloque) {
  bloqueSeleccionado.value = bloque
  destinoSeleccionadoId.value = bloque.nodeId

  // Origen automático: Si el usuario tiene GPS o ya está en un punto, busca el nodo más cercano
  const nodoOrigen = encontrarNodoMasCercano(posicionActualUsuario.value.x, posicionActualUsuario.value.y)
  origenSeleccionadoId.value = nodoOrigen.id

  trazarRuta()
  iniciarNavegacionWaze()
}

function seleccionarEntradaComoOrigen(entrada) {
  origenSeleccionadoId.value = entrada.nodeId
  posicionActualUsuario.value = { x: entrada.x, y: entrada.y }
  trazarRuta()
  centrarEnMiPosicion()
}

function trazarRuta() {
  if (!origenSeleccionadoId.value || !destinoSeleccionadoId.value) return
  const resultado = calcularRutaOptima(origenSeleccionadoId.value, destinoSeleccionadoId.value)
  rutaCalculada.value = resultado
  pasoActualIndex.value = 0
}

function iniciarNavegacionWaze() {
  trazarRuta()
  enModoNavegacion.value = true
  pasoActualIndex.value = 0
  centrarEnMiPosicion()

  if (vozActiva.value && instruccionActual.value) {
    pronunciarInstruccion(instruccionActual.value.texto)
  }
}

function detenerNavegacion() {
  detenerCaminataSimulada()
  enModoNavegacion.value = false
  pasoActualIndex.value = 0
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}

function avanzarPaso() {
  if (rutaCalculada.value && pasoActualIndex.value < rutaCalculada.value.instrucciones.length - 1) {
    pasoActualIndex.value++
    const inst = instruccionActual.value
    if (inst) {
      posicionActualUsuario.value = { x: inst.x, y: inst.y }
      centrarEnMiPosicion()
      if (vozActiva.value) {
        pronunciarInstruccion(inst.texto)
      }
    }
  }
}

function retrocederPaso() {
  if (pasoActualIndex.value > 0) {
    pasoActualIndex.value--
    const inst = instruccionActual.value
    if (inst) {
      posicionActualUsuario.value = { x: inst.x, y: inst.y }
      centrarEnMiPosicion()
      if (vozActiva.value) {
        pronunciarInstruccion(inst.texto)
      }
    }
  }
}

/**
 * SIMULACIÓN DE CAMINATA EN VIVO (Para probar desde cualquier lugar)
 */
function iniciarCaminataSimulada() {
  if (!rutaCalculada.value || rutaCalculada.value.nodos.length < 2) {
    trazarRuta()
  }
  enModoNavegacion.value = true
  caminataSimulada.value = true
  indexPuntoSimulado = 0
  pasoActualIndex.value = 0

  if (timerSimulacion) clearInterval(timerSimulacion)

  const nodos = rutaCalculada.value.nodos
  posicionActualUsuario.value = { x: nodos[0].x, y: nodos[0].y }
  centrarEnMiPosicion()

  if (vozActiva.value && instruccionActual.value) {
    pronunciarInstruccion(instruccionActual.value.texto)
  }

  timerSimulacion = setInterval(() => {
    if (indexPuntoSimulado < nodos.length - 1) {
      indexPuntoSimulado++
      const target = nodos[indexPuntoSimulado]
      posicionActualUsuario.value = { x: target.x, y: target.y }
      centrarEnMiPosicion()

      if (pasoActualIndex.value < rutaCalculada.value.instrucciones.length - 1) {
        pasoActualIndex.value++
        if (vozActiva.value && instruccionActual.value) {
          pronunciarInstruccion(instruccionActual.value.texto)
        }
      }
    } else {
      detenerCaminataSimulada()
      if (vozActiva.value) {
        pronunciarInstruccion('¡Has llegado a tu destino!')
      }
    }
  }, 2200)
}

function detenerCaminataSimulada() {
  caminataSimulada.value = false
  if (timerSimulacion) {
    clearInterval(timerSimulacion)
    timerSimulacion = null
  }
}

/**
 * GEOLOCALIZACIÓN GPS REAL (Al caminar dentro del hospital con el celular)
 */
function solicitarUbicacionGps() {
  if (!('geolocation' in navigator)) {
    alert('Tu navegador no soporta geolocalización GPS.')
    return
  }

  if (watchIdGps) {
    navigator.geolocation.clearWatch(watchIdGps)
    watchIdGps = null
    gpsActivo.value = false
    return
  }

  gpsActivo.value = true

  watchIdGps = navigator.geolocation.watchPosition(
    (pos) => {
      const lat = pos.coords.latitude
      const lng = pos.coords.longitude
      const metrosAlHospital = calcularDistanciaGpsMetros(lat, lng, HOSPITAL_GPS.centerLat, HOSPITAL_GPS.centerLng)

      estaEnCampus.value = metrosAlHospital <= 450

      if (estaEnCampus.value) {
        const coords = gpsACoordenadasCampus(lat, lng)
        posicionActualUsuario.value = { x: coords.x, y: coords.y }

        if (pos.coords.heading !== null && !isNaN(pos.coords.heading)) {
          rumboGrados.value = pos.coords.heading
        }

        if (enModoNavegacion.value) {
          centrarEnMiPosicion()
        }

        // Auto-recalcular ruta conforme camina
        if (destinoSeleccionadoId.value) {
          const nodoCercano = encontrarNodoMasCercano(coords.x, coords.y)
          if (nodoCercano.id !== origenSeleccionadoId.value) {
            origenSeleccionadoId.value = nodoCercano.id
            trazarRuta()
          }
        }
      }
    },
    (err) => {
      console.warn('Error GPS:', err.message)
      gpsActivo.value = false
    },
    {
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 8000
    }
  )

  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', alCambiarOrientacion, true)
  }
}

function alCambiarOrientacion(event) {
  if (event.webkitCompassHeading) {
    rumboGrados.value = event.webkitCompassHeading
  } else if (event.alpha !== null) {
    rumboGrados.value = 360 - event.alpha
  }
}

function pronunciarInstruccion(mensaje) {
  if (!('speechSynthesis' in window) || !vozActiva.value) return
  window.speechSynthesis.cancel()
  const locucion = new SpeechSynthesisUtterance(mensaje)
  locucion.lang = 'es-CO'
  locucion.rate = 1.05
  locucion.pitch = 1.0
  window.speechSynthesis.speak(locucion)
}

function alBuscar(valor) {
  if (!valor || valor.trim().length === 0) {
    resultadosBusqueda.value = []
    return
  }
  resultadosBusqueda.value = buscarDestinos(valor)
}

function limpiarBusqueda() {
  terminoBusqueda.value = ''
  resultadosBusqueda.value = []
}

function seleccionarResultadoBusqueda(res) {
  if (res.bloque) {
    alTocarBloque(res.bloque)
  } else if (res.entrada) {
    seleccionarEntradaComoOrigen(res.entrada)
  }
  limpiarBusqueda()
}

function filtrarPorCategoria(catId) {
  categoriaActiva.value = catId
  if (catId !== 'todas') {
    const b = bloquesMedellin.value.find(item => item.categoria === catId)
    if (b) alTocarBloque(b)
  }
}

function hacerZoom(delta) {
  const nuevo = Math.min(Math.max(nivelZoom.value + delta, 0.7), 2.5)
  nivelZoom.value = parseFloat(nuevo.toFixed(2))
}

function centrarVista() {
  nivelZoom.value = 1.0
  panX.value = 0
  panY.value = 0
}

function centrarEnMiPosicion() {
  nivelZoom.value = 1.35
  const x = posicionActualUsuario.value.x
  const y = posicionActualUsuario.value.y
  if (!mapaScrollContainer.value) return
  const w = mapaScrollContainer.value.clientWidth
  const h = mapaScrollContainer.value.clientHeight
  panX.value = Math.round((w / 2) - (x * (w / 1024) * 1.35))
  panY.value = Math.round((h / 2) - (y * (h / 682) * 1.35))
}

function iniciarArrastre(e) {
  estaArrastrando.value = true
  arrastreInicioX.value = e.clientX - panX.value
  arrastreInicioY.value = e.clientY - panY.value
}

function arrastrarMapa(e) {
  if (!estaArrastrando.value) return
  panX.value = e.clientX - arrastreInicioX.value
  panY.value = e.clientY - arrastreInicioY.value
}

function terminarArrastre() {
  estaArrastrando.value = false
  toqueInicialDist.value = null
}

function iniciarToque(e) {
  if (e.touches.length === 1) {
    estaArrastrando.value = true
    arrastreInicioX.value = e.touches[0].clientX - panX.value
    arrastreInicioY.value = e.touches[0].clientY - panY.value
  } else if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX
    const dy = e.touches[0].clientY - e.touches[1].clientY
    toqueInicialDist.value = Math.hypot(dx, dy)
  }
}

function moverToque(e) {
  if (e.touches.length === 1 && estaArrastrando.value) {
    panX.value = e.touches[0].clientX - arrastreInicioX.value
    panY.value = e.touches[0].clientY - arrastreInicioY.value
  } else if (e.touches.length === 2 && toqueInicialDist.value) {
    const dx = e.touches[0].clientX - e.touches[1].clientX
    const dy = e.touches[0].clientY - e.touches[1].clientY
    const distActual = Math.hypot(dx, dy)
    const factor = distActual / toqueInicialDist.value
    if (Math.abs(factor - 1) > 0.05) {
      hacerZoom(factor > 1 ? 0.05 : -0.05)
      toqueInicialDist.value = distActual
    }
  }
}

onMounted(() => {
  solicitarUbicacionGps()

  if (ruta.query.destino) {
    const b = bloquesMedellin.value.find(
      item => item.id === ruta.query.destino || item.nodeId === ruta.query.destino || item.nombre.toLowerCase().includes(String(ruta.query.destino).toLowerCase())
    )
    if (b) alTocarBloque(b)
  } else {
    destinoSeleccionadoId.value = 'node_b11_sur'
    bloqueSeleccionado.value = bloquesMedellin.value.find(b => b.id === 'b11')
    trazarRuta()
  }
})

onUnmounted(() => {
  if (watchIdGps) {
    navigator.geolocation.clearWatch(watchIdGps)
  }
  if (timerSimulacion) {
    clearInterval(timerSimulacion)
  }
  if (window.DeviceOrientationEvent) {
    window.removeEventListener('deviceorientation', alCambiarOrientacion, true)
  }
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
})
</script>

<style scoped>
.mapa-waze-contenedor {
  position: relative;
  width: 100%;
}

/* ========================================================= */
/* VIEWPORT DEL MAPA 3D (OCUPA LA PANTALLA EN CELULAR) */
/* ========================================================= */
.mapa-viewport-wrapper {
  height: calc(100vh - 130px);
  min-height: 520px;
  max-height: 860px;
  background: #1e293b;
  border-radius: 20px;
  border: 1px solid #334155;
  touch-action: none;
  position: relative;
}

@media (max-width: 600px) {
  .mapa-viewport-wrapper {
    height: calc(100dvh - 110px);
    min-height: 480px;
    border-radius: 16px;
  }
}

.mapa-canvas-interactivo {
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: grab;
  user-select: none;
}

.mapa-canvas-interactivo.agarrando {
  cursor: grabbing;
}

.mapa-transform-layer {
  width: 100%;
  height: 100%;
  transition: transform 0.05s ease-out;
}

.mapa-svg-root {
  width: 100%;
  height: 100%;
  display: block;
}

/* ========================================================= */
/* CAPA FLOTANTE SUPERIOR (BUSCADOR Y CHIPS) */
/* ========================================================= */
.capa-superior-flotante {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  z-index: 25;
}

.barra-busqueda-card {
  background: #ffffff;
  border-radius: 28px;
  padding: 4px 14px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.buscador-input :deep(.v-field__input) {
  font-size: 14px;
  color: #0f172a;
}

.resultados-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 50;
  max-height: 280px;
  overflow-y: auto;
  background: #ffffff;
}

/* ========================================================= */
/* CHIPS DE CATEGORÍA (NUNCA CORTADOS NI CON ...) */
/* ========================================================= */
.chips-scroll-horizontal {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  gap: 8px;
}

.chips-scroll-horizontal::-webkit-scrollbar {
  display: none;
}

.chip-categoria {
  flex-shrink: 0 !important;
  white-space: nowrap !important;
  display: inline-flex !important;
  cursor: pointer;
  font-size: 13px !important;
  font-weight: 700 !important;
  padding: 0 14px !important;
  height: 34px !important;
  border-radius: 20px !important;
  transition: all 0.2s ease;
}

.chip-categoria :deep(.v-chip__content) {
  overflow: visible !important;
  text-overflow: clip !important;
  white-space: nowrap !important;
}

.chip-inactivo {
  background-color: #ffffff !important;
  color: #1e293b !important;
  border: 1px solid #cbd5e1 !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.chip-activo {
  background-color: #166534 !important;
  color: #ffffff !important;
  border: 1px solid #14532d !important;
  box-shadow: 0 3px 8px rgba(22, 101, 52, 0.35);
}

/* ========================================================= */
/* HUD SUPERIOR DE NAVEGACIÓN TIPO GOOGLE MAPS / WAZE */
/* ========================================================= */
.hud-navegacion-google {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  z-index: 30;
  background: linear-gradient(135deg, #15803d 0%, #166534 100%);
  border-radius: 20px;
  padding: 14px 16px;
  color: white;
  box-shadow: 0 8px 26px rgba(0, 0, 0, 0.4);
  animation: slideDown 0.25s ease-out;
}

@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.maniobra-icono-caja {
  background: rgba(255, 255, 255, 0.22);
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.maniobra-distancia-texto {
  font-size: 15px;
  letter-spacing: 0.02em;
  color: #bbf7d0;
  text-transform: uppercase;
}

/* TEXTO COMPLETO SIN CORTAR CON ... */
.instruccion-texto-completo {
  font-size: 15px;
  line-height: 1.35;
  white-space: normal !important;
  word-break: break-word;
}

/* ========================================================= */
/* BARRA INFERIOR DE NAVEGACIÓN (GOOGLE MAPS) */
/* ========================================================= */
.barra-navegacion-google-inferior {
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  z-index: 30;
  background: #ffffff;
  border-radius: 20px;
  padding: 12px 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.25s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.tiempo-grande-texto {
  font-size: 22px;
  line-height: 1;
}

.distancia-texto {
  font-size: 14px;
}

/* ========================================================= */
/* FICHA BOTTOM SHEET INFORMATIVA DEL BLOQUE */
/* ========================================================= */
.ficha-bloque-flotante {
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  z-index: 28;
  background: #ffffff;
  border-radius: 22px;
  padding: 16px;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.25);
  max-height: 45vh;
  overflow-y: auto;
}

.chips-servicios-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-height: 120px;
  overflow-y: auto;
}

.chips-servicios-grid :deep(.v-chip) {
  font-size: 12px !important;
  font-weight: 600;
  color: #14532d !important;
  background-color: #f0fdf4 !important;
  border: 1px solid #86efac !important;
}

/* ========================================================= */
/* CONTROLES FLOTANTES (ZOOM Y RECENTRAR) */
/* ========================================================= */
.controles-mapa-flotantes {
  position: absolute;
  right: 14px;
  bottom: 90px;
  z-index: 22;
  display: flex;
  flex-direction: column;
}

.boton-recentrar-gps {
  border-radius: 50% !important;
  width: 44px !important;
  height: 44px !important;
}

.ayuda-tactil-movil {
  position: absolute;
  top: 96px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(15, 23, 42, 0.85);
  color: white;
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 11px;
  pointer-events: none;
  z-index: 10;
  display: flex;
  align-items: center;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

/* ========================================================= */
/* ANIMACIONES SVG Y LÍNEA WAZE */
/* ========================================================= */
.transicion-bloque {
  transition: all 0.25s ease;
}

.grupo-bloque-interactivo:hover rect,
.grupo-bloque-interactivo:hover polygon {
  fill-opacity: 0.4 !important;
  stroke: #00E676 !important;
  stroke-width: 3px !important;
}

.bloque-atenuado {
  opacity: 0.35;
}

.sombra-badge {
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.4));
}

.linea-waze-flujo {
  animation: flujoRuta 1s linear infinite;
}

@keyframes flujoRuta {
  from {
    stroke-dashoffset: 18;
  }
  to {
    stroke-dashoffset: 0;
  }
}

.pulso-gps-radar {
  animation: pulsoRadar 2s infinite ease-out;
  transform-origin: center;
}

@keyframes pulsoRadar {
  0% {
    r: 10;
    opacity: 0.85;
  }
  100% {
    r: 34;
    opacity: 0;
  }
}
</style>
