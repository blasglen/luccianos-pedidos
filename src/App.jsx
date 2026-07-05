import { useState, useEffect, useMemo, useRef } from "react";
import {
  Search, Package, ClipboardList, Store, CheckCircle2, Clock, Loader2,
  ArrowLeft, Send, ChevronDown, ChevronUp, Lock, CalendarDays, Sun, Moon,
} from "lucide-react";
import { supabase } from "./supabaseClient";

const PINS = {
  "American Dream": "1001",
  "Aventura": "1002",
  "Sawgrass": "1003",
  "Florida Mall": "1004",
  "Vineland": "1005",
  "Weston": "1006",
};

const VENDORS = {
  "Mec3": [
    { item: "Base Cheesecake", code: "8284" },
    { item: "Base Elena", code: "2136" },
    { item: "Base G Crème", code: "2481" },
    { item: "Base Limone 50", code: "8007" },
    { item: "Base Lucciano's Dulce De Leche", code: "2819" },
    { item: "Base Salted Butter Caramel", code: "8323" },
    { item: "Base Soave", code: "2121" },
    { item: "Biancocioc", code: "14092" },
    { item: "Brezel Cream", code: "14997" },
    { item: "Café Solubile", code: "8142" },
    { item: "Cookies Original", code: "14322" },
    { item: "Copertura Stracciatella", code: "14028" },
    { item: "Extra Dark", code: "8145" },
    { item: "Fiordibosco x 3", code: "18089A" },
    { item: "Fiordimaracuja x 3kg", code: "18195A" },
    { item: "Gianfrutta Mango Alphonso x 5 kg", code: "18351" },
    { item: "Gianfrutta Maracuja x 5kg", code: "18430" },
    { item: "Granella Nocciola Pralinata Ciuri Ciuri", code: "16095" },
    { item: "Granellla Di Nocciole", code: "16083" },
    { item: "Instacrumble Cacao Salato", code: "16100" },
    { item: "Instacrumble Pistacchio Salato gluten free", code: "16104" },
    { item: "Kit Limetta x 11.9kg", code: "14339" },
    { item: "Kit Lotus", code: "15079" },
    { item: "Mec Fibra Plus", code: "6072" },
    { item: "Morettina Pepita x 5.5kg", code: "12093050" },
    { item: "Pan Mec E", code: "8004" },
    { item: "Pasta Banana Con Pezzi x 3kg", code: "18138A" },
    { item: "Pasta Biscotino", code: "14094" },
    { item: "Pasta Cocco", code: "14020" },
    { item: "Pasta Cream Cacao", code: "14073A" },
    { item: "Pasta Crema Baci", code: "14023" },
    { item: "Pasta Crema Chocomilky", code: "15096" },
    { item: "Pasta Fragola x 3kg", code: "18047A" },
    { item: "Pasta French Vanilla", code: "14054A" },
    { item: "Pasta Gianduia Blanca", code: "14977" },
    { item: "Pasta Gusto popcorn", code: "14973" },
    { item: "Pasta Lampone", code: "1808A" },
    { item: "Pasta Mama Que Buena", code: "14221" },
    { item: "Pasta Menta", code: "14035A" },
    { item: "Pasta Mister Nico", code: "14220" },
    { item: "Pasta Nocciola Selection x 5kg", code: "14800" },
    { item: "Pasta Per Cookies Black x 4.5 kg", code: "14582" },
    { item: "Pasta Tiramisu x 4.5 kg", code: "14302B" },
    { item: "Pesto Nocciola Ciuri Ciuri", code: "15958A" },
    { item: "Softin x 3.5 kg", code: "6069" },
    { item: "Supergel Mix", code: "6004" },
    { item: "Sweet Gusto Mascarpone", code: "8010" },
    { item: "Variegato Master Nico", code: "14225" },
    { item: "Variegato Cookies Black", code: "14581A" },
    { item: "Variegato Cookies Black x 6kg", code: "14581A" },
    { item: "Variegato Cookies Lemon Meringue", code: "14964" },
    { item: "Variegato Dubai Chocolate", code: "18740" },
    { item: "Variegato Limetta X 1.5kg", code: "14343" },
    { item: "Variegato Mama Que Buena", code: "14219" },
    { item: "Variegato Mecbrownie", code: "148308" },
    { item: "Variegato Mecraph x 5.5kg", code: "14335" },
    { item: "Variegato Mecrock Plus x 5kg", code: "14318" },
    { item: "Variegato Mister Nico x 4kg", code: "14225" },
    { item: "Variegato Popcorn Salty Caramel", code: "14975" },
    { item: "Variegato Quella Crunchy x 5kg", code: "14677" },
    { item: "Variegato Quella G", code: "14780" },
    { item: "Variegato Quella Lampone Nocciole", code: "14976A" },
    { item: "Variegato Quella Nocciola Praline", code: "14782" },
    { item: "Variegato Quella Original x 6kg", code: "14179" },
    { item: "Variegato Quella Pistacchio X 6kg - Kosher", code: "14586" },
    { item: "Variegato Quella Pistacchio Crunchy", code: "14720" },
    { item: "Variegato Quello Caramel x 6kg", code: "14477" },
    { item: "Variegato Quello Crunchy x 2.3kg", code: "14723A" },
    { item: "Variegato Salty Caramel Cream", code: "14972" },
    { item: "Variegato Wafer x 5kg", code: "14349" },
    { item: "Yoghin - Kosher", code: "8011" },
  ],
  "Disaronno": [
    { item: "Dextrose 50lb", code: "DEXT_USA" },
    { item: "Gran Pistacchio", code: "2G7669" },
    { item: "Whole Milk Powder 28.5%", code: "WMP" },
  ],
  "Froyo": [
    { item: "Sugar Cone #310 (400 un/caja)", code: "LUCCSC" },
    { item: "Waffle Classic cone #5288 (288 un/caja)", code: "LUCCWC" },
    { item: "Cone Sleeves", code: "LUCICS" },
    { item: "Dome Lids Clear", code: "LUC90" },
    { item: "Flat Lids Clear", code: "LUC91" },
    { item: "Lucciano's 16oz Pet Cups", code: "LUC16PET" },
    { item: "Lucciano's 4oz Logo Cups", code: "LUC04" },
    { item: "Lucciano's 6oz Logo Cups", code: "LUC06" },
    { item: "Lucciano's 8oz Logo Cups", code: "LUC08" },
    { item: "Lucciano's 4oz Logo GOLD", code: "LUCG04" },
    { item: "Lucciano's 6oz Logo GOLD", code: "LUC0G6" },
    { item: "Lucciano's 8oz Logo GOLD", code: "LUCG08" },
    { item: "Lucciano's Alfajor bag x 250 pcs", code: "LucciAlfjr" },
    { item: "Lucciano's Bakery box x 250 pcs", code: "LucciBX" },
    { item: "Lucciano's Logo Napkins", code: "LUCNAPK" },
    { item: "Lucciano's Pastry bag x 250 pcs", code: "LucciPB" },
    { item: "Lucciano's Straw", code: "LUCCST" },
    { item: "Lucciano's To-Go Bag x 100 pcs", code: "LucciBG" },
    { item: "Lucciano's waffle cookie x 1200 pcs", code: "LUCCwaff" },
    { item: "Packaging Sleeve M x 250 pcs", code: "LucciSIM" },
    { item: "Packaging Sleeve XL x 250 pcs", code: "LucciSXL" },
    { item: "Sticker Roll x 500 pcs", code: "LucciST" },
  ],
};

const VENDOR_ORDER = ["Mec3", "Disaronno", "Froyo"];
const SUCURSALES = ["American Dream", "Aventura", "Sawgrass", "Florida Mall", "Vineland", "Weston"];
const SUCURSAL_PHOTOS = {
  "American Dream": "american-dream.jpg",
  "Aventura": "aventura.jpg",
  "Sawgrass": "sawgrass.jpg",
  "Florida Mall": "florida-mall.jpg",
  "Vineland": "vineland.jpg",
  "Weston": "weston.jpg",
};
const SUCURSAL_ABBR = {
  "American Dream": "AMD",
  "Aventura": "AVE",
  "Sawgrass": "SAW",
  "Florida Mall": "FML",
  "Vineland": "VIN",
  "Weston": "WES",
};
const ORDER_EMAIL = "admin@luccianos.us";
const ALLOWED_DEPOSITO_EMAILS = ["contabilidad@luccianos.com.ar", "admin@luccianos.us"];

function getAutoTheme() {
  const hour = new Date().getHours();
  return hour >= 7 && hour < 20 ? "day" : "night";
}

const THEMES = {
  day: {
    "--cream": "#FBF6EE", "--paper": "#FFFFFF", "--plum": "#4A1F2E", "--plum-light": "#6E3347",
    "--pistachio": "#8CA876", "--pistachio-dark": "#5F7A4C", "--terracotta": "#C9714E",
    "--ink": "#2B2320", "--line": "#E7DFCF",
    "--muted-strong": "#6B5D4B", "--muted": "#8A7B68", "--muted-faint": "#A99A86",
    "--on-accent": "#FFFFFF",
  },
  night: {
    "--cream": "#161616", "--paper": "#202020", "--plum": "#C7A75F", "--plum-light": "#D6BC7F",
    "--pistachio": "#A9C2B0", "--pistachio-dark": "#8CA895", "--terracotta": "#B98A5A",
    "--ink": "#EAEAE7", "--line": "#333333",
    "--muted-strong": "#D6CDBB", "--muted": "#AFA491", "--muted-faint": "#8C8272",
    "--on-accent": "#1A1409",
  },
};

const STATUS_META = {
  pendiente: { label: "Pendiente", color: "var(--terracotta)", bg: "#FBEAE0", on: "var(--on-accent)" },
  pedido: { label: "Pedido", color: "var(--pistachio-dark)", bg: "#EAF1E3", on: "var(--on-accent)" },
  cancelado: { label: "Cancelado", color: "#B3261E", bg: "#F7D6D2", on: "#fff" },
};

let scrollLockY = 0;
function lockScroll() {
  scrollLockY = window.scrollY;
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollLockY}px`;
  document.body.style.width = "100%";
}
function unlockScroll() {
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  window.scrollTo(0, scrollLockY);
}

function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" }) +
    " · " + d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

function fmtShortDate(iso) {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${d.getFullYear()}`;
}

function sanitizeQty(value) {
  let v = value.replace(/[^\d.]/g, "");
  const dotIndex = v.indexOf(".");
  if (dotIndex !== -1) {
    const intPart = v.slice(0, dotIndex);
    const decPart = v.slice(dotIndex + 1).replace(/\./g, "").slice(0, 2);
    v = intPart + "." + decPart;
  }
  return v;
}

function getSucursalOrderNumber(order, allOrders) {
  const sameSucursal = allOrders
    .filter((o) => o.sucursal === order.sucursal)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const idx = sameSucursal.findIndex((o) => o.id === order.id);
  return idx === -1 ? null : idx + 1;
}

function getOrderCode(order, allOrders) {
  const abbr = SUCURSAL_ABBR[order.sucursal] || order.sucursal.slice(0, 3).toUpperCase();
  const num = getSucursalOrderNumber(order, allOrders);
  return `ORDEN ${fmtShortDate(order.date)} - #${abbr}-${num ?? "?"}`;
}

function getOrderShortCode(order, allOrders) {
  const abbr = SUCURSAL_ABBR[order.sucursal] || order.sucursal.slice(0, 3).toUpperCase();
  const num = getSucursalOrderNumber(order, allOrders);
  return `#${abbr}-${num ?? "?"}`;
}

function buildMailBody(order) {
  let body = `Pedido de stock\nSucursal: ${order.sucursal}\nFecha: ${fmtDate(order.date)}\n\n`;
  VENDOR_ORDER.filter((v) => order.items.some((it) => it.vendor === v)).forEach((v) => {
    body += `${v}\n`;
    order.items.filter((it) => it.vendor === v).forEach((it) => {
      body += `  - ${it.item} (${it.code}): ${it.quantity}\n`;
    });
    body += `\n`;
  });
  if (order.notes) body += `Notas: ${order.notes}\n`;
  return body;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildOrderHtmlTable(order) {
  const font = "font-family:Arial,Helvetica,sans-serif;font-size:13px;";
  const headerCell = `border:1px solid #000000;padding:6px 14px;font-weight:bold;background:#ffffff;${font}`;
  const headerCellCenter = `${headerCell}text-align:center;`;
  const dataCell = `border:1px solid #000000;padding:6px 14px;background:#d9d9d9;${font}`;
  const dataCellCenter = `${dataCell}text-align:center;`;

  let html = `<div style="${font}color:#000000;">`;
  html += `<p style="margin:0 0 2px;"><strong>Pedido de stock</strong></p>`;
  html += `<p style="margin:0 0 2px;">Sucursal: ${escapeHtml(order.sucursal)}</p>`;
  html += `<p style="margin:0 0 14px;">Fecha: ${escapeHtml(fmtDate(order.date))}</p>`;

  VENDOR_ORDER.filter((v) => order.items.some((it) => it.vendor === v)).forEach((v) => {
    html += `<p style="margin:0 0 6px;font-weight:bold;">${escapeHtml(v)}</p>`;
    html += `<table style="border-collapse:collapse;margin-bottom:18px;">`;
    html += `<tr><td style="${headerCell}">Item</td><td style="${headerCellCenter}">Code</td><td style="${headerCellCenter}"></td></tr>`;
    order.items.filter((it) => it.vendor === v).forEach((it) => {
      html += `<tr><td style="${dataCell}">${escapeHtml(it.item)}</td><td style="${dataCellCenter}">${escapeHtml(it.code)}</td><td style="${dataCellCenter}">${escapeHtml(it.quantity)}</td></tr>`;
    });
    html += `</table>`;
  });

  if (order.notes) {
    html += `<p style="margin:8px 0 0;"><strong>Notas:</strong> ${escapeHtml(order.notes)}</p>`;
  }
  html += `</div>`;
  return html;
}

function buildMailto(order) {
  const subject = `Pedido de stock - ${order.sucursal} - ${fmtDate(order.date)}`;
  const body = buildMailBody(order);
  return `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [sucursal, setSucursal] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [activeVendor, setActiveVendor] = useState("Mec3");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState({});
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [filterSucursal, setFilterSucursal] = useState("Todas");
  const [filterStatus, setFilterStatus] = useState("todas");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [depositoView, setDepositoView] = useState("pedido");
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "night";
    const saved = localStorage.getItem("luccianos-theme");
    if (saved === "day" || saved === "night") return saved;
    return getAutoTheme();
  });

  useEffect(() => {
    localStorage.setItem("luccianos-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "night" ? "day" : "night"));
  }
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);
  const [pendingRole, setPendingRole] = useState(null);
  const [pinValue, setPinValue] = useState("");
  const [pinError, setPinError] = useState(false);
  const [depositoSession, setDepositoSession] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => { loadOrders(); }, []);

  useEffect(() => { unlockScroll(); }, [screen]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setDepositoSession(data.session);
      setAuthChecked(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setDepositoSession(session);
      if (event === "PASSWORD_RECOVERY") {
        setScreen("reset-password");
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  async function loadOrders() {
    setLoading(true);
    setLoadError(null);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("date", { ascending: false });
    if (error) {
      setLoadError(error.message);
      setOrders([]);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  }

  function requestPin(key, nextScreen) {
    setPendingRole({ key, nextScreen });
    setPinValue("");
    setPinError(false);
    setScreen("pin");
  }

  function checkPin() {
    if (pinValue === PINS[pendingRole.key]) {
      if (pendingRole.key !== "Depósito") setSucursal(pendingRole.key);
      setScreen(pendingRole.nextScreen);
      setPinValue("");
      setPinError(false);
    } else {
      setPinError(true);
    }
  }

  const draftCount = useMemo(
    () => Object.values(draft).filter((v) => v && v.trim() !== "").length,
    [draft]
  );

  function setQty(vendor, item, value) {
    setDraft((d) => ({ ...d, [vendor + "|" + item]: value }));
  }

  function clearDraft() {
    setDraft({});
  }

  function copyLastOrder() {
    const sorted = [...mySucursalOrders].sort((a, b) => new Date(b.date) - new Date(a.date));
    const last = sorted[0];
    if (!last) {
      setToast({ type: "error", text: "Todavía no hay pedidos anteriores para copiar." });
      return;
    }
    setDraft((d) => {
      const next = { ...d };
      last.items.forEach((it) => {
        next[it.vendor + "|" + it.item] = String(it.quantity);
      });
      return next;
    });
    setToast({ type: "success", text: "Cargamos las cantidades del último pedido." });
  }

  async function submitOrder() {
    const items = [];
    Object.entries(draft).forEach(([key, qty]) => {
      if (qty && qty.trim() !== "") {
        const sep = key.indexOf("|");
        const vendor = key.slice(0, sep);
        const itemName = key.slice(sep + 1);
        const prod = VENDORS[vendor].find((p) => p.item === itemName);
        items.push({ vendor, item: itemName, code: prod ? prod.code : "", quantity: qty.trim() });
      }
    });
    if (items.length === 0) {
      setToast({ type: "error", text: "Cargá al menos una cantidad antes de enviar." });
      return;
    }
    const newOrder = {
      id: (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()),
      sucursal,
      date: new Date().toISOString(),
      items,
      notes: notes.trim(),
      status: "pendiente",
    };
    setSubmitting(true);
    const { error } = await supabase.from("orders").insert([newOrder]);
    setSubmitting(false);
    if (error) {
      setToast({ type: "error", text: "No se pudo guardar el pedido. Probá de nuevo." });
      return;
    }
    setOrders((prev) => [newOrder, ...prev]);
    setDraft({});
    setNotes("");
    setLastOrder(newOrder);
    setScreen("sucursal-confirm");
  }

  async function updateStatus(orderId, status) {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) {
      setToast({ type: "error", text: "No se pudo actualizar el estado." });
      return;
    }
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  }

  async function importOrders(importedOrders) {
    const { error } = await supabase.from("orders").upsert(importedOrders, { onConflict: "id" });
    if (error) {
      setToast({ type: "error", text: "No se pudo restaurar el backup." });
      return;
    }
    await loadOrders();
  }

  const mySucursalOrders = useMemo(
    () => orders.filter((o) => o.sucursal === sucursal),
    [orders, sucursal]
  );

  const depositoOrders = useMemo(() => {
    return orders
      .filter((o) => filterSucursal === "Todas" || o.sucursal === filterSucursal)
      .filter((o) => filterStatus === "todas" || o.status === filterStatus)
      .filter((o) => {
        if (!filterDateFrom) return true;
        const orderTime = new Date(o.date).getTime();
        const from = new Date(`${filterDateFrom}T00:00:00`).getTime();
        const toDay = filterDateTo || filterDateFrom;
        const to = new Date(`${toDay}T23:59:59`).getTime();
        return orderTime >= from && orderTime <= to;
      });
  }, [orders, filterSucursal, filterStatus, filterDateFrom, filterDateTo]);

  return (
    <div style={{ ...styles.page, ...THEMES[theme] }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kaushan+Script&family=Baloo+2:wght@500;600;700;800&family=Bodoni+Moda:opsz,wght@6..96,700;6..96,800;6..96,900&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        input, textarea, select, button { font-family: inherit; }
        input:focus, textarea:focus, button:focus-visible { outline: 2px solid var(--plum); outline-offset: 1px; }
        ::placeholder { color: var(--muted-faint); }
        html, body { overscroll-behavior: none; }
        .no-scroll-screen { touch-action: none; overscroll-behavior: none; }

        .order-layout { display: grid; grid-template-columns: 1fr 320px; gap: 24px; align-items: start; }
        .order-ticket { position: sticky; top: 24px; }
        @media (max-width: 760px) {
          .order-layout { grid-template-columns: 1fr; gap: 20px; }
          .order-ticket { position: static; }
        }
      `}</style>

      {toast && (
        <div style={{ ...styles.toast, ...(toast.type === "error" ? styles.toastError : styles.toastSuccess) }}>
          {toast.text}
        </div>
      )}

      {loadError && screen === "home" && (
        <div style={{ ...styles.toast, ...styles.toastError, position: "static", margin: "16px auto", maxWidth: 520, textAlign: "center" }}>
          No se pudo conectar con la base de datos. Revisá que las variables de entorno de Supabase estén configuradas. ({loadError})
        </div>
      )}

      {screen === "home" && <Home onSucursal={() => setScreen("sucursal-select")} onDeposito={() => setScreen(depositoSession ? "deposito" : "deposito-auth")} theme={theme} onToggleTheme={toggleTheme} />}

      {screen === "sucursal-select" && (
        <SucursalSelect onBack={() => setScreen("home")} onPick={(s) => requestPin(s, "order-form")} theme={theme} onToggleTheme={toggleTheme} />
      )}

      {screen === "pin" && pendingRole && (
        <PinScreen
          roleKey={pendingRole.key}
          value={pinValue}
          setValue={setPinValue}
          error={pinError}
          onSubmit={checkPin}
          onBack={() => setScreen(pendingRole.key === "Depósito" ? "home" : "sucursal-select")}
        />
      )}

      {screen === "order-form" && (
        <OrderForm
          sucursal={sucursal}
          onBack={() => setScreen("sucursal-select")}
          onViewHistory={() => setScreen("sucursal-history")}
          activeVendor={activeVendor}
          setActiveVendor={setActiveVendor}
          search={search}
          setSearch={setSearch}
          draft={draft}
          setQty={setQty}
          draftCount={draftCount}
          notes={notes}
          setNotes={setNotes}
          onSubmit={submitOrder}
          submitting={submitting}
          theme={theme}
          onToggleTheme={toggleTheme}
          onCopyLastOrder={copyLastOrder}
          onClearDraft={clearDraft}
        />
      )}

      {screen === "sucursal-confirm" && (
        <Confirm
          sucursal={sucursal}
          lastOrder={lastOrder}
          onNewOrder={() => setScreen("order-form")}
          onHistory={() => setScreen("sucursal-history")}
          onHome={() => { setSucursal(null); setScreen("home"); }}
        />
      )}

      {screen === "sucursal-history" && (
        <SucursalHistory
          sucursal={sucursal}
          orders={mySucursalOrders}
          loading={loading}
          onBack={() => setScreen("order-form")}
          expandedOrder={expandedOrder}
          setExpandedOrder={setExpandedOrder}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      {screen === "deposito-auth" && (
        <DepositoAuth
          onBack={() => setScreen("home")}
          onSuccess={() => setScreen("deposito")}
        />
      )}

      {screen === "reset-password" && (
        <ResetPassword onSuccess={() => setScreen("deposito")} />
      )}

      {screen === "deposito" && (
        <Deposito
          onBack={() => setScreen("home")}
          loading={loading}
          orders={depositoOrders}
          allOrders={orders}
          filterSucursal={filterSucursal}
          setFilterSucursal={setFilterSucursal}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterDateFrom={filterDateFrom}
          setFilterDateFrom={setFilterDateFrom}
          filterDateTo={filterDateTo}
          setFilterDateTo={setFilterDateTo}
          depositoView={depositoView}
          setDepositoView={setDepositoView}
          expandedOrder={expandedOrder}
          setExpandedOrder={setExpandedOrder}
          updateStatus={updateStatus}
          onImportOrders={importOrders}
          userEmail={depositoSession?.user?.email}
          onLogout={async () => { await supabase.auth.signOut(); setScreen("home"); }}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
    </div>
  );
}

function Home({ onSucursal, onDeposito, theme, onToggleTheme }) {
  return (
    <div className="no-scroll-screen" style={styles.homeDark}>
      <button style={styles.homeThemeToggleBtn} onClick={onToggleTheme} aria-label="Cambiar tema día/noche">
        {theme === "night" ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <div style={styles.homeInner}>
        <img src={`${import.meta.env.BASE_URL}logo-gold.png`} alt="Lucciano's" style={styles.homeLogoImg} />
        <div style={styles.homeEyebrow}>Estados Unidos</div>
        <h1 style={styles.homeH1}>Gestión de Compras</h1>
        <div style={styles.roleGrid}>
          <button style={styles.roleCard} onClick={onSucursal}>
            <Store size={28} color="var(--plum)" strokeWidth={1.6} />
            <div style={styles.roleTitle}>Sucursal</div>
            <div style={styles.roleDesc}>Responsable de Sucursal</div>
          </button>
          <button style={styles.roleCard} onClick={onDeposito}>
            <ClipboardList size={28} color="var(--plum)" strokeWidth={1.6} />
            <div style={styles.roleTitle}>Depósito</div>
            <div style={styles.roleDesc}>Responsable de Compras</div>
          </button>
        </div>
        <div style={styles.homeTagline}>
          <div>#IL MAESTRO</div>
          <div>DEL GELATO</div>
        </div>
      </div>
    </div>
  );
}

function DepositoAuth({ onBack, onSuccess }) {
  const [mode, setMode] = useState("login"); // "login" | "signup" | "forgot"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => () => unlockScroll(), []);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  async function handleSubmit() {
    setError(null);
    setInfo(null);

    if (mode === "forgot") {
      if (!email.trim()) {
        setError("Ingresá tu mail para poder mandarte el link.");
        return;
      }
      setLoading(true);
      const redirectTo = `${window.location.origin}${import.meta.env.BASE_URL}`;
      const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
      setLoading(false);
      if (err) {
        setError(err.message);
        return;
      }
      setInfo("Listo. Si ese mail tiene una cuenta, te llegó un link para elegir una contraseña nueva. Revisá también spam.");
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError("Completá mail y contraseña.");
      return;
    }
    if (mode === "signup" && password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (mode === "signup" && !ALLOWED_DEPOSITO_EMAILS.includes(email.trim().toLowerCase())) {
      setError("Ese mail no está autorizado para crear una cuenta de Depósito. Consultá con quien administra la herramienta.");
      return;
    }
    setLoading(true);
    if (mode === "signup") {
      const { data, error: err } = await supabase.auth.signUp({ email: email.trim(), password });
      setLoading(false);
      if (err) {
        setError(err.message === "User already registered" ? "Ese mail ya tiene una cuenta creada. Probá ingresar." : err.message);
        return;
      }
      if (data.session) {
        onSuccess();
      } else {
        setInfo("Cuenta creada. Si te pide confirmar el mail, revisá tu casilla y después volvé acá a ingresar.");
        setMode("login");
      }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      setLoading(false);
      if (err) {
        setError("Mail o contraseña incorrectos.");
        return;
      }
      onSuccess();
    }
  }

  return (
    <div style={styles.center}>
      <Lock size={36} color="var(--plum)" strokeWidth={1.5} />
      <div style={styles.eyebrow}>Depósito</div>
      <h1 style={styles.h1}>
        {mode === "login" ? "Ingresá a tu cuenta" : mode === "signup" ? "Creá tu cuenta" : "Recuperar contraseña"}
      </h1>
      <p style={styles.sub}>
        {mode === "login" && "Con el mail y contraseña que ya registraste."}
        {mode === "signup" && "Elegí un mail y una contraseña para vos."}
        {mode === "forgot" && "Te mandamos un link a tu mail para elegir una contraseña nueva."}
      </p>

      <div style={{ width: "100%", maxWidth: 320, marginTop: 20 }}>
        <input
          type="email"
          placeholder="tu-mail@luccianos.us"
          style={styles.authInput}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={lockScroll}
          onBlur={unlockScroll}
          onKeyDown={(e) => { if (e.key === "Enter" && mode === "forgot") handleSubmit(); }}
        />
        {mode !== "forgot" && (
          <input
            type="password"
            placeholder="Contraseña"
            style={styles.authInput}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={lockScroll}
            onBlur={unlockScroll}
            onKeyDown={(e) => { if (e.key === "Enter" && mode === "login") handleSubmit(); }}
          />
        )}
        {mode === "signup" && (
          <input
            type="password"
            placeholder="Repetí la contraseña"
            style={styles.authInput}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onFocus={lockScroll}
            onBlur={unlockScroll}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
          />
        )}
      </div>

      {error && <div style={{ color: "var(--terracotta)", fontSize: 13, marginTop: 10, fontWeight: 600 }}>{error}</div>}
      {info && <div style={{ color: "var(--pistachio-dark)", fontSize: 13, marginTop: 10, fontWeight: 600, maxWidth: 320 }}>{info}</div>}

      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button style={styles.secondaryBtn} onClick={onBack}>Volver</button>
        <button style={styles.primaryBtnSm} onClick={handleSubmit} disabled={loading}>
          {loading ? "Un momento..." : mode === "login" ? "Ingresar" : mode === "signup" ? "Crear cuenta" : "Enviar link"}
        </button>
      </div>

      {mode === "login" && (
        <button style={styles.textLink} onClick={() => { setMode("forgot"); setError(null); setInfo(null); }}>
          ¿Olvidaste tu contraseña?
        </button>
      )}

      <button
        style={styles.textLink}
        onClick={() => { setMode(mode === "signup" ? "login" : mode === "forgot" ? "login" : "signup"); setError(null); setInfo(null); }}
      >
        {mode === "signup" ? "¿Ya tenés cuenta? Ingresá" : mode === "forgot" ? "Volver a ingresar" : "¿No tenés cuenta? Creá una"}
      </button>
    </div>
  );
}

function ResetPassword({ onSuccess }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => () => unlockScroll(), []);

  async function handleSubmit() {
    setError(null);
    if (!password.trim()) {
      setError("Elegí una contraseña nueva.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    onSuccess();
  }

  return (
    <div style={styles.center}>
      <Lock size={36} color="var(--plum)" strokeWidth={1.5} />
      <div style={styles.eyebrow}>Depósito</div>
      <h1 style={styles.h1}>Elegí tu contraseña nueva</h1>
      <p style={styles.sub}>Después de esto vas a entrar directo a Depósito.</p>

      <div style={{ width: "100%", maxWidth: 320, marginTop: 20 }}>
        <input
          type="password"
          placeholder="Contraseña nueva"
          style={styles.authInput}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={lockScroll}
          onBlur={unlockScroll}
        />
        <input
          type="password"
          placeholder="Repetí la contraseña nueva"
          style={styles.authInput}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onFocus={lockScroll}
          onBlur={unlockScroll}
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
        />
      </div>

      {error && <div style={{ color: "var(--terracotta)", fontSize: 13, marginTop: 10, fontWeight: 600 }}>{error}</div>}

      <button style={{ ...styles.primaryBtnSm, marginTop: 20 }} onClick={handleSubmit} disabled={loading}>
        {loading ? "Un momento..." : "Guardar contraseña"}
      </button>
    </div>
  );
}

function PinScreen({ roleKey, value, setValue, error, onSubmit, onBack }) {
  useEffect(() => () => unlockScroll(), []);
  return (
    <div style={styles.center}>
      <Lock size={36} color="var(--plum)" strokeWidth={1.5} />
      <div style={styles.eyebrow}>{roleKey}</div>
      <h1 style={styles.h1}>Ingresá el PIN</h1>
      <p style={styles.sub}>Pedíselo a quien administra la herramienta si no lo tenés.</p>
      <input
        type="password"
        inputMode="numeric"
        style={{ ...styles.qtyInput, width: 160, fontSize: 20, textAlign: "center", padding: "12px 10px", marginTop: 20 }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={lockScroll}
        onBlur={unlockScroll}
        onKeyDown={(e) => { if (e.key === "Enter") onSubmit(); }}
        placeholder="••••"
      />
      {error && <div style={{ color: "var(--terracotta)", fontSize: 13, marginTop: 10, fontWeight: 600 }}>PIN incorrecto. Probá de nuevo.</div>}
      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <button style={styles.secondaryBtn} onClick={onBack}>Volver</button>
        <button style={styles.primaryBtnSm} onClick={onSubmit}>Ingresar</button>
      </div>
    </div>
  );
}

function SucursalSelect({ onBack, onPick, theme, onToggleTheme }) {
  return (
    <div style={styles.darkWrapScroll}>
      <div style={styles.darkInner}>
        <div style={styles.darkTopBar}>
          <button style={styles.darkBackBtn} onClick={onBack}><ArrowLeft size={18} color="var(--ink)" /></button>
          <div style={{ flex: 1 }}>
            <div style={styles.darkTopTitle}>Elegí tu sucursal</div>
          </div>
          <button style={styles.themeToggleBtn} onClick={onToggleTheme} aria-label="Cambiar tema día/noche">
            {theme === "night" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
        <div style={styles.darkLogoWrapSmall}>
          <img src={`${import.meta.env.BASE_URL}logo-gold.png`} alt="Lucciano's" style={styles.darkLogoImgSmall} />
        </div>
        <div style={styles.branchList}>
          {SUCURSALES.map((s) => (
            <button
              key={s}
              style={{
                ...styles.branchCard,
                backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.05) 100%), url(${import.meta.env.BASE_URL}branches/${SUCURSAL_PHOTOS[s]})`,
              }}
              onClick={() => onPick(s)}
            >
              <span style={styles.branchCardName}>{s}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function OrderForm({ sucursal, onBack, onViewHistory, activeVendor, setActiveVendor, search, setSearch, draft, setQty, draftCount, notes, setNotes, onSubmit, submitting, theme, onToggleTheme, onCopyLastOrder, onClearDraft }) {
  const items = VENDORS[activeVendor].filter((p) =>
    p.item.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.wrap}>
      <TopBar onBack={onBack} title={sucursal} subtitle="Pedido semanal de stock" theme={theme} onToggleTheme={onToggleTheme} />
      <div className="order-layout" style={styles.formLayout}>
        <div style={styles.formMain}>
          <div style={styles.tabsRow}>
            <div style={{ ...styles.tabs, marginBottom: 0 }}>
              {VENDOR_ORDER.map((v) => (
                <button
                  key={v}
                  onClick={() => { setActiveVendor(v); setSearch(""); }}
                  style={{ ...styles.tab, ...(activeVendor === v ? styles.tabActive : {}) }}
                >
                  {v}
                </button>
              ))}
            </div>
            <div style={styles.tabsRowActions}>
              <button style={styles.tabsRowActionBtn} onClick={onCopyLastOrder}>Copiar último pedido</button>
              <button style={styles.tabsRowClearBtn} onClick={onClearDraft}>Borrar</button>
            </div>
          </div>

          <div style={styles.searchBox}>
            <Search size={16} color="var(--muted-faint)" />
            <input
              style={styles.searchInput}
              placeholder={`Buscar en ${activeVendor}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={styles.itemList}>
            {items.map((p) => {
              const key = activeVendor + "|" + p.item;
              return (
                <div key={key} style={styles.itemRow}>
                  <div style={styles.itemInfo}>
                    <div style={styles.itemName}>{p.item}</div>
                    <div style={styles.itemCode}>{p.code}</div>
                  </div>
                  <input
                    className="qtyInput"
                    style={styles.qtyInput}
                    placeholder="cant."
                    inputMode="decimal"
                    value={draft[key] || ""}
                    onChange={(e) => setQty(activeVendor, p.item, sanitizeQty(e.target.value))}
                  />
                </div>
              );
            })}
            {items.length === 0 && <div style={styles.emptyRow}>No hay productos que coincidan con "{search}".</div>}
          </div>
        </div>

        <div className="order-ticket" style={styles.ticket}>
          <div style={styles.ticketHeader}>
            <Package size={16} color="var(--plum)" />
            <span>Resumen del pedido</span>
          </div>
          <div style={styles.ticketCount}>{draftCount} {draftCount === 1 ? "ítem cargado" : "ítems cargados"}</div>
          <div style={styles.ticketDivider} />
          <div style={styles.ticketItems}>
            {Object.entries(draft).filter(([, v]) => v && v.trim() !== "").length === 0 && (
              <div style={styles.ticketEmpty}>Todavía no cargaste productos.</div>
            )}
            {Object.entries(draft).filter(([, v]) => v && v.trim() !== "").map(([key, qty]) => {
              const sep = key.indexOf("|");
              const itemName = key.slice(sep + 1);
              return (
                <div key={key} style={styles.ticketLine}>
                  <span style={styles.ticketLineName}>{itemName}</span>
                  <span style={styles.ticketLineQty}>{qty}</span>
                </div>
              );
            })}
          </div>
          <div style={styles.ticketDivider} />
          <label style={styles.notesLabel}>Notas para depósito (opcional)</label>
          <textarea
            style={styles.notesInput}
            placeholder="Ej: urgente para el finde, entregar antes del jueves..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
          <button style={styles.submitBtn} onClick={onSubmit} disabled={submitting}>
            {submitting ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={16} />}
            {submitting ? "Enviando..." : "Enviar pedido"}
          </button>
          <button style={styles.historyLink} onClick={onViewHistory}>Ver pedidos anteriores</button>
        </div>
      </div>
    </div>
  );
}

function Confirm({ sucursal, lastOrder, onNewOrder, onHistory, onHome }) {
  const textRef = useRef(null);
  const [selected, setSelected] = useState(false);
  const [copiedTable, setCopiedTable] = useState(false);
  const [copyError, setCopyError] = useState(false);

  function selectAll() {
    if (textRef.current) {
      textRef.current.focus();
      textRef.current.select();
      setSelected(true);
    }
  }

  async function copyFormattedTable() {
    if (!lastOrder) return;
    const html = buildOrderHtmlTable(lastOrder);
    const text = buildMailBody(lastOrder);
    try {
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new window.ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([text], { type: "text/plain" }),
          }),
        ]);
      } else {
        await navigator.clipboard.writeText(text);
      }
      setCopyError(false);
      setCopiedTable(true);
      setTimeout(() => setCopiedTable(false), 3000);
    } catch (err) {
      setCopyError(true);
      setTimeout(() => setCopyError(false), 3000);
    }
  }

  return (
    <div style={styles.center}>
      <CheckCircle2 size={48} color="var(--pistachio-dark)" strokeWidth={1.5} />
      <h1 style={styles.h1}>Pedido enviado</h1>
      <p style={styles.sub}>Depósito ya puede ver el pedido de {sucursal}.</p>
      <p style={{ ...styles.sub, fontSize: 13, marginTop: 4 }}>
        Para mandarlo también por mail a <strong>{ORDER_EMAIL}</strong>:
      </p>
      {lastOrder && (
        <div style={{ width: "100%", maxWidth: 460, marginTop: 14 }}>
          <ol style={{ textAlign: "left", fontSize: 13, color: "var(--muted-strong)", paddingLeft: 20, margin: "0 0 12px" }}>
            <li>Apretá "Copiar tabla con formato" abajo.</li>
            <li>Abrí un mail nuevo a {ORDER_EMAIL} y pegalo con <strong>Ctrl+V</strong> (o Cmd+V en Mac).</li>
            <li>Va a quedar con el mismo formato de tabla que le mandamos siempre a los proveedores.</li>
          </ol>
          <button
            onClick={copyFormattedTable}
            style={{ ...styles.submitBtn, width: "100%" }}
          >
            {copiedTable ? <CheckCircle2 size={16} /> : <ClipboardList size={16} />}
            {copiedTable
              ? "¡Copiado! Ahora pegalo en el mail"
              : copyError
              ? "No se pudo copiar, probá con el texto de abajo"
              : "Copiar tabla con formato"}
          </button>

          <div style={styles.tablePreviewWrap}>
            {VENDOR_ORDER.filter((v) => lastOrder.items.some((it) => it.vendor === v)).map((v) => (
              <div key={v} style={{ marginBottom: 14 }}>
                <div style={styles.tablePreviewVendor}>{v}</div>
                <table style={styles.tablePreviewTable}>
                  <tbody>
                    <tr>
                      <td style={styles.tablePreviewHeaderCell}>Item</td>
                      <td style={{ ...styles.tablePreviewHeaderCell, textAlign: "center" }}>Code</td>
                      <td style={styles.tablePreviewHeaderCell}></td>
                    </tr>
                    {lastOrder.items.filter((it) => it.vendor === v).map((it, i) => (
                      <tr key={i}>
                        <td style={styles.tablePreviewDataCell}>{it.item}</td>
                        <td style={{ ...styles.tablePreviewDataCell, textAlign: "center" }}>{it.code}</td>
                        <td style={{ ...styles.tablePreviewDataCell, textAlign: "center" }}>{it.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          <details style={{ marginTop: 6 }}>
            <summary style={styles.textLink}>¿No se copió bien? Usar texto plano en su lugar</summary>
            <textarea
              ref={textRef}
              readOnly
              value={buildMailBody(lastOrder)}
              style={{ ...styles.copyBox, marginTop: 10 }}
              rows={8}
              onFocus={(e) => e.target.select()}
            />
            <button
              onClick={selectAll}
              style={{ ...styles.secondaryBtn, width: "100%", marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              {selected ? <CheckCircle2 size={16} color="var(--pistachio-dark)" /> : null}
              {selected ? "Texto seleccionado — ahora Ctrl+C" : "Seleccionar todo"}
            </button>
          </details>

          <a href={buildMailto(lastOrder)} style={{ ...styles.historyLink, display: "block", textAlign: "center" }}>
            O probar con "Abrir mi programa de mail"
          </a>
        </div>
      )}
      <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap", justifyContent: "center" }}>
        <button style={styles.secondaryBtn} onClick={onHistory}>Ver mis pedidos</button>
        <button style={styles.secondaryBtn} onClick={onNewOrder}>Cargar otro pedido</button>
      </div>
      <button style={styles.textLink} onClick={onHome}>Volver al inicio</button>
    </div>
  );
}

function SucursalHistory({ sucursal, orders, loading, onBack, expandedOrder, setExpandedOrder, theme, onToggleTheme }) {
  return (
    <div style={styles.wrap}>
      <TopBar onBack={onBack} title={sucursal} subtitle="Historial de pedidos" theme={theme} onToggleTheme={onToggleTheme} />
      {loading && <div style={styles.emptyRow}>Cargando pedidos...</div>}
      {!loading && orders.length === 0 && <div style={styles.emptyRow}>Todavía no enviaste ningún pedido.</div>}
      <div style={styles.orderCards}>
        {orders.map((o) => (
          <OrderCard key={o.id} order={o} expanded={expandedOrder === o.id} onToggle={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)} allOrders={orders} />
        ))}
      </div>
    </div>
  );
}

function toISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseISODate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDisplayDate(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

const WEEKDAYS_ES = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
const MONTH_NAMES_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function DateRangePicker({ from, to, setFrom, setTo }) {
  const [open, setOpen] = useState(false);
  const today = new Date();
  const initial = from ? parseISODate(from) : today;
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const wrapRef = useRef(null);
  const hasFilter = !!from;

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function goPrevMonth() {
    setViewMonth((m) => {
      if (m === 0) { setViewYear((y) => y - 1); return 11; }
      return m - 1;
    });
  }
  function goNextMonth() {
    setViewMonth((m) => {
      if (m === 11) { setViewYear((y) => y + 1); return 0; }
      return m + 1;
    });
  }

  function handleDayClick(iso) {
    if (!from || (from && to)) {
      setFrom(iso);
      setTo("");
    } else {
      if (iso < from) {
        setTo(from);
        setFrom(iso);
      } else {
        setTo(iso);
      }
      setOpen(false);
    }
  }

  function handleClear(e) {
    if (e) e.stopPropagation();
    setFrom("");
    setTo("");
    setOpen(false);
  }

  function handleToday() {
    const iso = toISODate(today);
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    handleDayClick(iso);
  }

  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const todayISO = toISODate(today);

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const label = !from
    ? "Seleccionar fechas"
    : !to
    ? `${formatDisplayDate(from)} – …`
    : `${formatDisplayDate(from)} – ${formatDisplayDate(to)}`;

  return (
    <div style={styles.dateRangeWrapper} ref={wrapRef}>
      <button type="button" style={styles.dateTrigger} onClick={() => setOpen((v) => !v)}>
        <CalendarDays size={16} color="var(--muted)" />
        <span style={styles.dateTriggerText}>{label}</span>
      </button>
      {hasFilter && (
        <button type="button" style={styles.dateClearBtnFloating} onClick={handleClear} aria-label="Limpiar fechas">×</button>
      )}

      {open && (
        <div style={styles.calendarPopup}>
          <div style={styles.calendarHeader}>
            <button type="button" style={styles.calendarNavBtn} onClick={goPrevMonth}>‹</button>
            <span style={styles.calendarMonthLabel}>{MONTH_NAMES_ES[viewMonth]} {viewYear}</span>
            <button type="button" style={styles.calendarNavBtn} onClick={goNextMonth}>›</button>
          </div>
          <div style={styles.calendarWeekRow}>
            {WEEKDAYS_ES.map((wd) => <div key={wd} style={styles.calendarWeekDay}>{wd}</div>)}
          </div>
          <div style={styles.calendarGrid}>
            {cells.map((d, idx) => {
              if (d === null) return <div key={`e${idx}`} />;
              const iso = toISODate(new Date(viewYear, viewMonth, d));
              const isFrom = iso === from;
              const isTo = iso === to;
              const inRange = from && to && iso > from && iso < to;
              const isToday = iso === todayISO;
              let dayStyle = { ...styles.calendarDay };
              if (inRange) dayStyle = { ...dayStyle, ...styles.calendarDayInRange };
              if (isToday && !isFrom && !isTo) dayStyle = { ...dayStyle, ...styles.calendarDayToday };
              if (isFrom || isTo) dayStyle = { ...dayStyle, ...styles.calendarDaySelected };
              return (
                <button type="button" key={iso} style={dayStyle} onClick={() => handleDayClick(iso)}>
                  {d}
                </button>
              );
            })}
          </div>
          <div style={styles.calendarFooter}>
            <button type="button" style={styles.calendarFooterBtn} onClick={handleClear}>Limpiar</button>
            <button type="button" style={styles.calendarFooterBtn} onClick={handleToday}>Hoy</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Deposito({ onBack, loading, orders, allOrders, filterSucursal, setFilterSucursal, filterStatus, setFilterStatus, filterDateFrom, setFilterDateFrom, filterDateTo, setFilterDateTo, depositoView, setDepositoView, expandedOrder, setExpandedOrder, updateStatus, onImportOrders, userEmail, onLogout, theme, onToggleTheme }) {
  const pendingCount = allOrders.filter((o) => o.status === "pendiente").length;
  const [showExport, setShowExport] = useState(false);

  const productSummary = useMemo(() => {
    const map = new Map();
    orders.forEach((o) => {
      o.items.forEach((it) => {
        const key = `${it.vendor}|${it.item}|${it.code}`;
        const qty = parseFloat(String(it.quantity).replace(",", ".")) || 0;
        if (!map.has(key)) {
          map.set(key, { vendor: it.vendor, item: it.item, code: it.code, total: 0 });
        }
        map.get(key).total += qty;
      });
    });
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [orders]);

  return (
    <div style={styles.wrap}>
      <TopBar onBack={onBack} title="Depósito" subtitle={`${pendingCount} pedido${pendingCount === 1 ? "" : "s"} pendiente${pendingCount === 1 ? "" : "s"}`} theme={theme} onToggleTheme={onToggleTheme} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
        {userEmail && <div style={{ fontSize: 12, color: "var(--muted)" }}>Conectado como <strong>{userEmail}</strong> · <button onClick={onLogout} style={{ ...styles.textLink, marginTop: 0, display: "inline" }}>Cerrar sesión</button></div>}
        <button style={styles.secondaryBtn} onClick={() => setShowExport((v) => !v)}>
          {showExport ? "Ocultar respaldo" : "Exportar todos los pedidos"}
        </button>
      </div>

      {showExport && <ExportPanel orders={allOrders} onImport={onImportOrders} />}

      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(depositoView === "pedido" ? styles.tabActive : {}) }}
          onClick={() => setDepositoView("pedido")}
        >
          Por pedido
        </button>
        <button
          style={{ ...styles.tab, ...(depositoView === "producto" ? styles.tabActive : {}) }}
          onClick={() => setDepositoView("producto")}
        >
          Por producto
        </button>
      </div>

      <div style={styles.filters}>
        <select style={styles.select} value={filterSucursal} onChange={(e) => setFilterSucursal(e.target.value)}>
          <option value="Todas">Todas las sucursales</option>
          {SUCURSALES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select style={styles.select} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="todas">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="pedido">Pedido</option>
          <option value="cancelado">Cancelado</option>
        </select>
        <DateRangePicker
          from={filterDateFrom}
          to={filterDateTo}
          setFrom={setFilterDateFrom}
          setTo={setFilterDateTo}
        />
      </div>

      {loading && <div style={styles.emptyRow}>Cargando pedidos...</div>}
      {!loading && orders.length === 0 && <div style={styles.emptyRow}>No hay pedidos que coincidan con el filtro.</div>}

      {!loading && orders.length > 0 && depositoView === "pedido" && (
        <div style={styles.orderCards}>
          {orders.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              expanded={expandedOrder === o.id}
              onToggle={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}
              showSucursal
              allOrders={allOrders}
              actions={
                <div style={styles.statusBtns}>
                  {Object.entries(STATUS_META).map(([key, meta]) => (
                    <button
                      key={key}
                      onClick={() => updateStatus(o.id, key)}
                      style={{
                        ...styles.statusBtn,
                        ...(o.status === key ? { background: meta.color, color: meta.on, borderColor: meta.color } : {}),
                      }}
                    >
                      {meta.label}
                    </button>
                  ))}
                </div>
              }
            />
          ))}
        </div>
      )}

      {!loading && orders.length > 0 && depositoView === "producto" && (
        <div style={styles.productSummaryWrap}>
          <table style={styles.productSummaryTable}>
            <thead>
              <tr>
                <th style={styles.productSummaryHeaderCell}>Producto</th>
                <th style={{ ...styles.productSummaryHeaderCell, textAlign: "center" }}>Código</th>
                <th style={{ ...styles.productSummaryHeaderCell, textAlign: "center" }}>Proveedor</th>
                <th style={{ ...styles.productSummaryHeaderCell, textAlign: "right" }}>Cantidad total</th>
              </tr>
            </thead>
            <tbody>
              {productSummary.map((p) => (
                <tr key={`${p.vendor}|${p.item}|${p.code}`}>
                  <td style={styles.productSummaryCell}>{p.item}</td>
                  <td style={{ ...styles.productSummaryCell, textAlign: "center", color: "var(--muted-faint)" }}>{p.code}</td>
                  <td style={{ ...styles.productSummaryCell, textAlign: "center" }}>{p.vendor}</td>
                  <td style={{ ...styles.productSummaryCell, textAlign: "right", fontWeight: 700 }}>{p.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function buildAllOrdersExport(orders) {
  if (orders.length === 0) return "No hay pedidos cargados todavía.";
  let text = `Respaldo de pedidos - Lucciano's\nGenerado: ${fmtDate(new Date().toISOString())}\nTotal de pedidos: ${orders.length}\n\n${"=".repeat(40)}\n\n`;
  orders.forEach((o) => {
    text += `Sucursal: ${o.sucursal}\nFecha: ${fmtDate(o.date)}\nEstado: ${(STATUS_META[o.status] || STATUS_META.pendiente).label}\n`;
    VENDOR_ORDER.filter((v) => o.items.some((it) => it.vendor === v)).forEach((v) => {
      text += `  ${v}\n`;
      o.items.filter((it) => it.vendor === v).forEach((it) => {
        text += `    - ${it.item} (${it.code}): ${it.quantity}\n`;
      });
    });
    if (o.notes) text += `  Notas: ${o.notes}\n`;
    text += `\n${"-".repeat(40)}\n\n`;
  });
  return text;
}

function ExportPanel({ orders, onImport }) {
  const textRef = useRef(null);
  const [selected, setSelected] = useState(false);
  const exportText = buildAllOrdersExport(orders);

  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [importMsg, setImportMsg] = useState(null);

  function selectAll() {
    if (textRef.current) {
      textRef.current.focus();
      textRef.current.select();
      setSelected(true);
    }
  }

  const blob = useMemo(() => new Blob([exportText], { type: "text/plain" }), [exportText]);
  const downloadUrl = useMemo(() => URL.createObjectURL(blob), [blob]);
  const filename = `pedidos-luccianos-${new Date().toISOString().slice(0, 10)}.txt`;

  const jsonText = useMemo(() => JSON.stringify(orders, null, 2), [orders]);
  const jsonBlob = useMemo(() => new Blob([jsonText], { type: "application/json" }), [jsonText]);
  const jsonUrl = useMemo(() => URL.createObjectURL(jsonBlob), [jsonBlob]);
  const jsonFilename = `pedidos-luccianos-backup-${new Date().toISOString().slice(0, 10)}.json`;

  function handleImport() {
    let parsed;
    try {
      parsed = JSON.parse(importText.trim());
      if (!Array.isArray(parsed)) throw new Error("no es una lista");
    } catch (e) {
      setImportMsg({ type: "error", text: "Ese texto no es un backup JSON válido." });
      return;
    }
    const valid = parsed.every((o) => o && o.id && o.sucursal && Array.isArray(o.items));
    if (!valid) {
      setImportMsg({ type: "error", text: "El archivo no tiene el formato esperado de pedidos." });
      return;
    }
    onImport(parsed);
    setImportMsg({ type: "success", text: `Se restauraron ${parsed.length} pedido(s).` });
    setImportText("");
  }

  return (
    <div style={styles.exportPanel}>
      <div style={styles.ticketHeader}>
        <ClipboardList size={16} color="var(--plum)" />
        <span>Respaldo de {orders.length} pedido{orders.length === 1 ? "" : "s"}</span>
      </div>
      <p style={{ fontSize: 12, color: "var(--muted)", margin: "6px 0 12px" }}>
        Con la base de datos real, esto ya no debería perderse solo — pero sirve como respaldo extra.
      </p>
      <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
        <a href={jsonUrl} download={jsonFilename} style={{ ...styles.primaryBtnSm, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
          Descargar backup (.json)
        </a>
        <a href={downloadUrl} download={filename} style={{ ...styles.secondaryBtn, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
          Descargar .txt (lectura)
        </a>
        <button onClick={selectAll} style={{ ...styles.secondaryBtn, display: "inline-flex", alignItems: "center", gap: 8 }}>
          {selected ? <CheckCircle2 size={16} color="var(--pistachio-dark)" /> : null}
          {selected ? "Seleccionado — Ctrl+C" : "Seleccionar .txt para copiar"}
        </button>
      </div>
      <textarea ref={textRef} readOnly value={exportText} style={{ ...styles.copyBox, minHeight: 140 }} rows={8} onFocus={(e) => e.target.select()} />

      <div style={styles.ticketDivider} />

      <button style={styles.secondaryBtn} onClick={() => setShowImport((v) => !v)}>
        {showImport ? "Ocultar restauración" : "Restaurar pedidos desde un backup"}
      </button>

      {showImport && (
        <div style={{ marginTop: 12 }}>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder='[{"id": "...", "sucursal": "...", ...}]'
            style={{ ...styles.copyBox, minHeight: 120 }}
            rows={6}
          />
          {importMsg && (
            <div style={{ fontSize: 12, marginTop: 8, fontWeight: 600, color: importMsg.type === "error" ? "var(--terracotta)" : "var(--pistachio-dark)" }}>
              {importMsg.text}
            </div>
          )}
          <button style={{ ...styles.primaryBtnSm, marginTop: 10 }} onClick={handleImport} disabled={!importText.trim()}>
            Restaurar pedidos
          </button>
        </div>
      )}
    </div>
  );
}

function OrderCard({ order, expanded, onToggle, showSucursal, actions, allOrders }) {
  const meta = STATUS_META[order.status] || STATUS_META.pendiente;
  return (
    <div style={styles.orderCard}>
      <button style={styles.orderCardHead} onClick={onToggle}>
        <div>
          <div style={styles.orderCardTitle}>
            {showSucursal ? order.sucursal : `Pedido ${getOrderShortCode(order, allOrders || [order])}`}
            <span style={{ ...styles.statusPill, background: meta.bg, color: meta.color }}>
              <Clock size={12} /> {meta.label}
            </span>
          </div>
          <div style={styles.orderCode}>{getOrderCode(order, allOrders || [order])}</div>
          <div style={styles.orderCardDate}>{fmtDate(order.date)} · {order.items.length} ítems</div>
        </div>
        {expanded ? <ChevronUp size={18} color="var(--muted-faint)" /> : <ChevronDown size={18} color="var(--muted-faint)" />}
      </button>
      {expanded && (
        <div style={styles.orderCardBody}>
          {VENDOR_ORDER.filter((v) => order.items.some((it) => it.vendor === v)).map((v) => (
            <div key={v} style={{ marginBottom: 10 }}>
              <div style={styles.vendorLabel}>{v}</div>
              {order.items.filter((it) => it.vendor === v).map((it, i) => (
                <div key={i} style={styles.detailLine}>
                  <span>{it.item} <span style={styles.detailCode}>({it.code})</span></span>
                  <span style={styles.detailQty}>{it.quantity}</span>
                </div>
              ))}
            </div>
          ))}
          {order.notes && (
            <div style={styles.notesBox}>
              <strong>Notas:</strong> {order.notes}
            </div>
          )}
          {actions}
        </div>
      )}
    </div>
  );
}

function TopBar({ onBack, title, subtitle, theme, onToggleTheme }) {
  return (
    <div style={styles.topBar}>
      <button style={styles.backBtn} onClick={onBack}><ArrowLeft size={18} /></button>
      <div style={{ flex: 1 }}>
        <div style={styles.topTitle}>{title}</div>
        {subtitle && <div style={styles.topSubtitle}>{subtitle}</div>}
      </div>
      {onToggleTheme && (
        <button style={styles.themeToggleBtn} onClick={onToggleTheme} aria-label="Cambiar tema día/noche">
          {theme === "night" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh", background: "var(--cream)", color: "var(--ink)",
    fontFamily: "'Baloo 2', system-ui, sans-serif",
  },
  center: {
    display: "flex", flexDirection: "column", alignItems: "center",
    textAlign: "center", padding: "80px 24px 40px", maxWidth: 520, margin: "0 auto",
  },
  homeDark: {
    height: "100vh", overflow: "hidden", background: "var(--cream)", display: "flex", flexDirection: "column",
    alignItems: "center", width: "100%", padding: "100px 24px 50px", position: "relative",
  },
  homeThemeToggleBtn: {
    position: "absolute", top: "calc(28px + env(safe-area-inset-top, 0px))", right: 20,
    width: 36, height: 36, borderRadius: 10, border: "1px solid var(--line)",
    background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", color: "var(--ink)", zIndex: 5,
  },
  homeInner: {
    width: "100%", maxWidth: 520, display: "flex", flexDirection: "column",
    alignItems: "center", textAlign: "center", flex: 1,
  },
  homeLogoImg: { width: 280, height: "auto", marginBottom: 24 },
  homeEyebrow: {
    fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase",
    color: "var(--plum)", fontWeight: 600, marginBottom: 12,
  },
  homeH1: { fontFamily: "'Baloo 2', sans-serif", fontWeight: 600, fontSize: 34, margin: "0 0 32px", color: "var(--ink)" },
  homeTagline: {
    fontFamily: "'Bodoni Moda', serif", fontOpticalSizing: "auto", fontWeight: 900,
    textTransform: "uppercase", color: "var(--ink)", fontSize: 44, lineHeight: 1.05,
    letterSpacing: "0.01em", marginTop: "auto", paddingTop: 60,
  },
  logoImg: { width: 150, height: "auto", marginBottom: 4 },
  eyebrow: {
    fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase",
    color: "var(--pistachio-dark)", fontWeight: 600, marginBottom: 12,
  },
  h1: { fontFamily: "'Baloo 2', sans-serif", fontWeight: 600, fontSize: 34, margin: "0 0 8px", color: "var(--plum)" },
  sub: { color: "var(--muted-strong)", fontSize: 15, margin: 0 },
  roleGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 36, width: "100%" },
  roleCard: {
    background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 16,
    padding: "28px 18px", display: "flex", flexDirection: "column", alignItems: "center",
    gap: 8, cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
  },
  roleTitle: { fontFamily: "'Baloo 2', sans-serif", fontWeight: 600, fontSize: 18, color: "var(--plum)" },
  roleDesc: { fontSize: 13, color: "var(--muted)", textAlign: "center" },
  wrap: { maxWidth: 980, margin: "0 auto", padding: "calc(20px + env(safe-area-inset-top, 0px)) 24px 60px" },
  wrapFull: { maxWidth: 980, margin: "0 auto", padding: "28px 24px 0", minHeight: "calc(100vh - 60px)", display: "flex", flexDirection: "column" },
  sucGridWrap: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center" },
  darkWrapScroll: {
    minHeight: "100vh", background: "var(--cream)", display: "flex", flexDirection: "column",
    alignItems: "center", padding: "56px 24px 40px", width: "100%",
  },
  darkInner: { width: "100%", maxWidth: 980 },
  darkTopBar: { display: "flex", alignItems: "center", gap: 14 },
  darkBackBtn: {
    width: 36, height: 36, borderRadius: 10, border: "1px solid var(--line)",
    background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", flexShrink: 0,
  },
  darkTopTitle: { fontFamily: "'Baloo 2', sans-serif", fontWeight: 600, fontSize: 22, color: "var(--ink)" },
  darkLogoWrap: { display: "flex", justifyContent: "center", margin: "56px 0 16px" },
  darkLogoImg: { width: 210, height: "auto" },
  darkLogoWrapSmall: { display: "flex", justifyContent: "center", margin: "24px 0 20px" },
  darkLogoImgSmall: { width: 130, height: "auto" },
  branchList: { display: "flex", flexDirection: "column", gap: 14, paddingBottom: 24 },
  branchCard: {
    position: "relative", width: "100%", height: 150, borderRadius: 16, border: "none",
    backgroundSize: "cover", backgroundPosition: "center", cursor: "pointer",
    display: "flex", alignItems: "flex-start", justifyContent: "flex-start",
    padding: "16px 18px", overflow: "hidden",
  },
  branchCardName: {
    fontFamily: "'Baloo 2', sans-serif", fontWeight: 700,
    textTransform: "uppercase", color: "#FFFFFF", fontSize: 22, letterSpacing: "0.01em",
    textShadow: "0 2px 8px rgba(0,0,0,0.55)", textAlign: "left",
  },
  topBar: { display: "flex", alignItems: "center", gap: 14, marginBottom: 24 },
  backBtn: {
    width: 36, height: 36, borderRadius: 10, border: "1px solid var(--line)",
    background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", flexShrink: 0,
  },
  themeToggleBtn: {
    width: 36, height: 36, borderRadius: 10, border: "1px solid var(--line)",
    background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", flexShrink: 0, color: "var(--ink)",
  },
  topTitle: { fontFamily: "'Baloo 2', sans-serif", fontWeight: 600, fontSize: 22, color: "var(--plum)" },
  topSubtitle: { fontSize: 13, color: "var(--muted)", marginTop: 2 },
  sucGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, width: "100%" },
  sucCard: {
    background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 12,
    padding: "20px 14px", display: "flex", flexDirection: "column", alignItems: "center",
    gap: 8, cursor: "pointer", fontSize: 14, fontWeight: 600, color: "var(--ink)",
  },
  formLayout: {},
  formMain: {},
  tabs: { display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" },
  tab: {
    padding: "8px 16px", borderRadius: 999, border: "1px solid var(--line)",
    background: "var(--paper)", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "var(--muted)",
  },
  tabActive: { background: "var(--plum)", color: "var(--on-accent)", borderColor: "var(--plum)" },
  tabsRow: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 14 },
  tabsRowActions: { display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" },
  tabsRowActionBtn: {
    background: "none", border: "none", padding: 0, fontSize: 13, fontWeight: 600,
    color: "var(--pistachio-dark)", cursor: "pointer", textDecoration: "underline",
  },
  tabsRowClearBtn: {
    background: "none", border: "none", padding: 0, fontSize: 13, fontWeight: 600,
    color: "var(--terracotta)", cursor: "pointer", textDecoration: "underline",
  },
  searchBox: {
    display: "flex", alignItems: "center", gap: 8, background: "var(--paper)",
    border: "1px solid var(--line)", borderRadius: 10, padding: "9px 12px", marginBottom: 14,
  },
  searchInput: { border: "none", outline: "none", background: "transparent", fontSize: 14, width: "100%", color: "var(--ink)" },
  itemList: { background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14, maxHeight: 520, overflowY: "auto" },
  itemRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "12px 16px", borderBottom: "1px solid var(--line)", gap: 12,
  },
  itemInfo: { minWidth: 0 },
  itemName: { fontSize: 14, fontWeight: 500, color: "var(--ink)" },
  itemCode: { fontSize: 11, color: "var(--muted-faint)", marginTop: 2, letterSpacing: "0.02em" },
  qtyInput: {
    width: 84, padding: "7px 10px", borderRadius: 8, border: "1px solid var(--line)",
    fontSize: 13, textAlign: "center", flexShrink: 0, background: "var(--paper)", color: "var(--ink)",
  },
  emptyRow: { padding: "24px 16px", color: "var(--muted-faint)", fontSize: 14, textAlign: "center" },
  ticket: { background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 16, padding: 20 },
  ticketHeader: { display: "flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: 14, color: "var(--plum)" },
  ticketCount: { fontSize: 12, color: "var(--muted)", marginTop: 4 },
  ticketDivider: { borderTop: "1px dashed var(--line)", margin: "14px 0" },
  ticketItems: { maxHeight: 220, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 },
  ticketEmpty: { fontSize: 13, color: "var(--muted-faint)" },
  ticketLine: { display: "flex", justifyContent: "space-between", gap: 8, fontSize: 13 },
  ticketLineName: { color: "var(--ink)" },
  ticketLineQty: { fontWeight: 600, color: "var(--pistachio-dark)", flexShrink: 0 },
  notesLabel: { fontSize: 12, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 6 },
  notesInput: { width: "100%", border: "1px solid var(--line)", borderRadius: 10, padding: 10, fontSize: 13, resize: "vertical", marginBottom: 14, background: "var(--paper)", color: "var(--ink)" },
  authInput: {
    width: "100%", border: "1px solid var(--line)", borderRadius: 10, padding: "11px 14px",
    fontSize: 14, marginBottom: 10, background: "var(--paper)", color: "var(--ink)",
  },
  submitBtn: {
    width: "100%", background: "var(--plum)", color: "var(--on-accent)", border: "none", borderRadius: 10,
    padding: "12px 0", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center",
    justifyContent: "center", gap: 8, cursor: "pointer",
  },
  historyLink: {
    width: "100%", background: "none", border: "none", color: "var(--pistachio-dark)",
    fontSize: 13, fontWeight: 600, marginTop: 10, cursor: "pointer", textDecoration: "underline",
  },
  secondaryBtn: {
    padding: "10px 20px", borderRadius: 10, border: "1px solid var(--line)",
    background: "var(--paper)", fontSize: 14, fontWeight: 600, cursor: "pointer", color: "var(--ink)",
  },
  primaryBtnSm: { padding: "10px 20px", borderRadius: 10, border: "none", background: "var(--plum)", color: "var(--on-accent)", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  textLink: { marginTop: 20, background: "none", border: "none", color: "var(--muted)", fontSize: 13, cursor: "pointer", textDecoration: "underline" },
  orderCards: { display: "flex", flexDirection: "column", gap: 12 },
  orderCard: { background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden" },
  orderCardHead: {
    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left",
  },
  orderCardTitle: { fontSize: 15, fontWeight: 600, color: "var(--ink)", display: "flex", alignItems: "center", gap: 10 },
  orderCode: {
    fontSize: 12, fontWeight: 700, color: "var(--plum)", marginTop: 4,
    letterSpacing: "0.02em",
  },
  orderCardDate: { fontSize: 12, color: "var(--muted-faint)", marginTop: 4 },
  statusPill: { fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 4 },
  orderCardBody: { padding: "0 18px 18px", borderTop: "1px solid var(--line)" },
  vendorLabel: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--pistachio-dark)", margin: "14px 0 6px" },
  detailLine: { display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", gap: 12 },
  detailCode: { color: "var(--muted-faint)", fontSize: 11 },
  detailQty: { fontWeight: 600, flexShrink: 0 },
  notesBox: { marginTop: 12, padding: 12, background: "var(--cream)", borderRadius: 10, fontSize: 13, color: "var(--muted-strong)" },
  statusBtns: { display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" },
  statusBtn: {
    padding: "7px 14px", borderRadius: 999, border: "1px solid var(--line)",
    background: "var(--paper)", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "var(--ink)",
  },
  filters: { display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" },
  dateRangeWrapper: { position: "relative" },
  dateTrigger: {
    display: "flex", alignItems: "center", gap: 8,
    background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 999,
    padding: "9px 12px", cursor: "pointer",
  },
  dateTriggerText: { fontSize: 13, color: "var(--ink)", whiteSpace: "nowrap" },
  dateClearBtnFloating: {
    position: "absolute", top: -6, right: -6,
    width: 18, height: 18, borderRadius: "50%", border: "1px solid var(--line)",
    background: "var(--cream)", fontSize: 12, lineHeight: 1, fontWeight: 700, cursor: "pointer",
    color: "var(--terracotta)", display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
  },
  calendarPopup: {
    position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 40,
    background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14,
    padding: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.16)", width: 280,
  },
  calendarHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  calendarNavBtn: {
    width: 28, height: 28, borderRadius: 8, border: "1px solid var(--line)",
    background: "var(--cream)", cursor: "pointer", display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: 14, color: "var(--ink)",
  },
  calendarMonthLabel: { fontSize: 14, fontWeight: 600, color: "var(--plum)", textTransform: "capitalize" },
  calendarWeekRow: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 4 },
  calendarWeekDay: { fontSize: 11, fontWeight: 600, color: "var(--muted-faint)", textAlign: "center", padding: "4px 0" },
  calendarGrid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 },
  calendarDay: {
    width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, borderRadius: 8, border: "none", background: "transparent",
    cursor: "pointer", color: "var(--ink)",
  },
  calendarDayToday: { border: "1px solid var(--plum)" },
  calendarDayInRange: { background: "var(--cream)", borderRadius: 4 },
  calendarDaySelected: { background: "var(--plum)", color: "var(--on-accent)", fontWeight: 700 },
  calendarFooter: {
    display: "flex", justifyContent: "space-between", marginTop: 12,
    paddingTop: 10, borderTop: "1px solid var(--line)",
  },
  calendarFooterBtn: {
    background: "none", border: "none", color: "var(--pistachio-dark)",
    fontSize: 12, fontWeight: 600, cursor: "pointer", textDecoration: "underline",
  },
  select: { padding: "9px 12px", borderRadius: 10, border: "1px solid var(--line)", background: "var(--paper)", fontSize: 13, color: "var(--ink)" },
  toast: {
    position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
    padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, zIndex: 50,
    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
  },
  toastSuccess: { background: "#EAF1E3", color: "var(--pistachio-dark)" },
  toastError: { background: "#FBEAE0", color: "var(--terracotta)" },
  copyBox: {
    width: "100%", border: "1px solid var(--line)", borderRadius: 10, padding: 12,
    fontSize: 12, fontFamily: "monospace", resize: "vertical", background: "var(--cream)", color: "var(--ink)",
  },
  tablePreviewWrap: { marginTop: 16, textAlign: "left" },
  tablePreviewVendor: { fontSize: 12, fontWeight: 700, color: "var(--ink)", marginBottom: 6 },
  tablePreviewTable: { borderCollapse: "collapse", width: "100%", fontSize: 12 },
  tablePreviewHeaderCell: {
    border: "1px solid #000", padding: "6px 10px", fontWeight: 700, background: "#fff", color: "#000",
  },
  tablePreviewDataCell: {
    border: "1px solid #000", padding: "6px 10px", background: "#d9d9d9", color: "#000",
  },
  productSummaryWrap: { background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden" },
  productSummaryTable: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  productSummaryHeaderCell: {
    textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 700, textTransform: "uppercase",
    letterSpacing: "0.04em", color: "var(--muted)", borderBottom: "1px solid var(--line)", background: "var(--cream)",
  },
  productSummaryCell: { padding: "10px 16px", borderBottom: "1px solid var(--line)", color: "var(--ink)" },
  exportPanel: { background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14, padding: 18, marginBottom: 18 },
};
