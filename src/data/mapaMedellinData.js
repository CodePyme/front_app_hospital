/**
 * Datos y Grafos de Navegación del Hospital San Vicente Fundación - Sede Medellín
 * Vista 3D Isométrica Real (1024 x 682 px) con Soporte de GPS en Vivo
 */

export const SEDES_DISPONIBLES = [
  { id: 'medellin', nombre: 'Sede Medellín', direccion: 'Calle 64 con Carrera 51D #67', activa: true },
  { id: 'rionegro', nombre: 'Sede Rionegro', direccion: 'Vía Aeropuerto JMC, Rionegro', activa: false, mensaje: 'Próximamente disponible en el portal' }
]

// Coordenadas GPS Reales del Hospital Universitario San Vicente Fundación Medellín
export const HOSPITAL_GPS = {
  centerLat: 6.26286,
  centerLng: -75.5653,
  northLat: 6.2655,
  southLat: 6.2612,
  westLng: -75.5674,
  eastLng: -75.5630,
  centerX: 490,
  centerY: 360
}

/**
 * Calcula la distancia en metros entre dos coordenadas GPS (Haversine)
 */
export function calcularDistanciaGpsMetros(lat1, lon1, lat2, lon2) {
  const R = 6371e3
  const p1 = lat1 * Math.PI / 180
  const p2 = lat2 * Math.PI / 180
  const dp = (lat2 - lat1) * Math.PI / 180
  const dl = (lon2 - lon1) * Math.PI / 180

  const a = Math.sin(dp / 2) * Math.sin(dp / 2) +
            Math.cos(p1) * Math.cos(p2) *
            Math.sin(dl / 2) * Math.sin(dl / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Convierte coordenadas GPS (latitud, longitud) a píxeles (x, y) sobre el plano 3D isométrico
 */
export function gpsACoordenadasCampus(lat, lng) {
  const dLat = lat - HOSPITAL_GPS.centerLat
  const dLng = lng - HOSPITAL_GPS.centerLng

  const metrosNorte = dLat * 111139
  const metrosEste = dLng * 111139 * Math.cos(HOSPITAL_GPS.centerLat * Math.PI / 180)

  // En la perspectiva isométrica, el norte está inclinado ~18 grados
  const anguloRotacion = -18 * Math.PI / 180
  const rotEste = metrosEste * Math.cos(anguloRotacion) - metrosNorte * Math.sin(anguloRotacion)
  const rotNorte = metrosEste * Math.sin(anguloRotacion) + metrosNorte * Math.cos(anguloRotacion)

  const escalaX = 2.05
  const escalaY = 1.85

  const x = HOSPITAL_GPS.centerX + (rotEste * escalaX)
  const y = HOSPITAL_GPS.centerY - (rotNorte * escalaY)

  return {
    x: Math.min(Math.max(Math.round(x), 45), 975),
    y: Math.min(Math.max(Math.round(y), 55), 625),
    distanciaMetrosAlCentro: Math.hypot(metrosNorte, metrosEste)
  }
}

export const ENTRADAS_HOSPITAL = [
  {
    id: 'entrada_calle64',
    nombre: 'Entrada Calle 64 (Sur)',
    descripcion: 'Acceso peatonal y vehicular sur, cercano a Pensionados, Comfama y Dirección General',
    tipo: 'peatonal_vehicular',
    x: 470,
    y: 570,
    nodeId: 'node_sur_calle64',
    icono: 'mdi-door-open',
    calle: 'Calle 64'
  },
  {
    id: 'entrada_barranquilla',
    nombre: 'Entrada Calle 67 - Barranquilla (Norte)',
    descripcion: 'Acceso norte principal, cercano a Policlínica (Urgencias Adultos) y Banco de Sangre',
    tipo: 'peatonal_vehicular',
    x: 405,
    y: 65,
    nodeId: 'node_norte_calle67',
    icono: 'mdi-ambulance',
    calle: 'Calle 67 - Barranquilla'
  },
  {
    id: 'entrada_carabobo',
    nombre: 'Entrada Cra 52 - Carabobo (Oeste)',
    descripcion: 'Acceso peatonal costado occidental frente al Metro, cercano a Medicina Interna',
    tipo: 'peatonal',
    x: 75,
    y: 310,
    nodeId: 'node_oeste_carabobo',
    icono: 'mdi-train-car',
    calle: 'Carrera 52 - Carabobo'
  },
  {
    id: 'entrada_bolivar',
    nombre: 'Entrada Cra 51 - Bolívar (Este)',
    descripcion: 'Acceso oriental y parqueaderos, cercano a Hospital Infantil, Capilla y Restaurante',
    tipo: 'peatonal_vehicular',
    x: 885,
    y: 340,
    nodeId: 'node_este_bolivar',
    icono: 'mdi-parking',
    calle: 'Carrera 51 - Bolívar'
  },
  {
    id: 'plaza_fuente',
    nombre: 'Fuente Central (Glorieta de Jardines)',
    descripcion: 'Punto de encuentro central del campus entre Bloque 5 y Bloque 8',
    tipo: 'plaza',
    x: 490,
    y: 360,
    nodeId: 'node_fuente',
    icono: 'mdi-water-fountain',
    calle: 'Jardines Interiores'
  }
]

export const BLOQUES_MEDELLIN = [
  {
    id: 'b1',
    numero: 1,
    nombre: 'Bloque # 1 Comfama',
    tituloCorto: 'Bloque 1 Comfama',
    color: '#2e7d32',
    colorSecundario: '#1b5e20',
    colorTexto: '#ffffff',
    categoria: 'administrativo',
    descripcion: 'Servicios de compensación, afiliaciones y apoyo Comfama.',
    svgType: 'rect',
    x: 355,
    y: 490,
    width: 65,
    height: 45,
    rx: 6,
    centroX: 388,
    centroY: 512,
    nodeId: 'node_bloque1',
    servicios: [
      'Comfama',
      'Afiliaciones y Subsidios Comfama',
      'Atención Integral Comfama'
    ]
  },
  {
    id: 'b2',
    numero: 2,
    nombre: 'Bloque # 2 Dirección General',
    tituloCorto: 'Bloque 2 Dirección',
    color: '#5c93c4',
    colorSecundario: '#3f6d96',
    colorTexto: '#ffffff',
    categoria: 'administrativo',
    descripcion: 'Sede administrativa central, rectoría y gerencias del hospital.',
    svgType: 'rect',
    x: 510,
    y: 520,
    width: 65,
    height: 45,
    rx: 6,
    centroX: 542,
    centroY: 542,
    nodeId: 'node_bloque2',
    servicios: [
      'Presidencia',
      'Dirección General',
      'Gerencias',
      'Comunicaciones',
      'Jurídica',
      'Gestión Académica',
      'Donaciones y Cooperación',
      'Gestión Humana'
    ]
  },
  {
    id: 'b3',
    numero: 3,
    nombre: 'Bloque # 3 Cardiovascular',
    tituloCorto: 'Bloque 3 Cardiovascular',
    color: '#b87050',
    colorSecundario: '#8f4b2e',
    colorTexto: '#ffffff',
    categoria: 'especialidades',
    descripcion: 'Centro especializado cardiovascular, hemodinámica, trasplantes y diálisis.',
    svgType: 'rect',
    x: 670,
    y: 475,
    width: 135,
    height: 65,
    rx: 8,
    centroX: 738,
    centroY: 508,
    nodeId: 'node_b3',
    servicios: [
      'Fresenius - Diálisis',
      'Hospitalización Trasplantes',
      'UCI Bloque 3 Cardiovascular',
      'Cardiología Clínica',
      'Hemodinámia e Intervencionismo',
      'Consulta Externa Cardiovascular'
    ]
  },
  {
    id: 'b4',
    numero: 4,
    nombre: 'Bloque # 4',
    tituloCorto: 'Bloque 4',
    color: '#c59f6b',
    colorSecundario: '#a07a48',
    colorTexto: '#ffffff',
    categoria: 'apoyo',
    descripcion: 'Área en adecuación y reserva institucional.',
    svgType: 'rect',
    x: 680,
    y: 405,
    width: 95,
    height: 45,
    rx: 6,
    centroX: 728,
    centroY: 428,
    nodeId: 'node_b4',
    servicios: [
      'Área de Reserva / En adecuación'
    ]
  },
  {
    id: 'b5',
    numero: 5,
    nombre: 'Bloque # 5 Medicina Física y Rehabilitación',
    tituloCorto: 'Bloque 5 Rehabilitación',
    color: '#27ae60',
    colorSecundario: '#1e8449',
    colorTexto: '#ffffff',
    categoria: 'rehabilitacion',
    descripcion: 'Gran pabellón sur de terapias, rehabilitación física, oncología y consulta externa.',
    svgType: 'polygon',
    puntos: '355,420 440,360 595,385 550,500 425,480 355,420',
    centroX: 470,
    centroY: 430,
    nodeId: 'node_b5_norte',
    servicios: [
      'Fisioterapia',
      'Trabajo Social',
      'Rehabilitación Cardiaca',
      'Medicina Física y Rehabilitación',
      'Terapia Ocupacional',
      'Rehabilitación Visual',
      'Piel Sana y Clínica de Heridas',
      'Dirección de Enfermería',
      'Experiencia del Paciente',
      'Quimioterapia Ambulatoria',
      'UCE Pío X',
      'Voluntariado',
      'Sala San Camilo',
      'Departamento de Nutrición y Dietética',
      'Vigilancia Epidemiológica',
      'Museo',
      'Programación de Cirugía',
      'Consulta Externa Medicina Física',
      'Laboratorio de Neurofisiología',
      'Oncología',
      'Centro de Simulación'
    ]
  },
  {
    id: 'b6',
    numero: 6,
    nombre: 'Bloque # 6 Pensionados',
    tituloCorto: 'Bloque 6 Pensionados',
    color: '#dfcca0',
    colorSecundario: '#b8a36d',
    colorTexto: '#333333',
    categoria: 'hospitalizacion',
    descripcion: 'Pabellón suroccidental de hospitalización pensionados, vascular y quirófanos.',
    svgType: 'polygon',
    puntos: '55,445 130,325 300,345 270,510 90,490',
    centroX: 180,
    centroY: 420,
    nodeId: 'node_bloque6_este',
    servicios: [
      'Laboratorio de Patología Suescún',
      'Compras Misionales',
      'Vascular Periférico',
      'Quirófanos Pensionados',
      'Punto de Despacho de Cirugía',
      'Puesto 1',
      'Puesto 2',
      'Puesto 3',
      'Puesto 4',
      'Puesto 5',
      'Puesto 7',
      'UCE Puesto 5'
    ]
  },
  {
    id: 'b7',
    numero: 7,
    nombre: 'Bloque # 7 Medicina Interna',
    tituloCorto: 'Bloque 7 Med. Interna',
    color: '#f4d03f',
    colorSecundario: '#d4ac0d',
    colorTexto: '#333333',
    categoria: 'medicina_interna',
    descripcion: 'Pabellón clásico de hospitalización en medicina interna, salas y facturación.',
    svgType: 'polygon',
    puntos: '105,260 170,185 325,205 285,320 135,300',
    centroX: 205,
    centroY: 245,
    nodeId: 'node_b7_este',
    servicios: [
      'Medicina Nuclear',
      'Sala María Auxiliadora',
      'Procedimientos de Dermatología Maxilofacial',
      'Estomatología',
      'Sala Luis Carlos Uribe',
      'UCE Elkin Rodríguez',
      'Acopio Lavandería',
      'Facturación',
      'Dirección Unidad de Adultos',
      'Auditoría Corporativa',
      'Oficina de Proyectos'
    ]
  },
  {
    id: 'b8',
    numero: 8,
    nombre: 'Bloque # 8 Cirugía',
    tituloCorto: 'Bloque 8 Cirugía',
    color: '#54a8cf',
    colorSecundario: '#2980b9',
    colorTexto: '#ffffff',
    categoria: 'cirugia_uci',
    descripcion: 'Núcleo central de quirófanos de alta complejidad y unidades de cuidado intensivo.',
    svgType: 'polygon',
    puntos: '380,265 440,215 615,245 565,370 420,345',
    centroX: 495,
    centroY: 285,
    nodeId: 'node_b8_sur',
    servicios: [
      'TIC (Sistemas e Informática)',
      'Gobierno de la Información',
      'Ingeniería Biomédica',
      'Ingeniería Hospitalaria',
      'Instituto de Metrología Biomédica',
      'UCI San Rafael',
      'UCE Cristo Rey',
      'UCE San José',
      'UCI Médica',
      'Sala San Blas',
      'Central de Esterilización',
      'Sala Santa Genoveva',
      'Salud y Seguridad en el Trabajo',
      'Relaciones Laborales',
      'Gestión de Servicios',
      'Nómina',
      'Compensación Médica'
    ]
  },
  {
    id: 'b9',
    numero: 9,
    nombre: 'Bloque # 9 Capilla',
    tituloCorto: 'Bloque 9 Capilla',
    color: '#8e3e63',
    colorSecundario: '#6a2a47',
    colorTexto: '#ffffff',
    categoria: 'espiritual',
    descripcion: 'Capilla histórica San Vicente de Paúl, lugar de reflexión y eucaristías.',
    svgType: 'rect',
    x: 705,
    y: 325,
    width: 75,
    height: 48,
    rx: 6,
    centroX: 742,
    centroY: 349,
    nodeId: 'node_b9',
    servicios: [
      'Capilla San Vicente de Paúl',
      'Servicios Espirituales y Acompañamiento'
    ]
  },
  {
    id: 'b10',
    numero: 10,
    nombre: 'Bloque # 10 Servicios y Cafetería',
    tituloCorto: 'Bloque 10 Servicios',
    color: '#8d6e63',
    colorSecundario: '#5d4037',
    colorTexto: '#ffffff',
    categoria: 'servicios_paciente',
    descripcion: 'Restaurante Compass, cafetería, cajeros automáticos, farmacia y bienestar.',
    svgType: 'rect',
    x: 635,
    y: 255,
    width: 110,
    height: 55,
    rx: 8,
    centroX: 690,
    centroY: 282,
    nodeId: 'node_b10',
    servicios: [
      'Restaurante Compass',
      'Capilla',
      'Fondo de Empleados',
      'Cajero Bancolombia',
      'Cajero Banco de Bogotá',
      'Servicio Farmacéutico',
      'Cadena Logística',
      'Vigilancia Farmacológica',
      'Cafetería Delolita'
    ]
  },
  {
    id: 'b11',
    numero: 11,
    nombre: 'Bloque # 11 Hospital Infantil',
    tituloCorto: 'Bloque 11 Hospital Infantil',
    color: '#a3d8c6',
    colorSecundario: '#48a98a',
    colorTexto: '#1c4d3d',
    categoria: 'pediatria',
    descripcion: 'Sede especializada infantil: Urgencias pediátricas, UCI neonatal e infantil y salas pediátricas.',
    svgType: 'polygon',
    puntos: '650,230 690,120 865,150 820,250 740,240',
    centroX: 755,
    centroY: 185,
    nodeId: 'node_b11_sur',
    servicios: [
      'Urgencias Pediátricas',
      'Rayos X Infantil',
      'UCI Infantil',
      'UCE Infantil',
      'Quirófanos Infantil',
      'Punto de Despacho de Cirugía Infantil',
      'Consulta Externa Pediátrica',
      'Lactario',
      'Sala de Quemados Infantil',
      'Sala de Oncología Pediátrica',
      'Sala de Aislados',
      'Banco de Tejidos',
      'Central de Mezclas',
      'Sala de Lactantes',
      'Sala Pediatría Tercer Piso',
      'Sala Pediatría Cuarto Piso',
      'Nefrología Infantil',
      'UCI Santiago Corazón',
      'Aula Hospitalaria',
      'Quirófano Santiago Corazón',
      'Resonancia Magnética Pediátrica',
      'Dirección Unidad Infantil',
      'Experiencia del Paciente Infantil'
    ]
  },
  {
    id: 'b12',
    numero: 12,
    nombre: 'Bloque # 12 Diagnóstico e Imágenes',
    tituloCorto: 'Bloque 12 Diagnóstico',
    color: '#d94b4b',
    colorSecundario: '#b02a2a',
    colorTexto: '#ffffff',
    categoria: 'imagenes_dx',
    descripcion: 'Centro neurálgico de imágenes diagnósticas, tomografía, mamografía, endoscopia y quemados adultos.',
    svgType: 'polygon',
    puntos: '360,175 425,130 625,160 590,225 380,205',
    centroX: 495,
    centroY: 165,
    nodeId: 'node_b12_sur',
    servicios: [
      'Sala Santa Lucía',
      'Quemados Adultos',
      'UCI Neonatos',
      'UCE Neonatos',
      'Neonatos Básico',
      'Endoscopia Digestiva',
      'Intervencionismo Gastro',
      'Tomógrafo Central',
      'Ecografía y Mamógrafo',
      'Rayos X Central',
      'Angiógrafo',
      'Registros Médicos y Estadística',
      'Gestión Humana'
    ]
  },
  {
    id: 'b13',
    numero: 13,
    nombre: 'Bloque # 13 Patología UdeA',
    tituloCorto: 'Bloque 13 Patología',
    color: '#b71c1c',
    colorSecundario: '#7f0000',
    colorTexto: '#ffffff',
    categoria: 'laboratorio',
    descripcion: 'Laboratorio de anatomía patológica en convenio con la Universidad de Antioquia.',
    svgType: 'rect',
    x: 240,
    y: 140,
    width: 105,
    height: 40,
    rx: 6,
    centroX: 292,
    centroY: 160,
    nodeId: 'node_b13',
    servicios: [
      'Patología UdeA',
      'Laboratorio de Biopsias y Citología'
    ]
  },
  {
    id: 'b14',
    numero: 14,
    nombre: 'Bloque # 14 Policlínica (Urgencias Adultos)',
    tituloCorto: 'Bloque 14 Urgencias Adultos',
    color: '#70a1d7',
    colorSecundario: '#3571b8',
    colorTexto: '#ffffff',
    categoria: 'urgencias',
    descripcion: 'Servicio de urgencias adultos 24 horas, salas de observación, triage y UCI Santa Margarita.',
    svgType: 'rect',
    x: 285,
    y: 95,
    width: 85,
    height: 45,
    rx: 6,
    centroX: 327,
    centroY: 117,
    nodeId: 'node_b14_sur',
    servicios: [
      'Urgencias Adultos (24 Horas)',
      'Punto de Despacho Urgencias',
      'Sala de Observación Urgencias',
      'Tomógrafo de Urgencias',
      'Atención Inicial (Triage)',
      'Quirófanos Urgencias',
      'UCI Santa Margarita',
      'UCI San Miguel',
      'Coordinación de Urgencias'
    ]
  },
  {
    id: 'b15',
    numero: 15,
    nombre: 'Bloque # 15 Banco de Sangre y Laboratorio',
    tituloCorto: 'Bloque 15 Banco Sangre',
    color: '#2452a8',
    colorSecundario: '#173673',
    colorTexto: '#ffffff',
    categoria: 'laboratorio',
    descripcion: 'Banco de sangre, toma de muestras ambulatoria, laboratorio clínico y farmacia Colsubsidio.',
    svgType: 'rect',
    x: 195,
    y: 75,
    width: 95,
    height: 50,
    rx: 6,
    centroX: 242,
    centroY: 100,
    nodeId: 'node_b15_sur',
    servicios: [
      'Banco de Sangre',
      'Laboratorio Clínico Central',
      'Consulta Externa Laboratorio',
      'Unidad de Investigación',
      'Toma de Muestras',
      'Droguería Colsubsidio',
      'Centro de Operaciones Hospitalarias'
    ]
  },
  {
    id: 'b16',
    numero: 16,
    nombre: 'Bloque # 16 Apoyo Norte',
    tituloCorto: 'Bloque 16 Apoyo Norte',
    color: '#8e44ad',
    colorSecundario: '#6c3483',
    colorTexto: '#ffffff',
    categoria: 'apoyo',
    descripcion: 'Servicios de logística e infraestructura costado norte (Barranquilla).',
    svgType: 'rect',
    x: 340,
    y: 90,
    width: 190,
    height: 45,
    rx: 6,
    centroX: 435,
    centroY: 112,
    nodeId: 'node_pasillo_norte',
    servicios: [
      'Acceso Norte Calle 67',
      'Servicios de Apoyo y Mantenimiento'
    ]
  },
  {
    id: 'b17',
    numero: 17,
    nombre: 'Bloque # 17 Gestión Institucional',
    tituloCorto: 'Bloque 17 Terceros',
    color: '#688f4e',
    colorSecundario: '#4a6936',
    colorTexto: '#ffffff',
    categoria: 'administrativo',
    descripcion: 'Oficinas de cartera, atención a terceros, sala de duelo y calidad.',
    svgType: 'rect',
    x: 140,
    y: 120,
    width: 55,
    height: 65,
    rx: 6,
    centroX: 167,
    centroY: 152,
    nodeId: 'node_b17',
    servicios: [
      'Terceros',
      'Cartera y Cobranzas',
      'Sala de Duelo',
      'Calidad Institucional',
      'Diamante'
    ]
  }
]

export const ELEMENTOS_CAMPUS = {
  fuenteCentral: {
    cx: 490,
    cy: 360,
    r: 26,
    nombre: 'Fuente Central'
  }
}

// Red de Nodos Peatonales (Alineada al plano 3D)
export const NODOS_GRAFO = {
  // Entradas
  node_sur_calle64: { id: 'node_sur_calle64', nombre: 'Puerta Calle 64 (Sur)', x: 470, y: 570, esEntrada: true },
  node_norte_calle67: { id: 'node_norte_calle67', nombre: 'Puerta Calle 67 Barranquilla (Norte)', x: 405, y: 65, esEntrada: true },
  node_oeste_carabobo: { id: 'node_oeste_carabobo', nombre: 'Puerta Cra 52 Carabobo (Oeste)', x: 75, y: 310, esEntrada: true },
  node_este_bolivar: { id: 'node_este_bolivar', nombre: 'Puerta Cra 51 Bolívar (Este)', x: 885, y: 340, esEntrada: true },

  // Avenidas y camellones sur
  node_sur_avenida: { id: 'node_sur_avenida', nombre: 'Paso Entrada Sur', x: 470, y: 500 },
  node_bloque1: { id: 'node_bloque1', nombre: 'Frente a Bloque 1 Comfama', x: 410, y: 500, bloqueId: 'b1' },
  node_bloque2: { id: 'node_bloque2', nombre: 'Frente a Bloque 2 Dirección', x: 530, y: 520, bloqueId: 'b2' },
  node_bloque6_este: { id: 'node_bloque6_este', nombre: 'Puerta Bloque 6 Pensionados', x: 280, y: 420, bloqueId: 'b6' },
  node_camellon_sur: { id: 'node_camellon_sur', nombre: 'Camellón Sur Arbolado', x: 330, y: 440 },
  node_b5_oeste: { id: 'node_b5_oeste', nombre: 'Acceso Oeste Bloque 5', x: 380, y: 430, bloqueId: 'b5' },
  node_b5_norte: { id: 'node_b5_norte', nombre: 'Acceso Norte Bloque 5', x: 490, y: 390, bloqueId: 'b5' },

  // Plaza Central de la Fuente
  node_fuente: { id: 'node_fuente', nombre: 'Plaza Fuente Central', x: 490, y: 360, esHito: true },
  node_fuente_oeste: { id: 'node_fuente_oeste', nombre: 'Sendero Oeste de la Fuente', x: 330, y: 360 },
  node_fuente_este: { id: 'node_fuente_este', nombre: 'Sendero Este de la Fuente', x: 630, y: 360 },

  // Bloque 8 Cirugía y Centro
  node_b8_sur: { id: 'node_b8_sur', nombre: 'Entrada Sur Bloque 8 Cirugía', x: 490, y: 330, bloqueId: 'b8' },
  node_b8_norte: { id: 'node_b8_norte', nombre: 'Paso Norte Bloque 8', x: 490, y: 220, bloqueId: 'b8' },
  node_camellon_centro: { id: 'node_camellon_centro', nombre: 'Camellón Central (B7 - B8)', x: 340, y: 280 },
  node_b7_este: { id: 'node_b7_este', nombre: 'Entrada Este Bloque 7', x: 270, y: 260, bloqueId: 'b7' },
  node_b7_oeste: { id: 'node_b7_oeste', nombre: 'Paso Carabobo Bloque 7', x: 130, y: 280, bloqueId: 'b7' },

  // Noroccidente (B17, B13, B14, B15)
  node_b17: { id: 'node_b17', nombre: 'Frente a Bloque 17 Terceros', x: 190, y: 170, bloqueId: 'b17' },
  node_interseccion_noroeste: { id: 'node_interseccion_noroeste', nombre: 'Cruce Noroeste Jardines', x: 340, y: 200 },
  node_b13: { id: 'node_b13', nombre: 'Frente a Bloque 13 Patología', x: 310, y: 180, bloqueId: 'b13' },
  node_b14_sur: { id: 'node_b14_sur', nombre: 'Entrada Urgencias Bloque 14', x: 330, y: 140, bloqueId: 'b14' },
  node_b15_sur: { id: 'node_b15_sur', nombre: 'Entrada Laboratorio Bloque 15', x: 260, y: 130, bloqueId: 'b15' },
  node_pasillo_norte: { id: 'node_pasillo_norte', nombre: 'Corredor Norte Barranquilla', x: 370, y: 120 },

  // Bloque 12
  node_b12_sur: { id: 'node_b12_sur', nombre: 'Entrada Bloque 12 Diagnóstico', x: 490, y: 195, bloqueId: 'b12' },

  // Costado Oriente (B9, B10, B11, B3, B4)
  node_jardines_oriente: { id: 'node_jardines_oriente', nombre: 'Sendero Jardines Oriente', x: 630, y: 280 },
  node_b10: { id: 'node_b10', nombre: 'Entrada Bloque 10 Cafetería/Cajeros', x: 650, y: 280, bloqueId: 'b10' },
  node_b9: { id: 'node_b9', nombre: 'Entrada Bloque 9 Capilla', x: 700, y: 350, bloqueId: 'b9' },
  node_b4: { id: 'node_b4', nombre: 'Frente a Bloque 4', x: 700, y: 430, bloqueId: 'b4' },
  node_b3: { id: 'node_b3', nombre: 'Entrada Bloque 3 Cardiovascular', x: 700, y: 510, bloqueId: 'b3' },
  node_parqueadero: { id: 'node_parqueadero', nombre: 'Paso Peatonal Parqueaderos', x: 770, y: 280 },
  node_b11_sur: { id: 'node_b11_sur', nombre: 'Entrada Principal Bloque 11 Infantil', x: 720, y: 240, bloqueId: 'b11' }
}

// Conexiones peatonales con distancias en metros
export const CONEXIONES_GRAFO = [
  // Sur (Calle 64 hacia el interior)
  { de: 'node_sur_calle64', a: 'node_sur_avenida', metros: 35, instruccion: 'Ingresa por la Calle 64 hacia el camellón central' },
  { de: 'node_sur_avenida', a: 'node_bloque1', metros: 30, instruccion: 'Gira a la izquierda hacia Bloque 1 Comfama' },
  { de: 'node_sur_avenida', a: 'node_bloque2', metros: 35, instruccion: 'Avanza hacia Bloque 2 Dirección General' },
  { de: 'node_sur_avenida', a: 'node_camellon_sur', metros: 35, instruccion: 'Sube por el camellón arbolado hacia el norte' },
  { de: 'node_camellon_sur', a: 'node_bloque6_este', metros: 25, instruccion: 'Gira hacia Bloque 6 Pensionados' },

  // Camellón sur hacia Bloque 5 y Fuente
  { de: 'node_camellon_sur', a: 'node_b5_oeste', metros: 20, instruccion: 'Ingresa al Bloque 5 por el costado occidental' },
  { de: 'node_camellon_sur', a: 'node_fuente_oeste', metros: 40, instruccion: 'Avanza recto hacia la glorieta central' },
  { de: 'node_fuente_oeste', a: 'node_fuente', metros: 35, instruccion: 'Gira hacia la Fuente Central' },
  { de: 'node_fuente', a: 'node_b5_norte', metros: 15, instruccion: 'Ingresa al Bloque 5 Rehabilitación por el acceso norte' },
  { de: 'node_fuente', a: 'node_b8_sur', metros: 15, instruccion: 'Ingresa al Bloque 8 Cirugía por la puerta sur' },
  { de: 'node_fuente', a: 'node_fuente_este', metros: 35, instruccion: 'Bordea la fuente hacia los jardines orientales' },

  // Hacia Carabobo (Oeste)
  { de: 'node_oeste_carabobo', a: 'node_b7_oeste', metros: 30, instruccion: 'Ingresa por Carabobo hacia Bloque 7' },
  { de: 'node_b7_oeste', a: 'node_camellon_centro', metros: 50, instruccion: 'Cruza el pasillo lateral hacia el camellón central' },
  { de: 'node_camellon_centro', a: 'node_b7_este', metros: 20, instruccion: 'Llega a la entrada este del Bloque 7 Medicina Interna' },
  { de: 'node_camellon_centro', a: 'node_fuente_oeste', metros: 40, instruccion: 'Avanza al sur hacia la Fuente Central' },
  { de: 'node_camellon_centro', a: 'node_interseccion_noroeste', metros: 45, instruccion: 'Avanza al norte hacia Diagnóstico y Urgencias' },

  // Noroeste (Bloques 17, 13, 14 Policlínica, 15 Banco de Sangre)
  { de: 'node_interseccion_noroeste', a: 'node_b17', metros: 55, instruccion: 'Gira a la izquierda hacia Bloque 17 Terceros/Cartera' },
  { de: 'node_interseccion_noroeste', a: 'node_b13', metros: 30, instruccion: 'Dirígete a Bloque 13 Patología UdeA' },
  { de: 'node_interseccion_noroeste', a: 'node_b14_sur', metros: 40, instruccion: 'Avanza hacia la entrada de Urgencias Bloque 14' },
  { de: 'node_b14_sur', a: 'node_b15_sur', metros: 35, instruccion: 'Camina hacia el Bloque 15 Banco de Sangre y Laboratorio' },
  { de: 'node_interseccion_noroeste', a: 'node_pasillo_norte', metros: 45, instruccion: 'Avanza hacia la salida de Barranquilla' },
  { de: 'node_pasillo_norte', a: 'node_norte_calle67', metros: 30, instruccion: 'Llega a la Portería Norte Calle 67 - Barranquilla' },
  { de: 'node_pasillo_norte', a: 'node_b14_sur', metros: 25, instruccion: 'Ingresa a Urgencias Adultos Bloque 14' },

  // Bloque 12 y Conexiones Centro-Norte
  { de: 'node_interseccion_noroeste', a: 'node_b12_sur', metros: 40, instruccion: 'Accede al Bloque 12 Diagnóstico e Imágenes' },
  { de: 'node_b8_norte', a: 'node_b12_sur', metros: 25, instruccion: 'Pasa entre Bloque 8 y Bloque 12' },
  { de: 'node_b8_sur', a: 'node_b8_norte', metros: 60, instruccion: 'Atraviesa el pasillo central del Bloque 8 Cirugía' },

  // Costado Oriente (Bloque 10, Capilla, Bloque 4, Bloque 3)
  { de: 'node_fuente_este', a: 'node_jardines_oriente', metros: 40, instruccion: 'Sigue por el sendero oriente hacia Cafetería y Hospital Infantil' },
  { de: 'node_fuente_este', a: 'node_b9', metros: 35, instruccion: 'Dirígete a la Capilla (Bloque 9)' },
  { de: 'node_fuente_este', a: 'node_b4', metros: 35, instruccion: 'Avanza hacia Bloque 4' },
  { de: 'node_b4', a: 'node_b3', metros: 40, instruccion: 'Llega al Bloque 3 Cardiovascular' },
  { de: 'node_bloque2', a: 'node_b3', metros: 55, instruccion: 'Conecta con Bloque 3 Cardiovascular por el costado sur' },

  // Hospital Infantil (Bloque 11) y Parqueaderos Bolívar
  { de: 'node_jardines_oriente', a: 'node_b10', metros: 20, instruccion: 'Ingresa al Bloque 10 Restaurante Compass / Cajeros' },
  { de: 'node_jardines_oriente', a: 'node_b11_sur', metros: 35, instruccion: 'Avanza hacia la entrada del Bloque 11 Hospital Infantil' },
  { de: 'node_b10', a: 'node_parqueadero', metros: 35, instruccion: 'Sal hacia la zona de parqueaderos' },
  { de: 'node_parqueadero', a: 'node_este_bolivar', metros: 45, instruccion: 'Llega a la Portería Carrera 51 - Bolívar' },
  { de: 'node_b11_sur', a: 'node_parqueadero', metros: 35, instruccion: 'Camina entre el Hospital Infantil y los parqueaderos' },
  { de: 'node_b12_sur', a: 'node_b11_sur', metros: 65, instruccion: 'Conecta del Bloque 12 hacia el Hospital Infantil' }
]

/**
 * Encuentra el nodo transitable más cercano a una coordenada (x, y)
 */
export function encontrarNodoMasCercano(x, y) {
  let mejorNodoId = 'node_sur_calle64'
  let menorDistancia = Infinity

  Object.values(NODOS_GRAFO).forEach(nodo => {
    const d = Math.hypot(nodo.x - x, nodo.y - y)
    if (d < menorDistancia) {
      menorDistancia = d
      mejorNodoId = nodo.id
    }
  })

  return NODOS_GRAFO[mejorNodoId]
}

/**
 * Algoritmo Dijkstra para calcular la ruta óptima más corta entre dos nodos
 */
export function calcularRutaOptima(idNodoInicio, idNodoDestino) {
  if (!idNodoInicio || !idNodoDestino) return null
  if (idNodoInicio === idNodoDestino) {
    const nodo = NODOS_GRAFO[idNodoInicio]
    return {
      nodos: [nodo],
      polilinea: `${nodo.x},${nodo.y}`,
      distanciaMetros: 0,
      tiempoMinutos: 1,
      instrucciones: [{
        paso: 1,
        icono: 'mdi-check-circle',
        texto: `Ya te encuentras en: ${nodo.nombre}`,
        distancia: 0,
        x: nodo.x,
        y: nodo.y
      }]
    }
  }

  const grafo = {}
  Object.keys(NODOS_GRAFO).forEach(id => { grafo[id] = [] })

  CONEXIONES_GRAFO.forEach(con => {
    if (grafo[con.de] && grafo[con.a]) {
      grafo[con.de].push({ nodo: con.a, metros: con.metros, instruccion: con.instruccion })
      grafo[con.a].push({ nodo: con.de, metros: con.metros, instruccion: con.instruccion })
    }
  })

  const distancias = {}
  const previos = {}
  const noVisitados = new Set(Object.keys(NODOS_GRAFO))

  Object.keys(NODOS_GRAFO).forEach(id => {
    distancias[id] = Infinity
  })
  distancias[idNodoInicio] = 0

  while (noVisitados.size > 0) {
    let nodoActual = null
    let menorDistancia = Infinity
    for (const nodo of noVisitados) {
      if (distancias[nodo] < menorDistancia) {
        menorDistancia = distancias[nodo]
        nodoActual = nodo
      }
    }

    if (!nodoActual || menorDistancia === Infinity) break
    if (nodoActual === idNodoDestino) break

    noVisitados.delete(nodoActual)

    const vecinos = grafo[nodoActual] || []
    for (const { nodo: vecino, metros } of vecinos) {
      if (noVisitados.has(vecino)) {
        const nuevaDist = distancias[nodoActual] + metros
        if (nuevaDist < distancias[vecino]) {
          distancias[vecino] = nuevaDist
          previos[vecino] = nodoActual
        }
      }
    }
  }

  if (distancias[idNodoDestino] === Infinity) return null

  const caminoIds = []
  let actual = idNodoDestino
  while (actual) {
    caminoIds.unshift(actual)
    actual = previos[actual]
  }

  const nodosCamino = caminoIds.map(id => NODOS_GRAFO[id])
  const polilinea = nodosCamino.map(n => `${n.x},${n.y}`).join(' ')
  const distanciaTotal = distancias[idNodoDestino]
  const tiempoMinutos = Math.max(1, Math.ceil(distanciaTotal / 60))

  const instrucciones = []
  for (let i = 0; i < caminoIds.length - 1; i++) {
    const origen = NODOS_GRAFO[caminoIds[i]]
    const destino = NODOS_GRAFO[caminoIds[i + 1]]
    const conexion = grafo[caminoIds[i]].find(c => c.nodo === caminoIds[i + 1])
    const metros = conexion ? conexion.metros : 30

    const dx = destino.x - origen.x
    const dy = destino.y - origen.y
    let icono = 'mdi-arrow-up-bold'

    if (Math.abs(dx) > Math.abs(dy)) {
      icono = dx > 0 ? 'mdi-arrow-right-top' : 'mdi-arrow-left-top'
    } else {
      icono = dy > 0 ? 'mdi-arrow-down-bold' : 'mdi-arrow-up-bold'
    }

    let textoInstruccion = conexion?.instruccion || `Avanza hacia ${destino.nombre}`
    if (i === 0) {
      textoInstruccion = `Inicia en ${origen.nombre}. ${textoInstruccion}`
    }

    instrucciones.push({
      paso: i + 1,
      nodoOrigenId: origen.id,
      nodoDestinoId: destino.id,
      x: origen.x,
      y: origen.y,
      icono,
      texto: textoInstruccion,
      distancia: metros
    })
  }

  const nodoFinal = NODOS_GRAFO[idNodoDestino]
  instrucciones.push({
    paso: instrucciones.length + 1,
    nodoOrigenId: nodoFinal.id,
    nodoDestinoId: nodoFinal.id,
    x: nodoFinal.x,
    y: nodoFinal.y,
    icono: 'mdi-flag-checkered',
    texto: `Has llegado a tu destino: ${nodoFinal.nombre}`,
    distancia: 0
  })

  return {
    nodos: nodosCamino,
    polilinea,
    distanciaMetros: distanciaTotal,
    tiempoMinutos,
    instrucciones
  }
}

export function buscarDestinos(termino) {
  if (!termino || termino.trim().length === 0) return []
  const q = termino.trim().toLowerCase()
  const resultados = []

  BLOQUES_MEDELLIN.forEach(bloque => {
    if (bloque.nombre.toLowerCase().includes(q) || `bloque ${bloque.numero}`.includes(q)) {
      resultados.push({
        tipo: 'bloque',
        titulo: bloque.nombre,
        subtitulo: bloque.descripcion,
        bloque,
        nodeId: bloque.nodeId,
        icono: 'mdi-hospital-building'
      })
    }

    bloque.servicios.forEach(serv => {
      if (serv.toLowerCase().includes(q)) {
        resultados.push({
          tipo: 'servicio',
          titulo: serv,
          subtitulo: `${bloque.nombre} (${bloque.categoria})`,
          bloque,
          nodeId: bloque.nodeId,
          icono: 'mdi-medical-bag'
        })
      }
    })
  })

  ENTRADAS_HOSPITAL.forEach(ent => {
    if (ent.nombre.toLowerCase().includes(q) || ent.calle.toLowerCase().includes(q)) {
      resultados.push({
        tipo: 'entrada',
        titulo: ent.nombre,
        subtitulo: ent.descripcion,
        entrada: ent,
        nodeId: ent.nodeId,
        icono: ent.icono
      })
    }
  })

  return resultados.slice(0, 15)
}

export const CATEGORIAS_FILTRO = [
  { id: 'todas', label: 'Todos', icono: 'mdi-view-grid' },
  { id: 'urgencias', label: '🚨 Urgencias', icono: 'mdi-ambulance' },
  { id: 'laboratorio', label: '🧪 Laboratorio y Muestras', icono: 'mdi-test-tube' },
  { id: 'pediatria', label: '👶 Pediatría', icono: 'mdi-baby-face-outline' },
  { id: 'imagenes_dx', label: '🩻 Rayos X e Imágenes', icono: 'mdi-radiology-box' },
  { id: 'servicios_paciente', label: '☕ Cafetería, Cajeros y Farmacia', icono: 'mdi-store' },
  { id: 'rehabilitacion', label: '♿ Medicina Física y Terapias', icono: 'mdi-wheelchair' },
  { id: 'cirugia_uci', label: '🏥 Quirófanos y UCI', icono: 'mdi-hospital-box' }
]
