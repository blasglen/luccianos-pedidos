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
 *
 * Usuario y clave del Depósito: Configuración del proyecto (ícono ⚙️) →
 * Propiedades del script → DEPOSITO_EMAIL y DEPOSITO_PASSWORD.
 */

var TABLES = {
  orders: { sheet: 'Pedidos', cols: ['id', 'fecha', 'sucursal', 'estado', 'cancelado_en', 'notas', 'cant_productos', 'json'] },
  stock_counts: { sheet: 'Conteos', cols: ['id', 'fecha', 'sucursal', 'cant_productos', 'json'] },
  stock_extra_products: { sheet: 'Productos extra', cols: ['id', 'categoria', 'producto', 'json'] },
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
    if (action === 'insert') return withLock_(function () { insert_(req.table, req.row); return { ok: true }; });
    if (action === 'login') return out_({ ok: checkAuth_(req.email, req.password) });
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
    return [r.id, toDate_(r.date), r.sucursal, (r.items || []).length, json];
  }
  return [r.id, r.category || '', r.item || '', json];
}

function insert_(table, r) {
  if (!r || !r.id) throw new Error('Falta id');
  var sh = sheet_(table);
  if (findRow_(sh, r.id) > 0) return; // ya estaba (reintento)
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
  if (table === 'stock_counts') {
    var cols2 = ['conteo_id', 'fecha', 'sucursal', 'categoria', 'producto', 'cajas', 'paquetes', 'sueltas', 'vaschettas', 'total', 'unidad'];
    var sh2 = ss.getSheetByName('Conteos detalle') || newSheet_(ss, 'Conteos detalle', cols2);
    var rows2 = (r.items || []).map(function (it) {
      return [r.id, toDate_(r.date), r.sucursal, it.vendor || '', it.item || '',
        it.boxes || '', it.subs || '', (it.pans && it.pans.length) ? '' : (it.units || ''),
        (it.pans && it.pans.length) ? it.pans.length : '', num_(it.total !== undefined ? it.total : it.quantity), it.unit || 'u'];
    });
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

function withLock_(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try { return out_(fn()); } finally { lock.releaseLock(); }
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Ejecutalo una vez desde el editor para crear las hojas y dar permisos. */
function setup() {
  Object.keys(TABLES).forEach(sheet_);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss.getSheetByName('Pedidos detalle')) newSheet_(ss, 'Pedidos detalle', ['pedido_id', 'fecha', 'sucursal', 'proveedor', 'codigo', 'producto', 'cantidad']);
  if (!ss.getSheetByName('Conteos detalle')) newSheet_(ss, 'Conteos detalle', ['conteo_id', 'fecha', 'sucursal', 'categoria', 'producto', 'cajas', 'paquetes', 'sueltas', 'vaschettas', 'total', 'unidad']);
  var def = ss.getSheetByName('Hoja 1') || ss.getSheetByName('Sheet1');
  if (def && ss.getSheets().length > 1 && def.getLastRow() === 0) ss.deleteSheet(def);
}
