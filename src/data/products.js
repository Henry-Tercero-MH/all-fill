import { PHOTOS } from './images'

// Categorías reales de ALL-FILL. Coral + ink como acentos de marca.
export const categories = [
  { id: 'todos', label: 'Todo' },
  { id: 'llaveros', label: 'Llaveros' },
  { id: 'soportes', label: 'Soportes' },
  { id: 'antiestres', label: 'Antiestrés' },
  { id: 'silbatos', label: 'Silbatos' },
  { id: 'figuritas', label: 'Figuritas' },
  { id: 'instrumentos', label: 'Instrumentos' },
  { id: 'hogar', label: 'Hogar y útiles' },
]

export const catColor = {
  llaveros: '#F95C4B', // coral
  soportes: '#171818', // ink
  antiestres: '#F95C4B', // coral
  silbatos: '#171818', // ink
  figuritas: '#F95C4B', // coral
  instrumentos: '#171818', // ink
  hogar: '#F95C4B', // coral
}

export const products = [
  // Llaveros
  {
    id: 1,
    name: 'Llavero perrito',
    category: 'llaveros',
    price: 35,
    photo: PHOTOS.llaveroPerrito,
    tag: 'El más pedido',
    desc: 'Un perrito con muchísimo detalle. Lo hacemos en el color que prefieras.',
  },
  {
    id: 2,
    name: 'Llavero pulpo',
    category: 'llaveros',
    price: 40,
    photo: PHOTOS.llaveroPulpo,
    tag: 'Articulado',
    desc: 'Articulado y flexible, se mueve de verdad. Imposible no jugar con él.',
  },
  {
    id: 3,
    name: 'Llavero copa',
    category: 'llaveros',
    price: 30,
    photo: PHOTOS.llaveroCopa,
    desc: 'Para el campeón de la casa. Ideal como recuerdo o premio.',
  },
  // Soportes
  {
    id: 4,
    name: 'Soporte gatito para teléfono',
    category: 'soportes',
    price: 55,
    photo: PHOTOS.soporteTelefonoGatito,
    tag: 'Nuevo',
    desc: 'Un gatito que sostiene tu teléfono con muchísima ternura.',
  },
  {
    id: 5,
    name: 'Soporte para teléfono',
    category: 'soportes',
    price: 45,
    photo: PHOTOS.soporteTelefono,
    desc: 'Práctico y estable para ver tus videos o videollamadas.',
  },
  {
    id: 6,
    name: 'Soporte minimalista',
    category: 'soportes',
    price: 45,
    photo: PHOTOS.soporteTelefonoMin,
    desc: 'Líneas limpias para tu escritorio. Discreto y elegante.',
  },
  {
    id: 7,
    name: 'Soporte para laptop',
    category: 'soportes',
    price: 120,
    photo: PHOTOS.soporteLaptop,
    desc: 'Eleva tu laptop a una altura cómoda. Mejor postura, menos calor.',
  },
  {
    id: 8,
    name: 'Soporte laptop ventilado',
    category: 'soportes',
    price: 140,
    photo: PHOTOS.soporteLaptopPerforado,
    tag: 'Ventilado',
    desc: 'Diseño perforado que ayuda a que tu laptop respire mejor.',
  },
  // Antiestrés
  {
    id: 9,
    name: 'Engranaje antiestrés',
    category: 'antiestres',
    price: 50,
    photo: PHOTOS.engranaje,
    tag: 'Antiestrés',
    desc: 'Gíralo una y otra vez. Adictivo y relajante, en colores vivos.',
  },
  {
    id: 10,
    name: 'Bola de masaje para pies',
    category: 'antiestres',
    price: 40,
    photo: PHOTOS.bolaPies,
    desc: 'Rueda bajo tu pie y libera tensión al final del día.',
  },
  {
    id: 11,
    name: 'Tortuga giratoria',
    category: 'antiestres',
    price: 35,
    photo: PHOTOS.tortuga,
    desc: 'Pequeña tortuga que gira sin parar. Para manos inquietas.',
  },
  {
    id: 12,
    name: 'Rodillo de masaje para pies',
    category: 'antiestres',
    price: 60,
    photo: PHOTOS.rodilloPies,
    desc: 'Masaje casero para tus pies. Cómodo y resistente.',
  },
  // Figuritas
  {
    id: 13,
    name: 'Delfín miniatura',
    category: 'figuritas',
    price: 30,
    photo: PHOTOS.delfin,
    desc: 'Pequeño delfín con buen acabado. Perfecto para coleccionar.',
  },
  {
    id: 14,
    name: 'Tiburoncín',
    category: 'figuritas',
    price: 30,
    photo: PHOTOS.tiburon,
    tag: 'Tierno',
    desc: 'Un tiburón adorable que le saca sonrisa a cualquiera.',
  },
  // Hogar y útiles
  {
    id: 15,
    name: 'Macetas decorativas',
    category: 'hogar',
    price: 75,
    photo: PHOTOS.macetas,
    tag: 'Favorito',
    desc: 'Acabado tipo estriado y colores cálidos para tus plantas.',
  },
  {
    id: 16,
    name: 'Ganchos de pared',
    category: 'hogar',
    price: 25,
    photo: PHOTOS.ganchos,
    desc: 'Organiza llaves, gorras o accesorios sin perder estilo.',
  },
  {
    id: 17,
    name: 'Protector de cable cerdito',
    category: 'hogar',
    price: 20,
    photo: PHOTOS.protectorCableCerdito,
    desc: 'Un cerdito que cuida tu cable de cargador de los dobleces.',
  },
  {
    id: 18,
    name: 'Protector de cargador',
    category: 'hogar',
    price: 20,
    photo: PHOTOS.protectorCargador,
    desc: 'Evita que tu cable se pele justo donde más se daña.',
  },
  // Llaveros de personajes
  {
    id: 19,
    name: 'Llavero Mini Batman',
    category: 'llaveros',
    price: 40,
    photo: PHOTOS.llaveroBatman,
    tag: 'Personaje',
    desc: 'El caballero de la noche en versión kawaii. Para fans de verdad.',
  },
  {
    id: 20,
    name: 'Llavero Buzz Lightyear',
    category: 'llaveros',
    price: 40,
    photo: PHOTOS.llaveroBuzz,
    tag: 'Personaje',
    desc: 'Al infinito y más allá, colgando de tus llaves.',
  },
  // Antiestrés
  {
    id: 21,
    name: 'Llavero teclas antiestrés',
    category: 'antiestres',
    price: 35,
    photo: PHOTOS.dobleTecla,
    tag: 'Satisfactorio',
    desc: 'Dos teclas que se presionan con un clic adictivo. Llévalo a todos lados.',
  },
  // Silbatos
  {
    id: 22,
    name: 'Mini silbato de emergencia',
    category: 'silbatos',
    price: 15,
    photo: PHOTOS.miniSilbato,
    tag: 'Hasta 115 dB',
    desc: 'Pequeñísimo pero potentísimo. Perfecto para llaves o mochila.',
  },
  {
    id: 23,
    name: 'Silbato águila',
    category: 'silbatos',
    price: 25,
    photo: PHOTOS.silbatoAguila,
    desc: 'Con forma de águila y un sonido que se escucha lejos.',
  },
  {
    id: 24,
    name: 'Silbato lobo',
    category: 'silbatos',
    price: 25,
    photo: PHOTOS.silbatoLobo,
    desc: 'Diseño de lobo, ideal como regalo original y útil.',
  },
  {
    id: 25,
    name: 'Silbato pajarillo',
    category: 'silbatos',
    price: 20,
    photo: PHOTOS.silbatoPajarillo,
    desc: 'Un pajarito que suena de verdad. Tierno y funcional.',
  },
  // Instrumentos
  {
    id: 26,
    name: 'Ukelele funcional',
    category: 'instrumentos',
    price: 180,
    photo: PHOTOS.ukulele,
    tag: 'Suena de verdad',
    desc: '¡Sí, se toca! Ukelele impreso en 3D en el color que elijas.',
  },
  // Más llaveros de personajes
  {
    id: 27,
    name: 'Llavero Escudo Capitán América',
    category: 'llaveros',
    price: 35,
    photo: PHOTOS.llaveroCapitan,
    tag: 'Personaje',
    desc: 'El escudo del Capitán, con sus colores y detalle. Para todo fan.',
  },
  {
    id: 28,
    name: 'Llavero Iron Man',
    category: 'llaveros',
    price: 40,
    photo: PHOTOS.llaveroIronman,
    tag: 'Personaje',
    desc: 'El héroe de hierro en miniatura, listo para tus llaves.',
  },
  {
    id: 29,
    name: 'Llavero pesas',
    category: 'llaveros',
    price: 30,
    photo: PHOTOS.llaveroPesas,
    desc: 'Para los amantes del gym. Un detalle fitness original.',
  },
]
