// ============================================================
// ALL-FILL — Impresión 3D · Backend en Google Apps Script
// ============================================================
// PASOS DE CONFIGURACIÓN:
//   1. Crea un Google Sheet nuevo y abre Extensiones → Apps Script
//   2. Pega TODO este archivo, guarda y recarga el Sheet
//   3. Menú "⚙️ ALL-FILL" → "Inicializar hojas"
//   4. Menú → "Configurar Drive" (autoriza Google Drive)
//   5. Menú → "Crear usuario admin" (usuario + contraseña del panel)
//   6. Menú → "Cargar catálogo" (mete los 87 productos actuales)
//   7. Implementar → Nueva implementación → Web App:
//        - Ejecutar como: Yo
//        - Quién tiene acceso: Cualquiera
//      Copia la URL /exec → va en el .env del sitio (VITE_APPS_SCRIPT_URL)
// ============================================================

// ── Menú personalizado ──────────────────────────────────────
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚙️ ALL-FILL')
    .addItem('▶ Inicializar hojas', 'inicializar')
    .addItem('📁 Configurar Drive', 'testDrive')
    .addSeparator()
    .addItem('🔑 Crear usuario admin', 'crearAdminDesdeMenu')
    .addItem('📦 Cargar catálogo (87 productos)', 'cargarCatalogo')
    .addItem('🗑  Limpiar catálogo', 'limpiarCatalogo')
    .addSeparator()
    .addItem('🌐 Ver URL del Web App', 'mostrarUrl')
    .addToUi();
}

var Props = PropertiesService.getScriptProperties();

function getSpreadsheetId() {
  var id = Props.getProperty('SPREADSHEET_ID');
  if (!id) {
    id = SpreadsheetApp.getActiveSpreadsheet().getId();
    Props.setProperty('SPREADSHEET_ID', id);
  }
  return id;
}
function getFolderId() { return Props.getProperty('FOLDER_ID'); }
function getSheet(name) { return SpreadsheetApp.openById(getSpreadsheetId()).getSheetByName(name); }

// Categorías válidas del sitio (deben coincidir con el frontend).
var CATEGORIAS = ['llaveros', 'soportes', 'antiestres', 'silbatos', 'figuritas', 'instrumentos', 'hogar'];

// ============================================================
// INICIALIZACIÓN
// ============================================================
function inicializar() {
  var ss = SpreadsheetApp.openById(getSpreadsheetId());
  var ui = SpreadsheetApp.getUi();

  var hojas = {
    'productos': ['id', 'nombre', 'descripcion', 'precio', 'categoria', 'tag',
                  'imagenUrl', 'disponible', 'destacado', 'fechaCreacion', 'likes'],
    'redes':     ['plataforma', 'url', 'activo'],
    'config':    ['clave', 'valor'],
    'admin':     ['usuario', 'passwordHash', 'email', 'ultimoAcceso']
  };

  var creadas = [], existentes = [];
  Object.keys(hojas).forEach(function(nombre) {
    var sheet = ss.getSheetByName(nombre);
    if (!sheet) { sheet = ss.insertSheet(nombre); creadas.push(nombre); }
    else { existentes.push(nombre); }

    var headers = hojas[nombre];
    var primerFila = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    if (primerFila[0] !== headers[0]) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length)
        .setBackground('#F95C4B').setFontColor('#ffffff').setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
    sheet.autoResizeColumns(1, headers.length);
  });

  // Config por defecto
  var configSheet = ss.getSheetByName('config');
  if (configSheet.getDataRange().getValues().length <= 1) {
    configSheet.getRange(2, 1, 6, 2).setValues([
      ['nombreTienda',   'ALL-FILL'],
      ['whatsapp',       '50240705002'],
      ['descripcionSeo', 'Impresión 3D con estrategia. Llaveros, soportes, silbatos, instrumentos y piezas personalizadas en Guatemala.'],
      ['horarios',       'Lun–Sáb: 9:00–18:00'],
      ['ciudad',         'Guatemala'],
      ['emailContacto',  'allfill2026@gmail.com']
    ]);
  }

  // Redes por defecto
  var redesSheet = ss.getSheetByName('redes');
  if (redesSheet.getDataRange().getValues().length <= 1) {
    redesSheet.getRange(2, 1, 4, 3).setValues([
      ['Instagram', 'https://www.instagram.com/allfill2026', true],
      ['TikTok',    'https://vt.tiktok.com/ZSCaV33oy/', true],
      ['YouTube',   'https://youtube.com/@allfill-y2j', true],
      ['WhatsApp',  'https://wa.me/50240705002', true]
    ]);
  }

  var msg = '✅ Listo.\n';
  if (creadas.length)   msg += '➕ Creadas: ' + creadas.join(', ') + '\n';
  if (existentes.length) msg += '✔ Existentes: ' + existentes.join(', ') + '\n';
  msg += '\nSiguiente: "Configurar Drive".';
  ui.alert('ALL-FILL — Setup', msg, ui.ButtonSet.OK);
}

// ============================================================
// CONFIGURAR DRIVE
// ============================================================
function testDrive() {
  var ui = SpreadsheetApp.getUi();
  try {
    DriveApp.getRootFolder().getName(); // fuerza autorización
    var folderId = Props.getProperty('FOLDER_ID');
    var folder;
    if (folderId) {
      try {
        folder = DriveApp.getFolderById(folderId);
        ui.alert('Drive — OK', '📁 ' + folder.getName() + '\n🔑 ' + folderId, ui.ButtonSet.OK);
        return;
      } catch (e) { folderId = null; }
    }
    folder = DriveApp.createFolder('ALL-FILL — Imágenes');
    folderId = folder.getId();
    Props.setProperty('FOLDER_ID', folderId);
    folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    ui.alert('Drive — Configurado', '📁 ALL-FILL — Imágenes\n🔑 ' + folderId, ui.ButtonSet.OK);
  } catch (e) {
    ui.alert('Error Drive', '❌ ' + e.toString(), ui.ButtonSet.OK);
  }
}

// ============================================================
// CARGAR / LIMPIAR CATÁLOGO
// ============================================================
function cargarCatalogo() {
  var ui = SpreadsheetApp.getUi();
  var sheet = getSheet('productos');
  if (!sheet) { ui.alert('Error', 'Primero "Inicializar hojas".', ui.ButtonSet.OK); return; }

  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    var resp = ui.alert('⚠ Ya hay productos',
      'La hoja tiene ' + (lastRow - 1) + ' filas. ¿Agregar los del catálogo igual?',
      ui.ButtonSet.YES_NO);
    if (resp !== ui.Button.YES) return;
  }

  var productos = getCatalogoOriginal();
  var ahora = new Date().toISOString();
  var filas = productos.map(function(p) {
    return [
      Utilities.getUuid(),
      p.titulo, p.descripcion, p.precio, p.categoria, p.tag || '',
      p.imagenUrl || '', true, !!p.destacado, ahora, 0
    ];
  });
  sheet.getRange(lastRow + 1, 1, filas.length, 11).setValues(filas);
  ui.alert('✅ Catálogo cargado', 'Se cargaron ' + filas.length + ' productos.', ui.ButtonSet.OK);
}

function limpiarCatalogo() {
  var ui = SpreadsheetApp.getUi();
  var sheet = getSheet('productos');
  if (ui.alert('⚠ ¿Limpiar catálogo?', 'Se eliminan TODOS los productos.', ui.ButtonSet.YES_NO) !== ui.Button.YES) return;
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) sheet.deleteRows(2, lastRow - 1);
  ui.alert('✅ Listo', 'Catálogo vacío.', ui.ButtonSet.OK);
}

// ============================================================
// USUARIO ADMIN
// ============================================================
function crearAdminDesdeMenu() {
  var ui = SpreadsheetApp.getUi();
  var u = ui.prompt('Nuevo admin', 'Usuario:', ui.ButtonSet.OK_CANCEL);
  if (u.getSelectedButton() !== ui.Button.OK) return;
  var p = ui.prompt('Nuevo admin', 'Contraseña:', ui.ButtonSet.OK_CANCEL);
  if (p.getSelectedButton() !== ui.Button.OK) return;
  var em = ui.prompt('Nuevo admin', 'Email (opcional):', ui.ButtonSet.OK_CANCEL);
  if (em.getSelectedButton() !== ui.Button.OK) return;

  var usuario = u.getResponseText().trim(), pass = p.getResponseText().trim(), email = em.getResponseText().trim();
  if (!usuario || !pass) { ui.alert('Error', 'Usuario y contraseña requeridos.', ui.ButtonSet.OK); return; }
  getSheet('admin').appendRow([usuario, sha256Hex(pass), email, '']);
  ui.alert('✅ Admin creado', 'Usuario: ' + usuario, ui.ButtonSet.OK);
}

function mostrarUrl() {
  var ui = SpreadsheetApp.getUi();
  var url = ScriptApp.getService().getUrl();
  if (!url) { ui.alert('Sin URL', 'Publica como Web App primero.', ui.ButtonSet.OK); return; }
  ui.alert('URL del Web App', url + '\n\nVa en el .env del sitio:\nVITE_APPS_SCRIPT_URL=' + url, ui.ButtonSet.OK);
}

// ============================================================
// HELPERS
// ============================================================
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
function sheetToObjects(sheet) {
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  return data.slice(1).map(function(row) {
    var obj = {};
    headers.forEach(function(h, i) { obj[h] = row[i]; });
    return obj;
  });
}
function sha256Hex(input) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input).map(function(b) {
    var hex = (b & 0xFF).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}
function isTruthy(v) { return v === true || v === 'TRUE' || v === 'true' || v === 1 || v === '1'; }

// Verifica que quien escribe sea un admin: el body debe traer "auth" = passwordHash válido.
function isAuthed(body) {
  if (!body || !body.auth) return false;
  return sheetToObjects(getSheet('admin')).some(function(u) {
    return String(u.passwordHash) === String(body.auth);
  });
}
var NO_AUTH = { error: 'No autorizado. Inicia sesión de nuevo.' };

// ============================================================
// doGet / doPost
// ============================================================
function doGet(e) {
  var action = e.parameter.action, result;
  try {
    switch (action) {
      case 'ping':              result = { ok: true, message: 'ALL-FILL Apps Script OK' }; break;
      case 'getProductos':      result = getProductos(); break;
      case 'getProductosAdmin': result = getProductosAdmin(); break;
      case 'getProducto':       result = getProducto(e.parameter.id); break;
      case 'getRedes':          result = getRedes(); break;
      case 'getConfig':         result = getConfig(); break;
      default: result = { error: 'Acción GET no reconocida: ' + action };
    }
  } catch (err) { result = { error: err.toString() }; }
  return jsonResponse(result);
}

function doPost(e) {
  var result;
  try {
    var body = JSON.parse(e.postData.getDataAsString());
    switch (body.action) {
      case 'login':              result = login(body); break;
      case 'crearProducto':      result = crearProducto(body); break;
      case 'actualizarProducto': result = actualizarProducto(body); break;
      case 'eliminarProducto':   result = eliminarProducto(body); break;
      case 'darLike':            result = darLike(body); break;
      case 'subirImagen':        result = subirImagen(body); break;
      case 'updateConfig':       result = updateConfig(body); break;
      case 'updateRedes':        result = updateRedes(body); break;
      default: result = { error: 'Acción POST no reconocida: ' + body.action };
    }
  } catch (err) { result = { error: err.toString() }; }
  return jsonResponse(result);
}

// ── GET ──
function getProductos() {
  return sheetToObjects(getSheet('productos')).filter(function(p) { return isTruthy(p.disponible); }).map(normalizeProducto);
}
function getProductosAdmin() {
  return sheetToObjects(getSheet('productos')).map(normalizeProducto);
}
function getProducto(id) {
  var p = sheetToObjects(getSheet('productos')).find(function(r) { return String(r.id) === String(id); });
  return p ? normalizeProducto(p) : { error: 'No encontrado' };
}
function getRedes() {
  return sheetToObjects(getSheet('redes')).filter(function(r) { return isTruthy(r.activo); });
}
function getConfig() {
  var c = {};
  sheetToObjects(getSheet('config')).forEach(function(row) { c[row.clave] = row.valor; });
  return c;
}

// ── POST ──
function login(body) {
  var sheet = getSheet('admin');
  var user = sheetToObjects(sheet).find(function(u) {
    return String(u.usuario) === String(body.usuario) && String(u.passwordHash) === String(body.passwordHash);
  });
  if (!user) return { ok: false };
  var data = sheet.getDataRange().getValues(), headers = data[0];
  var colU = headers.indexOf('ultimoAcceso'), colUsr = headers.indexOf('usuario');
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][colUsr]) === String(body.usuario)) {
      sheet.getRange(i + 1, colU + 1).setValue(new Date().toISOString());
      break;
    }
  }
  return { ok: true, email: user.email };
}

function crearProducto(body) {
  if (!isAuthed(body)) return NO_AUTH;
  var sheet = getSheet('productos');
  var id = Utilities.getUuid(), ahora = new Date().toISOString();
  sheet.appendRow([
    id, body.nombre || '', body.descripcion || '', Number(body.precio) || 0,
    body.categoria || '', body.tag || '', body.imagenUrl || '',
    body.disponible !== undefined ? body.disponible : true,
    body.destacado !== undefined ? body.destacado : false, ahora, 0
  ]);
  return { ok: true, id: id };
}

function actualizarProducto(body) {
  if (!isAuthed(body)) return NO_AUTH;
  var sheet = getSheet('productos');
  var data = sheet.getDataRange().getValues(), headers = data[0], colId = headers.indexOf('id');
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][colId]) === String(body.id)) {
      ['nombre', 'descripcion', 'precio', 'categoria', 'tag', 'imagenUrl', 'disponible', 'destacado'].forEach(function(campo) {
        if (body[campo] !== undefined) {
          var col = headers.indexOf(campo);
          if (col >= 0) sheet.getRange(i + 1, col + 1).setValue(campo === 'precio' ? Number(body[campo]) : body[campo]);
        }
      });
      return { ok: true };
    }
  }
  return { error: 'No encontrado: ' + body.id };
}

function eliminarProducto(body) {
  if (!isAuthed(body)) return NO_AUTH;
  var sheet = getSheet('productos');
  var data = sheet.getDataRange().getValues(), colId = data[0].indexOf('id');
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][colId]) === String(body.id)) { sheet.deleteRow(i + 1); return { ok: true }; }
  }
  return { error: 'No encontrado: ' + body.id };
}

// Suma un "me gusta" (público, sin login). delta puede ser +1 o -1.
function darLike(body) {
  var sheet = getSheet('productos');
  var data = sheet.getDataRange().getValues(), headers = data[0];
  var colId = headers.indexOf('id'), colLikes = headers.indexOf('likes');
  if (colLikes < 0) return { error: 'Falta la columna likes. Ejecuta "Inicializar hojas".' };
  var delta = Number(body.delta) === -1 ? -1 : 1;
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][colId]) === String(body.id)) {
      var actual = Number(data[i][colLikes]) || 0;
      var nuevo = Math.max(0, actual + delta);
      sheet.getRange(i + 1, colLikes + 1).setValue(nuevo);
      return { ok: true, likes: nuevo };
    }
  }
  return { error: 'No encontrado: ' + body.id };
}

function subirImagen(body) {
  if (!isAuthed(body)) return NO_AUTH;
  var folderId = getFolderId();
  if (!folderId) return { error: 'Drive no configurado. Ejecuta "Configurar Drive".' };
  var folder = DriveApp.getFolderById(folderId);
  var blob = Utilities.newBlob(Utilities.base64Decode(body.base64), body.mimeType || 'image/jpeg', body.nombreArchivo || ('img_' + Date.now() + '.jpg'));
  var file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  // Formato lh3: más confiable para incrustar en <img> que uc?export=view.
  return { ok: true, imagenUrl: 'https://lh3.googleusercontent.com/d/' + file.getId() };
}

function updateConfig(body) {
  if (!isAuthed(body)) return NO_AUTH;
  var sheet = getSheet('config');
  var data = sheet.getDataRange().getValues();
  Object.keys(body.config).forEach(function(clave) {
    var found = false;
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === clave) { sheet.getRange(i + 1, 2).setValue(body.config[clave]); found = true; break; }
    }
    if (!found) { sheet.appendRow([clave, body.config[clave]]); data.push([clave, body.config[clave]]); }
  });
  return { ok: true };
}

function updateRedes(body) {
  if (!isAuthed(body)) return NO_AUTH;
  var sheet = getSheet('redes');
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) sheet.deleteRows(2, lastRow - 1);
  body.redes.forEach(function(r) { sheet.appendRow([r.plataforma, r.url, r.activo]); });
  return { ok: true };
}

// ── Normalización: entrega el mismo shape que consume el sitio ──
function normalizeProducto(p) {
  return {
    id:            String(p.id || ''),
    nombre:        String(p.nombre || ''),
    descripcion:   String(p.descripcion || ''),
    precio:        Number(p.precio) || 0,
    categoria:     String(p.categoria || ''),
    tag:           String(p.tag || ''),
    imagenUrl:     String(p.imagenUrl || ''),
    disponible:    isTruthy(p.disponible),
    destacado:     isTruthy(p.destacado),
    likes:         Number(p.likes) || 0,
    fechaCreacion: String(p.fechaCreacion || '')
  };
}

// ============================================================
// CATÁLOGO ACTUAL (87 productos) — se cargan con el menú.
// imagenUrl usa las rutas locales /img/... que ya viven en el sitio.
// ============================================================
function getCatalogoOriginal() {
  return [
  {
    "titulo": "Llavero perrito",
    "descripcion": "Un perrito con muchísimo detalle. Lo hacemos en el color que prefieras.",
    "precio": 35,
    "categoria": "llaveros",
    "tag": "El más pedido",
    "imagenUrl": "/img/llaveroPerrito.webp"
  },
  {
    "titulo": "Llavero pulpo",
    "descripcion": "Articulado y flexible, se mueve de verdad. Imposible no jugar con él.",
    "precio": 40,
    "categoria": "llaveros",
    "tag": "Articulado",
    "imagenUrl": "/img/llavero_pulpo2.webp"
  },
  {
    "titulo": "Llavero copa",
    "descripcion": "Para el campeón de la casa. Ideal como recuerdo o premio.",
    "precio": 30,
    "categoria": "llaveros",
    "tag": "",
    "imagenUrl": "/img/llaveroCopa.webp"
  },
  {
    "titulo": "Soporte gatito para teléfono",
    "descripcion": "Un gatito que sostiene tu teléfono con muchísima ternura.",
    "precio": 55,
    "categoria": "soportes",
    "tag": "Nuevo",
    "imagenUrl": "/img/soporteTelefonoGatito.webp"
  },
  {
    "titulo": "Soporte para teléfono",
    "descripcion": "Práctico y estable para ver tus videos o videollamadas.",
    "precio": 45,
    "categoria": "soportes",
    "tag": "",
    "imagenUrl": "/img/soporteTelefono.webp"
  },
  {
    "titulo": "Soporte minimalista",
    "descripcion": "Líneas limpias para tu escritorio. Discreto y elegante.",
    "precio": 45,
    "categoria": "soportes",
    "tag": "",
    "imagenUrl": "/img/soporteTelefonoMinumalista.webp"
  },
  {
    "titulo": "Soporte para laptop",
    "descripcion": "Eleva tu laptop a una altura cómoda. Mejor postura, menos calor.",
    "precio": 120,
    "categoria": "soportes",
    "tag": "",
    "imagenUrl": "/img/soporteLaptop.webp"
  },
  {
    "titulo": "Soporte laptop ventilado",
    "descripcion": "Diseño perforado que ayuda a que tu laptop respire mejor.",
    "precio": 140,
    "categoria": "soportes",
    "tag": "Ventilado",
    "imagenUrl": "/img/soporteLaptopPerforado.webp"
  },
  {
    "titulo": "Engranaje antiestrés",
    "descripcion": "Gíralo una y otra vez. Adictivo y relajante, en colores vivos.",
    "precio": 50,
    "categoria": "antiestres",
    "tag": "Antiestrés",
    "imagenUrl": "/img/dobleengranajeantiestresjuguete.webp"
  },
  {
    "titulo": "Bola de masaje para pies",
    "descripcion": "Rueda bajo tu pie y libera tensión al final del día.",
    "precio": 40,
    "categoria": "antiestres",
    "tag": "",
    "imagenUrl": "/img/bolaparapiesantiestres.webp"
  },
  {
    "titulo": "Tortuga giratoria",
    "descripcion": "Pequeña tortuga que gira sin parar. Para manos inquietas.",
    "precio": 35,
    "categoria": "antiestres",
    "tag": "",
    "imagenUrl": "/img/tortugaAntiestres.webp"
  },
  {
    "titulo": "Rodillo de masaje para pies",
    "descripcion": "Masaje casero para tus pies. Cómodo y resistente.",
    "precio": 60,
    "categoria": "antiestres",
    "tag": "",
    "imagenUrl": "/img/rodillodemasajesparapies.webp"
  },
  {
    "titulo": "Delfín miniatura",
    "descripcion": "Pequeño delfín con buen acabado. Perfecto para coleccionar.",
    "precio": 30,
    "categoria": "figuritas",
    "tag": "",
    "imagenUrl": "/img/delfinMiniatura.webp"
  },
  {
    "titulo": "Tiburoncín",
    "descripcion": "Un tiburón adorable que le saca sonrisa a cualquiera.",
    "precio": 30,
    "categoria": "figuritas",
    "tag": "Tierno",
    "imagenUrl": "/img/tiburoncin.webp"
  },
  {
    "titulo": "Macetas decorativas",
    "descripcion": "Acabado tipo estriado y colores cálidos para tus plantas.",
    "precio": 75,
    "categoria": "hogar",
    "tag": "Favorito",
    "imagenUrl": "/img/macetas.webp"
  },
  {
    "titulo": "Ganchos de pared",
    "descripcion": "Organiza llaves, gorras o accesorios sin perder estilo.",
    "precio": 25,
    "categoria": "hogar",
    "tag": "",
    "imagenUrl": "/img/ganchosdepared.webp"
  },
  {
    "titulo": "Protector de cable cerdito",
    "descripcion": "Un cerdito que cuida tu cable de cargador de los dobleces.",
    "precio": 20,
    "categoria": "hogar",
    "tag": "",
    "imagenUrl": "/img/protectorcableFormadeCerdito.webp"
  },
  {
    "titulo": "Protector de cargador",
    "descripcion": "Evita que tu cable se pele justo donde más se daña.",
    "precio": 20,
    "categoria": "hogar",
    "tag": "",
    "imagenUrl": "/img/protectorCargador.webp"
  },
  {
    "titulo": "Llavero Mini Batman",
    "descripcion": "El caballero de la noche en versión kawaii. Para fans de verdad.",
    "precio": 40,
    "categoria": "llaveros",
    "tag": "Personaje",
    "imagenUrl": "/img/llaverobatman.webp"
  },
  {
    "titulo": "Llavero Buzz Lightyear",
    "descripcion": "Al infinito y más allá, colgando de tus llaves.",
    "precio": 40,
    "categoria": "llaveros",
    "tag": "Personaje",
    "imagenUrl": "/img/llaveroBuzzlightyear.webp"
  },
  {
    "titulo": "Llavero teclas antiestrés",
    "descripcion": "Dos teclas que se presionan con un clic adictivo. Llévalo a todos lados.",
    "precio": 35,
    "categoria": "antiestres",
    "tag": "Satisfactorio",
    "imagenUrl": "/img/llaverojugueteantiestresdobletecla.webp"
  },
  {
    "titulo": "Mini silbato de emergencia",
    "descripcion": "Pequeñísimo pero potentísimo. Perfecto para llaves o mochila.",
    "precio": 15,
    "categoria": "silbatos",
    "tag": "Hasta 115 dB",
    "imagenUrl": "/img/minisilbato.webp"
  },
  {
    "titulo": "Silbato águila",
    "descripcion": "Con forma de águila y un sonido que se escucha lejos.",
    "precio": 25,
    "categoria": "silbatos",
    "tag": "",
    "imagenUrl": "/img/silbatoaguila.webp"
  },
  {
    "titulo": "Silbato lobo",
    "descripcion": "Diseño de lobo, ideal como regalo original y útil.",
    "precio": 25,
    "categoria": "silbatos",
    "tag": "",
    "imagenUrl": "/img/silbatolobo.webp"
  },
  {
    "titulo": "Silbato pajarillo",
    "descripcion": "Un pajarito que suena de verdad. Tierno y funcional.",
    "precio": 20,
    "categoria": "silbatos",
    "tag": "",
    "imagenUrl": "/img/silbatopajarillo.webp"
  },
  {
    "titulo": "Ukelele funcional",
    "descripcion": "¡Sí, se toca! Ukelele impreso en 3D en el color que elijas.",
    "precio": 180,
    "categoria": "instrumentos",
    "tag": "Suena de verdad",
    "imagenUrl": "/img/ukulele.webp"
  },
  {
    "titulo": "Llavero Escudo Capitán América",
    "descripcion": "El escudo del Capitán, con sus colores y detalle. Para todo fan.",
    "precio": 35,
    "categoria": "llaveros",
    "tag": "Personaje",
    "imagenUrl": "/img/llaveroEscudocapitanamerica.webp"
  },
  {
    "titulo": "Llavero Iron Man",
    "descripcion": "El héroe de hierro en miniatura, listo para tus llaves.",
    "precio": 40,
    "categoria": "llaveros",
    "tag": "Personaje",
    "imagenUrl": "/img/llaveroIromman.webp"
  },
  {
    "titulo": "Llavero pesas",
    "descripcion": "Para los amantes del gym. Un detalle fitness original.",
    "precio": 30,
    "categoria": "llaveros",
    "tag": "",
    "imagenUrl": "/img/llaverospesas.webp"
  },
  {
    "titulo": "Llavero zapato",
    "descripcion": "Un zapatito con muchísimo detalle. Ideal como regalo o recuerdo.",
    "precio": 30,
    "categoria": "llaveros",
    "tag": "",
    "imagenUrl": "/img/llaverozapato.webp"
  },
  {
    "titulo": "Lámpara colgante",
    "descripcion": "Lámpara decorativa impresa en 3D. Da una luz cálida y un toque único a tu espacio.",
    "precio": 150,
    "categoria": "hogar",
    "tag": "Nuevo",
    "imagenUrl": "/img/lamparacolgante.webp"
  },
  {
    "titulo": "Lámpara colgante moderna",
    "descripcion": "Diseño moderno con acabado artesanal. Perfecta para sala o dormitorio.",
    "precio": 160,
    "categoria": "hogar",
    "tag": "",
    "imagenUrl": "/img/lamparacolgante2.webp"
  },
  {
    "titulo": "Lámpara para negocios",
    "descripcion": "Ideal para restaurantes, cafeterías o tiendas. Da ambiente y estilo.",
    "precio": 200,
    "categoria": "hogar",
    "tag": "Para locales",
    "imagenUrl": "/img/lamparacolganteparanegociosrestaurantes.webp"
  },
  {
    "titulo": "Jarrón de seda artístico",
    "descripcion": "Acabado que imita la textura de la seda. Elegante y original.",
    "precio": 90,
    "categoria": "hogar",
    "tag": "Decoración",
    "imagenUrl": "/img/jarrondesedaartistico.webp"
  },
  {
    "titulo": "Jarrón espiral",
    "descripcion": "Forma espiral que se convierte en el centro de atención del cuarto.",
    "precio": 85,
    "categoria": "hogar",
    "tag": "",
    "imagenUrl": "/img/jarronespiral.webp"
  },
  {
    "titulo": "Jarrón acanalado retorcido",
    "descripcion": "Textura acanalada con una forma retorcida que lo hace irrepetible.",
    "precio": 85,
    "categoria": "hogar",
    "tag": "",
    "imagenUrl": "/img/jarronacanaladoretorcido.webp"
  },
  {
    "titulo": "Portapapel mayordomo",
    "descripcion": "Sostenedor de papel de baño con diseño divertido de mayordomo.",
    "precio": 70,
    "categoria": "hogar",
    "tag": "",
    "imagenUrl": "/img/portapapelmayordomo.webp"
  },
  {
    "titulo": "Colgador con bloqueo automático",
    "descripcion": "Se engancha solo y no suelta. Perfecto para colgar objetos livianos.",
    "precio": 45,
    "categoria": "hogar",
    "tag": "Práctico",
    "imagenUrl": "/img/colgadorconbloqueoautomatico.webp"
  },
  {
    "titulo": "Soporte para trapos de cocina",
    "descripcion": "Mantén tus trapos organizados y a la mano en la cocina.",
    "precio": 35,
    "categoria": "hogar",
    "tag": "",
    "imagenUrl": "/img/soporteparatraposcocina.webp"
  },
  {
    "titulo": "Estante de pared con llavero",
    "descripcion": "Estante pequeño con ganchos integrados. Organiza llaves y objetos de entrada.",
    "precio": 60,
    "categoria": "hogar",
    "tag": "",
    "imagenUrl": "/img/estantedeparedyllavero.webp"
  },
  {
    "titulo": "Estantería hexagonal",
    "descripcion": "Estante mural en forma de hexágono. Luce increíble solo o en conjunto.",
    "precio": 80,
    "categoria": "hogar",
    "tag": "Decoración",
    "imagenUrl": "/img/estanteriahexagonal.webp"
  },
  {
    "titulo": "Estantería modular de esquina",
    "descripcion": "Aprovecha las esquinas de tu cuarto con este estante modular.",
    "precio": 95,
    "categoria": "hogar",
    "tag": "",
    "imagenUrl": "/img/estanteriamodulardeesquina.webp"
  },
  {
    "titulo": "Estantería modular de escritorio",
    "descripcion": "Organiza tu escritorio en niveles. Más espacio, más orden.",
    "precio": 90,
    "categoria": "hogar",
    "tag": "",
    "imagenUrl": "/img/estanteriamodulardeescritorio.webp"
  },
  {
    "titulo": "Organizador de baño acanalado",
    "descripcion": "Porta objetos de baño con textura acanalada. Elegante y funcional.",
    "precio": 55,
    "categoria": "hogar",
    "tag": "",
    "imagenUrl": "/img/organizadordebañoacanalado.webp"
  },
  {
    "titulo": "Estante colgante hexagonal",
    "descripcion": "Hexágono decorativo para colgar en la pared. Perfecto para plantas pequeñas.",
    "precio": 75,
    "categoria": "hogar",
    "tag": "",
    "imagenUrl": "/img/estantecolgantehexagonal.webp"
  },
  {
    "titulo": "Patas para estante",
    "descripcion": "Dale altura a tus muebles con estas patas resistentes impresas en 3D.",
    "precio": 40,
    "categoria": "hogar",
    "tag": "",
    "imagenUrl": "/img/patasparaestante.webp"
  },
  {
    "titulo": "Interruptor con joystick",
    "descripcion": "Tapa de interruptor con forma de joystick. El detalle gamer que nadie espera.",
    "precio": 50,
    "categoria": "hogar",
    "tag": "Gamer",
    "imagenUrl": "/img/interruptordeparedconjostik.webp"
  },
  {
    "titulo": "Organizador de escritorio con soporte",
    "descripcion": "Organiza tu escritorio con soporte integrado para el teléfono. Todo en uno.",
    "precio": 110,
    "categoria": "hogar",
    "tag": "Oficina",
    "imagenUrl": "/img/organizadordeescritorioparaoficinaconsoporteintegradoparatelefono.webp"
  },
  {
    "titulo": "Organizador de post-its",
    "descripcion": "Ten tus post-its siempre a mano y ordenados sobre el escritorio.",
    "precio": 45,
    "categoria": "hogar",
    "tag": "",
    "imagenUrl": "/img/postikorganizador.webp"
  },
  {
    "titulo": "Mini trípode",
    "descripcion": "Trípode compacto para teléfono. Perfecto para fotos y videollamadas.",
    "precio": 55,
    "categoria": "soportes",
    "tag": "Nuevo",
    "imagenUrl": "/img/minitripode.webp"
  },
  {
    "titulo": "Katana retráctil",
    "descripcion": "Katana en miniatura con hoja retráctil. Un coleccionable increíble.",
    "precio": 65,
    "categoria": "figuritas",
    "tag": "Coleccionable",
    "imagenUrl": "/img/katanaretractil.webp"
  },
  {
    "titulo": "Rompecabezas esfera",
    "descripcion": "Una esfera que se desarma y se arma. Desafía tu paciencia.",
    "precio": 80,
    "categoria": "figuritas",
    "tag": "",
    "imagenUrl": "/img/rompecabezasesfera.webp"
  },
  {
    "titulo": "Dispensador de cartas",
    "descripcion": "Dispensador automático de cartas. Ideal para juegos de mesa.",
    "precio": 70,
    "categoria": "figuritas",
    "tag": "",
    "imagenUrl": "/img/dispensadordecartas.webp"
  },
  {
    "titulo": "Juguete antiestrés",
    "descripcion": "Para manos que no pueden estar quietas. Adictivo y relajante.",
    "precio": 45,
    "categoria": "antiestres",
    "tag": "Antiestrés",
    "imagenUrl": "/img/jugueteantestres.webp"
  },
  {
    "titulo": "Rompecabezas de nombre personalizado",
    "descripcion": "Rompecabezas con el nombre que quieras. El regalo perfecto para niños.",
    "precio": 60,
    "categoria": "figuritas",
    "tag": "Personalizado",
    "imagenUrl": "/img/rompecabezasdenombreparaniñospersonalizado.webp"
  },
  {
    "titulo": "Soporte de página para libro",
    "descripcion": "Marca tu página y sostén el libro abierto al mismo tiempo. Ideal para lectores.",
    "precio": 35,
    "categoria": "hogar",
    "tag": "",
    "imagenUrl": "/img/soportedepaginalibro.webp"
  },
  {
    "titulo": "Pájaro de equilibrio",
    "descripcion": "Se balancea solo en la punta de tu dedo. Un clásico que nunca pasa de moda.",
    "precio": 40,
    "categoria": "figuritas",
    "tag": "",
    "imagenUrl": "/img/pajarodeequilibrio.webp"
  },
  {
    "titulo": "Pescador de tazas de té",
    "descripcion": "Un pescadorcito que sostiene la bolsita de tu té. Detalle adorable para tu taza.",
    "precio": 30,
    "categoria": "hogar",
    "tag": "Tierno",
    "imagenUrl": "/img/pescadordetazaste.webp"
  },
  {
    "titulo": "Colgador de llaves forma de carro",
    "descripcion": "Colgador de llaves con la silueta de un carro visto desde atrás. Para los amantes de los autos.",
    "precio": 40,
    "categoria": "hogar",
    "tag": "",
    "imagenUrl": "/img/colgadordellavescarropartetrasera.webp"
  },
  {
    "titulo": "Destapador de botellas",
    "descripcion": "Destapador resistente impreso en 3D. Práctico y con diseño propio.",
    "precio": 25,
    "categoria": "hogar",
    "tag": "",
    "imagenUrl": "/img/destapadordebotellas.webp"
  },
  {
    "titulo": "Calzador",
    "descripcion": "Calzador resistente para ponerte los zapatos sin agacharte.",
    "precio": 30,
    "categoria": "hogar",
    "tag": "",
    "imagenUrl": "/img/calzador.webp"
  },
  {
    "titulo": "Calzador largo",
    "descripcion": "Versión larga del calzador, sin tener que inclinarte nada.",
    "precio": 40,
    "categoria": "hogar",
    "tag": "",
    "imagenUrl": "/img/calzadorlargo.webp"
  },
  {
    "titulo": "Pato relajado",
    "descripcion": "Un patito recostado con cara de no tener ningún problema. Figurita de colección.",
    "precio": 35,
    "categoria": "figuritas",
    "tag": "Tierno",
    "imagenUrl": "/img/patorelajadofigurita.webp"
  },
  {
    "titulo": "Cortador de cinta",
    "descripcion": "Cortador de cinta adhesiva práctico y resistente. Siempre listo en tu escritorio.",
    "precio": 30,
    "categoria": "hogar",
    "tag": "",
    "imagenUrl": "/img/cortadordecinta.webp"
  },
  {
    "titulo": "Cortador de cinta compacto",
    "descripcion": "Versión compacta del cortador de cinta. Fácil de guardar y usar.",
    "precio": 30,
    "categoria": "hogar",
    "tag": "",
    "imagenUrl": "/img/cortadordecinta1.webp"
  },
  {
    "titulo": "Marcador cocodrilo para libro",
    "descripcion": "Un cocodrilito que muerde la página de tu libro. Nunca más perderás tu lugar.",
    "precio": 20,
    "categoria": "hogar",
    "tag": "Tierno",
    "imagenUrl": "/img/marcadordecocodriloparalibro.webp"
  },
  {
    "titulo": "Llavero iPhone 17",
    "descripcion": "Réplica en miniatura del iPhone 17. Para los fans de Apple que lo llevan a todos lados.",
    "precio": 35,
    "categoria": "llaveros",
    "tag": "Nuevo",
    "imagenUrl": "/img/llaveroihpone17.webp"
  },
  {
    "titulo": "Altavoz pasivo para teléfono",
    "descripcion": "Amplifica el sonido de tu teléfono sin electricidad. Solo ponlo y escucha más fuerte.",
    "precio": 65,
    "categoria": "hogar",
    "tag": "Sin cables",
    "imagenUrl": "/img/altavozpasivoparatelefono.webp"
  },
  {
    "titulo": "Empuñador de mano para iPhone",
    "descripcion": "Agarra tu iPhone con más seguridad. Ideal para fotos, videos y uso con una sola mano.",
    "precio": 45,
    "categoria": "soportes",
    "tag": "Nuevo",
    "imagenUrl": "/img/empuñadordemanoparaiphone.webp"
  },
  {
    "titulo": "Amplificador iPhone Cyberdock",
    "descripcion": "Amplifica el sonido de tu iPhone sin electricidad ni Bluetooth. Diseño cyberpunk único.",
    "precio": 70,
    "categoria": "soportes",
    "tag": "Sin cables",
    "imagenUrl": "/img/aplificadordeiphoneciberdock.webp"
  },
  {
    "titulo": "Llavero motor V8",
    "descripcion": "Un bloque de motor V8 en miniatura, con todo el detalle. Para amantes de los autos.",
    "precio": 40,
    "categoria": "llaveros",
    "tag": "Motor",
    "imagenUrl": "/img/llaverodebloquedemotorv8.webp"
  },
  {
    "titulo": "Llavero pistón",
    "descripcion": "Pistón de motor con acabado mecánico. El detalle perfecto para tu llavero.",
    "precio": 35,
    "categoria": "llaveros",
    "tag": "",
    "imagenUrl": "/img/llaveropiston.webp"
  },
  {
    "titulo": "Llavero block de cemento",
    "descripcion": "Un block de construcción en mini. Original y con mucho carácter.",
    "precio": 30,
    "categoria": "llaveros",
    "tag": "",
    "imagenUrl": "/img/llaverodeblockdecemento.webp"
  },
  {
    "titulo": "Tarjetero Batman",
    "descripcion": "Protege tus tarjetas con estilo. Diseño de Batman que no pasa desapercibido.",
    "precio": 45,
    "categoria": "hogar",
    "tag": "Personaje",
    "imagenUrl": "/img/tarjeterobatman.webp"
  },
  {
    "titulo": "Colgador de llaves Batimóvil",
    "descripcion": "Organizador de llaves de pared con forma del Batimóvil. Funcional y de colección.",
    "precio": 70,
    "categoria": "hogar",
    "tag": "Batman",
    "imagenUrl": "/img/colgadordellavesbatimovil.webp"
  },
  {
    "titulo": "Soporte de balón de pared",
    "descripcion": "Exhibe tu balón en la pared como un trofeo. Fácil de instalar.",
    "precio": 45,
    "categoria": "hogar",
    "tag": "Mundial 2026",
    "imagenUrl": "/img/soportebalondepared.webp"
  },
  {
    "titulo": "Soporte de balón (repisa)",
    "descripcion": "Repisa de pared para tu balón favorito. Lo sostiene firme y se ve increíble.",
    "precio": 50,
    "categoria": "hogar",
    "tag": "",
    "imagenUrl": "/img/soportedeparedparabalon.webp"
  },
  {
    "titulo": "Estante de pared para papel higiénico",
    "descripcion": "Aprovecha la pared del baño y ten siempre un repuesto a la mano.",
    "precio": 55,
    "categoria": "hogar",
    "tag": "",
    "imagenUrl": "/img/estantepararollopapelhigienicopaered.webp"
  },
  {
    "titulo": "Portaesponja",
    "descripcion": "Mantén la esponja escurrida y ordenada junto al lavatrastos.",
    "precio": 30,
    "categoria": "hogar",
    "tag": "",
    "imagenUrl": "/img/portaesponja.webp"
  },
  {
    "titulo": "Recipiente para jabón",
    "descripcion": "Dispensador o jabonera con diseño limpio para tu cocina o baño.",
    "precio": 40,
    "categoria": "hogar",
    "tag": "",
    "imagenUrl": "/img/recipienteparajabon.webp"
  },
  {
    "titulo": "Exprimidor de pasta dental",
    "descripcion": "Aprovecha hasta la última gota de pasta. Pequeño y muy útil.",
    "precio": 25,
    "categoria": "hogar",
    "tag": "",
    "imagenUrl": "/img/exprimidordepasta.webp"
  },
  {
    "titulo": "Caja para toallas sanitarias",
    "descripcion": "Almacena con discreción y orden. Diseño práctico para el baño.",
    "precio": 60,
    "categoria": "hogar",
    "tag": "",
    "imagenUrl": "/img/cajadealmacenamientodetoallassanitarias.webp"
  },
  {
    "titulo": "Caja para baterías AA",
    "descripcion": "Organiza tus baterías AA con tapa a presión. Adiós al cajón desordenado.",
    "precio": 40,
    "categoria": "hogar",
    "tag": "Con tapa",
    "imagenUrl": "/img/cajdebateriaAAcontapapresion.webp"
  },
  {
    "titulo": "Funda para AirPods",
    "descripcion": "Protege tus AirPods con un toque de color. En el tono que prefieras.",
    "precio": 35,
    "categoria": "hogar",
    "tag": "Para AirPods",
    "imagenUrl": "/img/fundaparairpods.webp"
  },
  {
    "titulo": "Limpiador de puertos de carga",
    "descripcion": "Saca la pelusa del puerto de tu teléfono y carga como nuevo.",
    "precio": 20,
    "categoria": "hogar",
    "tag": "",
    "imagenUrl": "/img/herramientadelimpiezaparapuertosdecarga.webp"
  },
  {
    "titulo": "Mini clips para bolsas",
    "descripcion": "Cierra bolsas y mantén todo fresco. Set de clips prácticos.",
    "precio": 20,
    "categoria": "hogar",
    "tag": "",
    "imagenUrl": "/img/miniclipparabolsas.webp"
  },
  {
    "titulo": "Guía de dedos para costura",
    "descripcion": "Cose a mano de forma pareja y segura, sin pincharte los dedos.",
    "precio": 15,
    "categoria": "hogar",
    "tag": "",
    "imagenUrl": "/img/guiadededosparacosturaamano.webp"
  }
]
;
}
