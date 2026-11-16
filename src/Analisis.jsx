// Análisis de inventarios mes a mes (sección del Depósito).
// Se carga solo cuando se abre, para no agrandar el resto de la app.
import { useMemo, useState } from "react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, LabelList,
} from "recharts";

const BRANCHES = ["Florida Mall", "Vineland", "Weston"];

// Paleta categórica validada (3 primeros slots), un color fijo por sucursal.
const PALETTE = {
  day: {
    branch: { "Florida Mall": "#2a78d6", Vineland: "#eb6834", Weston: "#1baf7a" },
    up: "#2a78d6", down: "#e34948", grid: "rgba(28,20,20,0.08)", ink: "#1C1414", muted: "#6E625E", surface: "#F8F1EA",
    single: "#2a78d6",
  },
  night: {
    branch: { "Florida Mall": "#3987e5", Vineland: "#d95926", Weston: "#199e70" },
    up: "#3987e5", down: "#e66767", grid: "rgba(255,255,255,0.07)", ink: "#EDEAE4", muted: "#A89E8D", surface: "#1A1A1A",
    single: "#3987e5",
  },
};

const MONTHS_ES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Los conteos son de fin de mes: si se hacen los primeros días del mes siguiente,
// cuentan para el mes anterior.
function monthKeyOf(iso) {
  const d = new Date(iso);
  if (d.getDate() <= 7) d.setDate(0);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function monthLabel(key, lang) {
  const [y, m] = key.split("-").map(Number);
  return `${(lang === "en" ? MONTHS_EN : MONTHS_ES)[m - 1]} ${String(y).slice(2)}`;
}
const num = (v) => { const n = parseFloat(String(v ?? "").replace(",", ".")); return isNaN(n) ? 0 : n; };
const fmtUSD = (n) => "US$ " + Math.round(n).toLocaleString("es-AR");
const fmt = (n, d = 1) => (Math.round(n * 10 ** d) / 10 ** d).toLocaleString("es-AR");

// ── Datos de ejemplo (6 meses, 3 sucursales) para ver cómo queda ─────────
function rng(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
function buildSampleCounts(catalog) {
  const r = rng(42);
  const now = new Date();
  const counts = [];
  const base = {};
  BRANCHES.forEach((b, bi) => {
    for (let k = 5; k >= 0; k--) {
      const d = new Date(now.getFullYear(), now.getMonth() - k, 0, 21, 0); // último día del mes anterior a k
      const items = [];
      const waste = [];
      catalog.forEach((c) => c.products.forEach((p) => {
        if (r() < 0.25) return; // no todo se cuenta
        const key = b + c.category + p.item;
        const isKg = c.category === "GELATO" || c.category === "INGREDIENTS";
        if (!(key in base)) base[key] = isKg ? 4 + r() * 30 : 20 + r() * 400;
        const season = 1 + 0.25 * Math.sin((d.getMonth() + bi) / 2);
        const q = Math.max(0, base[key] * season * (0.6 + r() * 0.8));
        const total = isKg ? Math.round(q * 1000) / 1000 : Math.round(q);
        items.push({ vendor: c.category, item: p.item, total, quantity: String(total), unit: isKg ? "kg" : "" });
        if (r() < 0.06) {
          const w = isKg ? Math.round(r() * 3 * 1000) / 1000 : Math.ceil(r() * 12);
          waste.push({ vendor: c.category, item: p.item, total: w, quantity: String(w), unit: isKg ? "kg" : "",
            reason: ["Vencido", "Se cayó", "Mal estado", "Vencido", ""][Math.floor(r() * 5)] });
        }
      }));
      counts.push({ id: `demo-${b}-${k}`, sucursal: b, date: d.toISOString(), items, waste });
    }
  });
  return counts;
}

// ── Estructura mensual: por sucursal y mes, el último conteo ─────────────
function buildMonthly(counts) {
  const byBM = {};
  counts.forEach((c) => {
    if (!BRANCHES.includes(c.sucursal)) return;
    if (c.type === "spot") return; // los aleatorios no entran al análisis mes a mes
    const mk = c.period || monthKeyOf(c.date);
    const k = c.sucursal + "|" + mk;
    if (!byBM[k] || new Date(c.date) > new Date(byBM[k].date)) byBM[k] = c;
  });
  const months = [...new Set(Object.keys(byBM).map((k) => k.split("|")[1]))].sort();
  const get = (b, m) => byBM[b + "|" + m];
  return { months, get };
}
const itemQty = (it) => num(it.total ?? it.quantity);

export default function Analisis({ stockCounts = [], catalog = [], theme = "day", lang = "es" }) {
  const C = PALETTE[theme] || PALETTE.day;
  const es = lang !== "en";
  const realMonthly = useMemo(() => buildMonthly(stockCounts), [stockCounts]);
  const hasRealData = realMonthly.months.length >= 2;
  const [useSample, setUseSample] = useState(!hasRealData);
  const counts = useMemo(() => (useSample ? buildSampleCounts(catalog) : stockCounts), [useSample, catalog, stockCounts]);
  const { months, get } = useMemo(() => buildMonthly(counts), [counts]);

  const [branch, setBranch] = useState("Todas");
  const [category, setCategory] = useState("Todas");
  const [monthSel, setMonthSel] = useState(null);
  const month = monthSel && months.includes(monthSel) ? monthSel : months[months.length - 1];
  const prevMonth = months[months.indexOf(month) - 1];
  const branches = branch === "Todas" ? BRANCHES : [branch];
  const costMap = useMemo(() => {
    const m = {};
    catalog.forEach((c) => c.products.forEach((p) => { if (p.cost) m[c.category + "|" + p.item] = p.cost; }));
    return m;
  }, [catalog]);
  // Costo con el que se valoriza: el guardado en el conteo (precio de ese momento);
  // si el conteo es viejo y no lo tiene, el costo actual del catálogo.
  const costOfIt = (it) => (it.cost != null && it.cost !== "" ? Number(it.cost) : costMap[it.vendor + "|" + it.item] || 0);
  const valueOf = (items = []) => items.reduce((a, it) => a + itemQty(it) * costOfIt(it), 0);
  const catLabel = (cat) => (catalog.find((c) => c.category === cat) || {}).label || cat;
  const inCat = (it) => category === "Todas" || it.vendor === category;

  // Totales de gelato (kg) por mes y sucursal
  const gelatoSeries = useMemo(() => months.map((m) => {
    const row = { month: monthLabel(m, lang) };
    BRANCHES.forEach((b) => {
      const c = get(b, m);
      row[b] = c ? Math.round(c.items.filter((it) => it.vendor === "GELATO").reduce((a, it) => a + itemQty(it), 0) * 10) / 10 : null;
    });
    return row;
  }), [months, get, lang]);

  // Valor del inventario (USD) por mes y sucursal
  const valueSeries = useMemo(() => months.map((m) => {
    const row = { month: monthLabel(m, lang) };
    BRANCHES.forEach((b) => {
      const c = get(b, m);
      row[b] = c ? Math.round(valueOf(c.items.filter(inCat))) : null;
    });
    return row;
  }), [months, get, lang, category, costMap]);

  // Valor por categoría en el mes elegido (sucursales filtradas)
  const valueByCat = useMemo(() => catalog.map((c) => ({
    name: c.label,
    value: Math.round(branches.reduce((a, b) => a + valueOf(((get(b, month) || {}).items || []).filter((it) => it.vendor === c.category)), 0)),
  })).filter((r) => r.value > 0).sort((a, b) => b.value - a.value), [catalog, month, branch, get, costMap]);

  // Desperdicio por mes y sucursal: kg (gelato + ingredientes) y unidades (resto)
  const wasteSeries = useMemo(() => months.map((m) => {
    const row = { month: monthLabel(m, lang) };
    BRANCHES.forEach((b) => {
      const c = get(b, m);
      const w = (c && c.waste) || [];
      row[b + "_kg"] = Math.round(w.filter((it) => it.unit === "kg").reduce((a, it) => a + itemQty(it), 0) * 10) / 10;
      row[b + "_u"] = w.filter((it) => it.unit !== "kg").reduce((a, it) => a + itemQty(it), 0);
    });
    return row;
  }), [months, get, lang]);

  // Tabla del mes: actual vs anterior por producto (sucursales elegidas sumadas)
  const monthTable = useMemo(() => {
    if (!month) return [];
    const map = new Map();
    branches.forEach((b) => {
      const cur = get(b, month);
      const prev = prevMonth ? get(b, prevMonth) : null;
      (cur ? cur.items : []).filter(inCat).forEach((it) => {
        const k = it.vendor + "|" + it.item;
        const e = map.get(k) || { vendor: it.vendor, item: it.item, unit: it.unit === "kg" ? "kg" : "u", cur: 0, prev: null };
        e.cur += itemQty(it);
        e.val = (e.val || 0) + itemQty(it) * costOfIt(it);
        map.set(k, e);
      });
      (prev ? prev.items : []).filter(inCat).forEach((it) => {
        const k = it.vendor + "|" + it.item;
        const e = map.get(k) || { vendor: it.vendor, item: it.item, unit: it.unit === "kg" ? "kg" : "u", cur: 0, prev: null };
        e.prev = (e.prev || 0) + itemQty(it);
        map.set(k, e);
      });
    });
    return [...map.values()].map((e) => ({ ...e, pct: e.prev ? ((e.cur - e.prev) / e.prev) * 100 : null }));
  }, [month, prevMonth, branch, category, get]);

  const movers = useMemo(() => {
    const withPct = monthTable.filter((e) => e.pct !== null && e.prev >= 1);
    const short = (e) => { const real = Math.round(Math.abs(e.pct)); return { name: e.item.length > 22 ? e.item.slice(0, 21) + "…" : e.item, full: e.item, real, pct: Math.min(real, 300) }; };
    return {
      down: [...withPct].filter((e) => e.pct < 0).sort((a, b) => a.pct - b.pct).slice(0, 5).map(short),
      up: [...withPct].filter((e) => e.pct > 0).sort((a, b) => b.pct - a.pct).slice(0, 5).map(short),
    };
  }, [monthTable]);

  // Desperdicio por motivo y top productos (mes elegido)
  const wasteThisMonth = useMemo(() => branches.flatMap((b) => ((get(b, month) || {}).waste || []).filter(inCat).map((w) => ({ ...w, branch: b }))), [month, branch, category, get]);
  const wasteByReason = useMemo(() => {
    const m = {};
    wasteThisMonth.forEach((w) => { const r = w.reason || (es ? "Sin motivo" : "No reason"); m[r] = (m[r] || 0) + 1; });
    return Object.entries(m).map(([reason, n]) => ({ reason, n })).sort((a, b) => b.n - a.n);
  }, [wasteThisMonth]);

  // KPIs
  const kpi = useMemo(() => {
    const gel = (m) => branches.reduce((a, b) => { const c = get(b, m); return a + (c ? c.items.filter((it) => it.vendor === "GELATO").reduce((x, it) => x + itemQty(it), 0) : 0); }, 0);
    const g = month ? gel(month) : 0;
    const gp = prevMonth ? gel(prevMonth) : null;
    const wasteKg = wasteThisMonth.filter((w) => w.unit === "kg").reduce((a, w) => a + itemQty(w), 0);
    const wasteU = wasteThisMonth.filter((w) => w.unit !== "kg").reduce((a, w) => a + itemQty(w), 0);
    const zero = monthTable.filter((e) => e.cur === 0 && e.prev > 0).length;
    const alerts = monthTable.filter((e) => e.pct !== null && Math.abs(e.pct) >= 50).length;
    const val = (m) => branches.reduce((a, b) => { const c = get(b, m); return a + (c ? valueOf(c.items.filter(inCat)) : 0); }, 0);
    const v = month ? val(month) : 0;
    const vp = prevMonth ? val(prevMonth) : null;
    const wasteUSD = valueOf(wasteThisMonth);
    return { g, gp, wasteKg, wasteU, zero, alerts, v, vp, wasteUSD, counted: monthTable.filter((e) => e.cur > 0).length };
  }, [month, prevMonth, branch, category, monthTable, wasteThisMonth, get, costMap]);

  // Explorador de producto
  // Para elegir el producto: primero la categoría, después el producto de esa categoría.
  const [prodCatSel, setProdCatSel] = useState(null);
  const prodCat = prodCatSel || (category !== "Todas" ? category : "GELATO");
  const productOptions = useMemo(() => {
    const s = new Set();
    counts.forEach((c) => c.items.forEach((it) => { if (it.vendor === prodCat) s.add(it.vendor + "|" + it.item); }));
    return [...s].sort((a, b) => a.split("|")[1].localeCompare(b.split("|")[1]));
  }, [counts, prodCat]);
  const [productSel, setProductSel] = useState("");
  const product = productOptions.includes(productSel) ? productSel : productOptions[0];
  const productSeries = useMemo(() => months.map((m) => {
    const row = { month: monthLabel(m, lang) };
    BRANCHES.forEach((b) => {
      const c = get(b, m);
      const it = c && c.items.find((x) => x.vendor + "|" + x.item === product);
      row[b] = it ? itemQty(it) : null;
    });
    return row;
  }), [months, get, product, lang]);

  const [sortKey, setSortKey] = useState("pct");
  const sortedTable = useMemo(() => {
    const t = [...monthTable];
    if (sortKey === "pct") t.sort((a, b) => Math.abs(b.pct ?? 0) - Math.abs(a.pct ?? 0));
    if (sortKey === "item") t.sort((a, b) => a.item.localeCompare(b.item));
    if (sortKey === "cur") t.sort((a, b) => b.cur - a.cur);
    if (sortKey === "val") t.sort((a, b) => (b.val || 0) - (a.val || 0));
    return t;
  }, [monthTable, sortKey]);

  const axis = { stroke: C.muted, fontSize: 11, tickLine: false, axisLine: false };
  const tooltipStyle = { contentStyle: { background: C.surface, border: `1px solid ${C.grid}`, borderRadius: 12, fontSize: 12, color: C.ink, boxShadow: "0 8px 24px rgba(0,0,0,.12)" }, labelStyle: { color: C.muted, fontWeight: 600 }, itemStyle: { color: C.ink }, cursor: { stroke: C.muted, strokeWidth: 1, strokeDasharray: "3 3", fill: "rgba(128,128,128,0.06)" } };
  const visibleBranches = branches;

  if (!catalog.length) return null;
  if (months.length === 0) {
    return (
      <div style={S.card}>
        <div style={S.cardTitle}>{es ? "Todavía no hay conteos para analizar" : "No counts to analyze yet"}</div>
        <button style={S.chipBtn} onClick={() => setUseSample(true)}>{es ? "Ver con datos de ejemplo" : "View with sample data"}</button>
      </div>
    );
  }

  const delta = kpi.gp ? ((kpi.g - kpi.gp) / kpi.gp) * 100 : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {useSample && (
        <div style={S.sampleBanner}>
          <strong>{es ? "Datos de ejemplo" : "Sample data"}</strong>
          <span style={{ opacity: 0.85 }}>{es ? " — inventados para ver cómo queda. Con los conteos reales de fin de mes se reemplazan solos." : " — made up to preview. Real month-end counts replace them automatically."}</span>
          {hasRealData && <button style={{ ...S.chipBtn, marginLeft: 8 }} onClick={() => setUseSample(false)}>{es ? "Ver datos reales" : "Show real data"}</button>}
        </div>
      )}

      {/* Filtros: una sola fila arriba de todo */}
      <div style={S.filters}>
        <div className="chips" style={S.chipRow}>
          {["Todas", ...BRANCHES].map((b) => (
            <button key={b} onClick={() => setBranch(b)} style={{ ...S.chip, ...(branch === b ? S.chipOn : {}) }}>
              {b !== "Todas" && <span style={{ ...S.dot, background: C.branch[b] }} />}{b === "Todas" ? (es ? "Todas" : "All") : b}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <select style={S.select} value={month} onChange={(e) => setMonthSel(e.target.value)}>
            {[...months].reverse().map((m) => <option key={m} value={m}>{monthLabel(m, lang)}</option>)}
          </select>
          <select style={S.select} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Todas">{es ? "Todas las categorías" : "All categories"}</option>
            {catalog.map((c) => <option key={c.category} value={c.category}>{c.label}</option>)}
          </select>
          {!useSample && <button style={S.chipBtn} onClick={() => setUseSample(true)}>{es ? "Ver ejemplo" : "Sample"}</button>}
        </div>
      </div>

      {/* KPIs */}
      <div style={S.kpiGrid}>
        <Kpi label={es ? "Valor del inventario" : "Inventory value"} value={fmtUSD(kpi.v)} delta={kpi.vp ? ((kpi.v - kpi.vp) / kpi.vp) * 100 : null} es={es} C={C} />
        <Kpi label={es ? "Gelato en stock" : "Gelato in stock"} value={`${fmt(kpi.g)} kg`} delta={delta} es={es} C={C} />
        <Kpi label={es ? "Desperdicio del mes" : "Waste this month"} value={fmtUSD(kpi.wasteUSD)} sub={`${fmt(kpi.wasteKg)} kg + ${fmt(kpi.wasteU, 0)} ${es ? "unidades" : "units"}`} C={C} />
        <Kpi label={es ? "Variaciones fuertes" : "Big swings"} value={kpi.alerts} sub={es ? "productos ±50% vs mes anterior" : "products ±50% vs last month"} C={C} />
        <Kpi label={es ? "Se quedaron sin stock" : "Ran out"} value={kpi.zero} sub={es ? "tenían el mes anterior" : "had stock last month"} C={C} />

      </div>

      <div style={S.grid2}>
        <Card title={es ? "Valor del inventario por sucursal (US$)" : "Inventory value by branch (US$)"} sub={es ? "Cantidad contada × costo unitario" : "Counted quantity × unit cost"}>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={valueSeries} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={C.grid} />
              <XAxis dataKey="month" {...axis} interval={0} tick={{ fontSize: 10, fill: C.muted }} />
              <YAxis {...axis} width={56} tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)} />
              <Tooltip {...tooltipStyle} formatter={(v) => (v == null ? "—" : fmtUSD(v))} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} formatter={(v) => <span style={{ color: C.muted }}>{v}</span>} />
              {visibleBranches.map((b) => (
                <Line key={b} type="monotone" dataKey={b} stroke={C.branch[b]} strokeWidth={2} dot={{ r: 4, strokeWidth: 2, stroke: C.surface }} activeDot={{ r: 6 }} connectNulls />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title={es ? `Valor por categoría · ${monthLabel(month, lang)}` : `Value by category · ${monthLabel(month, lang)}`} sub={branch === "Todas" ? (es ? "Las 3 sucursales" : "All 3 branches") : branch}>
          {valueByCat.length === 0 ? <div style={S.empty}>—</div> : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={valueByCat} layout="vertical" margin={{ top: 4, right: 64, left: 4, bottom: 0 }}>
                <CartesianGrid horizontal={false} stroke={C.grid} />
                <XAxis type="number" {...axis} tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)} />
                <YAxis type="category" dataKey="name" {...axis} width={96} tick={{ fontSize: 11, fill: C.muted }} />
                <Tooltip {...tooltipStyle} formatter={(v) => [fmtUSD(v), es ? "Valor" : "Value"]} />
                <Bar dataKey="value" fill={C.single} radius={4} barSize={14}>
                  <LabelList dataKey="value" position="right" formatter={fmtUSD} style={{ fontSize: 11, fill: C.muted }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      <div style={S.grid2}>
        <Card title={es ? "Gelato en stock por sucursal (kg)" : "Gelato in stock by branch (kg)"} sub={es ? "Último conteo de cada mes" : "Last count of each month"}>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={gelatoSeries} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={C.grid} />
              <XAxis dataKey="month" {...axis} interval={0} tick={{ fontSize: 10, fill: C.muted }} />
              <YAxis {...axis} width={48} />
              <Tooltip {...tooltipStyle} formatter={(v) => (v == null ? "—" : `${fmt(v)} kg`)} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} formatter={(v) => <span style={{ color: C.muted }}>{v}</span>} />
              {visibleBranches.map((b) => (
                <Line key={b} type="monotone" dataKey={b} stroke={C.branch[b]} strokeWidth={2} dot={{ r: 4, strokeWidth: 2, stroke: C.surface }} activeDot={{ r: 6 }} connectNulls />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title={es ? "Desperdicio por mes (kg)" : "Waste per month (kg)"} sub={es ? "Gelato e ingredientes" : "Gelato and ingredients"}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={wasteSeries} margin={{ top: 10, right: 16, left: -10, bottom: 0 }} barGap={2} barCategoryGap="22%">
              <CartesianGrid vertical={false} stroke={C.grid} />
              <XAxis dataKey="month" {...axis} interval={0} tick={{ fontSize: 10, fill: C.muted }} />
              <YAxis {...axis} width={48} />
              <Tooltip {...tooltipStyle} formatter={(v, n) => [`${fmt(v)} kg`, n.replace("_kg", "")]} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} formatter={(v) => <span style={{ color: C.muted }}>{v.replace("_kg", "")}</span>} />
              {visibleBranches.map((b) => <Bar key={b} dataKey={b + "_kg"} name={b} fill={C.branch[b]} radius={[4, 4, 0, 0]} />)}
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={S.grid2}>
        {[["down", es ? "Más bajaron" : "Biggest drops", C.down, "−"], ["up", es ? "Más subieron" : "Biggest rises", C.up, "+"]].map(([k, title, color, sign]) => (
          <Card key={k} title={`${title} vs ${prevMonth ? monthLabel(prevMonth, lang) : (es ? "mes anterior" : "last month")}`} sub={es ? "Variación % del stock" : "Stock change %"}>
            {movers[k].length === 0 ? <div style={S.empty}>{es ? "Hace falta un mes anterior para comparar." : "Need a previous month to compare."}</div> : (
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={movers[k]} layout="vertical" margin={{ top: 4, right: 72, left: 4, bottom: 0 }}>
                  <CartesianGrid horizontal={false} stroke={C.grid} />
                  <XAxis type="number" {...axis} tickFormatter={(v) => `${v}%`} allowDecimals={false} domain={[0, (max) => Math.min(Math.max(max, 10), 300)]} />
                  <YAxis type="category" dataKey="name" {...axis} width={130} tick={{ fontSize: 10, fill: C.muted }} />
                  <Tooltip {...tooltipStyle} formatter={(v, n, it) => [`${sign}${it.payload.real}%`, es ? "Variación" : "Change"]} labelFormatter={(l, p) => (p && p[0] ? p[0].payload.full : l)} />
                  <Bar dataKey="pct" fill={color} radius={4} barSize={14}>
                    <LabelList dataKey="real" position="right" formatter={(v) => `${sign}${v.toLocaleString("es-AR")}%`} style={{ fontSize: 11, fill: C.muted }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        ))}
      </div>

      <div style={S.grid2}>
        <Card title={es ? "Evolución de un producto" : "Product over time"}
          right={
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", width: "100%" }}>
              <select style={{ ...S.select, flex: "0 1 150px" }} value={prodCat} onChange={(e) => { setProdCatSel(e.target.value); setProductSel(""); }}>
                {catalog.map((c) => <option key={c.category} value={c.category}>{c.label}</option>)}
              </select>
              <select style={{ ...S.select, flex: "1 1 180px", minWidth: 0 }} value={product || ""} onChange={(e) => setProductSel(e.target.value)}>
                {productOptions.length === 0 && <option value="">{es ? "Sin productos contados" : "No counted products"}</option>}
                {productOptions.map((k) => <option key={k} value={k}>{k.split("|")[1]}</option>)}
              </select>
            </div>
          }>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={productSeries} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={C.grid} />
              <XAxis dataKey="month" {...axis} interval={0} tick={{ fontSize: 10, fill: C.muted }} />
              <YAxis {...axis} width={48} />
              <Tooltip {...tooltipStyle} formatter={(v) => (v == null ? "—" : fmt(v))} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} formatter={(v) => <span style={{ color: C.muted }}>{v}</span>} />
              {visibleBranches.map((b) => (
                <Line key={b} type="monotone" dataKey={b} stroke={C.branch[b]} strokeWidth={2} dot={{ r: 4, strokeWidth: 2, stroke: C.surface }} activeDot={{ r: 6 }} connectNulls />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title={es ? `Desperdicio por motivo · ${monthLabel(month, lang)}` : `Waste by reason · ${monthLabel(month, lang)}`} sub={es ? "Cantidad de productos con desperdicio" : "Products with waste"}>
          {wasteByReason.length === 0 ? <div style={S.empty}>{es ? "Sin desperdicio cargado este mes." : "No waste this month."}</div> : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={wasteByReason} layout="vertical" margin={{ top: 4, right: 30, left: 8, bottom: 0 }}>
                <CartesianGrid horizontal={false} stroke={C.grid} />
                <XAxis type="number" allowDecimals={false} {...axis} />
                <YAxis type="category" dataKey="reason" {...axis} width={100} />
                <Tooltip {...tooltipStyle} formatter={(v) => [v, es ? "Productos" : "Products"]} />
                <Bar dataKey="n" fill={C.single} radius={4} barSize={16}>
                  <LabelList dataKey="n" position="right" style={{ fontSize: 11, fill: C.muted }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      <Card title={es ? `Detalle del mes · ${monthLabel(month, lang)}${branch !== "Todas" ? " · " + branch : ""}` : `Month detail · ${monthLabel(month, lang)}`}
        sub={es ? "Tocá un encabezado para ordenar" : "Tap a header to sort"}>
        <div style={{ overflowX: "auto", maxHeight: 420, overflowY: "auto" }}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={{ ...S.th, textAlign: "left", cursor: "pointer" }} onClick={() => setSortKey("item")}>{es ? "Producto" : "Product"}</th>
                <th style={S.th}>{es ? "Categoría" : "Category"}</th>
                <th style={S.th}>{prevMonth ? monthLabel(prevMonth, lang) : "—"}</th>
                <th style={{ ...S.th, cursor: "pointer" }} onClick={() => setSortKey("cur")}>{monthLabel(month, lang)}</th>
                <th style={{ ...S.th, cursor: "pointer" }} onClick={() => setSortKey("pct")}>{es ? "Var." : "Chg."}</th>
                <th style={{ ...S.th, cursor: "pointer" }} onClick={() => setSortKey("val")}>{es ? "Valor" : "Value"}</th>
              </tr>
            </thead>
            <tbody>
              {sortedTable.map((e) => (
                <tr key={e.vendor + e.item}>
                  <td style={{ ...S.td, textAlign: "left", fontWeight: 600 }}>{e.item}</td>
                  <td style={{ ...S.td, color: C.muted }}>{catLabel(e.vendor)}</td>
                  <td style={S.td}>{e.prev == null ? "—" : `${fmt(e.prev)} ${e.unit}`}</td>
                  <td style={{ ...S.td, fontWeight: 700 }}>{fmt(e.cur)} {e.unit}</td>
                  <td style={{ ...S.td, fontWeight: 700, color: e.pct == null ? C.muted : e.pct >= 0 ? C.up : C.down }}>
                    {e.pct == null ? "—" : `${e.pct >= 0 ? "▲" : "▼"} ${Math.abs(Math.round(e.pct))}%`}
                  </td>
                  <td style={S.td}>{e.val ? fmtUSD(e.val) : <span style={{ color: C.muted }}>{es ? "sin costo" : "no cost"}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div style={{ ...S.card, ...S.soon }}>
        <div style={S.cardTitle}>{es ? "Próximamente, con las compras recibidas" : "Coming with received purchases"}</div>
        <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
          {es
            ? "Uso del mes (inicial + recibido − desperdicio ± transferencias − empleados − final) · costo de uso en US$ · food cost % contra ventas netas · igual que la hoja FOOD COST CALC, pero automático."
            : "Monthly use (opening + received − waste ± transfers − staff − closing) · cost of use in US$ · food cost % vs net sales · like the FOOD COST CALC sheet, but automatic."}
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, sub, delta, es, C, muted }) {
  return (
    <div style={{ ...S.kpi, ...(muted ? { opacity: 0.6, borderStyle: "dashed" } : {}) }}>
      <div style={S.kpiLabel}>{label}</div>
      <div style={S.kpiValue}>{value}</div>
      {delta != null && (
        <div style={{ fontSize: 12, fontWeight: 600, color: delta >= 0 ? C.up : C.down }}>
          {delta >= 0 ? "▲" : "▼"} {Math.abs(Math.round(delta))}% {es ? "vs mes anterior" : "vs last month"}
        </div>
      )}
      {sub && <div style={{ fontSize: 12, color: "var(--muted)" }}>{sub}</div>}
    </div>
  );
}

function Card({ title, sub, right, children }) {
  return (
    <div style={S.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
        <div>
          <div style={S.cardTitle}>{title}</div>
          {sub && <div style={S.cardSub}>{sub}</div>}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

const S = {
  filters: { display: "flex", flexDirection: "column", gap: 10 },
  chipRow: { display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" },
  chip: { display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 999, border: "1px solid var(--line)", background: "var(--paper)", color: "var(--muted-strong)", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" },
  chipOn: { background: "var(--plum)", color: "var(--on-accent)", borderColor: "var(--plum)" },
  chipBtn: { padding: "8px 14px", borderRadius: 999, border: "1px solid var(--line)", background: "var(--paper)", color: "var(--ink)", fontSize: 12, fontWeight: 600, cursor: "pointer" },
  dot: { width: 8, height: 8, borderRadius: 999, display: "inline-block" },
  select: { padding: "9px 12px", borderRadius: 12, border: "1px solid var(--line)", background: "var(--paper)", color: "var(--ink)", fontSize: 13 },
  kpiGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 },
  kpi: { background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 4, boxShadow: "var(--shadow-sm)" },
  kpiLabel: { fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" },
  kpiValue: { fontSize: 24, fontWeight: 800, color: "var(--ink)", letterSpacing: "-0.02em" },
  grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 },
  card: { background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 20, padding: 16, boxShadow: "var(--shadow)", minWidth: 0 },
  cardTitle: { fontSize: 15, fontWeight: 700, color: "var(--ink)" },
  cardSub: { fontSize: 12, color: "var(--muted)", marginTop: 2 },
  empty: { fontSize: 13, color: "var(--muted)", padding: "30px 0", textAlign: "center" },
  sampleBanner: { background: "var(--paper-2)", border: "1px dashed var(--line)", borderRadius: 14, padding: "10px 14px", fontSize: 13, color: "var(--ink)", display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: { position: "sticky", top: 0, background: "var(--paper)", textAlign: "right", padding: "8px 10px", fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--line)", whiteSpace: "nowrap" },
  td: { textAlign: "right", padding: "9px 10px", borderBottom: "1px solid var(--line)", color: "var(--ink)", whiteSpace: "nowrap" },
  soon: { borderStyle: "dashed", boxShadow: "none" },
};
