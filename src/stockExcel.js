// Genera el Excel del raconto de inventario (se carga solo cuando se usa,
// para no agrandar la app). Replica la planilla de inventario de las
// sucursales, con fórmulas vivas: TOTAL = cajas × ud x caja + paquetes × ud x paq. + sueltas.
import ExcelJS from "exceljs/dist/exceljs.min.js";

const C = {
  black: "FF1A1A1A",
  gold: "FFC9A45C",
  beige: "FFE6D3C2",
  beigeLight: "FFF6EEE6",
  grey: "FFE7E7E7",
  input: "FFFFF8DC",
  line: "FFBFB3A8",
  muted: "FF7A6F66",
  green: "FF2E7D32",
  red: "FFC62828",
};

const thin = { style: "thin", color: { argb: C.line } };
const border = { top: thin, left: thin, bottom: thin, right: thin };
const NUM = "#,##0.###;-#,##0.###;0";
const DIFF = "+#,##0.###;-#,##0.###;0";

function fmtDate(iso) {
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function fileDate(iso) {
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const MES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
function periodText(p) { if (!p) return ""; const [y, m] = p.split("-").map(Number); return `${MES[m - 1]} ${y}`; }

export function stockExcelFileName(stockCount) {
  if (stockCount.type === "spot") return `Inventario aleatorio ${stockCount.sucursal} - ${fileDate(stockCount.date)}.xlsx`;
  if (stockCount.period) return `Inventario ${stockCount.sucursal} - ${periodText(stockCount.period)}.xlsx`;
  return `Inventario ${stockCount.sucursal} - ${fileDate(stockCount.date)}.xlsx`;
}

/**
 * @param stockCount  { sucursal, date, items: [{vendor,item,boxes,subs,units,total,unit}], prev?: {key: qty}, prevDate? }
 * @param catalog     [{ category, label, products: [{item, box, sub, unit}] }]  (todos los productos, en orden)
 */
export async function buildStockWorkbook(stockCount, catalog, lang = "es") {
  const es = lang !== "en";
  const wb = new ExcelJS.Workbook();
  wb.creator = "Lucciano's";
  wb.created = new Date(stockCount.date);

  const counted = {};
  stockCount.items.forEach((it) => { counted[it.vendor + "|" + it.item] = it; });
  const prev = stockCount.prev || {};
  const hasPrev = Object.keys(prev).length > 0;

  // ── Hoja 1: Inventario ────────────────────────────────────────────────
  const ws = wb.addWorksheet(es ? "Inventario" : "Inventory", {
    views: [{ state: "frozen", xSplit: 2, ySplit: 5, showGridLines: false }],
    pageSetup: { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0, paperSize: 1, margins: { left: 0.4, right: 0.4, top: 0.5, bottom: 0.5, header: 0.2, footer: 0.2 } },
    headerFooter: { oddFooter: `&L${stockCount.sucursal} · ${fmtDate(stockCount.date)}&R&P / &N` },
  });
  ws.columns = [
    { key: "n", width: 5 },
    { key: "item", width: 58 },
    { key: "box", width: 10 },
    { key: "sub", width: 10 },
    { key: "b", width: 9 },
    { key: "s", width: 10 },
    { key: "u", width: 10 },
    { key: "total", width: 12 },
    { key: "unit", width: 7 },
    { key: "prev", width: 12 },
    { key: "diff", width: 12 },
    { key: "cost", width: 12 },
    { key: "value", width: 14 },
  ];
  const lastCol = "M";
  const USD = '"US$" #,##0.00;-"US$" #,##0.00;"-"';
  const USD4 = '"US$" #,##0.00##;-"US$" #,##0.00##;"-"';

  // Título
  ws.mergeCells(`A1:${lastCol}1`);
  const title = ws.getCell("A1");
  const kindTxt = stockCount.type === "spot" ? (es ? "INVENTARIO ALEATORIO" : "SPOT CHECK")
    : stockCount.period ? `${es ? "INVENTARIO MENSUAL" : "MONTHLY INVENTORY"} · ${periodText(stockCount.period).toUpperCase()}`
    : (es ? "RACONTO DE INVENTARIO" : "INVENTORY COUNT");
  title.value = `LUCCIANO'S · ${kindTxt}`;
  title.font = { name: "Arial", size: 16, bold: true, color: { argb: C.gold } };
  title.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.black } };
  title.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  ws.getRow(1).height = 30;

  const totalProducts = catalog.reduce((a, c) => a + c.products.length, 0);
  const info = [
    [es ? "Sucursal" : "Store", stockCount.sucursal],
    [es ? "Fecha" : "Date", fmtDate(stockCount.date)],
    [es ? "Productos contados" : "Products counted", `${stockCount.items.length} ${es ? "de" : "of"} ${totalProducts}`],
  ];
  if (hasPrev && stockCount.prevDate) info.push([es ? "Conteo anterior" : "Previous count", fmtDate(stockCount.prevDate)]);
  ws.mergeCells(`A2:${lastCol}2`);
  ws.mergeCells(`A3:${lastCol}3`);
  const infoCell = ws.getCell("A2");
  infoCell.value = {
    richText: info.flatMap(([k, v], i) => [
      { text: (i ? "     " : "") + k + ": ", font: { name: "Arial", size: 10, color: { argb: C.muted } } },
      { text: String(v), font: { name: "Arial", size: 10, bold: true } },
    ]),
  };
  infoCell.alignment = { vertical: "middle", indent: 1 };
  ws.getRow(2).height = 22;
  const note = ws.getCell("A3");
  note.value = es
    ? "Cargar solo las celdas amarillas (Cajas, Paquetes, Sueltas). Las grises y el Total se calculan solos."
    : "Fill in only the yellow cells (Boxes, Packs, Loose). Grey cells and Total are calculated.";
  note.font = { name: "Arial", size: 9, italic: true, color: { argb: C.muted } };
  note.alignment = { indent: 1 };

  // Encabezado
  const headers = es
    ? ["#", "Producto", "Ud x caja", "Ud x paq.", "Cajas", "Paquetes", "Sueltas", "TOTAL", "Unidad", "Anterior", "Diferencia", "Costo unit.", "Valor"]
    : ["#", "Product", "Units/box", "Units/pack", "Boxes", "Packs", "Loose", "TOTAL", "Unit", "Previous", "Difference", "Unit cost", "Value"];
  const hr = ws.getRow(5);
  hr.values = headers;
  hr.height = 22;
  hr.eachCell((cell, col) => {
    cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.black } };
    cell.alignment = { vertical: "middle", horizontal: col === 2 ? "left" : "center", wrapText: true };
    cell.border = border;
  });

  let r = 6;
  const firstDataRow = r;
  const catStats = [];
  catalog.forEach((cat) => {
    // Fila de categoría
    ws.mergeCells(`A${r}:${lastCol}${r}`);
    const cc = ws.getCell(`A${r}`);
    cc.value = cat.label.toUpperCase();
    cc.font = { name: "Arial", size: 11, bold: true, color: { argb: C.black } };
    cc.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.beige } };
    cc.alignment = { vertical: "middle", indent: 1 };
    cc.border = border;
    ws.getRow(r).height = 20;
    r++;

    let nCounted = 0;
    let catValue = 0;
    const catFirst = r;
    cat.products.forEach((p, i) => {
      const it = counted[cat.category + "|" + p.item];
      if (it) nCounted++;
      const row = ws.getRow(r);
      const unit = p.unit || "u";
      const b = it && it.boxes ? it.boxes : null;
      const s = it && it.subs ? it.subs : null;
      const u = it && (it.units || (!it.boxes && !it.subs)) ? (it.units || 0) : null;
      const totalVal = it ? Number(it.total ?? it.quantity) : null;
      const pv = prev[cat.category + "|" + p.item];
      const prevVal = pv !== undefined && pv !== "" ? Number(pv) : null;

      row.getCell(1).value = i + 1;
      row.getCell(2).value = p.item;
      row.getCell(3).value = p.box || null;
      row.getCell(4).value = p.sub || null;
      row.getCell(5).value = b;
      row.getCell(6).value = s;
      row.getCell(7).value = u;
      row.getCell(8).value = {
        formula: `IF(COUNT(E${r}:G${r})=0,"",N(E${r})*N(C${r})+N(F${r})*N(D${r})+N(G${r}))`,
        result: totalVal === null ? "" : totalVal,
      };
      row.getCell(9).value = unit;
      row.getCell(10).value = prevVal;
      row.getCell(11).value = {
        formula: `IF(OR(H${r}="",J${r}=""),"",H${r}-J${r})`,
        result: totalVal !== null && prevVal !== null ? totalVal - prevVal : "",
      };
      // Costo guardado en el conteo (precio de esa fecha); si no lo tiene, el actual.
      const cost = (it && it.cost != null && it.cost !== "" ? Number(it.cost) : Number(p.cost)) || null;
      row.getCell(12).value = cost;
      const val = totalVal !== null && cost ? totalVal * cost : null;
      if (val) catValue += val;
      row.getCell(13).value = { formula: `IF(OR(H${r}="",L${r}=""),"",H${r}*L${r})`, result: val === null ? "" : val };

      const zebra = i % 2 === 1;
      row.eachCell({ includeEmpty: true }, (cell, col) => {
        if (col > 13) return;
        cell.border = border;
        cell.font = { name: "Arial", size: 10, color: { argb: it ? "FF000000" : C.muted } };
        cell.alignment = { vertical: "middle", horizontal: col === 2 ? "left" : "center" };
        if (col >= 3) cell.numFmt = col === 11 ? DIFF : col === 12 ? USD4 : col === 13 ? USD : NUM;
        let fill = zebra ? C.beigeLight : null;
        if (col === 3 || col === 4) fill = C.grey;
        if (col >= 5 && col <= 7) fill = C.input;
        if (fill) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: fill } };
      });
      row.getCell(1).font = { name: "Arial", size: 9, color: { argb: C.muted } };
      row.getCell(8).font = { name: "Arial", size: 10, bold: true };
      row.getCell(9).font = { name: "Arial", size: 9, color: { argb: C.muted } };
      if (it) row.getCell(2).font = { name: "Arial", size: 10, bold: true };
      if (it && it.pans && it.pans.length) {
        const note = `${it.pans.length} vaschetta${it.pans.length === 1 ? "" : "s"}: ${it.pans.join(" + ")} kg` + (it.tare ? `\nTara: ${it.tare} kg c/u` : "");
        row.getCell(7).note = note;
        row.getCell(2).value = `${p.item}  (${it.pans.length} vasch.)`;
      }
      r++;
    });
    catStats.push({ label: cat.label, total: cat.products.length, counted: nCounted, value: catValue, from: catFirst, to: r - 1 });
  });
  const lastDataRow = r - 1;
  const grandValue = catStats.reduce((a, c) => a + c.value, 0);
  {
    const tr = ws.getRow(r);
    ws.mergeCells(`A${r}:L${r}`);
    tr.getCell(1).value = es ? "VALOR TOTAL DEL INVENTARIO" : "TOTAL INVENTORY VALUE";
    tr.getCell(13).value = { formula: `SUM(M${firstDataRow}:M${lastDataRow})`, result: grandValue };
    tr.height = 22;
    [1, 13].forEach((col) => {
      const cell = tr.getCell(col);
      cell.font = { name: "Arial", size: 11, bold: true, color: { argb: C.gold } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.black } };
      cell.alignment = { vertical: "middle", horizontal: col === 1 ? "right" : "center", indent: col === 1 ? 1 : 0 };
    });
    tr.getCell(13).numFmt = USD;
  }

  // Diferencias en color (verde sube, rojo baja)
  ws.addConditionalFormatting({
    ref: `K${firstDataRow}:K${lastDataRow}`,
    rules: [
      { type: "cellIs", operator: "lessThan", formulae: ["0"], style: { font: { color: { argb: C.red }, bold: true } } },
      { type: "cellIs", operator: "greaterThan", formulae: ["0"], style: { font: { color: { argb: C.green }, bold: true } } },
    ],
  });
  ws.autoFilter = { from: { row: 5, column: 1 }, to: { row: lastDataRow, column: 13 } };
  if (!hasPrev) {
    ws.getColumn(10).hidden = true;
    ws.getColumn(11).hidden = true;
  }

  // ── Hoja Desperdicio (solo si se cargó) ───────────────────────────────
  const waste = stockCount.waste || [];
  if (waste.length) {
    const wsW = wb.addWorksheet(es ? "Desperdicio" : "Waste", {
      views: [{ state: "frozen", ySplit: 3, showGridLines: false }],
      pageSetup: { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
    });
    wsW.columns = [{ width: 16 }, { width: 50 }, { width: 12 }, { width: 9 }, { width: 12 }, { width: 13 }, { width: 44 }];
    wsW.mergeCells("A1:G1");
    const tw = wsW.getCell("A1");
    tw.value = es ? `DESPERDICIO · ${stockCount.sucursal} · ${fmtDate(stockCount.date)}` : `WASTE · ${stockCount.sucursal} · ${fmtDate(stockCount.date)}`;
    tw.font = { name: "Arial", size: 14, bold: true, color: { argb: "FFFFFFFF" } };
    tw.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFB3261E" } };
    tw.alignment = { vertical: "middle", indent: 1 };
    wsW.getRow(1).height = 28;
    const hw = wsW.getRow(3);
    hw.values = es ? ["Categoría", "Producto", "Cantidad", "Unidad", "Costo unit.", "Valor", "Motivo"] : ["Category", "Product", "Quantity", "Unit", "Unit cost", "Value", "Reason"];
    hw.eachCell((cell, col) => {
      cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.black } };
      cell.alignment = { horizontal: col >= 3 && col <= 6 ? "center" : "left", vertical: "middle" };
      cell.border = border;
    });
    const labelOf = {};
    const costOf = {};
    catalog.forEach((c) => { labelOf[c.category] = c.label; c.products.forEach((p) => { if (p.cost) costOf[c.category + "|" + p.item] = Number(p.cost); }); });
    let wasteValue = 0;
    waste.forEach((it, i) => {
      const rw = 4 + i;
      const row = wsW.getRow(rw);
      const q = Number(it.total ?? it.quantity);
      const cost = (it.cost != null && it.cost !== "" ? Number(it.cost) : costOf[it.vendor + "|" + it.item]) || null;
      if (cost) wasteValue += q * cost;
      row.values = [labelOf[it.vendor] || it.vendor, it.item, q, it.unit === "kg" ? "kg" : "u", cost,
        { formula: `IF(E${rw}="","",C${rw}*E${rw})`, result: cost ? q * cost : "" }, it.reason || ""];
      row.eachCell({ includeEmpty: true }, (cell, col) => {
        if (col > 7) return;
        cell.border = border;
        cell.font = { name: "Arial", size: 10, bold: col === 3 || col === 6 };
        cell.alignment = { vertical: "middle", horizontal: col >= 3 && col <= 6 ? "center" : "left", wrapText: col === 7 };
        if (col === 3) cell.numFmt = NUM;
        if (col === 5) cell.numFmt = USD4;
        if (col === 6) cell.numFmt = USD;
        if (i % 2 === 1) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.beigeLight } };
      });
    });
    const wt = wsW.getRow(4 + waste.length);
    wsW.mergeCells(`A${4 + waste.length}:E${4 + waste.length}`);
    wt.getCell(1).value = es ? "VALOR TOTAL DEL DESPERDICIO" : "TOTAL WASTE VALUE";
    wt.getCell(6).value = { formula: `SUM(F4:F${3 + waste.length})`, result: wasteValue };
    [1, 6].forEach((col) => {
      const cell = wt.getCell(col);
      cell.font = { name: "Arial", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFB3261E" } };
      cell.alignment = { vertical: "middle", horizontal: col === 1 ? "right" : "center", indent: col === 1 ? 1 : 0 };
    });
    wt.getCell(6).numFmt = USD;
    stockCount._wasteValue = wasteValue;
  }

  // ── Hoja Entradas por semana (solo inventario mensual con entradas) ──
  // stockCount.entries: [{ vendor, item, week, qty, unit }] ya normalizado
  // (recepciones del mes + entradas históricas de la planilla; las
  // transferencias enviadas a otra sucursal vienen en negativo).
  const entries = stockCount.entries || [];
  const weeks = stockCount.weeks || [];
  if (entries.length && weeks.length) {
    const nW = weeks.length;
    const wsE = wb.addWorksheet(es ? "Entradas" : "Received", {
      views: [{ state: "frozen", xSplit: 2, ySplit: 4, showGridLines: false }],
      pageSetup: { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
    });
    wsE.columns = [{ width: 5 }, { width: 52 }, { width: 8 }, ...weeks.map(() => ({ width: 11 })), { width: 12 }];
    const lastE = String.fromCharCode(65 + 3 + nW); // A + 3 + nW = columna Total
    wsE.mergeCells(`A1:${lastE}1`);
    const te = wsE.getCell("A1");
    te.value = `${es ? "ENTRADAS POR SEMANA" : "RECEIVED BY WEEK"} · ${stockCount.sucursal} · ${periodText(stockCount.period).toUpperCase()}`;
    te.font = { name: "Arial", size: 14, bold: true, color: { argb: C.gold } };
    te.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.black } };
    te.alignment = { vertical: "middle", indent: 1 };
    wsE.getRow(1).height = 28;
    wsE.mergeCells(`A2:${lastE}2`);
    const ne = wsE.getCell("A2");
    ne.value = es
      ? "Semanas de lunes a domingo, cortadas en el cambio de mes. Incluye pedidos de proveedores y transferencias recibidas; lo enviado a otra sucursal va en negativo."
      : "Monday–Sunday weeks, cut at month end. Includes supplier deliveries and transfers received; transfers sent to another store are negative.";
    ne.font = { name: "Arial", size: 9, italic: true, color: { argb: C.muted } };
    ne.alignment = { indent: 1, wrapText: true };
    wsE.getRow(2).height = 26;
    const he = wsE.getRow(4);
    he.values = ["#", es ? "Producto" : "Product", es ? "Unidad" : "Unit", ...weeks.map((w) => `${es ? "Sem" : "Wk"} ${w.n}\n${w.from}–${w.to}`), "TOTAL"];
    he.height = 30;
    he.eachCell((cell, col) => {
      cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.black } };
      cell.alignment = { vertical: "middle", horizontal: col === 2 ? "left" : "center", wrapText: true };
      cell.border = border;
    });
    const byKey = {};
    entries.forEach((e) => {
      const k = e.vendor + "|" + e.item;
      if (!byKey[k]) byKey[k] = { unit: e.unit, w: Array(nW).fill(0) };
      const i = Math.min(Math.max(1, e.week || 1), nW) - 1;
      byKey[k].w[i] += Number(e.qty) || 0;
    });
    let re = 5;
    const firstE = re;
    catalog.forEach((cat) => {
      const prods = cat.products.filter((p) => byKey[cat.category + "|" + p.item]);
      if (!prods.length) return;
      wsE.mergeCells(`A${re}:${lastE}${re}`);
      const cc = wsE.getCell(`A${re}`);
      cc.value = cat.label.toUpperCase();
      cc.font = { name: "Arial", size: 11, bold: true };
      cc.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.beige } };
      cc.alignment = { vertical: "middle", indent: 1 };
      cc.border = border;
      re++;
      prods.forEach((p, i) => {
        const d = byKey[cat.category + "|" + p.item];
        const row = wsE.getRow(re);
        const tot = d.w.reduce((a, b) => a + b, 0);
        row.values = [i + 1, p.item, (d.unit || p.unit) === "kg" ? "kg" : "u", ...d.w.map((v) => (v ? Math.round(v * 1000) / 1000 : null)),
          { formula: `SUM(D${re}:${String.fromCharCode(67 + nW)}${re})`, result: tot }];
        row.eachCell({ includeEmpty: true }, (cell, col) => {
          if (col > 4 + nW) return;
          cell.border = border;
          cell.font = { name: "Arial", size: 10, bold: col === 4 + nW };
          cell.alignment = { vertical: "middle", horizontal: col === 2 ? "left" : "center" };
          if (col >= 4) cell.numFmt = NUM;
          if (i % 2 === 1) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.beigeLight } };
        });
        row.getCell(1).font = { name: "Arial", size: 9, color: { argb: C.muted } };
        re++;
      });
    });
    wsE.addConditionalFormatting({
      ref: `D${firstE}:${lastE}${re - 1}`,
      rules: [{ type: "cellIs", operator: "lessThan", formulae: ["0"], style: { font: { color: { argb: C.red }, bold: true } } }],
    });
  }

  // ── Hoja 2: Resumen ───────────────────────────────────────────────────
  const rs = wb.addWorksheet(es ? "Resumen" : "Summary", { views: [{ showGridLines: false }] });
  rs.columns = [{ width: 28 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 16 }];
  rs.mergeCells("A1:E1");
  const t2 = rs.getCell("A1");
  t2.value = `${stockCount.sucursal} · ${fmtDate(stockCount.date)}`;
  t2.font = { name: "Arial", size: 14, bold: true, color: { argb: C.gold } };
  t2.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.black } };
  t2.alignment = { vertical: "middle", indent: 1 };
  rs.getRow(1).height = 28;
  const h2 = rs.getRow(3);
  h2.values = es ? ["Categoría", "Productos", "Contados", "% contado", "Valor"] : ["Category", "Products", "Counted", "% counted", "Value"];
  h2.eachCell((cell) => {
    cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.black } };
    cell.alignment = { horizontal: "center" };
    cell.border = border;
  });
  let rr = 4;
  catStats.forEach((c) => {
    const row = rs.getRow(rr);
    row.values = [c.label, c.total, c.counted, { formula: `IF(B${rr}=0,0,C${rr}/B${rr})`, result: c.total ? c.counted / c.total : 0 },
      { formula: `SUM('${es ? "Inventario" : "Inventory"}'!M${c.from}:M${c.to})`, result: c.value }];
    row.eachCell((cell, col) => {
      cell.border = border;
      cell.font = { name: "Arial", size: 10 };
      cell.alignment = { horizontal: col === 1 ? "left" : "center", indent: col === 1 ? 1 : 0 };
    });
    row.getCell(4).numFmt = "0%";
    row.getCell(5).numFmt = USD;
    rr++;
  });
  const tot = rs.getRow(rr);
  const sumT = catStats.reduce((a, c) => a + c.total, 0);
  const sumC = catStats.reduce((a, c) => a + c.counted, 0);
  tot.values = [
    "TOTAL",
    { formula: `SUM(B4:B${rr - 1})`, result: sumT },
    { formula: `SUM(C4:C${rr - 1})`, result: sumC },
    { formula: `IF(B${rr}=0,0,C${rr}/B${rr})`, result: sumT ? sumC / sumT : 0 },
    { formula: `SUM(E4:E${rr - 1})`, result: grandValue },
  ];
  tot.eachCell((cell, col) => {
    cell.border = border;
    cell.font = { name: "Arial", size: 10, bold: true };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.beige } };
    cell.alignment = { horizontal: col === 1 ? "left" : "center", indent: col === 1 ? 1 : 0 };
  });
  tot.getCell(4).numFmt = "0%";
  tot.getCell(5).numFmt = USD;
  if (waste.length) {
    const wr = rs.getRow(rr + 2);
    wr.values = [es ? "Desperdicio (productos / valor)" : "Waste (products / value)", waste.length, null, null, stockCount._wasteValue || 0];
    wr.getCell(5).numFmt = USD;
    wr.getCell(5).font = { name: "Arial", size: 10, bold: true, color: { argb: "FFB3261E" } };
    wr.getCell(5).alignment = { horizontal: "center" };
    wr.getCell(1).font = { name: "Arial", size: 10, bold: true, color: { argb: "FFB3261E" } };
    wr.getCell(2).font = { name: "Arial", size: 10, bold: true, color: { argb: "FFB3261E" } };
    wr.getCell(2).alignment = { horizontal: "center" };
  }

  const buf = await wb.xlsx.writeBuffer();
  return new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}
