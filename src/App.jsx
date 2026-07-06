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
    { item: "Base Elena", code: "2136" },
    { item: "Base G Crème", code: "2481" },
    { item: "Base Limone 50", code: "8007" },
    { item: "Base Lucciano's Dulce De Leche", code: "2819" },
    { item: "Base Lucciano's Stecchi Fruta Limone", code: "2817" },
    { item: "Base Lucciano's Stecchi Latte", code: "2818" },
    { item: "Base Soave", code: "2121" },
    { item: "Biancocioc", code: "14092" },
    { item: "Brezel Cream", code: "14997" },
    { item: "Cheese Cake Base", code: "8284" },
    { item: "Cookies Lemon Meringue US", code: "14964" },
    { item: "Cookies Original", code: "14322" },
    { item: "Copertura Al Gusto Di Ciocc Blanco tipo M", code: "15920A" },
    { item: "Copertura al Gusto Di Cioccolato Fondente 5.5kg", code: "14321" },
    { item: "Copertura M. al Pistacchio", code: "15923A" },
    { item: "Copertura Stracciatella", code: "14028" },
    { item: "Extra Dark", code: "8145" },
    { item: "Fiordiamarena x 3kg", code: "18084A" },
    { item: "Fiordibosco x 3", code: "18089A" },
    { item: "Fiordifragola x3kg", code: "18073A" },
    { item: "Fiordimaracuja x 3kg", code: "18195A" },
    { item: "Frollini Cookies Black x 1kg", code: "16484" },
    { item: "Gianfrutta Mango Alphonso x 5 kg", code: "18351" },
    { item: "Gianfrutta Maracuja x 5kg", code: "18430" },
    { item: "Granellla Di Nocciole", code: "16083" },
    { item: "Granella Nocciola Pralinata Ciuri Ciuri", code: "16095" },
    { item: "Instacrumble", code: "16089A" },
    { item: "Instacrumble Cacao Salato", code: "16100" },
    { item: "Instacrumble Neutro", code: "16088" },
    { item: "Instacrumble Pistacchio Salato gluten free", code: "16104" },
    { item: "Italian Whole Roasted Hazelnut", code: "16084" },
    { item: "Kit Limetta x 11.9kg", code: "14339" },
    { item: "Lit Lotus", code: "15079" },
    { item: "Lemon Meringue", code: "14750" },
    { item: "Mango", code: "18154A" },
    { item: "Maracuja", code: "18061" },
    { item: "Master Nico Variegato", code: "14225" },
    { item: "Mecbrownie", code: "148308" },
    { item: "Mec Fibra Plus", code: "6072" },
    { item: "Mecrock x 6kg", code: "14083" },
    { item: "Mecrock Plus x 5kg", code: "14318" },
    { item: "Morettina Pepita x 5.5kg", code: "12093050" },
    { item: "Pan Mec E", code: "8004" },
    { item: "Pasta Banana Con Pezzi x 3kg", code: "18138A" },
    { item: "Pasta Biscotino", code: "14094" },
    { item: "Pasta Caramel", code: "14019" },
    { item: "Pasta Cocco", code: "14020" },
    { item: "Pasta Chocomilky", code: "15096" },
    { item: "Pasta Cream Cacao", code: "14073A" },
    { item: "Pasta Crema Baci", code: "14023" },
    { item: "Pasta Fragola L - Kosher", code: "18031A" },
    { item: "Pasta Fragola x 3kg", code: "18047A" },
    { item: "Pasta French Vanilla", code: "14054A" },
    { item: "Pasta Gusto popcorn", code: "14973" },
    { item: "Pasta Lampone", code: "1808A" },
    { item: "Pasta Mama Que Buena", code: "14221" },
    { item: "Pasta Mango Alfonso", code: "18154A" },
    { item: "Pasta Maracuya", code: "18061A" },
    { item: "Pasta Menta", code: "14035A" },
    { item: "Pasta Mister Nico", code: "14220" },
    { item: "Pasta Nocciola Selection x 5kg", code: "14800" },
    { item: "Pasta Nocciola ciuri ciuri", code: "15958A" },
    { item: "Pasta Paste Limetta", code: "14341" },
    { item: "Pasta Per Cookies Black x 4.5 kg", code: "14582" },
    { item: "Pasta Pistacchio 100% Selection x 4kg", code: "14689" },
    { item: "Pasta Salted Butter Caramel", code: "8323" },
    { item: "Pasta Tiramisu MO - Kosher", code: "14338A" },
    { item: "Pasta Tiramisu x 4.5 kg", code: "14302B" },
    { item: "Pasta White Gianduia", code: "14977" },
    { item: "Pistacchio by Quella Family", code: "14735" },
    { item: "Pistacchio Grains", code: "16082" },
    { item: "Quella Crunchy x 5kg", code: "14677" },
    { item: "Quella Di Nocciole x 6kg", code: "14179" },
    { item: "Quella G", code: "14780" },
    { item: "Quella Lampone", code: "14976A" },
    { item: "Quella Nocciola Praline", code: "14782" },
    { item: "Quella Pistacchio X 6kg - Also Kosher", code: "14586" },
    { item: "Quella Pistacchio Crunchy", code: "14720" },
    { item: "Quella Ultra White", code: "14431" },
    { item: "Quella white crunchy", code: "14724A" },
    { item: "Quello (Caramel) x 6kg", code: "14477" },
    { item: "Quello Crunchy x 2.3kg", code: "14723A" },
    { item: "Softin x 3.5 kg", code: "6069" },
    { item: "Supergel Mix", code: "6004" },
    { item: "Sweet Gusto Mascarpone", code: "8010" },
    { item: "Tuttopann C 10 - Kosher", code: "2009" },
    { item: "Variegato Cookies Black", code: "14581" },
    { item: "Variegato Cookies Black - Kosher", code: "14322" },
    { item: "Variegato Dubai Chocolate", code: "18740" },
    { item: "Variegato Limetta X 1.5kg", code: "14343" },
    { item: "Variegato Mama Que Buena", code: "14219" },
    { item: "Variegato Mecraph x 5.5kg", code: "14335" },
    { item: "Variegato Mister Nico x 4kg", code: "14225" },
    { item: "Variegato Popcorn Salty Caramel", code: "14975" },
    { item: "Variegato Quella Dark - Kosher", code: "14856" },
    { item: "Variegato Salty Caramel Cream", code: "14972" },
    { item: "Variegato Wafer x 5kg", code: "14349" },
    { item: "Yoghin - Kosher", code: "8011" },
  ],
  "Dulce de Leche": [
    { item: "Dulce de Leche Ice Cream", code: "VAC026" },
    { item: "Dulce de Leche Classic 12units", code: "VAC011" },
  ],
  "Varios": [
    { item: "Organic Coco Shredded", code: "" },
  ],
  "Disaronno": [
    { item: "Dextrose 50lb", code: "DEXT_USA" },
    { item: "Gran Pistacchio", code: "2G7669" },
    { item: "Whole Milk Powder 28.5%", code: "WMP" },
  ],
  "Chocolate": [
    { item: "White Chocolate W2-US-U76", code: "LUCCwhite" },
    { item: "Milk Chocoalte 39% 823NV-595", code: "LUCCmikl" },
    { item: "Semi Sweet Chocolate 56% 811 NV-595", code: "LUCCsemi" },
    { item: "Cocoa Powder 22-24 100054-722", code: "LUCCcocoa" },
    { item: "Dark Chocolate 72% 70-30-38NV-595", code: "LUCCdark" },
  ],
  "Packaging": [
    { item: "Sugar Cone #310 400 un", code: "LUCCSC" },
    { item: "Waffle Classic cone #5288 288 un", code: "LUCCWC" },
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
  "Merchandising": [
    { item: "Container TO-GO W Lid MD", code: "" },
    { item: "Container TO-GO W Lid XL", code: "" },
    { item: "Plush Enzo", code: "" },
    { item: "Plush Tonio", code: "" },
    { item: "Plush Tonio NY", code: "" },
    { item: "Plush Tonio US", code: "" },
    { item: "Spoon Luccianos 18cm", code: "" },
    { item: "Spoon Luccianos 9.5cm", code: "" },
    { item: "White Sugar Stick Lucciano's", code: "" },
    { item: "Yellow Sweetener Stick Lucciano's", code: "" },
  ],
  "Equipamiento": [
    { item: "Acrilic Spatula Lucciano's Logo", code: "" },
    { item: "Tray DOWN", code: "" },
    { item: "Tray UP", code: "" },
  ],
  "Uniformes": [
    { item: "Gingham T-shirt black & white women (S)", code: "" },
    { item: "Gingham T-shirt black & white women (M)", code: "" },
    { item: "Gingham T-shirt black & white women (L)", code: "" },
    { item: "Gingham T-shirt black & white women (XL)", code: "" },
    { item: "Gingham T-shirt black & white women (XXL)", code: "" },
    { item: "Gingham T-shirt black & white men (S)", code: "" },
    { item: "Gingham T-shirt black & white men (M)", code: "" },
    { item: "Gingham T-shirt black & white men (L)", code: "" },
    { item: "Gingham T-shirt black & white men (XL)", code: "" },
    { item: "Gingham T-shirt black & white men (XXL)", code: "" },
    { item: "Black apron FOH (ONE SIZE)", code: "" },
    { item: "Back Beret hat FOH (ONE SIZE)", code: "" },
    { item: "Black bow tie FOH (ONE SIZE)", code: "" },
    { item: "White Chef coat women LAB (S)", code: "" },
    { item: "White Chef coat women LAB (M)", code: "" },
    { item: "White Chef coat women LAB (L)", code: "" },
    { item: "White Chef coat women LAB (XL)", code: "" },
    { item: "White Chef coat women LAB (XXL)", code: "" },
    { item: "White Chef coat men LAB (S)", code: "" },
    { item: "White Chef coat men LAB (M)", code: "" },
    { item: "White Chef coat men LAB (L)", code: "" },
    { item: "White Chef coat men LAB (XL)", code: "" },
    { item: "White Chef coat men LAB (XXL)", code: "" },
    { item: "White Chef apron LAB (ONE SIZE)", code: "" },
    { item: "White Chef hat LAB (ONE SIZE)", code: "" },
    { item: "White Chef Pants LAB (S)", code: "" },
    { item: "White Chef Pants LAB (M)", code: "" },
    { item: "White Chef Pants LAB (L)", code: "" },
    { item: "White Chef Pants LAB (XL)", code: "" },
    { item: "White Chef Pants LAB (XXL)", code: "" },
  ],
};

const VENDOR_ORDER = ["Mec3", "Dulce de Leche", "Varios", "Disaronno", "Chocolate", "Packaging", "Merchandising", "Equipamiento", "Uniformes"];

const VENDOR_LABELS = {
  es: {
    "Mec3": "Mec3",
    "Dulce de Leche": "Dulce de Leche",
    "Varios": "Varios",
    "Disaronno": "Disaronno",
    "Chocolate": "Chocolate",
    "Packaging": "Packaging",
    "Merchandising": "Merchandising",
    "Equipamiento": "Equipamiento",
    "Uniformes": "Uniformes",
  },
  en: {
    "Mec3": "Mec3",
    "Dulce de Leche": "Dulce de Leche",
    "Varios": "Other",
    "Disaronno": "Disaronno",
    "Chocolate": "Chocolate",
    "Packaging": "Packaging",
    "Merchandising": "Merchandise",
    "Equipamiento": "Equipment",
    "Uniformes": "Uniforms",
  },
};
function getVendorLabel(key, lang) {
  return (VENDOR_LABELS[lang] && VENDOR_LABELS[lang][key]) || key;
}
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

const STR = {
  es: {
    homeEyebrow: "Estados Unidos",
    homeTitle: "Gestión de Compras",
    sucursalTitle: "Sucursal",
    sucursalDesc: "Responsable de Sucursal",
    depositoTitle: "Depósito",
    depositoDesc: "Responsable de Compras",
    dbError: (msg) => `No se pudo conectar con la base de datos. Revisá que las variables de entorno de Supabase estén configuradas. (${msg})`,

    authEyebrow: "Depósito",
    loginTitle: "Ingresá a tu cuenta",
    signupTitle: "Creá tu cuenta",
    forgotTitle: "Recuperar contraseña",
    loginSub: "Con el mail y contraseña que ya registraste.",
    signupSub: "Elegí un mail y una contraseña para vos.",
    forgotSub: "Te mandamos un link a tu mail para elegir una contraseña nueva.",
    emailPlaceholder: "tu-mail@luccianos.us",
    passwordPlaceholder: "Contraseña",
    confirmPasswordPlaceholder: "Repetí la contraseña",
    back: "Volver",
    loadingWait: "Un momento...",
    loginBtn: "Ingresar",
    signupBtn: "Crear cuenta",
    forgotBtn: "Enviar link",
    forgotLink: "¿Olvidaste tu contraseña?",
    toSignup: "¿No tenés cuenta? Creá una",
    toLogin: "¿Ya tenés cuenta? Ingresá",
    backToLogin: "Volver a ingresar",
    errNeedEmail: "Ingresá tu mail para poder mandarte el link.",
    errNeedBoth: "Completá mail y contraseña.",
    errPasswordsMismatch: "Las contraseñas no coinciden.",
    errNotAllowed: "Ese mail no está autorizado para crear una cuenta de Depósito. Consultá con quien administra la herramienta.",
    errAlreadyRegistered: "Ese mail ya tiene una cuenta creada. Probá ingresar.",
    errWrongCredentials: "Mail o contraseña incorrectos.",
    infoResetSent: "Listo. Si ese mail tiene una cuenta, te llegó un link para elegir una contraseña nueva. Revisá también spam.",
    infoAccountCreated: "Cuenta creada. Si te pide confirmar el mail, revisá tu casilla y después volvé acá a ingresar.",

    resetTitle: "Elegí tu contraseña nueva",
    resetSub: "Después de esto vas a entrar directo a Depósito.",
    newPasswordPlaceholder: "Contraseña nueva",
    confirmNewPasswordPlaceholder: "Repetí la contraseña nueva",
    savePassword: "Guardar contraseña",
    errChoosePassword: "Elegí una contraseña nueva.",

    pinTitle: "Ingresá el PIN",
    pinSub: "Pedíselo a quien administra la herramienta si no lo tenés.",
    pinWrong: "PIN incorrecto. Probá de nuevo.",

    sucursalSelectTitle: "Elegí tu sucursal",

    orderSubtitle: "Pedido semanal de stock",
    copyLast: "Copiar último pedido",
    clearBtn: "Borrar",
    searchPlaceholder: (v) => `Buscar en ${v}...`,
    recurring: "Recurrentes",
    restOfProducts: "Resto de productos",
    noMatch: (s) => `No hay productos que coincidan con "${s}".`,
    qtyPlaceholder: "cant.",
    orderSummary: "Resumen del pedido",
    itemLoaded: "ítem cargado",
    itemsLoaded: "ítems cargados",
    noItemsYet: "Todavía no cargaste productos.",
    notesLabel: "Notas para depósito (opcional)",
    notesPlaceholder: "Ej: urgente para el finde, entregar antes del jueves...",
    sending: "Enviando...",
    submitOrder: "Enviar pedido",
    viewPrevious: "Ver pedidos anteriores",
    errNoQty: "Todavía no hay pedidos anteriores para copiar.",
    copiedLast: "Cargamos las cantidades del último pedido.",
    errNoQtyToSubmit: "Cargá al menos una cantidad antes de enviar.",
    errCouldNotSave: "No se pudo guardar el pedido. Probá de nuevo.",
    errCouldNotUpdateStatus: "No se pudo actualizar el estado.",
    errCouldNotRestore: "No se pudo restaurar el backup.",

    orderSent: "Pedido enviado",
    depositoCanSee: (s) => `Depósito ya puede ver el pedido de ${s}.`,
    alsoByMail: (email) => "Para mandarlo también por mail a ",
    stepCopyTable: 'Apretá "Copiar tabla con formato" abajo.',
    stepOpenMail: (email) => `Abrí un mail nuevo a ${email} y pegalo con `,
    stepSameFormat: "Va a quedar con el mismo formato de tabla que le mandamos siempre a los proveedores.",
    copyTableBtn: "Copiar tabla con formato",
    copiedPasteNow: "¡Copiado! Ahora pegalo en el mail",
    copyFailed: "No se pudo copiar, probá con el texto de abajo",
    plainTextFallback: "¿No se copió bien? Usar texto plano en su lugar",
    selectAllText: "Seleccionar todo",
    textSelected: "Texto seleccionado — ahora Ctrl+C",
    openMailApp: 'O probar con "Abrir mi programa de mail"',
    viewMyOrders: "Ver mis pedidos",
    loadAnotherOrder: "Cargar otro pedido",
    backHome: "Volver al inicio",

    orderHistory: "Historial de pedidos",
    loadingOrders: "Cargando pedidos...",
    noOrdersYet: "Todavía no enviaste ningún pedido.",
    order: "Pedido",
    items: "ítems",
    canceledOn: (d) => `Cancelado el ${d}`,
    notes: "Notas",
    cancelThisOrder: "Cancelar este pedido",
    confirmCancel: "¿Seguro? Tocá de nuevo para cancelar",

    selectDates: "Seleccionar fechas",
    clearDates: "Limpiar",
    today: "Hoy",
    noOrdersMatchFilter: "No hay pedidos que coincidan con el filtro.",
    connectedAs: "Conectado como",
    logout: "Cerrar sesión",
    hideBackup: "Ocultar respaldo",
    exportAllOrders: "Exportar todos los pedidos",
    byOrder: "Por pedido",
    byProduct: "Por producto",
    allBranches: "Todas las sucursales",
    allStatuses: "Todos los estados",
    statusPendiente: "Pendiente",
    statusPedido: "Pedido",
    statusCancelado: "Cancelado",
    product: "Producto",
    code: "Código",
    vendor: "Proveedor",
    totalQty: "Cantidad total",
    pendingOrdersSubtitle: (n) => `${n} pedido${n === 1 ? "" : "s"} pendiente${n === 1 ? "" : "s"}`,

    backupOf: (n) => `Respaldo de ${n} pedido${n === 1 ? "" : "s"}`,
    backupNote: "Con la base de datos real, esto ya no debería perderse solo — pero sirve como respaldo extra.",
    downloadJson: "Descargar backup (.json)",
    downloadTxt: "Descargar .txt (lectura)",
    selectedCtrlC: "Seleccionado — Ctrl+C",
    selectTxtToCopy: "Seleccionar .txt para copiar",
    hideRestore: "Ocultar restauración",
    restoreFromBackup: "Restaurar pedidos desde un backup",
    restoreOrders: "Restaurar pedidos",
    errInvalidBackup: "Ese texto no es un backup JSON válido.",
    errWrongFormat: "El archivo no tiene el formato esperado de pedidos.",
    restoredOrders: (n) => `Se restauraron ${n} pedido(s).`,

    langToggleLabel: "Cambiar idioma",
    themeToggleLabel: "Cambiar tema día/noche",
  },
  en: {
    homeEyebrow: "United States",
    homeTitle: "Purchasing Management",
    sucursalTitle: "Branch",
    sucursalDesc: "Branch Manager",
    depositoTitle: "Warehouse",
    depositoDesc: "Purchasing Manager",
    dbError: (msg) => `Could not connect to the database. Check that the Supabase environment variables are configured. (${msg})`,

    authEyebrow: "Warehouse",
    loginTitle: "Log in to your account",
    signupTitle: "Create your account",
    forgotTitle: "Recover password",
    loginSub: "With the email and password you already registered.",
    signupSub: "Choose an email and a password for yourself.",
    forgotSub: "We'll send a link to your email so you can choose a new password.",
    emailPlaceholder: "your-email@luccianos.us",
    passwordPlaceholder: "Password",
    confirmPasswordPlaceholder: "Repeat the password",
    back: "Back",
    loadingWait: "One moment...",
    loginBtn: "Log in",
    signupBtn: "Create account",
    forgotBtn: "Send link",
    forgotLink: "Forgot your password?",
    toSignup: "Don't have an account? Create one",
    toLogin: "Already have an account? Log in",
    backToLogin: "Back to login",
    errNeedEmail: "Enter your email so we can send you the link.",
    errNeedBoth: "Fill in email and password.",
    errPasswordsMismatch: "Passwords don't match.",
    errNotAllowed: "That email isn't authorized to create a Warehouse account. Check with whoever manages this tool.",
    errAlreadyRegistered: "That email already has an account. Try logging in.",
    errWrongCredentials: "Wrong email or password.",
    infoResetSent: "Done. If that email has an account, a link to choose a new password was sent to it. Check spam too.",
    infoAccountCreated: "Account created. If it asks you to confirm your email, check your inbox and come back here to log in.",

    resetTitle: "Choose your new password",
    resetSub: "After this you'll go straight into Warehouse.",
    newPasswordPlaceholder: "New password",
    confirmNewPasswordPlaceholder: "Repeat the new password",
    savePassword: "Save password",
    errChoosePassword: "Choose a new password.",

    pinTitle: "Enter the PIN",
    pinSub: "Ask whoever manages this tool if you don't have it.",
    pinWrong: "Wrong PIN. Try again.",

    sucursalSelectTitle: "Choose your branch",

    orderSubtitle: "Weekly stock order",
    copyLast: "Copy last order",
    clearBtn: "Clear",
    searchPlaceholder: (v) => `Search in ${v}...`,
    recurring: "Recurring",
    restOfProducts: "Rest of products",
    noMatch: (s) => `No products match "${s}".`,
    qtyPlaceholder: "qty.",
    orderSummary: "Order summary",
    itemLoaded: "item loaded",
    itemsLoaded: "items loaded",
    noItemsYet: "You haven't loaded any products yet.",
    notesLabel: "Notes for warehouse (optional)",
    notesPlaceholder: "E.g.: urgent for the weekend, deliver before Thursday...",
    sending: "Sending...",
    submitOrder: "Send order",
    viewPrevious: "View previous orders",
    errNoQty: "There are no previous orders to copy yet.",
    copiedLast: "We loaded the quantities from the last order.",
    errNoQtyToSubmit: "Load at least one quantity before sending.",
    errCouldNotSave: "Couldn't save the order. Try again.",
    errCouldNotUpdateStatus: "Couldn't update the status.",
    errCouldNotRestore: "Couldn't restore the backup.",

    orderSent: "Order sent",
    depositoCanSee: (s) => `Warehouse can now see ${s}'s order.`,
    alsoByMail: (email) => "To also send it by email to ",
    stepCopyTable: 'Tap "Copy formatted table" below.',
    stepOpenMail: (email) => `Open a new email to ${email} and paste it with `,
    stepSameFormat: "It will keep the same table format we always send to vendors.",
    copyTableBtn: "Copy formatted table",
    copiedPasteNow: "Copied! Now paste it in the email",
    copyFailed: "Couldn't copy, try the text below",
    plainTextFallback: "Didn't copy well? Use plain text instead",
    selectAllText: "Select all",
    textSelected: "Text selected — now Ctrl+C",
    openMailApp: 'Or try "Open my email app"',
    viewMyOrders: "View my orders",
    loadAnotherOrder: "Load another order",
    backHome: "Back to home",

    orderHistory: "Order history",
    loadingOrders: "Loading orders...",
    noOrdersYet: "You haven't sent any orders yet.",
    order: "Order",
    items: "items",
    canceledOn: (d) => `Canceled on ${d}`,
    notes: "Notes",
    cancelThisOrder: "Cancel this order",
    confirmCancel: "Sure? Tap again to cancel",

    selectDates: "Select dates",
    clearDates: "Clear",
    today: "Today",
    noOrdersMatchFilter: "No orders match the filter.",
    connectedAs: "Connected as",
    logout: "Log out",
    hideBackup: "Hide backup",
    exportAllOrders: "Export all orders",
    byOrder: "By order",
    byProduct: "By product",
    allBranches: "All branches",
    allStatuses: "All statuses",
    statusPendiente: "Pending",
    statusPedido: "Ordered",
    statusCancelado: "Canceled",
    product: "Product",
    code: "Code",
    vendor: "Vendor",
    totalQty: "Total quantity",
    pendingOrdersSubtitle: (n) => `${n} pending order${n === 1 ? "" : "s"}`,

    backupOf: (n) => `Backup of ${n} order${n === 1 ? "" : "s"}`,
    backupNote: "With the real database this shouldn't get lost on its own anymore — but it's useful as an extra backup.",
    downloadJson: "Download backup (.json)",
    downloadTxt: "Download .txt (reading)",
    selectedCtrlC: "Selected — Ctrl+C",
    selectTxtToCopy: "Select .txt to copy",
    hideRestore: "Hide restore",
    restoreFromBackup: "Restore orders from a backup",
    restoreOrders: "Restore orders",
    errInvalidBackup: "That text isn't a valid JSON backup.",
    errWrongFormat: "The file doesn't have the expected order format.",
    restoredOrders: (n) => `Restored ${n} order(s).`,

    langToggleLabel: "Switch language",
    themeToggleLabel: "Switch day/night theme",
  },
};

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

function fmtDate(iso, lang = "es") {
  const locale = lang === "en" ? "en-US" : "es-AR";
  const d = new Date(iso);
  return d.toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" }) +
    " · " + d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
}

function fmtShortDate(iso) {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${d.getFullYear()}`;
}

const STATUS_LABEL_KEY = { pendiente: "statusPendiente", pedido: "statusPedido", cancelado: "statusCancelado" };
function getStatusLabel(status, lang) {
  return STR[lang][STATUS_LABEL_KEY[status] || "statusPendiente"];
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

function canCancelOrder(order) {
  if (order.status === "cancelado") return false;
  const d = new Date(order.date);
  const orderDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round((today - orderDay) / 86400000);
  return diffDays <= 1;
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

  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "es";
    return localStorage.getItem("luccianos-lang") || "es";
  });

  useEffect(() => {
    localStorage.setItem("luccianos-lang", lang);
  }, [lang]);

  function toggleLang() {
    setLang((l) => (l === "es" ? "en" : "es"));
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

  const [recentOrder, setRecentOrder] = useState([]);

  function setQty(vendor, item, value) {
    const key = vendor + "|" + item;
    setDraft((d) => ({ ...d, [key]: value }));
    if (value && value.trim() !== "") {
      setRecentOrder((prev) => [key, ...prev.filter((k) => k !== key)]);
    }
  }

  function clearDraft() {
    setDraft({});
    setRecentOrder([]);
  }

  function copyLastOrder() {
    const sorted = [...mySucursalOrders].sort((a, b) => new Date(b.date) - new Date(a.date));
    const last = sorted[0];
    if (!last) {
      setToast({ type: "error", text: STR[lang].errNoQty });
      return;
    }
    setDraft((d) => {
      const next = { ...d };
      last.items.forEach((it) => {
        next[it.vendor + "|" + it.item] = String(it.quantity);
      });
      return next;
    });
    setRecentOrder((prev) => [
      ...last.items.map((it) => it.vendor + "|" + it.item),
      ...prev,
    ]);
    setToast({ type: "success", text: STR[lang].copiedLast });
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
      setToast({ type: "error", text: STR[lang].errNoQtyToSubmit });
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
      setToast({ type: "error", text: STR[lang].errCouldNotSave });
      return;
    }
    setOrders((prev) => [newOrder, ...prev]);
    setDraft({});
    setRecentOrder([]);
    setNotes("");
    setLastOrder(newOrder);
    setScreen("sucursal-confirm");
  }

  async function updateStatus(orderId, status) {
    const patch = { status };
    if (status === "cancelado") patch.canceled_at = new Date().toISOString();
    let { error } = await supabase.from("orders").update(patch).eq("id", orderId);
    if (error && patch.canceled_at) {
      // Probablemente la columna canceled_at todavía no existe en Supabase: reintentamos sin ella.
      delete patch.canceled_at;
      const retry = await supabase.from("orders").update(patch).eq("id", orderId);
      error = retry.error;
    }
    if (error) {
      setToast({ type: "error", text: STR[lang].errCouldNotUpdateStatus });
      return;
    }
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, ...patch } : o)));
  }

  async function importOrders(importedOrders) {
    const { error } = await supabase.from("orders").upsert(importedOrders, { onConflict: "id" });
    if (error) {
      setToast({ type: "error", text: STR[lang].errCouldNotRestore });
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
          {STR[lang].dbError(loadError)}
        </div>
      )}

      {screen === "home" && <Home onSucursal={() => setScreen("sucursal-select")} onDeposito={() => setScreen(depositoSession ? "deposito" : "deposito-auth")} theme={theme} onToggleTheme={toggleTheme} lang={lang} onToggleLang={toggleLang} />}

      {screen === "sucursal-select" && (
        <SucursalSelect onBack={() => setScreen("home")} onPick={(s) => requestPin(s, "order-form")} theme={theme} onToggleTheme={toggleTheme} lang={lang} onToggleLang={toggleLang} />
      )}

      {screen === "pin" && pendingRole && (
        <PinScreen
          roleKey={pendingRole.key}
          value={pinValue}
          setValue={setPinValue}
          error={pinError}
          onSubmit={checkPin}
          onBack={() => setScreen(pendingRole.key === "Depósito" ? "home" : "sucursal-select")}
          lang={lang}
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
          recentOrder={recentOrder}
          pastOrders={mySucursalOrders}
          lang={lang}
          onToggleLang={toggleLang}
        />
      )}

      {screen === "sucursal-confirm" && (
        <Confirm
          sucursal={sucursal}
          lastOrder={lastOrder}
          onNewOrder={() => setScreen("order-form")}
          onHistory={() => setScreen("sucursal-history")}
          onHome={() => { setSucursal(null); setScreen("home"); }}
          lang={lang}
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
          updateStatus={updateStatus}
          lang={lang}
          onToggleLang={toggleLang}
        />
      )}

      {screen === "deposito-auth" && (
        <DepositoAuth
          onBack={() => setScreen("home")}
          onSuccess={() => setScreen("deposito")}
          lang={lang}
        />
      )}

      {screen === "reset-password" && (
        <ResetPassword onSuccess={() => setScreen("deposito")} lang={lang} />
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
          lang={lang}
          onToggleLang={toggleLang}
        />
      )}
    </div>
  );
}

function Home({ onSucursal, onDeposito, theme, onToggleTheme, lang, onToggleLang }) {
  const t = STR[lang];
  return (
    <div className="no-scroll-screen" style={styles.homeDark}>
      <div style={styles.homeToggleGroup}>
        <button style={styles.homeThemeToggleBtn} onClick={onToggleLang} aria-label={t.langToggleLabel}>
          {lang === "es" ? "EN" : "ES"}
        </button>
        <button style={styles.homeThemeToggleBtn} onClick={onToggleTheme} aria-label={t.themeToggleLabel}>
          {theme === "night" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
      <div style={styles.homeInner}>
        <img src={`${import.meta.env.BASE_URL}logo-gold.png`} alt="Lucciano's" style={styles.homeLogoImg} />
        <div style={styles.homeEyebrow}>{t.homeEyebrow}</div>
        <h1 style={styles.homeH1}>{t.homeTitle}</h1>
        <div style={styles.roleGrid}>
          <button style={styles.roleCard} onClick={onSucursal}>
            <Store size={28} color="var(--plum)" strokeWidth={1.6} />
            <div style={styles.roleTitle}>{t.sucursalTitle}</div>
            <div style={styles.roleDesc}>{t.sucursalDesc}</div>
          </button>
          <button style={styles.roleCard} onClick={onDeposito}>
            <ClipboardList size={28} color="var(--plum)" strokeWidth={1.6} />
            <div style={styles.roleTitle}>{t.depositoTitle}</div>
            <div style={styles.roleDesc}>{t.depositoDesc}</div>
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

function DepositoAuth({ onBack, onSuccess, lang }) {
  const t = STR[lang];
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
        setError(t.errNeedEmail);
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
      setInfo(t.infoResetSent);
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError(t.errNeedBoth);
      return;
    }
    if (mode === "signup" && password !== confirmPassword) {
      setError(t.errPasswordsMismatch);
      return;
    }
    if (mode === "signup" && !ALLOWED_DEPOSITO_EMAILS.includes(email.trim().toLowerCase())) {
      setError(t.errNotAllowed);
      return;
    }
    setLoading(true);
    if (mode === "signup") {
      const { data, error: err } = await supabase.auth.signUp({ email: email.trim(), password });
      setLoading(false);
      if (err) {
        setError(err.message === "User already registered" ? t.errAlreadyRegistered : err.message);
        return;
      }
      if (data.session) {
        onSuccess();
      } else {
        setInfo(t.infoAccountCreated);
        setMode("login");
      }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      setLoading(false);
      if (err) {
        setError(t.errWrongCredentials);
        return;
      }
      onSuccess();
    }
  }

  return (
    <div style={styles.center}>
      <Lock size={36} color="var(--plum)" strokeWidth={1.5} />
      <div style={styles.eyebrow}>{t.authEyebrow}</div>
      <h1 style={styles.h1}>
        {mode === "login" ? t.loginTitle : mode === "signup" ? t.signupTitle : t.forgotTitle}
      </h1>
      <p style={styles.sub}>
        {mode === "login" && t.loginSub}
        {mode === "signup" && t.signupSub}
        {mode === "forgot" && t.forgotSub}
      </p>

      <div style={{ width: "100%", maxWidth: 320, marginTop: 20 }}>
        <input
          type="email"
          placeholder={t.emailPlaceholder}
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
            placeholder={t.passwordPlaceholder}
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
            placeholder={t.confirmPasswordPlaceholder}
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
        <button style={styles.secondaryBtn} onClick={onBack}>{t.back}</button>
        <button style={styles.primaryBtnSm} onClick={handleSubmit} disabled={loading}>
          {loading ? t.loadingWait : mode === "login" ? t.loginBtn : mode === "signup" ? t.signupBtn : t.forgotBtn}
        </button>
      </div>

      {mode === "login" && (
        <button style={styles.textLink} onClick={() => { setMode("forgot"); setError(null); setInfo(null); }}>
          {t.forgotLink}
        </button>
      )}

      <button
        style={styles.textLink}
        onClick={() => { setMode(mode === "signup" ? "login" : mode === "forgot" ? "login" : "signup"); setError(null); setInfo(null); }}
      >
        {mode === "signup" ? t.toLogin : mode === "forgot" ? t.backToLogin : t.toSignup}
      </button>
    </div>
  );
}

function ResetPassword({ onSuccess, lang }) {
  const t = STR[lang];
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => () => unlockScroll(), []);

  async function handleSubmit() {
    setError(null);
    if (!password.trim()) {
      setError(t.errChoosePassword);
      return;
    }
    if (password !== confirmPassword) {
      setError(t.errPasswordsMismatch);
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
      <div style={styles.eyebrow}>{t.authEyebrow}</div>
      <h1 style={styles.h1}>{t.resetTitle}</h1>
      <p style={styles.sub}>{t.resetSub}</p>

      <div style={{ width: "100%", maxWidth: 320, marginTop: 20 }}>
        <input
          type="password"
          placeholder={t.newPasswordPlaceholder}
          style={styles.authInput}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={lockScroll}
          onBlur={unlockScroll}
        />
        <input
          type="password"
          placeholder={t.confirmNewPasswordPlaceholder}
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
        {loading ? t.loadingWait : t.savePassword}
      </button>
    </div>
  );
}

function PinScreen({ roleKey, value, setValue, error, onSubmit, onBack, lang }) {
  const t = STR[lang];
  useEffect(() => () => unlockScroll(), []);
  return (
    <div style={styles.center}>
      <Lock size={36} color="var(--plum)" strokeWidth={1.5} />
      <div style={styles.eyebrow}>{roleKey}</div>
      <h1 style={styles.h1}>{t.pinTitle}</h1>
      <p style={styles.sub}>{t.pinSub}</p>
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
      {error && <div style={{ color: "var(--terracotta)", fontSize: 13, marginTop: 10, fontWeight: 600 }}>{t.pinWrong}</div>}
      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <button style={styles.secondaryBtn} onClick={onBack}>{t.back}</button>
        <button style={styles.primaryBtnSm} onClick={onSubmit}>{t.loginBtn}</button>
      </div>
    </div>
  );
}

function SucursalSelect({ onBack, onPick, theme, onToggleTheme, lang, onToggleLang }) {
  const t = STR[lang];
  return (
    <div style={styles.darkWrapScroll}>
      <div style={styles.darkInner}>
        <div style={styles.darkTopBar}>
          <button style={styles.darkBackBtn} onClick={onBack}><ArrowLeft size={18} color="var(--ink)" /></button>
          <div style={{ flex: 1 }}>
            <div style={styles.darkTopTitle}>{t.sucursalSelectTitle}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={styles.themeToggleBtn} onClick={onToggleLang} aria-label={t.langToggleLabel}>
              {lang === "es" ? "EN" : "ES"}
            </button>
            <button style={styles.themeToggleBtn} onClick={onToggleTheme} aria-label={t.themeToggleLabel}>
              {theme === "night" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
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

function ItemRow({ p, activeVendor, draft, setQty, lang }) {
  const key = activeVendor + "|" + p.item;
  return (
    <div style={styles.itemRow}>
      <div style={styles.itemInfo}>
        <div style={styles.itemName}>{p.item}</div>
        <div style={styles.itemCode}>{p.code}</div>
      </div>
      <input
        className="qtyInput"
        style={styles.qtyInput}
        placeholder={STR[lang].qtyPlaceholder}
        inputMode="decimal"
        value={draft[key] || ""}
        onChange={(e) => setQty(activeVendor, p.item, sanitizeQty(e.target.value))}
      />
    </div>
  );
}

function OrderForm({ sucursal, onBack, onViewHistory, activeVendor, setActiveVendor, search, setSearch, draft, setQty, draftCount, notes, setNotes, onSubmit, submitting, theme, onToggleTheme, onCopyLastOrder, onClearDraft, recentOrder, pastOrders, lang, onToggleLang }) {
  const t = STR[lang];
  const filteredItems = VENDORS[activeVendor].filter((p) =>
    p.item.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase())
  );

  const itemFrequency = useMemo(() => {
    const freq = {};
    pastOrders
      .filter((o) => o.status !== "cancelado")
      .forEach((o) => {
        const seenInThisOrder = new Set();
        o.items.forEach((it) => {
          if (it.vendor === activeVendor) seenInThisOrder.add(it.item);
        });
        seenInThisOrder.forEach((name) => {
          freq[name] = (freq[name] || 0) + 1;
        });
      });
    return freq;
  }, [pastOrders, activeVendor]);

  const withQty = [];
  const recurrent = [];
  const rest = [];
  filteredItems.forEach((p) => {
    const key = activeVendor + "|" + p.item;
    if (draft[key] && draft[key].trim() !== "") {
      withQty.push(p);
    } else if ((itemFrequency[p.item] || 0) >= 2) {
      recurrent.push(p);
    } else {
      rest.push(p);
    }
  });
  withQty.sort((a, b) => {
    const ra = recentOrder.indexOf(activeVendor + "|" + a.item);
    const rb = recentOrder.indexOf(activeVendor + "|" + b.item);
    return (ra === -1 ? Infinity : ra) - (rb === -1 ? Infinity : rb);
  });
  recurrent.sort((a, b) => (itemFrequency[b.item] || 0) - (itemFrequency[a.item] || 0));

  return (
    <div style={styles.wrap}>
      <TopBar onBack={onBack} title={sucursal} subtitle={t.orderSubtitle} theme={theme} onToggleTheme={onToggleTheme} lang={lang} onToggleLang={onToggleLang} />
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
                  {getVendorLabel(v, lang)}
                </button>
              ))}
            </div>
            <div style={styles.tabsRowActions}>
              <button style={styles.tabsRowActionBtn} onClick={onCopyLastOrder}>{t.copyLast}</button>
              <button style={styles.tabsRowClearBtn} onClick={onClearDraft}>{t.clearBtn}</button>
            </div>
          </div>

          <div style={styles.searchBox}>
            <Search size={16} color="var(--muted-faint)" />
            <input
              style={styles.searchInput}
              placeholder={t.searchPlaceholder(getVendorLabel(activeVendor, lang))}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={styles.itemList}>
            {withQty.map((p) => (
              <ItemRow key={activeVendor + "|" + p.item} p={p} activeVendor={activeVendor} draft={draft} setQty={setQty} lang={lang} />
            ))}
            {recurrent.length > 0 && <div style={styles.itemSectionLabel}>{t.recurring}</div>}
            {recurrent.map((p) => (
              <ItemRow key={activeVendor + "|" + p.item} p={p} activeVendor={activeVendor} draft={draft} setQty={setQty} lang={lang} />
            ))}
            {rest.length > 0 && (withQty.length > 0 || recurrent.length > 0) && (
              <div style={styles.itemSectionLabel}>{t.restOfProducts}</div>
            )}
            {rest.map((p) => (
              <ItemRow key={activeVendor + "|" + p.item} p={p} activeVendor={activeVendor} draft={draft} setQty={setQty} lang={lang} />
            ))}
            {filteredItems.length === 0 && <div style={styles.emptyRow}>{t.noMatch(search)}</div>}
          </div>
        </div>

        <div className="order-ticket" style={styles.ticket}>
          <div style={styles.ticketHeader}>
            <Package size={16} color="var(--plum)" />
            <span>{t.orderSummary}</span>
          </div>
          <div style={styles.ticketCount}>{draftCount} {draftCount === 1 ? t.itemLoaded : t.itemsLoaded}</div>
          <div style={styles.ticketDivider} />
          <div style={styles.ticketItems}>
            {Object.entries(draft).filter(([, v]) => v && v.trim() !== "").length === 0 && (
              <div style={styles.ticketEmpty}>{t.noItemsYet}</div>
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
          <label style={styles.notesLabel}>{t.notesLabel}</label>
          <textarea
            style={styles.notesInput}
            placeholder={t.notesPlaceholder}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
          <button style={styles.submitBtn} onClick={onSubmit} disabled={submitting}>
            {submitting ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={16} />}
            {submitting ? t.sending : t.submitOrder}
          </button>
          <button style={styles.historyLink} onClick={onViewHistory}>{t.viewPrevious}</button>
        </div>
      </div>
    </div>
  );
}

function Confirm({ sucursal, lastOrder, onNewOrder, onHistory, onHome, lang }) {
  const t = STR[lang];
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
      <h1 style={styles.h1}>{t.orderSent}</h1>
      <p style={styles.sub}>{t.depositoCanSee(sucursal)}</p>
      <p style={{ ...styles.sub, fontSize: 13, marginTop: 4 }}>
        {t.alsoByMail(ORDER_EMAIL)}<strong>{ORDER_EMAIL}</strong>:
      </p>
      {lastOrder && (
        <div style={{ width: "100%", maxWidth: 460, marginTop: 14 }}>
          <ol style={{ textAlign: "left", fontSize: 13, color: "var(--muted-strong)", paddingLeft: 20, margin: "0 0 12px" }}>
            <li>{t.stepCopyTable}</li>
            <li>{t.stepOpenMail(ORDER_EMAIL)}<strong>Ctrl+V</strong> ({lang === "en" ? "or Cmd+V on Mac" : "o Cmd+V en Mac"}).</li>
            <li>{t.stepSameFormat}</li>
          </ol>
          <button
            onClick={copyFormattedTable}
            style={{ ...styles.submitBtn, width: "100%" }}
          >
            {copiedTable ? <CheckCircle2 size={16} /> : <ClipboardList size={16} />}
            {copiedTable
              ? t.copiedPasteNow
              : copyError
              ? t.copyFailed
              : t.copyTableBtn}
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
            <summary style={styles.textLink}>{t.plainTextFallback}</summary>
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
              {selected ? t.textSelected : t.selectAllText}
            </button>
          </details>

          <a href={buildMailto(lastOrder)} style={{ ...styles.historyLink, display: "block", textAlign: "center" }}>
            {t.openMailApp}
          </a>
        </div>
      )}
      <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap", justifyContent: "center" }}>
        <button style={styles.secondaryBtn} onClick={onHistory}>{t.viewMyOrders}</button>
        <button style={styles.secondaryBtn} onClick={onNewOrder}>{t.loadAnotherOrder}</button>
      </div>
      <button style={styles.textLink} onClick={onHome}>{t.backHome}</button>
    </div>
  );
}

function SucursalHistory({ sucursal, orders, loading, onBack, expandedOrder, setExpandedOrder, theme, onToggleTheme, updateStatus, lang, onToggleLang }) {
  const t = STR[lang];
  return (
    <div style={styles.wrap}>
      <TopBar onBack={onBack} title={sucursal} subtitle={t.orderHistory} theme={theme} onToggleTheme={onToggleTheme} lang={lang} onToggleLang={onToggleLang} />
      {loading && <div style={styles.emptyRow}>{t.loadingOrders}</div>}
      {!loading && orders.length === 0 && <div style={styles.emptyRow}>{t.noOrdersYet}</div>}
      <div style={styles.orderCards}>
        {orders.map((o) => (
          <OrderCard
            key={o.id}
            order={o}
            expanded={expandedOrder === o.id}
            onToggle={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}
            allOrders={orders}
            onCancel={() => updateStatus(o.id, "cancelado")}
            lang={lang}
          />
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
const WEEKDAYS_EN = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
const MONTH_NAMES_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function DateRangePicker({ from, to, setFrom, setTo, lang }) {
  const t = STR[lang];
  const weekdays = lang === "en" ? WEEKDAYS_EN : WEEKDAYS_ES;
  const monthNames = lang === "en" ? MONTH_NAMES_EN : MONTH_NAMES_ES;
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
    ? t.selectDates
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
        <button type="button" style={styles.dateClearBtnFloating} onClick={handleClear} aria-label={t.clearDates}>×</button>
      )}

      {open && (
        <div style={styles.calendarPopup}>
          <div style={styles.calendarHeader}>
            <button type="button" style={styles.calendarNavBtn} onClick={goPrevMonth}>‹</button>
            <span style={styles.calendarMonthLabel}>{monthNames[viewMonth]} {viewYear}</span>
            <button type="button" style={styles.calendarNavBtn} onClick={goNextMonth}>›</button>
          </div>
          <div style={styles.calendarWeekRow}>
            {weekdays.map((wd, i) => <div key={i} style={styles.calendarWeekDay}>{wd}</div>)}
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
            <button type="button" style={styles.calendarFooterBtn} onClick={handleClear}>{t.clearDates}</button>
            <button type="button" style={styles.calendarFooterBtn} onClick={handleToday}>{t.today}</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Deposito({ onBack, loading, orders, allOrders, filterSucursal, setFilterSucursal, filterStatus, setFilterStatus, filterDateFrom, setFilterDateFrom, filterDateTo, setFilterDateTo, depositoView, setDepositoView, expandedOrder, setExpandedOrder, updateStatus, onImportOrders, userEmail, onLogout, theme, onToggleTheme, lang, onToggleLang }) {
  const t = STR[lang];
  const pendingCount = allOrders.filter((o) => o.status === "pendiente").length;
  const [showExport, setShowExport] = useState(false);

  const productSummary = useMemo(() => {
    const map = new Map();
    orders.filter((o) => o.status !== "cancelado").forEach((o) => {
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
      <TopBar onBack={onBack} title={t.depositoTitle} subtitle={t.pendingOrdersSubtitle(pendingCount)} theme={theme} onToggleTheme={onToggleTheme} lang={lang} onToggleLang={onToggleLang} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
        {userEmail && <div style={{ fontSize: 12, color: "var(--muted)" }}>{t.connectedAs} <strong>{userEmail}</strong> · <button onClick={onLogout} style={{ ...styles.textLink, marginTop: 0, display: "inline" }}>{t.logout}</button></div>}
        <button style={styles.secondaryBtn} onClick={() => setShowExport((v) => !v)}>
          {showExport ? t.hideBackup : t.exportAllOrders}
        </button>
      </div>

      {showExport && <ExportPanel orders={allOrders} onImport={onImportOrders} lang={lang} />}

      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(depositoView === "pedido" ? styles.tabActive : {}) }}
          onClick={() => setDepositoView("pedido")}
        >
          {t.byOrder}
        </button>
        <button
          style={{ ...styles.tab, ...(depositoView === "producto" ? styles.tabActive : {}) }}
          onClick={() => setDepositoView("producto")}
        >
          {t.byProduct}
        </button>
      </div>

      <div style={styles.filters}>
        <select style={styles.select} value={filterSucursal} onChange={(e) => setFilterSucursal(e.target.value)}>
          <option value="Todas">{t.allBranches}</option>
          {SUCURSALES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select style={styles.select} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="todas">{t.allStatuses}</option>
          <option value="pendiente">{t.statusPendiente}</option>
          <option value="pedido">{t.statusPedido}</option>
          <option value="cancelado">{t.statusCancelado}</option>
        </select>
        <DateRangePicker
          from={filterDateFrom}
          to={filterDateTo}
          setFrom={setFilterDateFrom}
          setTo={setFilterDateTo}
          lang={lang}
        />
      </div>

      {loading && <div style={styles.emptyRow}>{t.loadingOrders}</div>}
      {!loading && orders.length === 0 && <div style={styles.emptyRow}>{t.noOrdersMatchFilter}</div>}

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
              lang={lang}
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
                      {getStatusLabel(key, lang)}
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
                <th style={styles.productSummaryHeaderCell}>{t.product}</th>
                <th style={{ ...styles.productSummaryHeaderCell, textAlign: "center" }}>{t.code}</th>
                <th style={{ ...styles.productSummaryHeaderCell, textAlign: "center" }}>{t.vendor}</th>
                <th style={{ ...styles.productSummaryHeaderCell, textAlign: "right" }}>{t.totalQty}</th>
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

function buildAllOrdersExport(orders, lang = "es") {
  const en = lang === "en";
  if (orders.length === 0) return en ? "No orders loaded yet." : "No hay pedidos cargados todavía.";
  let text = en
    ? `Lucciano's order backup\nGenerated: ${fmtDate(new Date().toISOString(), lang)}\nTotal orders: ${orders.length}\n\n${"=".repeat(40)}\n\n`
    : `Respaldo de pedidos - Lucciano's\nGenerado: ${fmtDate(new Date().toISOString(), lang)}\nTotal de pedidos: ${orders.length}\n\n${"=".repeat(40)}\n\n`;
  orders.forEach((o) => {
    text += en
      ? `Branch: ${o.sucursal}\nDate: ${fmtDate(o.date, lang)}\nStatus: ${getStatusLabel(o.status, lang)}\n`
      : `Sucursal: ${o.sucursal}\nFecha: ${fmtDate(o.date, lang)}\nEstado: ${getStatusLabel(o.status, lang)}\n`;
    VENDOR_ORDER.filter((v) => o.items.some((it) => it.vendor === v)).forEach((v) => {
      text += `  ${v}\n`;
      o.items.filter((it) => it.vendor === v).forEach((it) => {
        text += `    - ${it.item} (${it.code}): ${it.quantity}\n`;
      });
    });
    if (o.notes) text += en ? `  Notes: ${o.notes}\n` : `  Notas: ${o.notes}\n`;
    text += `\n${"-".repeat(40)}\n\n`;
  });
  return text;
}

function ExportPanel({ orders, onImport, lang }) {
  const t = STR[lang];
  const textRef = useRef(null);
  const [selected, setSelected] = useState(false);
  const exportText = buildAllOrdersExport(orders, lang);

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
      if (!Array.isArray(parsed)) throw new Error("not a list");
    } catch (e) {
      setImportMsg({ type: "error", text: t.errInvalidBackup });
      return;
    }
    const valid = parsed.every((o) => o && o.id && o.sucursal && Array.isArray(o.items));
    if (!valid) {
      setImportMsg({ type: "error", text: t.errWrongFormat });
      return;
    }
    onImport(parsed);
    setImportMsg({ type: "success", text: t.restoredOrders(parsed.length) });
    setImportText("");
  }

  return (
    <div style={styles.exportPanel}>
      <div style={styles.ticketHeader}>
        <ClipboardList size={16} color="var(--plum)" />
        <span>{t.backupOf(orders.length)}</span>
      </div>
      <p style={{ fontSize: 12, color: "var(--muted)", margin: "6px 0 12px" }}>
        {t.backupNote}
      </p>
      <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
        <a href={jsonUrl} download={jsonFilename} style={{ ...styles.primaryBtnSm, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
          {t.downloadJson}
        </a>
        <a href={downloadUrl} download={filename} style={{ ...styles.secondaryBtn, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
          {t.downloadTxt}
        </a>
        <button onClick={selectAll} style={{ ...styles.secondaryBtn, display: "inline-flex", alignItems: "center", gap: 8 }}>
          {selected ? <CheckCircle2 size={16} color="var(--pistachio-dark)" /> : null}
          {selected ? t.selectedCtrlC : t.selectTxtToCopy}
        </button>
      </div>
      <textarea ref={textRef} readOnly value={exportText} style={{ ...styles.copyBox, minHeight: 140 }} rows={8} onFocus={(e) => e.target.select()} />

      <div style={styles.ticketDivider} />

      <button style={styles.secondaryBtn} onClick={() => setShowImport((v) => !v)}>
        {showImport ? t.hideRestore : t.restoreFromBackup}
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
            {t.restoreOrders}
          </button>
        </div>
      )}
    </div>
  );
}

function OrderCard({ order, expanded, onToggle, showSucursal, actions, allOrders, onCancel, lang = "es" }) {
  const t = STR[lang];
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const meta = STATUS_META[order.status] || STATUS_META.pendiente;
  const isCanceled = order.status === "cancelado";
  const canCancel = !!onCancel && canCancelOrder(order);

  function handleCancelClick(e) {
    e.stopPropagation();
    if (!confirmingCancel) {
      setConfirmingCancel(true);
      return;
    }
    setConfirmingCancel(false);
    onCancel();
  }

  return (
    <div style={{ ...styles.orderCard, ...(isCanceled ? styles.orderCardCanceled : {}) }}>
      <button style={styles.orderCardHead} onClick={onToggle}>
        <div>
          <div style={{ ...styles.orderCardTitle, ...(isCanceled ? styles.orderCardTitleCanceled : {}) }}>
            {showSucursal ? order.sucursal : `${t.order} ${getOrderShortCode(order, allOrders || [order])}`}
            <span style={{ ...styles.statusPill, background: meta.bg, color: meta.color }}>
              <Clock size={12} /> {getStatusLabel(order.status, lang)}
            </span>
          </div>
          <div style={{ ...styles.orderCode, ...(isCanceled ? styles.orderCardTitleCanceled : {}) }}>{getOrderCode(order, allOrders || [order])}</div>
          <div style={styles.orderCardDate}>{fmtDate(order.date, lang)} · {order.items.length} {t.items}</div>
          {isCanceled && order.canceled_at && (
            <div style={styles.canceledAtLabel}>{t.canceledOn(fmtDate(order.canceled_at, lang))}</div>
          )}
        </div>
        {expanded ? <ChevronUp size={18} color="var(--muted-faint)" /> : <ChevronDown size={18} color="var(--muted-faint)" />}
      </button>
      {expanded && (
        <div style={styles.orderCardBody}>
          {VENDOR_ORDER.filter((v) => order.items.some((it) => it.vendor === v)).map((v) => (
            <div key={v} style={{ marginBottom: 10 }}>
              <div style={styles.vendorLabel}>{getVendorLabel(v, lang)}</div>
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
              <strong>{t.notes}:</strong> {order.notes}
            </div>
          )}
          {actions}
          {canCancel && (
            <button style={confirmingCancel ? styles.cancelOrderBtnConfirm : styles.cancelOrderBtn} onClick={handleCancelClick}>
              {confirmingCancel ? t.confirmCancel : t.cancelThisOrder}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function TopBar({ onBack, title, subtitle, theme, onToggleTheme, lang, onToggleLang }) {
  return (
    <div style={styles.topBar}>
      <button style={styles.backBtn} onClick={onBack}><ArrowLeft size={18} /></button>
      <div style={{ flex: 1 }}>
        <div style={styles.topTitle}>{title}</div>
        {subtitle && <div style={styles.topSubtitle}>{subtitle}</div>}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {onToggleLang && (
          <button style={styles.themeToggleBtn} onClick={onToggleLang} aria-label={STR[lang].langToggleLabel}>
            {lang === "es" ? "EN" : "ES"}
          </button>
        )}
        {onToggleTheme && (
          <button style={styles.themeToggleBtn} onClick={onToggleTheme} aria-label={STR[lang || "es"].themeToggleLabel}>
            {theme === "night" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )}
      </div>
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
  homeToggleGroup: {
    position: "absolute", top: "calc(28px + env(safe-area-inset-top, 0px))", right: 20,
    display: "flex", gap: 8, zIndex: 5,
  },
  homeThemeToggleBtn: {
    width: 36, height: 36, borderRadius: 10, border: "1px solid var(--line)",
    background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", color: "var(--ink)", fontSize: 12, fontWeight: 700,
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
    cursor: "pointer", flexShrink: 0, color: "var(--ink)", fontSize: 12, fontWeight: 700,
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
  orderCardCanceled: { background: "var(--cream)", opacity: 0.72 },
  orderCardHead: {
    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left",
  },
  orderCardTitle: { fontSize: 15, fontWeight: 600, color: "var(--ink)", display: "flex", alignItems: "center", gap: 10 },
  orderCardTitleCanceled: { textDecoration: "line-through", textDecorationColor: "var(--muted)" },
  orderCode: {
    fontSize: 12, fontWeight: 700, color: "var(--plum)", marginTop: 4,
    letterSpacing: "0.02em",
  },
  orderCardDate: { fontSize: 12, color: "var(--muted-faint)", marginTop: 4 },
  canceledAtLabel: { fontSize: 11, color: "#B3261E", fontWeight: 600, marginTop: 4 },
  cancelOrderBtn: {
    marginTop: 14, background: "none", border: "none", padding: 0, fontSize: 13, fontWeight: 600,
    color: "#B3261E", cursor: "pointer", textDecoration: "underline",
  },
  cancelOrderBtnConfirm: {
    marginTop: 14, background: "#B3261E", border: "none", borderRadius: 8, padding: "8px 14px",
    fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer",
  },
  statusPill: { fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 4 },
  orderCardBody: { padding: "0 18px 18px", borderTop: "1px solid var(--line)" },
  vendorLabel: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--pistachio-dark)", margin: "14px 0 6px" },
  itemSectionLabel: {
    fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
    color: "var(--muted)", padding: "10px 16px", background: "var(--cream)",
  },
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
