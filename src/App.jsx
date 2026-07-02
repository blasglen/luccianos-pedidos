import { useState, useEffect, useMemo, useRef } from "react";
import {
  Search, Package, ClipboardList, Store, CheckCircle2, Clock, Loader2,
  ArrowLeft, Send, ChevronDown, ChevronUp, Lock,
} from "lucide-react";
import { supabase } from "./supabaseClient";

const PINS = {
  "American Dream": "1001",
  "Aventura": "1002",
  "Sawgrass": "1003",
  "Florida Mall": "1004",
  "Vineland": "1005",
  "Weston": "1006",
  "Depósito": "2000",
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
const ORDER_EMAIL = "admin@luccianos.us";

const STATUS_META = {
  pendiente: { label: "Pendiente", color: "var(--terracotta)", bg: "#FBEAE0" },
  preparacion: { label: "En preparación", color: "#B08628", bg: "#FAF1DC" },
  recibido: { label: "Recibido", color: "var(--pistachio-dark)", bg: "#EAF1E3" },
};

function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" }) +
    " · " + d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
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
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);
  const [pendingRole, setPendingRole] = useState(null);
  const [pinValue, setPinValue] = useState("");
  const [pinError, setPinError] = useState(false);

  useEffect(() => { loadOrders(); }, []);

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
      .filter((o) => filterStatus === "todas" || o.status === filterStatus);
  }, [orders, filterSucursal, filterStatus]);

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kaushan+Script&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        input, textarea, select, button { font-family: inherit; }
        input:focus, textarea:focus, button:focus-visible { outline: 2px solid var(--plum); outline-offset: 1px; }
        ::placeholder { color: #B8AA98; }
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

      {screen === "home" && <Home onSucursal={() => setScreen("sucursal-select")} onDeposito={() => requestPin("Depósito", "deposito")} />}

      {screen === "sucursal-select" && (
        <SucursalSelect onBack={() => setScreen("home")} onPick={(s) => requestPin(s, "order-form")} />
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
        />
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
          expandedOrder={expandedOrder}
          setExpandedOrder={setExpandedOrder}
          updateStatus={updateStatus}
          onImportOrders={importOrders}
        />
      )}
    </div>
  );
}

function Home({ onSucursal, onDeposito }) {
  return (
    <div style={styles.center}>
      <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Lucciano's" style={styles.logoImg} />
      <div style={styles.eyebrow}>Pedidos internos</div>
      <h1 style={styles.h1}>¿Quién sos hoy?</h1>
      <p style={styles.sub}>Elegí tu rol para pedir o recibir stock.</p>
      <div style={styles.roleGrid}>
        <button style={styles.roleCard} onClick={onSucursal}>
          <Store size={28} color="var(--plum)" strokeWidth={1.6} />
          <div style={styles.roleTitle}>Sucursal</div>
          <div style={styles.roleDesc}>Armar y enviar el pedido semanal</div>
        </button>
        <button style={styles.roleCard} onClick={onDeposito}>
          <ClipboardList size={28} color="var(--plum)" strokeWidth={1.6} />
          <div style={styles.roleTitle}>Depósito</div>
          <div style={styles.roleDesc}>Ver y gestionar los pedidos que llegan</div>
        </button>
      </div>
    </div>
  );
}

function PinScreen({ roleKey, value, setValue, error, onSubmit, onBack }) {
  return (
    <div style={styles.center}>
      <Lock size={36} color="var(--plum)" strokeWidth={1.5} />
      <div style={styles.eyebrow}>{roleKey}</div>
      <h1 style={styles.h1}>Ingresá el PIN</h1>
      <p style={styles.sub}>Pedíselo a quien administra la herramienta si no lo tenés.</p>
      <input
        autoFocus
        type="password"
        inputMode="numeric"
        style={{ ...styles.qtyInput, width: 160, fontSize: 20, textAlign: "center", padding: "12px 10px", marginTop: 20 }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
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

function SucursalSelect({ onBack, onPick }) {
  return (
    <div style={styles.wrapFull}>
      <TopBar onBack={onBack} title="Elegí tu sucursal" />
      <div style={styles.sucGridWrap}>
        <div style={styles.sucGrid}>
          {SUCURSALES.map((s) => (
            <button key={s} style={styles.sucCard} onClick={() => onPick(s)}>
              <Store size={20} color="var(--pistachio-dark)" strokeWidth={1.6} />
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function OrderForm({ sucursal, onBack, onViewHistory, activeVendor, setActiveVendor, search, setSearch, draft, setQty, draftCount, notes, setNotes, onSubmit, submitting }) {
  const items = VENDORS[activeVendor].filter((p) =>
    p.item.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.wrap}>
      <TopBar onBack={onBack} title={sucursal} subtitle="Pedido semanal de stock" />
      <div style={styles.formLayout}>
        <div style={styles.formMain}>
          <div style={styles.tabs}>
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

          <div style={styles.searchBox}>
            <Search size={16} color="#A99A86" />
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
                    value={draft[key] || ""}
                    onChange={(e) => setQty(activeVendor, p.item, e.target.value)}
                  />
                </div>
              );
            })}
            {items.length === 0 && <div style={styles.emptyRow}>No hay productos que coincidan con "{search}".</div>}
          </div>
        </div>

        <div style={styles.ticket}>
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

  function selectAll() {
    if (textRef.current) {
      textRef.current.focus();
      textRef.current.select();
      setSelected(true);
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
          <ol style={{ textAlign: "left", fontSize: 13, color: "#6B5D4B", paddingLeft: 20, margin: "0 0 12px" }}>
            <li>Apretá "Seleccionar todo" abajo.</li>
            <li>Copialo con <strong>Ctrl+C</strong> (o Cmd+C en Mac).</li>
            <li>Abrí un mail nuevo a {ORDER_EMAIL} y pegalo con <strong>Ctrl+V</strong>.</li>
          </ol>
          <textarea
            ref={textRef}
            readOnly
            value={buildMailBody(lastOrder)}
            style={styles.copyBox}
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

function SucursalHistory({ sucursal, orders, loading, onBack, expandedOrder, setExpandedOrder }) {
  return (
    <div style={styles.wrap}>
      <TopBar onBack={onBack} title={sucursal} subtitle="Historial de pedidos" />
      {loading && <div style={styles.emptyRow}>Cargando pedidos...</div>}
      {!loading && orders.length === 0 && <div style={styles.emptyRow}>Todavía no enviaste ningún pedido.</div>}
      <div style={styles.orderCards}>
        {orders.map((o) => (
          <OrderCard key={o.id} order={o} expanded={expandedOrder === o.id} onToggle={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)} />
        ))}
      </div>
    </div>
  );
}

function Deposito({ onBack, loading, orders, allOrders, filterSucursal, setFilterSucursal, filterStatus, setFilterStatus, expandedOrder, setExpandedOrder, updateStatus, onImportOrders }) {
  const pendingCount = allOrders.filter((o) => o.status === "pendiente").length;
  const [showExport, setShowExport] = useState(false);

  return (
    <div style={styles.wrap}>
      <TopBar onBack={onBack} title="Depósito" subtitle={`${pendingCount} pedido${pendingCount === 1 ? "" : "s"} pendiente${pendingCount === 1 ? "" : "s"}`} />

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <button style={styles.secondaryBtn} onClick={() => setShowExport((v) => !v)}>
          {showExport ? "Ocultar respaldo" : "Exportar todos los pedidos"}
        </button>
      </div>

      {showExport && <ExportPanel orders={allOrders} onImport={onImportOrders} />}

      <div style={styles.filters}>
        <select style={styles.select} value={filterSucursal} onChange={(e) => setFilterSucursal(e.target.value)}>
          <option value="Todas">Todas las sucursales</option>
          {SUCURSALES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select style={styles.select} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="todas">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="preparacion">En preparación</option>
          <option value="recibido">Recibido</option>
        </select>
      </div>

      {loading && <div style={styles.emptyRow}>Cargando pedidos...</div>}
      {!loading && orders.length === 0 && <div style={styles.emptyRow}>No hay pedidos que coincidan con el filtro.</div>}

      <div style={styles.orderCards}>
        {orders.map((o) => (
          <OrderCard
            key={o.id}
            order={o}
            expanded={expandedOrder === o.id}
            onToggle={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}
            showSucursal
            actions={
              <div style={styles.statusBtns}>
                {Object.entries(STATUS_META).map(([key, meta]) => (
                  <button
                    key={key}
                    onClick={() => updateStatus(o.id, key)}
                    style={{
                      ...styles.statusBtn,
                      ...(o.status === key ? { background: meta.color, color: "#fff", borderColor: meta.color } : {}),
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
      <p style={{ fontSize: 12, color: "#8A7B68", margin: "6px 0 12px" }}>
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

function OrderCard({ order, expanded, onToggle, showSucursal, actions }) {
  const meta = STATUS_META[order.status] || STATUS_META.pendiente;
  return (
    <div style={styles.orderCard}>
      <button style={styles.orderCardHead} onClick={onToggle}>
        <div>
          <div style={styles.orderCardTitle}>
            {showSucursal ? order.sucursal : `Pedido #${order.id.slice(-4)}`}
            <span style={{ ...styles.statusPill, background: meta.bg, color: meta.color }}>
              <Clock size={12} /> {meta.label}
            </span>
          </div>
          <div style={styles.orderCardDate}>{fmtDate(order.date)} · {order.items.length} ítems</div>
        </div>
        {expanded ? <ChevronUp size={18} color="#A99A86" /> : <ChevronDown size={18} color="#A99A86" />}
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

function TopBar({ onBack, title, subtitle }) {
  return (
    <div style={styles.topBar}>
      <button style={styles.backBtn} onClick={onBack}><ArrowLeft size={18} /></button>
      <div>
        <div style={styles.topTitle}>{title}</div>
        {subtitle && <div style={styles.topSubtitle}>{subtitle}</div>}
      </div>
    </div>
  );
}

const styles = {
  page: {
    "--cream": "#FBF6EE", "--paper": "#FFFFFF", "--plum": "#4A1F2E", "--plum-light": "#6E3347",
    "--pistachio": "#8CA876", "--pistachio-dark": "#5F7A4C", "--terracotta": "#C9714E",
    "--ink": "#2B2320", "--line": "#E7DFCF",
    minHeight: "100vh", background: "var(--cream)", color: "var(--ink)",
    fontFamily: "'Inter', system-ui, sans-serif", padding: "0 0 60px",
  },
  center: {
    display: "flex", flexDirection: "column", alignItems: "center",
    textAlign: "center", padding: "80px 24px 40px", maxWidth: 520, margin: "0 auto",
  },
  logoImg: { width: 150, height: "auto", marginBottom: 4 },
  eyebrow: {
    fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase",
    color: "var(--pistachio-dark)", fontWeight: 600, marginBottom: 12,
  },
  h1: { fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 34, margin: "0 0 8px", color: "var(--plum)" },
  sub: { color: "#7A6C5A", fontSize: 15, margin: 0 },
  roleGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 36, width: "100%" },
  roleCard: {
    background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 16,
    padding: "28px 18px", display: "flex", flexDirection: "column", alignItems: "center",
    gap: 8, cursor: "pointer", boxShadow: "0 1px 2px rgba(74,31,46,0.04)",
  },
  roleTitle: { fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 18, color: "var(--plum)" },
  roleDesc: { fontSize: 13, color: "#8A7B68", textAlign: "center" },
  wrap: { maxWidth: 980, margin: "0 auto", padding: "28px 24px 0" },
  wrapFull: { maxWidth: 980, margin: "0 auto", padding: "28px 24px 0", minHeight: "calc(100vh - 60px)", display: "flex", flexDirection: "column" },
  sucGridWrap: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center" },
  topBar: { display: "flex", alignItems: "center", gap: 14, marginBottom: 24 },
  backBtn: {
    width: 36, height: 36, borderRadius: 10, border: "1px solid var(--line)",
    background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", flexShrink: 0,
  },
  topTitle: { fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 22, color: "var(--plum)" },
  topSubtitle: { fontSize: 13, color: "#8A7B68", marginTop: 2 },
  sucGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, width: "100%" },
  sucCard: {
    background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 12,
    padding: "20px 14px", display: "flex", flexDirection: "column", alignItems: "center",
    gap: 8, cursor: "pointer", fontSize: 14, fontWeight: 600, color: "var(--ink)",
  },
  formLayout: { display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" },
  formMain: {},
  tabs: { display: "flex", gap: 8, marginBottom: 14 },
  tab: {
    padding: "8px 16px", borderRadius: 999, border: "1px solid var(--line)",
    background: "var(--paper)", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#8A7B68",
  },
  tabActive: { background: "var(--plum)", color: "#fff", borderColor: "var(--plum)" },
  searchBox: {
    display: "flex", alignItems: "center", gap: 8, background: "var(--paper)",
    border: "1px solid var(--line)", borderRadius: 10, padding: "9px 12px", marginBottom: 14,
  },
  searchInput: { border: "none", outline: "none", background: "transparent", fontSize: 14, width: "100%" },
  itemList: { background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14, maxHeight: 520, overflowY: "auto" },
  itemRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "12px 16px", borderBottom: "1px solid var(--line)", gap: 12,
  },
  itemInfo: { minWidth: 0 },
  itemName: { fontSize: 14, fontWeight: 500, color: "var(--ink)" },
  itemCode: { fontSize: 11, color: "#A99A86", marginTop: 2, letterSpacing: "0.02em" },
  qtyInput: {
    width: 84, padding: "7px 10px", borderRadius: 8, border: "1px solid var(--line)",
    fontSize: 13, textAlign: "center", flexShrink: 0,
  },
  emptyRow: { padding: "24px 16px", color: "#A99A86", fontSize: 14, textAlign: "center" },
  ticket: { background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 16, padding: 20, position: "sticky", top: 24 },
  ticketHeader: { display: "flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: 14, color: "var(--plum)" },
  ticketCount: { fontSize: 12, color: "#8A7B68", marginTop: 4 },
  ticketDivider: { borderTop: "1px dashed var(--line)", margin: "14px 0" },
  ticketItems: { maxHeight: 220, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 },
  ticketEmpty: { fontSize: 13, color: "#A99A86" },
  ticketLine: { display: "flex", justifyContent: "space-between", gap: 8, fontSize: 13 },
  ticketLineName: { color: "var(--ink)" },
  ticketLineQty: { fontWeight: 600, color: "var(--pistachio-dark)", flexShrink: 0 },
  notesLabel: { fontSize: 12, fontWeight: 600, color: "#8A7B68", display: "block", marginBottom: 6 },
  notesInput: { width: "100%", border: "1px solid var(--line)", borderRadius: 10, padding: 10, fontSize: 13, resize: "vertical", marginBottom: 14 },
  submitBtn: {
    width: "100%", background: "var(--plum)", color: "#fff", border: "none", borderRadius: 10,
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
  primaryBtnSm: { padding: "10px 20px", borderRadius: 10, border: "none", background: "var(--plum)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  textLink: { marginTop: 20, background: "none", border: "none", color: "#8A7B68", fontSize: 13, cursor: "pointer", textDecoration: "underline" },
  orderCards: { display: "flex", flexDirection: "column", gap: 12 },
  orderCard: { background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden" },
  orderCardHead: {
    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left",
  },
  orderCardTitle: { fontSize: 15, fontWeight: 600, color: "var(--ink)", display: "flex", alignItems: "center", gap: 10 },
  orderCardDate: { fontSize: 12, color: "#A99A86", marginTop: 4 },
  statusPill: { fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 4 },
  orderCardBody: { padding: "0 18px 18px", borderTop: "1px solid var(--line)" },
  vendorLabel: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--pistachio-dark)", margin: "14px 0 6px" },
  detailLine: { display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", gap: 12 },
  detailCode: { color: "#A99A86", fontSize: 11 },
  detailQty: { fontWeight: 600, flexShrink: 0 },
  notesBox: { marginTop: 12, padding: 12, background: "var(--cream)", borderRadius: 10, fontSize: 13, color: "#6B5D4B" },
  statusBtns: { display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" },
  statusBtn: {
    padding: "7px 14px", borderRadius: 999, border: "1px solid var(--line)",
    background: "var(--paper)", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "var(--ink)",
  },
  filters: { display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" },
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
  exportPanel: { background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14, padding: 18, marginBottom: 18 },
};
