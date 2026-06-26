// Fotos reales de las piezas HEMITH (en /public/img).
// U() devuelve la ruta local tal cual; si fuese un ID de Unsplash, arma la URL.
const img = (file) => `/img/${file}`

export const U = (id, w = 800) =>
  id.startsWith('/')
    ? id
    : `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`

export const PHOTOS = {
  // Llaveros
  llaveroPerrito: img('llaveroPerrito.webp'),
  llaveroCopa: img('llaveroCopa.webp'),
  llaveroPulpo: img('llavero_pulpo2.webp'),
  llaveroBatman: img('llaverobatman.webp'),
  llaveroBuzz: img('llaveroBuzzlightyear.webp'),
  // Soportes
  soporteTelefono: img('soporteTelefono.webp'),
  soporteTelefonoGatito: img('soporteTelefonoGatito.webp'),
  soporteTelefonoMin: img('soporteTelefonoMinumalista.webp'),
  soporteLaptop: img('soporteLaptop.webp'),
  soporteLaptopPerforado: img('soporteLaptopPerforado.webp'),
  // Antiestrés
  engranaje: img('dobleengranajeantiestresjuguete.webp'),
  bolaPies: img('bolaparapiesantiestres.webp'),
  tortuga: img('tortugaAntiestres.webp'),
  rodilloPies: img('rodillodemasajesparapies.webp'),
  dobleTecla: img('llaverojugueteantiestresdobletecla.webp'),
  // Silbatos
  miniSilbato: img('minisilbato.webp'),
  silbatoAguila: img('silbatoaguila.webp'),
  silbatoLobo: img('silbatolobo.webp'),
  silbatoPajarillo: img('silbatopajarillo.webp'),
  // Instrumentos
  ukulele: img('ukulele.webp'),
  // Figuritas
  delfin: img('delfinMiniatura.webp'),
  tiburon: img('tiburoncin.webp'),
  // Hogar y útiles
  macetas: img('macetas.webp'),
  ganchos: img('ganchosdepared.webp'),
  protectorCableCerdito: img('protectorcableFormadeCerdito.webp'),
  protectorCargador: img('protectorCargador.webp'),
}
