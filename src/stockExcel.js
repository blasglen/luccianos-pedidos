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
  ];
  const lastCol = "K";

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
    ? ["#", "Producto", "Ud x caja", "Ud x paq.", "Cajas", "Paquetes", "Sueltas", "TOTAL", "Unidad", "Anterior", "Diferencia"]
    : ["#", "Product", "Units/box", "Units/pack", "Boxes", "Packs", "Loose", "TOTAL", "Unit", "Previous", "Difference"];
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

      const zebra = i % 2 === 1;
      row.eachCell({ includeEmpty: true }, (cell, col) => {
        if (col > 11) return;
        cell.border = border;
        cell.font = { name: "Arial", size: 10, color: { argb: it ? "FF000000" : C.muted } };
        cell.alignment = { vertical: "middle", horizontal: col === 2 ? "left" : "center" };
        if (col >= 3) cell.numFmt = col === 11 ? DIFF : NUM;
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
    catStats.push({ label: cat.label, total: cat.products.length, counted: nCounted });
  });
  const lastDataRow = r - 1;

  // Diferencias en color (verde sube, rojo baja)
  ws.addConditionalFormatting({
    ref: `K${firstDataRow}:K${lastDataRow}`,
    rules: [
      { type: "cellIs", operator: "lessThan", formulae: ["0"], style: { font: { color: { argb: C.red }, bold: true } } },
      { type: "cellIs", operator: "greaterThan", formulae: ["0"], style: { font: { color: { argb: C.green }, bold: true } } },
    ],
  });
  ws.autoFilter = { from: { row: 5, column: 1 }, to: { row: lastDataRow, column: 11 } };
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
    wsW.columns = [{ width: 16 }, { width: 50 }, { width: 12 }, { width: 9 }, { width: 44 }];
    wsW.mergeCells("A1:E1");
    const tw = wsW.getCell("A1");
    tw.value = es ? `DESPERDICIO · ${stockCount.sucursal} · ${fmtDate(stockCount.date)}` : `WASTE · ${stockCount.sucursal} · ${fmtDate(stockCount.date)}`;
    tw.font = { name: "Arial", size: 14, bold: true, color: { argb: "FFFFFFFF" } };
    tw.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFB3261E" } };
    tw.alignment = { vertical: "middle", indent: 1 };
    wsW.getRow(1).height = 28;
    const hw = wsW.getRow(3);
    hw.values = es ? ["Categoría", "Producto", "Cantidad", "Unidad", "Motivo"] : ["Category", "Product", "Quantity", "Unit", "Reason"];
    hw.eachCell((cell, col) => {
      cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.black } };
      cell.alignment = { horizontal: col === 3 || col === 4 ? "center" : "left", vertical: "middle" };
      cell.border = border;
    });
    const labelOf = {};
    catalog.forEach((c) => { labelOf[c.category] = c.label; });
    waste.forEach((it, i) => {
      const row = wsW.getRow(4 + i);
      row.values = [labelOf[it.vendor] || it.vendor, it.item, Number(it.total ?? it.quantity), it.unit === "kg" ? "kg" : "u", it.reason || ""];
      row.eachCell({ includeEmpty: true }, (cell, col) => {
        if (col > 5) return;
        cell.border = border;
        cell.font = { name: "Arial", size: 10, bold: col === 3 };
        cell.alignment = { vertical: "middle", horizontal: col === 3 || col === 4 ? "center" : "left", wrapText: col === 5 };
        if (col === 3) cell.numFmt = NUM;
        if (i % 2 === 1) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.beigeLight } };
      });
    });
  }

  // ── Hoja 2: Resumen ───────────────────────────────────────────────────
  const rs = wb.addWorksheet(es ? "Resumen" : "Summary", { views: [{ showGridLines: false }] });
  rs.columns = [{ width: 28 }, { width: 14 }, { width: 14 }, { width: 14 }];
  rs.mergeCells("A1:D1");
  const t2 = rs.getCell("A1");
  t2.value = `${stockCount.sucursal} · ${fmtDate(stockCount.date)}`;
  t2.font = { name: "Arial", size: 14, bold: true, color: { argb: C.gold } };
  t2.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.black } };
  t2.alignment = { vertical: "middle", indent: 1 };
  rs.getRow(1).height = 28;
  const h2 = rs.getRow(3);
  h2.values = es ? ["Categoría", "Productos", "Contados", "% contado"] : ["Category", "Products", "Counted", "% counted"];
  h2.eachCell((cell) => {
    cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.black } };
    cell.alignment = { horizontal: "center" };
    cell.border = border;
  });
  let rr = 4;
  catStats.forEach((c) => {
    const row = rs.getRow(rr);
    row.values = [c.label, c.total, c.counted, { formula: `IF(B${rr}=0,0,C${rr}/B${rr})`, result: c.total ? c.counted / c.total : 0 }];
    row.eachCell((cell, col) => {
      cell.border = border;
      cell.font = { name: "Arial", size: 10 };
      cell.alignment = { horizontal: col === 1 ? "left" : "center", indent: col === 1 ? 1 : 0 };
    });
    row.getCell(4).numFmt = "0%";
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
  ];
  tot.eachCell((cell, col) => {
    cell.border = border;
    cell.font = { name: "Arial", size: 10, bold: true };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.beige } };
    cell.alignment = { horizontal: col === 1 ? "left" : "center", indent: col === 1 ? 1 : 0 };
  });
  tot.getCell(4).numFmt = "0%";
  if (waste.length) {
    const wr = rs.getRow(rr + 2);
    wr.values = [es ? "Productos con desperdicio" : "Products with waste", waste.length];
    wr.getCell(1).font = { name: "Arial", size: 10, bold: true, color: { argb: "FFB3261E" } };
    wr.getCell(2).font = { name: "Arial", size: 10, bold: true, color: { argb: "FFB3261E" } };
    wr.getCell(2).alignment = { horizontal: "center" };
  }

  const buf = await wb.xlsx.writeBuffer();
  return new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}
