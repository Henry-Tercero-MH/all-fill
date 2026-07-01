// Fotos reales de las piezas ALL-FILL (en /public/img).
// U() devuelve la ruta local tal cual; si fuese un ID de Unsplash, arma la URL.
const img = (file) => `/img/${file}`

export const U = (id, w = 800) => {
  if (!id) return ''
  // Links de Google Drive (cualquier formato) → lh3 (más confiable para <img>).
  if (id.includes('drive.google.com') || id.includes('googleusercontent.com')) {
    const m = id.match(/[-\w]{25,}/)
    return m ? `https://lh3.googleusercontent.com/d/${m[0]}` : id
  }
  // Rutas locales (/img/...) u otras URLs completas se usan tal cual.
  if (id.startsWith('/') || id.startsWith('http')) return id
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`
}

export const PHOTOS = {
  // Llaveros
  llaveroPerrito: img('llaveroPerrito.webp'),
  llaveroCopa: img('llaveroCopa.webp'),
  llaveroPulpo: img('llavero_pulpo2.webp'),
  llaveroBatman: img('llaverobatman.webp'),
  llaveroBuzz: img('llaveroBuzzlightyear.webp'),
  llaveroCapitan: img('llaveroEscudocapitanamerica.webp'),
  llaveroIronman: img('llaveroIromman.webp'),
  llaveroPesas: img('llaverospesas.webp'),
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
  // Lámparas
  lamparaColgante: img('lamparacolgante.webp'),
  lamparaColgante2: img('lamparacolgante2.webp'),
  lamparaNegocios: img('lamparacolganteparanegociosrestaurantes.webp'),
  // Jarrones y decoración
  jarronSeda: img('jarrondesedaartistico.webp'),
  jarronEspiral: img('jarronespiral.webp'),
  jarronAcanalado: img('jarronacanaladoretorcido.webp'),
  // Organización y estantes
  portapapel: img('portapapelmayordomo.webp'),
  colgadorBloqueo: img('colgadorconbloqueoautomatico.webp'),
  soporteTrapos: img('soporteparatraposcocina.webp'),
  estanteParedLlavero: img('estantedeparedyllavero.webp'),
  estanteriaHexagonal: img('estanteriahexagonal.webp'),
  estanteriaEsquina: img('estanteriamodulardeesquina.webp'),
  estanteriaEscritorio: img('estanteriamodulardeescritorio.webp'),
  organizadorBano: img('organizadordebañoacanalado.webp'),
  estanteColgante: img('estantecolgantehexagonal.webp'),
  patasEstante: img('patasparaestante.webp'),
  interruptorJoystick: img('interruptordeparedconjostik.webp'),
  organizadorOficina: img('organizadordeescritorioparaoficinaconsoporteintegradoparatelefono.webp'),
  postikOrganizador: img('postikorganizador.webp'),
  miniTripode: img('minitripode.webp'),
  // Juguetes y otros
  katanaRetractil: img('katanaretractil.webp'),
  llaveroZapato: img('llaverozapato.webp'),
  rompecabezasEsfera: img('rompecabezasesfera.webp'),
  dispensadorCartas: img('dispensadordecartas.webp'),
  jugueteAntistres: img('jugueteantestres.webp'),
  rompecabezasNombre: img('rompecabezasdenombreparaniñospersonalizado.webp'),
  soportePaginaLibro: img('soportedepaginalibro.webp'),
  pajaroEquilibrio: img('pajarodeequilibrio.webp'),
  pescadorTazas: img('pescadordetazaste.webp'),
  colgadorLlavesCarrro: img('colgadordellavescarropartetrasera.webp'),
  destapadorBotellas: img('destapadordebotellas.webp'),
  calzador: img('calzador.webp'),
  calzadorLargo: img('calzadorlargo.webp'),
  patoRelajado: img('patorelajadofigurita.webp'),
  cortadorCinta: img('cortadordecinta.webp'),
  cortadorCinta2: img('cortadordecinta1.webp'),
  marcadorCocodrilo: img('marcadordecocodriloparalibro.webp'),
  llaveroIphone17: img('llaveroihpone17.webp'),
  altavozPasivo: img('altavozpasivoparatelefono.webp'),
  empuñadorIphone: img('empuñadordemanoparaiphone.webp'),
  amplificadorCiberdock: img('aplificadordeiphoneciberdock.webp'),
  // Llaveros (lote nuevo)
  llaveroBlockCemento: img('llaverodeblockdecemento.webp'),
  llaveroMotorV8: img('llaverodebloquedemotorv8.webp'),
  llaveroPiston: img('llaveropiston.webp'),
  // Hogar y útiles (lote nuevo)
  cajaToallas: img('cajadealmacenamientodetoallassanitarias.webp'),
  cajaBaterias: img('cajdebateriaAAcontapapresion.webp'),
  colgadorBatimovil: img('colgadordellavesbatimovil.webp'),
  estantePapel: img('estantepararollopapelhigienicopaered.webp'),
  exprimidorPasta: img('exprimidordepasta.webp'),
  fundaAirpods: img('fundaparairpods.webp'),
  guiaCostura: img('guiadededosparacosturaamano.webp'),
  limpiadorPuertos: img('herramientadelimpiezaparapuertosdecarga.webp'),
  miniclipBolsas: img('miniclipparabolsas.webp'),
  portaesponja: img('portaesponja.webp'),
  recipienteJabon: img('recipienteparajabon.webp'),
  soporteBalon: img('soportebalondepared.webp'),
  soporteBalonRepisa: img('soportedeparedparabalon.webp'),
  tarjeteroBatman: img('tarjeterobatman.webp'),
}
