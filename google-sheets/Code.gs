/**
 * Lucciano's · App de Compras y Stocks — "base de datos" en Google Sheets.
 *
 * Este script se pega en la planilla (Extensiones → Apps Script) y se publica
 * como aplicación web. La app de las sucursales le manda los pedidos y conteos
 * y el script los guarda como filas. Nadie en las sucursales toca la planilla.
 *
 * Hojas que crea solo (la primera vez que se usa):
 *   - Pedidos            → un renglón por pedido (lo que lee la app)
 *   - Pedidos detalle    → un renglón por producto pedido (para filtrar / tablas dinámicas)
 *   - Conteos            → un renglón por conteo de stock (lo que lee la app)
 *   - Conteos detalle    → un renglón por producto contado
 *   - Productos extra    → productos agregados desde la app
 *   - Recepciones        → un renglón por recepción (proveedor o transferencia)
 *   - Recepciones detalle→ un renglón por producto recibido
 *
 * Usuario y clave del Depósito: Configuración del proyecto (ícono ⚙️) →
 * Propiedades del script → DEPOSITO_EMAIL y DEPOSITO_PASSWORD.
 *
 * Usuarios de Sucursal: una propiedad por usuario, con nombre SUC_<usuario>
 * y valor  <contraseña>|<Sucursal>,<Sucursal>   por ejemplo:
 *   SUC_weston      →  laClave|Weston
 *   SUC_fmvineland  →  otraClave|Florida Mall,Vineland
 * El usuario del Depósito también entra en Sucursal y ve todas.
 */

var TABLES = {
  orders: { sheet: 'Pedidos', cols: ['id', 'fecha', 'sucursal', 'estado', 'cancelado_en', 'notas', 'cant_productos', 'json'] },
  stock_counts: { sheet: 'Conteos', cols: ['id', 'fecha', 'sucursal', 'cant_productos', 'cant_desperdicio', 'json', 'tipo', 'periodo'] },
  stock_extra_products: { sheet: 'Productos extra', cols: ['id', 'categoria', 'producto', 'json'] },
  receptions: { sheet: 'Recepciones', cols: ['id', 'fecha', 'sucursal', 'origen_tipo', 'origen', 'remito', 'cargado_por', 'cant_productos', 'json', 'periodo', 'semana'] },
};

function doGet(e) {
  return handle_(e && e.parameter ? e.parameter : {});
}

function doPost(e) {
  var body = {};
  try { body = JSON.parse(e.postData.contents || '{}'); } catch (err) {}
  return handle_(body);
}

function handle_(req) {
  try {
    var action = req.action;
    if (action === 'ping') return out_({ ok: true });
    if (action === 'list') return out_({ ok: true, rows: list_(req.table) });
    if (action === 'insert') {
      var res = withLockRaw_(function () { return insert_(req.table, req.row); });
      var mailed = null;
      if (req.table === 'stock_counts' && res !== 'dup') { try { mailed = mailStockCount_(req.row, req.excel); } catch (err) { mailed = null; } }
      return out_({ ok: true, mailed: mailed });
    }
    if (action === 'login') return out_({ ok: checkAuth_(req.email, req.password) });
    if (action === 'branchLogin') return out_({ ok: true, sucursales: branchAuth_(req.user, req.password) });
    if (action === 'delete') {
      if (!checkAuth_(req.email, req.password)) return out_({ ok: false, error: 'auth' });
      return withLock_(function () { delete_(req.table, req.id); return { ok: true }; });
    }
    if (action === 'update') {
      if (!checkAuth_(req.email, req.password)) return out_({ ok: false, error: 'auth' });
      return withLock_(function () { update_(req.table, req.id, req.patch); return { ok: true }; });
    }
    if (action === 'upsert') {
      if (!checkAuth_(req.email, req.password)) return out_({ ok: false, error: 'auth' });
      return withLock_(function () { (req.rows || []).forEach(function (r) { upsert_(req.table, r); }); return { ok: true }; });
    }
    return out_({ ok: false, error: 'unknown action' });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  }
}

// ── Auth del Depósito ──────────────────────────────────────────────────
function checkAuth_(email, password) {
  var props = PropertiesService.getScriptProperties();
  var okEmail = String(props.getProperty('DEPOSITO_EMAIL') || '').trim().toLowerCase();
  var okPass = String(props.getProperty('DEPOSITO_PASSWORD') || '');
  if (!okEmail || !okPass) return false;
  return String(email || '').trim().toLowerCase() === okEmail && String(password || '') === okPass;
}

var ALL_BRANCHES = ['Florida Mall', 'Vineland', 'Weston', 'American Dream', 'Aventura', 'Sawgrass'];

function branchAuth_(user, password) {
  user = String(user || '').trim().toLowerCase();
  if (!user || !password) return [];
  if (checkAuth_(user, password)) return ALL_BRANCHES;
  var props = PropertiesService.getScriptProperties().getProperties();
  for (var k in props) {
    if (k.toUpperCase().indexOf('SUC_') !== 0) continue;
    if (k.slice(4).trim().toLowerCase() !== user) continue;
    var v = String(props[k]);
    var sep = v.lastIndexOf('|');
    if (sep < 0) return [];
    if (v.slice(0, sep) !== String(password)) return [];
    return v.slice(sep + 1).split(',').map(function (x) { return x.trim(); }).filter(String);
  }
  return [];
}

// ── Lectura / escritura ────────────────────────────────────────────────
function sheet_(table) {
  var def = TABLES[table];
  if (!def) throw new Error('Tabla desconocida: ' + table);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(def.sheet);
  if (!sh) {
    sh = ss.insertSheet(def.sheet);
    sh.appendRow(def.cols);
    styleHeader_(sh, def.cols.length);
  } else if (sh.getLastColumn() < def.cols.length) {
    // Columnas nuevas (siempre agregadas al final): completar el encabezado.
    sh.getRange(1, 1, 1, def.cols.length).setValues([def.cols]);
    styleHeader_(sh, def.cols.length);
  }
  return sh;
}

function list_(table) {
  var sh = sheet_(table);
  var last = sh.getLastRow();
  if (last < 2) return [];
  var cols = TABLES[table].cols;
  var jsonCol = cols.indexOf('json');
  var values = sh.getRange(2, 1, last - 1, cols.length).getValues();
  var rows = [];
  values.forEach(function (v) {
    if (!v[0]) return;
    try { rows.push(JSON.parse(v[jsonCol])); } catch (err) {}
  });
  return rows;
}

function toRow_(table, r) {
  var json = JSON.stringify(r);
  if (table === 'orders') {
    return [r.id, toDate_(r.date), r.sucursal, r.status || 'pendiente', r.canceled_at ? toDate_(r.canceled_at) : '', r.notes || '', (r.items || []).length, json];
  }
  if (table === 'stock_counts') {
    return [r.id, toDate_(r.date), r.sucursal, (r.items || []).length, (r.waste || []).length, json, r.type === 'spot' ? 'Aleatorio' : 'Mensual', r.period || ''];
  }
  if (table === 'receptions') {
    return [r.id, toDate_(r.date), r.sucursal, r.source_type || '', r.source || '', r.ref || '', r.origin || 'manual', (r.items || []).length, json, r.period || '', r.week || ''];
  }
  return [r.id, r.category || '', r.item || '', json];
}

function insert_(table, r) {
  if (!r || !r.id) throw new Error('Falta id');
  var sh = sheet_(table);
  if (findRow_(sh, r.id) > 0) return 'dup'; // ya estaba (reintento)
  sh.appendRow(toRow_(table, r));
  writeDetail_(table, r);
}

function update_(table, id, patch) {
  var sh = sheet_(table);
  var rowIdx = findRow_(sh, id);
  if (rowIdx < 0) throw new Error('No existe ' + id);
  var cols = TABLES[table].cols;
  var current = JSON.parse(sh.getRange(rowIdx, cols.indexOf('json') + 1).getValue());
  Object.keys(patch || {}).forEach(function (k) { current[k] = patch[k]; });
  sh.getRange(rowIdx, 1, 1, cols.length).setValues([toRow_(table, current)]);
}

function upsert_(table, r) {
  var sh = sheet_(table);
  var rowIdx = findRow_(sh, r.id);
  if (rowIdx > 0) {
    sh.getRange(rowIdx, 1, 1, TABLES[table].cols.length).setValues([toRow_(table, r)]);
  } else {
    sh.appendRow(toRow_(table, r));
    writeDetail_(table, r);
  }
}

function delete_(table, id) {
  var sh = sheet_(table);
  var rowIdx = findRow_(sh, id);
  if (rowIdx > 0) sh.deleteRow(rowIdx);
  var detail = { stock_counts: 'Conteos detalle', orders: 'Pedidos detalle', receptions: 'Recepciones detalle' }[table] || null;
  if (!detail) return;
  var dsh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(detail);
  if (!dsh || dsh.getLastRow() < 2) return;
  var ids = dsh.getRange(2, 1, dsh.getLastRow() - 1, 1).getValues();
  for (var i = ids.length - 1; i >= 0; i--) if (String(ids[i][0]) === String(id)) dsh.deleteRow(i + 2);
}

function findRow_(sh, id) {
  var last = sh.getLastRow();
  if (last < 2) return -1;
  var ids = sh.getRange(2, 1, last - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(id)) return i + 2;
  return -1;
}

// ── Hojas de detalle (una fila por producto) ───────────────────────────
function writeDetail_(table, r) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (table === 'orders') {
    var cols = ['pedido_id', 'fecha', 'sucursal', 'proveedor', 'codigo', 'producto', 'cantidad'];
    var sh = ss.getSheetByName('Pedidos detalle') || newSheet_(ss, 'Pedidos detalle', cols);
    var rows = (r.items || []).map(function (it) {
      return [r.id, toDate_(r.date), r.sucursal, it.vendor || '', it.code || '', it.item || '', num_(it.quantity)];
    });
    if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, cols.length).setValues(rows);
  }
  if (table === 'receptions') {
    var cols3 = ['recepcion_id', 'fecha', 'sucursal', 'origen_tipo', 'origen', 'categoria', 'producto', 'cajas', 'paquetes', 'sueltas', 'total', 'unidad', 'periodo', 'semana'];
    var sh3 = ss.getSheetByName('Recepciones detalle') || newSheet_(ss, 'Recepciones detalle', cols3);
    var rows3 = (r.items || []).map(function (it) {
      return [r.id, toDate_(r.date), r.sucursal, r.source_type || '', r.source || '', it.vendor || '', it.item || '',
        it.boxes || '', it.subs || '', it.units || '', num_(it.total !== undefined ? it.total : it.quantity), it.unit || 'u', r.period || '', r.week || ''];
    });
    if (rows3.length) sh3.getRange(sh3.getLastRow() + 1, 1, rows3.length, cols3.length).setValues(rows3);
  }
  if (table === 'stock_counts') {
    var cols2 = ['conteo_id', 'fecha', 'sucursal', 'tipo', 'categoria', 'producto', 'cajas', 'paquetes', 'sueltas', 'vaschettas', 'total', 'unidad', 'motivo'];
    var sh2 = ss.getSheetByName('Conteos detalle') || newSheet_(ss, 'Conteos detalle', cols2);
    var mk = function (tipo) {
      return function (it) {
        return [r.id, toDate_(r.date), r.sucursal, tipo, it.vendor || '', it.item || '',
          it.boxes || '', it.subs || '', (it.pans && it.pans.length) ? '' : (it.units || ''),
          (it.pans && it.pans.length) ? it.pans.length : '', num_(it.total !== undefined ? it.total : it.quantity), it.unit || 'u', it.reason || ''];
      };
    };
    var rows2 = (r.items || []).map(mk('Stock')).concat((r.waste || []).map(mk('Desperdicio')));
    if (rows2.length) sh2.getRange(sh2.getLastRow() + 1, 1, rows2.length, cols2.length).setValues(rows2);
  }
}

function newSheet_(ss, name, cols) {
  var sh = ss.insertSheet(name);
  sh.appendRow(cols);
  styleHeader_(sh, cols.length);
  return sh;
}

function styleHeader_(sh, n) {
  sh.getRange(1, 1, 1, n).setFontWeight('bold').setBackground('#1A1A1A').setFontColor('#C9A45C');
  sh.setFrozenRows(1);
}

// ── Utilidades ─────────────────────────────────────────────────────────
function toDate_(iso) { var d = new Date(iso); return isNaN(d.getTime()) ? iso : d; }
function num_(v) { var n = Number(String(v).replace(',', '.')); return isNaN(n) ? v : n; }

function withLockRaw_(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try { return fn(); } finally { lock.releaseLock(); }
}

function withLock_(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try { return out_(fn()); } finally { lock.releaseLock(); }
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// ── Mail automático del conteo ─────────────────────────────────────────
// Destinatarios: propiedad NOTIFY_EMAIL (varios separados por coma);
// si no está, el mail del Depósito. Devuelve a quién se mandó.
var MESES_ = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
var CAT_LABEL_ = { PAPER: 'Papel', 'COFFEE CORNER': 'Rincón Café', 'GRAB & GO': 'Grab & Go', OTHERS: 'Otros', INGREDIENTS: 'Ingredientes', ALFAJORES: 'Alfajores', 'ICE POPS': 'Paletas', GELATO: 'Gelato' };

function mailStockCount_(r, excel) {
  var props = PropertiesService.getScriptProperties();
  var to = String(props.getProperty('NOTIFY_EMAIL') || props.getProperty('DEPOSITO_EMAIL') || '').trim();
  if (!to) return null;
  var tz = 'America/New_York';
  var fecha = Utilities.formatDate(new Date(r.date), tz, 'dd/MM/yyyy HH:mm');
  var kind = r.type === 'spot' ? 'Inventario aleatorio' : 'Inventario mensual';
  if (r.type !== 'spot' && r.period) { var pm = r.period.split('-'); kind += ' · ' + MESES_[Number(pm[1]) - 1] + ' ' + pm[0]; }
  var esc = function (x) { return String(x === undefined || x === null ? '' : x).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
  var td = 'style="border:1px solid #d8cfc6;padding:6px 8px;font-size:13px"';
  var th = 'style="border:1px solid #1a1a1a;padding:6px 8px;font-size:12px;background:#1a1a1a;color:#C9A45C;text-align:left"';
  var table = function (items, waste) {
    var groups = {};
    var order = [];
    items.forEach(function (it) { if (!groups[it.vendor]) { groups[it.vendor] = []; order.push(it.vendor); } groups[it.vendor].push(it); });
    var h = '';
    order.forEach(function (v) {
      h += '<h3 style="font-family:Arial;font-size:14px;margin:18px 0 6px">' + esc(CAT_LABEL_[v] || v) + '</h3>';
      h += '<table style="border-collapse:collapse;font-family:Arial;width:100%"><tr><th ' + th + '>Producto</th>' +
        (waste ? '<th ' + th + '>Cantidad</th><th ' + th + '>Motivo</th>' : '<th ' + th + '>Cajas</th><th ' + th + '>Paquetes</th><th ' + th + '>Sueltas</th><th ' + th + '>Total</th>') + '</tr>';
      groups[v].forEach(function (it) {
        var u = it.unit === 'kg' ? ' kg' : '';
        h += '<tr><td ' + td + '>' + esc(it.item) + '</td>' + (waste
          ? '<td ' + td + '>' + esc(it.quantity) + u + '</td><td ' + td + '>' + esc(it.reason || '') + '</td>'
          : '<td ' + td + '>' + esc(it.boxes || '') + '</td><td ' + td + '>' + esc(it.subs || '') + '</td><td ' + td + '>' + esc((it.pans && it.pans.length) ? it.pans.length + ' vasch.' : (it.units || '')) + '</td><td ' + td + '><b>' + esc(it.quantity) + u + '</b></td>') + '</tr>';
      });
      h += '</table>';
    });
    return h;
  };
  var html = '<div style="font-family:Arial;color:#1c1414">' +
    '<h2 style="margin:0 0 4px">' + esc(r.sucursal) + ' · ' + esc(kind) + '</h2>' +
    '<div style="color:#6e625e;font-size:13px">' + fecha + ' · ' + (r.items || []).length + ' productos' + ((r.waste || []).length ? ' · ' + r.waste.length + ' con desperdicio' : '') + '</div>' +
    table(r.items || [], false) +
    ((r.waste || []).length ? '<h2 style="margin:26px 0 0;color:#B3261E;font-size:16px">Desperdicio</h2>' + table(r.waste, true) : '') +
    '<p style="color:#6e625e;font-size:12px;margin-top:22px">Va adjunto el Excel del conteo. También se descarga desde la app → Depósito → Stocks.</p></div>';
  var msg = { to: to, subject: "Lucciano's · " + r.sucursal + ' · ' + kind, htmlBody: html, name: "Lucciano's App" };
  if (excel && excel.b64) {
    msg.attachments = [Utilities.newBlob(Utilities.base64Decode(excel.b64), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', String(excel.name || 'Inventario.xlsx'))];
  }
  MailApp.sendEmail(msg);
  return to;
}

/** Ejecutalo una vez desde el editor para autorizar el envío de mails (manda uno de prueba). */
function probarMail() {
  return mailStockCount_({ sucursal: 'Prueba', date: new Date().toISOString(), type: 'spot', items: [{ vendor: 'PAPER', item: 'Producto de prueba', boxes: 1, quantity: '10' }] });
}

/** Ejecutalo una vez desde el editor para crear las hojas y dar permisos. */
function setup() {
  Object.keys(TABLES).forEach(sheet_);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss.getSheetByName('Pedidos detalle')) newSheet_(ss, 'Pedidos detalle', ['pedido_id', 'fecha', 'sucursal', 'proveedor', 'codigo', 'producto', 'cantidad']);
  if (!ss.getSheetByName('Conteos detalle')) newSheet_(ss, 'Conteos detalle', ['conteo_id', 'fecha', 'sucursal', 'tipo', 'categoria', 'producto', 'cajas', 'paquetes', 'sueltas', 'vaschettas', 'total', 'unidad', 'motivo']);
  if (!ss.getSheetByName('Recepciones detalle')) newSheet_(ss, 'Recepciones detalle', ['recepcion_id', 'fecha', 'sucursal', 'origen_tipo', 'origen', 'categoria', 'producto', 'cajas', 'paquetes', 'sueltas', 'total', 'unidad']);
  var def = ss.getSheetByName('Hoja 1') || ss.getSheetByName('Sheet1');
  if (def && ss.getSheets().length > 1 && def.getLastRow() === 0) ss.deleteSheet(def);
}
