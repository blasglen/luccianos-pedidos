import { useState, lazy, Suspense, useEffect, useMemo, useRef } from "react";
import {
  Search, Package, ClipboardList, Store, CheckCircle2, Clock, Loader2,
  ArrowLeft, Send, ChevronDown, ChevronUp, Lock, CalendarDays, Sun, Moon, Download, ChevronRight, Trash2,
} from "lucide-react";
import { apiConfigured, listRows, insertRow, updateRow, upsertRows, login as apiLogin, readSession, saveSession, clearSession } from "./api";

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
  "Todos": [],
};

const VENDOR_ORDER = ["Mec3", "Dulce de Leche", "Varios", "Disaronno", "Chocolate", "Packaging", "Merchandising", "Equipamiento", "Uniformes", "Todos"];

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
    "Todos": "Todos",
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
    "Todos": "All",
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

const OWN_SUCURSALES = ["Florida Mall", "Vineland", "Weston"];
// Franquicias ocultas por ahora en la pantalla de selección de sucursal.
// Para volver a mostrarlas, sacalas de esta lista.
const HIDDEN_SUCURSALES = ["American Dream", "Aventura", "Sawgrass"];

const STOCK_VENDORS = {
  "PAPER": [
    { item: "BAKERY BOX ( Paper box for cakes to go )", code: "", sub: 250, cost: 0.84 },
    { item: "PASTRY BAG ( Small paper bag for pastries )", code: "", box: 250, sub: 50, cost: 1.61 },
    { item: "HANDLE PAPER BAG ( Paper bag to go )", code: "", box: 100, sub: 25, cost: 1.95 },
    { item: "CLEAR CUP 16oz LOGO ( Shake-Smoothie)", code: "", box: 1000, sub: 50, cost: 0.11 },
    { item: "CONE SLEEVE ( For premium cone )", code: "", box: 2500, sub: 100, cost: 0.02 },
    { item: "CONTAINER TO GO WITH LID MEDIUM", code: "", box: 50, sub: 25, cost: 0.86 },
    { item: "CONTAINER TO GO WITH LID XL", code: "", box: 50, sub: 25, cost: 1.11 },
    { item: "PACKAGING SLEEVE MEDIUM for container to go", code: "", sub: 250, cost: 0.28 },
    { item: "PACKAGING SLEEVE XLARGE for container to go", code: "", sub: 250, cost: 0.29 },
    { item: "DOME LID for 16oz cup", code: "", box: 1000, sub: 50, cost: 0.05 },
    { item: "FLAT LID for 16oz cup", code: "", box: 1000, sub: 50, cost: 0.04 },
    { item: "LOGO-GOLD 4oz SMALL PAPER CUP", code: "", box: 1000, sub: 50, cost: 0.09 },
    { item: "LOGO-GOLD 6oz MEDIUM PAPER CUP", code: "", box: 1000, sub: 50, cost: 0.1 },
    { item: "LOGO-GOLD 8oz LARGE PAPER CUP", code: "", box: 1000, sub: 50, cost: 0.11 },
    { item: "LOGO-WHITE 4oz SMALL PAPER CUP", code: "", box: 1000, sub: 50, cost: 0.09 },
    { item: "LOGO-WHITE 6oz MEDIUM PAPER CUP", code: "", box: 1000, sub: 50, cost: 0.1 },
    { item: "LOGO-WHITE 8oz LARGE PAPER CUP", code: "", box: 1000, sub: 50, cost: 0.1 },
    { item: "NAPKINS WITH LOGO", code: "", box: 6000, sub: 500, cost: 0.01 },
    { item: "PAPER STRAW WRAPPED BLACK & WHITE", code: "", box: 1200, sub: 50, cost: 0.03 },
    { item: "LARGE BLACK SPOON 18cm", code: "", box: 3000, sub: 250, cost: 0.04 },
    { item: "SMALL BLACK SPOON 9.5cm", code: "", box: 6600, sub: 660, cost: 0.01 },
    { item: "STICKER LOGO for paper bags.", code: "", sub: 500, cost: 0.16 },
  ],
  "COFFEE CORNER": [
    { item: "NESPRESSO 12oz LID for paper cup", code: "", sub: 35, cost: 0.085 },
    { item: "NESPRESSO 12oz PAPER CUP", code: "", sub: 35, cost: 0.17 },
    { item: "NESPRESSO 4oz LID for paper cup", code: "", sub: 50, cost: 0.06 },
    { item: "NESPRESSO 4oz PAPER CUP", code: "", sub: 50, cost: 0.08 },
    { item: "NESPRESSO 8oz LID for paper cup", code: "", sub: 30, cost: 0.07 },
    { item: "NESPRESSO 8oz PAPER CUP", code: "", sub: 30, cost: 0.14 },
    { item: "NESPRESSO COFFEE CAPSULE ESPRESSO CARAMEL", code: "", box: 50, cost: 0.69 },
    { item: "NESPRESSO COFFEE CAPSULE ESPRESSO DECAFFEINATO", code: "", box: 50, cost: 0.69 },
    { item: "NESPRESSO COFFEE CAPSULE ESPRESSO LEGGERO", code: "", box: 50, cost: 0.69 },
    { item: "NESPRESSO COFFEE CAPSULE ESPRESSO ORIGIN BRAZIL", code: "", box: 50, cost: 0.69 },
    { item: "NESPRESSO COFFEE CAPSULE LUNGO FORTE", code: "", box: 50, cost: 0.69 },
    { item: "NESPRESSO COFFEE CAPSULE LUNGO LEGGERO", code: "", box: 50, cost: 0.69 },
    { item: "NESPRESSO COFFEE CAPSULE RISTRETTO", code: "", box: 50, cost: 0.69 },
    { item: "PAPER CUP HOLDER for cups to go", code: "", box: 2500, sub: 75, cost: 0.011 },
    { item: "PAPER SLEEVE FOR NESPRESSO CUP LARGE", code: "" },
    { item: "PAPER SLEEVE FOR NESPRESSO CUP SMALL", code: "" },
    { item: "STIR for coffee cup", code: "", box: 100, cost: 0.023 },
    { item: "SWEETNER STICK PACKET LOGO - for coffee", code: "", box: 2000, cost: 0.02 },
    { item: "WHITE SUGAR STICK PACKET LOGO - for coffee", code: "", box: 2000, cost: 0.02 },
  ],
  "GRAB & GO": [
    { item: "BOTTLE OF SPARKLING WATER", code: "", box: 24, cost: 1.2496 },
    { item: "BOTTLE OF COKE ZERO", code: "", box: 24, cost: 1.4583 },
    { item: "BOTTLE OF SPRITE", code: "", box: 24, cost: 1.4583 },
    { item: "BOTTLE OF REGULAR COKE", code: "", box: 24, cost: 1.4583 },
    { item: "BOTTLE OF WATER", code: "", box: 24, cost: 1.5483 },
    { item: "BERRY CAKE", code: "", box: 12, cost: 3.54 },
    { item: "CHOCOLATE CAKE", code: "", box: 14, cost: 2.85 },
    { item: "APPLE TART", code: "", box: 12, cost: 3.38 },
    { item: "CHOCOLATE TEMPTATION", code: "", box: 12, cost: 3.92 },
    { item: "MACARONS", code: "", box: 144, sub: 48, cost: 1.07 },
    { item: "NOCCIOLA CAKE", code: "", box: 10, cost: 3.7 },
    { item: "RICOTTA PISTACCHIO TART", code: "", box: 12, cost: 3.5 },
    { item: "TORTA DE LA NONNA", code: "", box: 12, cost: 3.29 },
    { item: "MINI KEY LIME CHEESECAKE", code: "", box: 16, cost: 3.19 },
    { item: "INDIV PORTION TIRAMISU", code: "", box: 10, cost: 4.05 },
    { item: "PUMPKIN CHEESCKE", code: "", box: 14 },
    { item: "MINI CROISSANT", code: "", box: 150 },
    { item: "RED VELVET CAKE", code: "", box: 16, cost: 4.69 },
    { item: "DULCE DE LECHE CHEESECAKE", code: "", box: 16, cost: 2.75 },
  ],
  "OTHERS": [
    { item: "CIALDINO - WAFFLE COOKIE", code: "", box: 1200, cost: 0.05 },
    { item: "KIDS CONE", code: "", box: 400, sub: 200, cost: 0.16 },
    { item: "REGULAR WAFFLE CONE", code: "", box: 288, sub: 24, cost: 0.32 },
    { item: "WHIPPED CREAM", code: "", box: 0.36, cost: 12.19 },
    { item: "WHOLE MILK", code: "", box: 3.78, cost: 0.95 },
    { item: "ICE POPS LOGO STICKS", code: "", box: 10000 },
    { item: "LARGE BOTTLE OF SPARKLING WATER", code: "", box: 1, cost: 2.92 },
    { item: "STUFF TOYS", code: "", box: 25, cost: 10.43 },
  ],
  "INGREDIENTS": [
    { item: "COPERTURA AL GUSTO DI CIOCC FONDENTE 2 / 5.5kg", code: "", box: 11, sub: 5.5, unit: "kg", cost: 19.64 },
    { item: "FIORDIAMARENA x 2 / 3kg", code: "", box: 6, sub: 3, unit: "kg", cost: 13.39 },
    { item: "FIORDIBOSCO x 2 / 3 kg", code: "", box: 6, sub: 3, unit: "kg", cost: 17.6 },
    { item: "FIORDIMARACUJA x2 / 3kg", code: "", box: 6, sub: 3, unit: "kg", cost: 20.65 },
    { item: "FROLLINI COOKIES BLACK x 4 / 1kg", code: "", box: 4, sub: 1, unit: "kg", cost: 14.87 },
    { item: "GRANELLA DI NOCCIOLE x 6 / 2kg", code: "", box: 12, sub: 2, unit: "kg", cost: 38.08 },
    { item: "INSTACRUMBLE 1 / 2.5 kg", code: "", box: 2.5, unit: "kg", cost: 16.73 },
    { item: "Instacrumble Pistacchio Salato gluten free", code: "", box: 2.5, unit: "kg" },
    { item: "ITALIAN WHOLE ROASTED HAZELNUT 6 / 2kg", code: "", box: 12, sub: 2, unit: "kg", cost: 43.62 },
    { item: "MECROCK PLUS x 2 / 5kg", code: "", box: 10, sub: 5, unit: "kg", cost: 17.4 },
    { item: "Morettina Pepita x 5.5kg", code: "", sub: 5.5, unit: "kg" },
    { item: "PISTACCHIO GRAINS 6 / 1 kg", code: "", box: 6, sub: 1, unit: "kg", cost: 93.87 },
    { item: "QUELLA DI NOCCIOLE x 2 / 6kg", code: "", box: 12, sub: 6, unit: "kg", cost: 38.08 },
    { item: "QUELLA PISTACCHIO x 2 / 6kg", code: "", box: 12, sub: 6, unit: "kg", cost: 28.75 },
    { item: "QUELLA PISTACCHIO CRUNCHY 2 / 2.3 kg", code: "", box: 4.6, sub: 2.3, unit: "kg", cost: 25.74 },
    { item: "QUELLO (Caramel) x 2 / 6 kg", code: "", box: 12, sub: 6, unit: "kg", cost: 13.77 },
    { item: "VARIEGATO DUBAI CHOCOLATE x 1 / 5.5 kg", code: "", sub: 5.5, unit: "kg", cost: 30.91 },
    { item: "VARIEGATO LIMETTA X 6 / 1.5kg", code: "", box: 9, sub: 1.5, unit: "kg", cost: 19.33 },
    { item: "CANOLA OIL PAN", code: "", box: 0.22, unit: "kg", cost: 18.63 },
    { item: "COCOA POWDER 22-24 22.68kg", code: "", box: 22.68, unit: "kg", cost: 11.23 },
    { item: "SEMI SWEET CHOCOLATE 56% 2/10kg", code: "", box: 20, sub: 10, unit: "kg", cost: 12.97 },
    { item: "GIRARDELLI CARAMEL", code: "", box: 0.45, unit: "kg", cost: 13.08 },
    { item: "GIRARDELLI CHOCOLATE", code: "", box: 0.45, unit: "kg", cost: 13.08 },
    { item: "DULCE DE LECHE CLASSIC", code: "", box: 4.8, sub: 0.4, unit: "kg", cost: 8.36 },
    { item: "SHREDDED COCONUT", code: "", box: 11.33, unit: "kg", cost: 14.3 },
  ],
  "ALFAJORES": [
    { item: "ALFAJOR SEMISWEET CHOCOLATE", code: "", box: 60, cost: 2.05 },
    { item: "ALFAJOR DARK 70% CHOCOLATE", code: "", box: 60, cost: 2.1 },
    { item: "ALFAJOR WHITE CHOCOLATE", code: "", box: 60, cost: 2.15 },
    { item: "ALFAJOR WHITE CHOCOLATE WITH WALNUT", code: "", box: 60, cost: 2.85 },
    { item: "ALFAJOR BAGS", code: "", box: 250 },
    { item: "BOX OF 6 ALFAJOR SEMIWEET CHOCOLATE", code: "", box: 125, cost: 1.69 },
    { item: "BOX OF 6 ALFAJOR DARK 70% CHOCOLATE", code: "", box: 125, cost: 1.69 },
    { item: "BOX OF 6 ALFAJOR WHITE CHOCOLATE", code: "", box: 125, cost: 1.69 },
    { item: "BOX OF 6 ALFAJOR WHITE CHOCOLATE WITH WALNUT", code: "", box: 125, cost: 1.69 },
    { item: "BOX OF 6 ALFAJOR MIXED", code: "", box: 125, cost: 1.69 },
    { item: "BOX OF 6 ALFAJOR SORTED", code: "", box: 125, cost: 1.69 },
    { item: "BOX OF 10 ALFAJOR MIXED", code: "", box: 100, cost: 2.49 },
    { item: "BOX OF 10 ALFAJOR SORTED", code: "", box: 100, cost: 2.49 },
  ],
  "ICE POPS": [
    { item: "CHOCOLATE & DULCE DE LECHE", code: "", sub: 30, cost: 2.98 },
    { item: "CHOCOLATE 72%", code: "", box: 40, sub: 30, cost: 3.11 },
    { item: "COOKIES & CREAM", code: "", sub: 30, cost: 3.23 },
    { item: "CRISPY CHOCOLATE", code: "", box: 40, sub: 30, cost: 3.1 },
    { item: "CRISPY DULCE DE LECHE", code: "", box: 40, sub: 30, cost: 3.09 },
    { item: "DARK DOUBLE CHOCOLATE", code: "", box: 40, sub: 30, cost: 3.31 },
    { item: "DULCE DE LECHE & DULCE DE LECHE", code: "", sub: 30, cost: 3 },
    { item: "ENZO - DULCE DE LECHE & GIANDUIA", code: "", sub: 25, cost: 3.01 },
    { item: "HAZELNUT & CHOCOLATE", code: "", sub: 30, cost: 3.08 },
    { item: "KING NERO", code: "", sub: 25, cost: 3.31 },
    { item: "LEMON", code: "", box: 40, sub: 30, cost: 2.6 },
    { item: "MASCARPONE & BERRIES", code: "", sub: 30, cost: 3.34 },
    { item: "MINION - KING & WHITE CHOCOLATE", code: "", box: 30, sub: 25, cost: 3.17 },
    { item: "OLI KING", code: "", box: 30, sub: 25, cost: 3.22 },
    { item: "PASSION FRUIT", code: "", box: 40, sub: 30, cost: 2.87 },
    { item: "PASSION FRUIT & COCONUT", code: "", sub: 25, cost: 3.15 },
    { item: "PISTACCHIO", code: "", box: 40, sub: 30, cost: 3.4 },
    { item: "SMILE KING", code: "", sub: 25, cost: 3.27 },
    { item: "SORBET PATAGONIA", code: "", sub: 25, cost: 3.11 },
    { item: "STRAWBERRY", code: "", box: 40, sub: 30, cost: 2.66 },
    { item: "STRAWBERRY & WHIPPED CREAM", code: "", box: 30, sub: 25, cost: 2.66 },
    { item: "TANGERINE", code: "", box: 40, sub: 30, cost: 2.66 },
    { item: "TONIO - COOKIES & CREAM", code: "", box: 30, sub: 25, cost: 3.17 },
    { item: "WHIPPED CREAM & CRISPY CHOCOLATE", code: "", box: 40, sub: 30, cost: 3.14 },
    { item: "WHITE DOUBLE CHOCOLATE", code: "", box: 40, sub: 30, cost: 3.09 },
    { item: "MANGO", code: "", box: 40, cost: 2.66 },
    { item: "COOKIES & CREAM DIPPED", code: "", box: 40, sub: 30 },
    { item: "DULCE DE LECHE & COOKIES", code: "", box: 40, sub: 30 },
    { item: "CHOCOLATE LUCCIANO'S & HAZELNUT", code: "", box: 40, sub: 30 },
    { item: "MILK CHOCOLATE 0% SUGAR ADDED", code: "", box: 40, sub: 30 },
    { item: "PASSION FRUIT CHEESECAKE", code: "", box: 40, sub: 30 },
  ],
  "GELATO": [
    { item: "BANANA SPLIT", code: "", unit: "kg", cost: 14.77 },
    { item: "CARAMELIZED POP CORN", code: "", unit: "kg", cost: 14.31 },
    { item: "CHERRY VANILLA", code: "", unit: "kg", cost: 14.24 },
    { item: "CHOCOLATE DUBAI", code: "", unit: "kg", cost: 16.1 },
    { item: "COCO ROCK", code: "", unit: "kg", cost: 15.32 },
    { item: "COOKIES & CREAM", code: "", unit: "kg", cost: 15.26 },
    { item: "DARK CHOCOLATE SORBET 81%", code: "", unit: "kg", cost: 15.96 },
    { item: "DULCE DE LECHE", code: "", unit: "kg", cost: 15.47 },
    { item: "DULCE DE LECHE WITH BROWNIE", code: "", unit: "kg", cost: 16.1 },
    { item: "DULCE DE LECHE WITH STRACCIATELLA", code: "", unit: "kg", cost: 15.93 },
    { item: "HAZELNUT CHOCOLATE 0% ADDED SUGAR", code: "", unit: "kg", cost: 16.1 },
    { item: "HAZELNUT CREAM CHOCOLATE", code: "", unit: "kg", cost: 15.89 },
    { item: "KING BIANCO", code: "", unit: "kg", cost: 16.63 },
    { item: "KING NERO", code: "", unit: "kg", cost: 17.83 },
    { item: "LEMON PIE", code: "", unit: "kg", cost: 15.25 },
    { item: "LIME", code: "", unit: "kg", cost: 16.09 },
    { item: "LUCCIANO'S SIGNATURE CHOCOLATE", code: "", unit: "kg", cost: 17.05 },
    { item: "MANGO", code: "", unit: "kg", cost: 16.66 },
    { item: "MASCARPONE & BERRIES", code: "", unit: "kg", cost: 15.04 },
    { item: "MINT & CHOCOLATE", code: "", unit: "kg", cost: 14.38 },
    { item: "PASSION FRUIT", code: "", unit: "kg", cost: 17.39 },
    { item: "PASSION FRUIT CHEESECAKE", code: "", unit: "kg", cost: 15.27 },
    { item: "PISTACCHIO", code: "", unit: "kg", cost: 20.67 },
    { item: "RASPBERRY CHOCOLATE", code: "", unit: "kg", cost: 16.1 },
    { item: "STRAWBERRY", code: "", unit: "kg", cost: 14.98 },
    { item: "TIRAMISU", code: "", unit: "kg", cost: 13.52 },
    { item: "VANILLA", code: "", unit: "kg", cost: 16.1 },
    { item: "WHITE CHOCOLATE PISTACCHIO CRUNCH", code: "", unit: "kg", cost: 15.33 },
    { item: "WHITE GIANDUIA & SALTED CARAMEL", code: "", unit: "kg", cost: 15.84 },
    { item: "GIANDUIA CHOCOLATE SLAB", code: "", unit: "kg", cost: 31.2 },
    { item: "GIANDUIOTTO", code: "", unit: "kg" },
    { item: "NOCCIOLA SUPREMA", code: "", unit: "kg" },
    { item: "PISTACCHIO CHEESECAKE", code: "", unit: "kg" },
    { item: "TIRAMISU PISTACCHIO", code: "", unit: "kg" },
  ],
  "Todos": [],
  "Agregar Producto": [],
};

const STOCK_VENDOR_ORDER = ["PAPER", "COFFEE CORNER", "GRAB & GO", "OTHERS", "INGREDIENTS", "ALFAJORES", "ICE POPS", "GELATO", "Todos", "Agregar Producto"];
const STOCK_REAL_CATEGORIES = ["PAPER", "COFFEE CORNER", "GRAB & GO", "OTHERS", "INGREDIENTS", "ALFAJORES", "ICE POPS", "GELATO"];

const STOCK_VENDOR_LABELS = {
  es: {
    "PAPER": "Papel",
    "COFFEE CORNER": "Rincón Café",
    "GRAB & GO": "Grab & Go",
    "OTHERS": "Otros",
    "INGREDIENTS": "Ingredientes",
    "ALFAJORES": "Alfajores",
    "ICE POPS": "Ice Pops",
    "GELATO": "Gelato",
    "Todos": "Todos",
    "Agregar Producto": "Agregar producto",
  },
  en: {
    "PAPER": "Paper",
    "COFFEE CORNER": "Coffee Corner",
    "GRAB & GO": "Grab & Go",
    "OTHERS": "Others",
    "INGREDIENTS": "Ingredients",
    "ALFAJORES": "Alfajores",
    "ICE POPS": "Ice Pops",
    "GELATO": "Gelato",
    "Todos": "All",
    "Agregar Producto": "Add product",
  },
};
function getStockVendorLabel(key, lang) {
  return (STOCK_VENDOR_LABELS[lang] && STOCK_VENDOR_LABELS[lang][key]) || key;
}

function getAutoTheme() {
  const hour = new Date().getHours();
  return hour >= 7 && hour < 20 ? "day" : "night";
}

const Analisis = lazy(() => import("./Analisis.jsx"));

const STR = {
  es: {
    homeEyebrow: "Estados Unidos",
    homeTitle: "Gestión de Compras",
    sucursalTitle: "Sucursal",
    sucursalDesc: "Responsable de Sucursal",
    depositoTitle: "Depósito",
    depositoDesc: "Responsable de Compras",
    dbError: (msg) => `No se pudo conectar con la planilla de Google. (${msg})`,

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
    errNoDatabase: "Todavía no está conectada la planilla de Google. Pedile a quien administra la app que la configure.",
    warnNotSavedMail: "No se pudo guardar en la planilla. Mandalo por mail desde la pantalla siguiente.",
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
    menuTitle: "¿Qué querés hacer?",
    comprasTitle: "Compras",
    comprasDesc: "Armar y enviar el pedido semanal",
    stocksTitle: "Stocks",
    stocksDesc: "Hacer un raconto de inventario",
    stockSubtitle: "Raconto de inventario",
    stockCountLoaded: "ítem contado",
    stockCountsLoaded: "ítems contados",
    stockNoItemsYet: "Todavía no cargaste ningún conteo.",
    stockSummary: "Resumen del conteo",
    sendCount: "Enviar conteo",
    stockSent: "Conteo enviado",
    stockConfirmSub: (s) => `El conteo de stock de ${s} está listo. Mandalo por mail para que llegue al depósito.`,
    newCount: "Hacer otro conteo",
    backToMenu: "Volver al menú",

    orderSubtitle: "Pedido semanal de stock",
    copyLast: "Copiar último pedido",
    clearBtn: "Borrar",
    searchPlaceholder: (v) => `Buscar en ${v}...`,
    recurring: "Recurrentes",
    restOfProducts: "Resto de productos",
    noMatch: (s) => `No hay productos que coincidan con "${s}".`,
    customItemPlaceholder: "Nombre del producto",
    addItem: "Agregar",
    noCustomItemsYet: "Todavía no agregaste ningún producto libre.",
    newProductCategory: "Categoría",
    newProductName: "Nombre del producto nuevo",
    confirmAddTitle: "¿Confirmás agregar este producto?",
    confirmAddBody: (name, cat) => `Vas a agregar "${name}" en la categoría "${cat}". Va a quedar disponible para esta sucursal y para las otras que usan Stocks.`,
    confirmAddOk: "Sí, agregar producto",
    qtyPlaceholder: "cant.",
    stockBoxes: "Cajas",
    stockPacks: "Paquetes",
    stockLoose: "Sueltas",
    stockLooseKg: "Kg",
    stockQty: "Cantidad",
    stockTotal: "Total",
    stockBoxShort: "Caja x",
    stockPackShort: "Paq. x",
    stockPrev: "Antes",
    stockPacksShort: "Paq.",
    wasteSubtitle: "Desperdicio",
    wasteBannerTitle: "Cargá lo que se desperdició",
    wasteBannerSub: (n) => `El conteo de stock (${n} ${n === 1 ? "producto" : "productos"}) ya está guardado acá. Cargá solo lo tirado o vencido y enviá todo junto.`,
    wasteNone: "Sin desperdicio cargado",
    nWasted: (n) => `${n} ${n === 1 ? "producto con desperdicio" : "productos con desperdicio"}`,
    sendWithWaste: "Enviar todo",
    confirmContinue: "Continuar",
    confirmSendWasteBody: (n, w) => `Vas a enviar el conteo (${n} ${n === 1 ? "producto" : "productos"})${w ? ` y el desperdicio (${w} ${w === 1 ? "producto" : "productos"})` : " sin desperdicio"}.`,
    askWasteTitle: "¿Hubo desperdicio?",
    askWasteBody: "Si se tiró o venció algo desde el último conteo, cargalo ahora y se envía junto con el stock.",
    askWasteYes: "Sí, cargar desperdicio",
    askWasteNo: "No, enviar conteo",
    wasteReasonPh: "Motivo (opcional): vencido, se cayó, mal estado…",
    wasteTitle: "Desperdicio",
    wasteUnits: "Unidades",
    tareTitle: "Peso de la vaschetta vacía",
    tareSub: "Se descuenta de cada pesada. Dejalo en 0 si ya pesás el helado neto.",
    tareShort: "tara",
    tapToWeigh: "Tocá para pesar las vaschettas",
    nPans: (n) => `${n} vaschetta${n === 1 ? "" : "s"}`,
    panN: (n) => `Vaschetta ${n}`,
    panHint: "Pesá la primera vaschetta y se habilita la siguiente.",
    removePan: "Quitar vaschetta",
    nCounted: (n) => `${n} ${n === 1 ? "producto contado" : "productos contados"}`,
    nInOrder: (n) => `${n} ${n === 1 ? "producto en el pedido" : "productos en el pedido"}`,
    excelBtn: "Descargar / compartir Excel",
    excelDownload: "Descargar Excel",
    analisisTitle: "Análisis",
    delStockBtn: "Eliminar este conteo",
    histOpen: "Importar conteos históricos",
    histTitle: "Importar conteos históricos",
    histSub: "Elegí el archivo .json con los conteos armados a partir de las planillas Excel. Si un mes ya estaba importado, se reemplaza.",
    histBadFile: "El archivo no tiene el formato esperado.",
    histImport: (n) => `Importar ${n} ${n === 1 ? "conteo" : "conteos"}`,
    histImporting: "Importando…",
    histDone: (n) => `Listo: ${n} ${n === 1 ? "conteo importado" : "conteos importados"}.`,
    histError: "No se pudo importar. Probá de nuevo.",
    histWaste: "con desperdicio",
    histClose: "Cerrar",
    delConfirmTitle: "¿Eliminar el conteo?",
    delConfirmBody: (s, d) => `Vas a eliminar el conteo de ${s} del ${d}. Deja de aparecer en la app, en el Excel y en el Análisis.`,
    delConfirmYes: "Sí, eliminar",
    delPassTitle: "Confirmá con tu contraseña",
    delPassBody: "Para eliminar, ingresá la contraseña del usuario del Depósito.",
    delFinal: "Eliminar",
    delDeleting: "Eliminando…",
    delNeedPassword: "Ingresá la contraseña.",
    delWrongPassword: "Contraseña incorrecta.",
    delError: "No se pudo eliminar. Probá de nuevo.",
    stockDeleted: "Conteo eliminado.",
    excelWorking: "Armando el Excel…",
    excelDone: "Excel listo",
    excelError: "No se pudo generar el Excel. Probá de nuevo.",
    excelHint: (m) => `En el celular se abre el menú para compartir: elegí Mail y mandalo a ${m}. Si preferís, también podés pegar la tabla en el mail:`,

    orderSummary: "Resumen del pedido",
    itemLoaded: "ítem cargado",
    itemsLoaded: "ítems cargados",
    noItemsYet: "Todavía no cargaste productos.",
    notesLabel: "Notas para depósito (opcional)",
    notesPlaceholder: "Ej: urgente para el finde, entregar antes del jueves...",
    sending: "Enviando...",
    submitOrder: "Enviar pedido",
    confirmSendTitle: "¿Confirmás el envío?",
    confirmSendBody: (n) => `Vas a enviar un pedido con ${n} ${n === 1 ? "ítem" : "ítems"}. Una vez enviado, depósito ya lo puede ver.`,
    confirmSendCancel: "Cancelar",
    confirmSendOk: "Sí, enviar pedido",
    confirmSendStockTitle: "¿Confirmás el envío del conteo?",
    confirmSendStockBody: (n) => `Vas a enviar un conteo con ${n} ${n === 1 ? "ítem" : "ítems"}. Una vez enviado, depósito ya lo puede ver.`,
    confirmSendStockOk: "Sí, enviar conteo",
    viewPrevious: "Ver pedidos anteriores",
    errNoQty: "Todavía no hay pedidos anteriores para copiar.",
    copiedLast: "Cargamos las cantidades del último pedido.",
    useAsBase: "Usar este pedido como base",
    replicatedOrder: "Cargamos los productos de ese pedido.",
    errNoQtyToSubmit: "Cargá al menos una cantidad antes de enviar.",
    errCouldNotSave: "No se pudo guardar el pedido. Probá de nuevo.",
    errCouldNotSaveStock: "No se pudo guardar el conteo. Probá de nuevo.",
    errCouldNotUpdateStatus: "No se pudo actualizar el estado.",
    errCouldNotRestore: "No se pudo restaurar el backup.",

    orderSent: "Pedido enviado",
    depositoCanSee: (s) => `Depósito ya puede ver el pedido de ${s}.`,
    orderReadyMail: (s) => `El pedido de ${s} está listo. Mandalo por mail para que llegue al depósito.`,
    alsoByMail: (email) => "Para mandarlo también por mail a ",
    stepCopyTable: 'Apretá "Copiar tabla con formato" abajo.',
    stepOpenMail: (email) => `Abrí un mail nuevo a ${email} y pegalo con `,
    stepSameFormat: "Va a quedar con el mismo formato de tabla que le mandamos siempre a los proveedores.",
    stockStepSameFormat: "Va a quedar con el mismo formato de tabla que usamos para el conteo de depósito.",
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
    byCount: "Por conteo",
    byProduct: "Por producto",
    loadingStocks: "Cargando stocks...",
    noStocksMatchFilter: "No hay conteos de stock que coincidan con el filtro.",
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
    dbError: (msg) => `Could not connect to the Google Sheet. (${msg})`,

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
    errNoDatabase: "The Google Sheet isn't connected yet. Ask the app admin to set it up.",
    warnNotSavedMail: "Couldn't save to the sheet. Send it by email from the next screen.",
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
    menuTitle: "What do you want to do?",
    comprasTitle: "Orders",
    comprasDesc: "Build and send the weekly order",
    stocksTitle: "Stock count",
    stocksDesc: "Do an inventory count",
    stockSubtitle: "Inventory count",
    stockCountLoaded: "item counted",
    stockCountsLoaded: "items counted",
    stockNoItemsYet: "You haven't loaded any counts yet.",
    stockSummary: "Count summary",
    sendCount: "Send count",
    stockSent: "Count sent",
    stockConfirmSub: (s) => `${s}'s stock count is ready. Email it so it reaches the warehouse.`,
    newCount: "Do another count",
    backToMenu: "Back to menu",

    orderSubtitle: "Weekly stock order",
    copyLast: "Copy last order",
    clearBtn: "Clear",
    searchPlaceholder: (v) => `Search in ${v}...`,
    recurring: "Recurring",
    restOfProducts: "Rest of products",
    noMatch: (s) => `No products match "${s}".`,
    customItemPlaceholder: "Product name",
    addItem: "Add",
    noCustomItemsYet: "You haven't added any custom products yet.",
    newProductCategory: "Category",
    newProductName: "New product name",
    confirmAddTitle: "Confirm adding this product?",
    confirmAddBody: (name, cat) => `You're about to add "${name}" to the "${cat}" category. It will become available for this branch and the other ones using Stock count.`,
    confirmAddOk: "Yes, add product",
    qtyPlaceholder: "qty.",
    stockBoxes: "Boxes",
    stockPacks: "Packs",
    stockLoose: "Loose",
    stockLooseKg: "Kg",
    stockQty: "Quantity",
    stockTotal: "Total",
    stockBoxShort: "Box x",
    stockPackShort: "Pack x",
    stockPrev: "Before",
    stockPacksShort: "Pack",
    wasteSubtitle: "Waste",
    wasteBannerTitle: "Enter what was wasted",
    wasteBannerSub: (n) => `The stock count (${n} ${n === 1 ? "product" : "products"}) is kept here. Enter only what was thrown away or expired and send everything together.`,
    wasteNone: "No waste entered",
    nWasted: (n) => `${n} ${n === 1 ? "product with waste" : "products with waste"}`,
    sendWithWaste: "Send all",
    confirmContinue: "Continue",
    confirmSendWasteBody: (n, w) => `You're sending the count (${n} ${n === 1 ? "product" : "products"})${w ? ` and waste (${w} ${w === 1 ? "product" : "products"})` : " with no waste"}.`,
    askWasteTitle: "Was there any waste?",
    askWasteBody: "If anything was thrown away or expired since the last count, enter it now and it's sent with the stock.",
    askWasteYes: "Yes, enter waste",
    askWasteNo: "No, send count",
    wasteReasonPh: "Reason (optional): expired, dropped, spoiled…",
    wasteTitle: "Waste",
    wasteUnits: "Units",
    tareTitle: "Empty pan weight",
    tareSub: "Subtracted from each weighing. Leave 0 if you already weigh net gelato.",
    tareShort: "tare",
    tapToWeigh: "Tap to weigh the pans",
    nPans: (n) => `${n} pan${n === 1 ? "" : "s"}`,
    panN: (n) => `Pan ${n}`,
    panHint: "Weigh the first pan and the next one opens.",
    removePan: "Remove pan",
    nCounted: (n) => `${n} ${n === 1 ? "product counted" : "products counted"}`,
    nInOrder: (n) => `${n} ${n === 1 ? "product in the order" : "products in the order"}`,
    excelBtn: "Download / share Excel",
    excelDownload: "Download Excel",
    analisisTitle: "Analysis",
    delStockBtn: "Delete this count",
    histOpen: "Import past counts",
    histTitle: "Import past counts",
    histSub: "Pick the .json file with the counts built from the Excel sheets. A month already imported is replaced.",
    histBadFile: "The file doesn't have the expected format.",
    histImport: (n) => `Import ${n} ${n === 1 ? "count" : "counts"}`,
    histImporting: "Importing…",
    histDone: (n) => `Done: ${n} ${n === 1 ? "count imported" : "counts imported"}.`,
    histError: "Couldn't import. Try again.",
    histWaste: "with waste",
    histClose: "Close",
    delConfirmTitle: "Delete the count?",
    delConfirmBody: (s, d) => `You're deleting ${s}'s count from ${d}. It will no longer show in the app, the Excel or the Analysis.`,
    delConfirmYes: "Yes, delete",
    delPassTitle: "Confirm with your password",
    delPassBody: "To delete, enter the Depósito user's password.",
    delFinal: "Delete",
    delDeleting: "Deleting…",
    delNeedPassword: "Enter the password.",
    delWrongPassword: "Wrong password.",
    delError: "Couldn't delete. Try again.",
    stockDeleted: "Count deleted.",
    excelWorking: "Building the Excel…",
    excelDone: "Excel ready",
    excelError: "Couldn't build the Excel. Try again.",
    excelHint: (m) => `On a phone the share menu opens: pick Mail and send it to ${m}. You can also paste the table into the email:`,

    orderSummary: "Order summary",
    itemLoaded: "item loaded",
    itemsLoaded: "items loaded",
    noItemsYet: "You haven't loaded any products yet.",
    notesLabel: "Notes for warehouse (optional)",
    notesPlaceholder: "E.g.: urgent for the weekend, deliver before Thursday...",
    sending: "Sending...",
    submitOrder: "Send order",
    confirmSendTitle: "Confirm sending?",
    confirmSendBody: (n) => `You're about to send an order with ${n} ${n === 1 ? "item" : "items"}. Once sent, the warehouse can already see it.`,
    confirmSendCancel: "Cancel",
    confirmSendOk: "Yes, send order",
    confirmSendStockTitle: "Confirm sending the count?",
    confirmSendStockBody: (n) => `You're about to send a count with ${n} ${n === 1 ? "item" : "items"}. Once sent, the warehouse can already see it.`,
    confirmSendStockOk: "Yes, send count",
    viewPrevious: "View previous orders",
    errNoQty: "There are no previous orders to copy yet.",
    copiedLast: "We loaded the quantities from the last order.",
    useAsBase: "Use this order as a base",
    replicatedOrder: "We loaded that order's products.",
    errNoQtyToSubmit: "Load at least one quantity before sending.",
    errCouldNotSave: "Couldn't save the order. Try again.",
    errCouldNotSaveStock: "Couldn't save the count. Try again.",
    errCouldNotUpdateStatus: "Couldn't update the status.",
    errCouldNotRestore: "Couldn't restore the backup.",

    orderSent: "Order sent",
    depositoCanSee: (s) => `Warehouse can now see ${s}'s order.`,
    orderReadyMail: (s) => `${s}'s order is ready. Email it so it reaches the warehouse.`,
    alsoByMail: (email) => "To also send it by email to ",
    stepCopyTable: 'Tap "Copy formatted table" below.',
    stepOpenMail: (email) => `Open a new email to ${email} and paste it with `,
    stepSameFormat: "It will keep the same table format we always send to vendors.",
    stockStepSameFormat: "It will keep the same table format we use for the warehouse count.",
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
    byCount: "By count",
    byProduct: "By product",
    loadingStocks: "Loading stocks...",
    noStocksMatchFilter: "No stock counts match the filter.",
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
    "--cream": "#E6D3C2", "--paper": "#F8F1EA", "--paper-2": "#EFE4DA",
    "--plum": "#4A1F2E", "--plum-light": "#6E3347", "--plum-glow": "rgba(74,31,46,0.28)",
    "--gold": "#9C7A3C",
    "--pistachio": "#8CA876", "--pistachio-dark": "#5F7A4C", "--terracotta": "#C9714E",
    "--ok": "#3F6E34", "--ok-bg": "rgba(95,122,76,0.14)",
    "--ink": "#1C1414", "--line": "rgba(28,20,20,0.10)",
    "--muted-strong": "#3A2E2C", "--muted": "#6E625E", "--muted-faint": "#9A8E89",
    "--on-accent": "#FFFFFF",
    "--glass": "rgba(230,211,194,0.82)", "--glass-strong": "rgba(248,241,234,0.88)",
    "--shadow": "0 1px 2px rgba(60,30,20,0.05), 0 10px 28px rgba(60,30,20,0.08)",
    "--shadow-sm": "0 1px 2px rgba(60,30,20,0.05), 0 4px 12px rgba(60,30,20,0.05)",
  },
  night: {
    "--cream": "#121212", "--paper": "#1A1A1A", "--paper-2": "#232323",
    "--plum": "#C7A75F", "--plum-light": "#D6BC7F", "--plum-glow": "rgba(199,167,95,0.22)",
    "--gold": "#C7A75F",
    "--pistachio": "#A9C2B0", "--pistachio-dark": "#8CA895", "--terracotta": "#B98A5A",
    "--ok": "#A9C79A", "--ok-bg": "rgba(169,199,154,0.14)",
    "--ink": "#EDEAE4", "--line": "rgba(255,255,255,0.08)",
    "--muted-strong": "#D6CDBB", "--muted": "#A89E8D", "--muted-faint": "#7D7466",
    "--on-accent": "#1A1409",
    "--glass": "rgba(18,18,18,0.78)", "--glass-strong": "rgba(34,34,34,0.85)",
    "--shadow": "0 1px 2px rgba(0,0,0,0.4), 0 10px 28px rgba(0,0,0,0.35)",
    "--shadow-sm": "0 1px 2px rgba(0,0,0,0.35)",
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

// ── Conteo de stock: cajas / paquetes / sueltas ─────────────────────────
// Igual que la planilla de inventario: TOTAL = cajas × (ud por caja)
// + paquetes × (ud por paquete) + sueltas. Los factores (box / sub) vienen
// de STOCK_VENDORS; los productos sin factor se cargan solo como sueltas.
function sanitizeStockQty(value) {
  let v = String(value).replace(/,/g, ".").replace(/[^\d.]/g, "");
  const dotIndex = v.indexOf(".");
  if (dotIndex !== -1) {
    v = v.slice(0, dotIndex) + "." + v.slice(dotIndex + 1).replace(/\./g, "").slice(0, 3);
  }
  return v;
}
function stockNum(v) {
  const n = parseFloat(String(v ?? "").replace(",", "."));
  return isNaN(n) ? 0 : n;
}
function fmtStockNum(n) {
  return String(Math.round(n * 1000) / 1000);
}
// Gelato: se pesa vaschetta por vaschetta (d.v = ["4.215", "3.870", ...]).
// Si la sucursal cargó el peso de la vaschetta vacía (tara), se descuenta de cada pesada.
function filledPans(d) {
  return (d && Array.isArray(d.v) ? d.v : []).filter((w) => String(w ?? "").trim() !== "");
}
function stockEntryHasValue(d) {
  if (!d) return false;
  if (filledPans(d).length > 0) return true;
  return ["b", "s", "u"].some((f) => d[f] !== undefined && String(d[f]).trim() !== "");
}
function stockEntryTotal(p, d, tare = 0) {
  if (!d) return 0;
  const pans = filledPans(d);
  if (pans.length > 0) {
    const t = stockNum(tare);
    return pans.reduce((acc, w) => acc + Math.max(0, stockNum(w) - t), 0);
  }
  return stockNum(d.b) * (p.box || 0) + stockNum(d.s) * (p.sub || 0) + stockNum(d.u);
}
function isPanProduct(p) {
  return p && p.vendor === "GELATO";
}
function readGelatoTare(sucursal) {
  try { return localStorage.getItem("gelato_tare_" + sucursal) || ""; } catch { return ""; }
}
function writeGelatoTare(sucursal, v) {
  try { localStorage.setItem("gelato_tare_" + sucursal, v); } catch {}
}
function findStockProduct(vendor, item, extraProducts = []) {
  const base = (STOCK_VENDORS[vendor] || []).find((p) => p.item === item);
  if (base) return base;
  const extra = extraProducts.find((e) => e.category === vendor && e.item === item);
  return extra ? { item: extra.item, code: extra.code || "" } : { item, code: "" };
}
function stockItemBreakdown(it) {
  if (it.pans && it.pans.length) {
    return `${it.pans.length} vaschetta${it.pans.length === 1 ? "" : "s"}: ${it.pans.map(fmtStockNum).join(" + ")}${it.tare ? ` (tara ${fmtStockNum(it.tare)} c/u)` : ""}`;
  }
  const parts = [];
  if (it.boxes) parts.push(`${fmtStockNum(it.boxes)} cj`);
  if (it.subs) parts.push(`${fmtStockNum(it.subs)} paq`);
  if (it.units) parts.push(`${fmtStockNum(it.units)}${it.unit ? " " + it.unit : " u"}`);
  return parts.join(" + ");
}
function readLastStock(sucursal) {
  try { return JSON.parse(localStorage.getItem("last_stock_" + sucursal) || "{}"); } catch { return {}; }
}
function writeLastStock(sucursal, items) {
  try {
    const map = {};
    items.forEach((it) => { map[it.vendor + "|" + it.item] = it.quantity; });
    localStorage.setItem("last_stock_" + sucursal, JSON.stringify({ date: new Date().toISOString(), items: map }));
  } catch {}
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

function buildStockMailBody(stockCount, lang = "es") {
  let body = `Raconto de inventario\nSucursal: ${stockCount.sucursal}\nFecha: ${fmtDate(stockCount.date)}\n\n`;
  STOCK_REAL_CATEGORIES.filter((v) => stockCount.items.some((it) => it.vendor === v)).forEach((v) => {
    body += `${getStockVendorLabel(v, lang)}\n`;
    stockCount.items.filter((it) => it.vendor === v).forEach((it) => {
      const br = stockItemBreakdown(it);
      const u = it.unit ? " " + it.unit : "";
      body += `  - ${it.item}: ${it.quantity}${u}${br && (it.boxes || it.subs || (it.pans && it.pans.length)) ? ` (${br})` : ""}\n`;
    });
    body += `\n`;
  });
  if (stockCount.waste && stockCount.waste.length) {
    body += `${lang === "en" ? "WASTE" : "DESPERDICIO"}\n`;
    STOCK_REAL_CATEGORIES.filter((v) => stockCount.waste.some((it) => it.vendor === v)).forEach((v) => {
      body += `${getStockVendorLabel(v, lang)}\n`;
      stockCount.waste.filter((it) => it.vendor === v).forEach((it) => {
        const u = it.unit ? " " + it.unit : "";
        body += `  - ${it.item}: ${it.quantity}${u}${it.reason ? ` — ${it.reason}` : ""}\n`;
      });
      body += `\n`;
    });
  }
  return body;
}

function buildStockHtmlTable(stockCount, lang = "es") {
  const font = "font-family:Arial,Helvetica,sans-serif;font-size:13px;";
  const headerCell = `border:1px solid #000000;padding:6px 14px;font-weight:bold;background:#ffffff;${font}`;
  const headerCellCenter = `${headerCell}text-align:center;`;
  const dataCell = `border:1px solid #000000;padding:6px 14px;background:#d9d9d9;${font}`;
  const dataCellCenter = `${dataCell}text-align:center;`;

  let html = `<div style="${font}color:#000000;">`;
  html += `<p style="margin:0 0 2px;"><strong>Raconto de inventario</strong></p>`;
  html += `<p style="margin:0 0 2px;">Sucursal: ${escapeHtml(stockCount.sucursal)}</p>`;
  html += `<p style="margin:0 0 14px;">Fecha: ${escapeHtml(fmtDate(stockCount.date))}</p>`;

  STOCK_REAL_CATEGORIES.filter((v) => stockCount.items.some((it) => it.vendor === v)).forEach((v) => {
    html += `<p style="margin:0 0 6px;font-weight:bold;">${escapeHtml(getStockVendorLabel(v, lang))}</p>`;
    html += `<table style="border-collapse:collapse;margin-bottom:18px;">`;
    const L = lang === "en" ? ["Item", "Boxes", "Packs", "Loose", "Total"] : ["Item", "Cajas", "Paquetes", "Sueltas", "Total"];
    html += `<tr><td style="${headerCell}">${L[0]}</td>${L.slice(1).map((h) => `<td style="${headerCellCenter}">${h}</td>`).join("")}</tr>`;
    const cell = (n) => (n ? fmtStockNum(n) : "");
    stockCount.items.filter((it) => it.vendor === v).forEach((it) => {
      const hasBreak = it.boxes !== undefined;
      const tot = escapeHtml(it.quantity) + (it.unit ? " " + escapeHtml(it.unit) : "");
      html += `<tr><td style="${dataCell}">${escapeHtml(it.item)}</td>`
        + `<td style="${dataCellCenter}">${hasBreak ? cell(it.boxes) : ""}</td>`
        + `<td style="${dataCellCenter}">${hasBreak ? cell(it.subs) : ""}</td>`
        + `<td style="${dataCellCenter}">${hasBreak ? cell(it.units) : ""}</td>`
        + `<td style="${dataCellCenter}font-weight:bold;">${tot}</td></tr>`;
    });
    html += `</table>`;
  });

  if (stockCount.waste && stockCount.waste.length) {
    html += `<p style="margin:10px 0 8px;font-weight:bold;font-size:15px;color:#B3261E;">${lang === "en" ? "Waste" : "Desperdicio"}</p>`;
    html += `<table style="border-collapse:collapse;margin-bottom:18px;">`;
    const W = lang === "en" ? ["Category", "Item", "Total", "Reason"] : ["Categoría", "Item", "Total", "Motivo"];
    html += `<tr>${W.map((h, i) => `<td style="${i === 2 ? headerCellCenter : headerCell}">${h}</td>`).join("")}</tr>`;
    stockCount.waste.forEach((it) => {
      const tot = escapeHtml(it.quantity) + (it.unit ? " " + escapeHtml(it.unit) : "");
      html += `<tr><td style="${dataCell}">${escapeHtml(getStockVendorLabel(it.vendor, lang))}</td><td style="${dataCell}">${escapeHtml(it.item)}</td>`
        + `<td style="${dataCellCenter}font-weight:bold;">${tot}</td><td style="${dataCell}">${escapeHtml(it.reason || "")}</td></tr>`;
    });
    html += `</table>`;
  }

  html += `</div>`;
  return html;
}

function buildStockMailto(stockCount, lang = "es") {
  const subject = `Raconto de inventario - ${stockCount.sucursal} - ${fmtDate(stockCount.date)}`;
  const body = buildStockMailBody(stockCount, lang);
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
  const [stockActiveVendor, setStockActiveVendor] = useState(STOCK_VENDOR_ORDER[0]);
  const [stockSearch, setStockSearch] = useState("");
  const [stockDraft, setStockDraft] = useState({});
  const [wasteDraft, setWasteDraft] = useState({});
  const [stockStage, setStockStage] = useState("stock"); // "stock" | "waste"
  const [gelatoTare, setGelatoTareState] = useState("");
  useEffect(() => { if (sucursal) setGelatoTareState(readGelatoTare(sucursal)); }, [sucursal]);
  function setGelatoTare(v) {
    setGelatoTareState(v);
    if (sucursal) writeGelatoTare(sucursal, v);
  }
  const [stockSubmitting, setStockSubmitting] = useState(false);
  const [lastStockCount, setLastStockCount] = useState(null);
  const [stockExtraProducts, setStockExtraProducts] = useState([]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [filterSucursal, setFilterSucursal] = useState("Todas");
  const [filterStatus, setFilterStatus] = useState("todas");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [depositoView, setDepositoView] = useState("pedido");
  const [depositoSection, setDepositoSection] = useState("compras");
  const [depositoStockView, setDepositoStockView] = useState("conteo");
  const [stockCounts, setStockCounts] = useState([]);
  const [stockCountsLoading, setStockCountsLoading] = useState(true);
  const [expandedStockCount, setExpandedStockCount] = useState(null);
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

  // El fondo de toda la página (incluida la franja del reloj/batería en iPhone)
  // toma el color del tema, para que arriba no aparezca un degradé blanco o gris.
  useEffect(() => {
    const bg = THEMES[theme]["--cream"];
    document.documentElement.style.backgroundColor = bg;
    document.body.style.backgroundColor = bg;
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "theme-color"; document.head.appendChild(meta); }
    meta.setAttribute("content", bg);
  }, [theme]);

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

  function goBack() {
    switch (screen) {
      case "sucursal-select":
        setScreen("home");
        break;
      case "pin":
        setScreen(pendingRole && pendingRole.key === "Depósito" ? "home" : "sucursal-select");
        break;
      case "sucursal-menu":
        setScreen("sucursal-select");
        break;
      case "order-form":
        setScreen(OWN_SUCURSALES.includes(sucursal) ? "sucursal-menu" : "sucursal-select");
        break;
      case "stock-form":
        if (stockStage === "waste") { setStockStage("stock"); break; }
        setScreen("sucursal-menu");
        break;
      case "sucursal-history":
        setScreen("order-form");
        break;
      case "deposito-auth":
        setScreen("home");
        break;
      case "deposito":
        setScreen("home");
        break;
      default:
        break;
    }
  }

  const touchStartRef = useRef(null);
  const SWIPE_MIN_DISTANCE = 110;
  const SWIPE_MAX_VERTICAL_RATIO = 0.5;
  const SWIPE_MAX_DURATION = 700;

  function handleTouchStart(e) {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, t: Date.now() };
  }

  function handleTouchEnd(e) {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    const dt = Date.now() - start.t;
    if (
      dx > SWIPE_MIN_DISTANCE &&
      Math.abs(dy) < dx * SWIPE_MAX_VERTICAL_RATIO &&
      dt < SWIPE_MAX_DURATION
    ) {
      goBack();
    }
  }
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);
  const [pendingRole, setPendingRole] = useState(null);
  const [pinValue, setPinValue] = useState("");
  const [pinError, setPinError] = useState(false);
  const [depositoSession, setDepositoSession] = useState(() => readSession());
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => { loadOrders(); }, []);

  useEffect(() => { loadStockCounts(); }, []);

  useEffect(() => { loadStockExtraProducts(); }, []);

  function readLocalExtraProducts() {
    try { return JSON.parse(localStorage.getItem("stock_extra_products") || "[]"); } catch { return []; }
  }
  function writeLocalExtraProducts(list) {
    try { localStorage.setItem("stock_extra_products", JSON.stringify(list)); } catch {}
  }

  async function loadStockExtraProducts() {
    const local = readLocalExtraProducts();
    setStockExtraProducts(local);
    if (!apiConfigured()) return;
    try {
      const data = await listRows("stock_extra_products");
      if (data) {
        const seen = new Set(data.map((p) => p.category + "|" + p.item));
        setStockExtraProducts([...data, ...local.filter((p) => !seen.has(p.category + "|" + p.item))]);
      }
    } catch (e) { console.warn("stock_extra_products load skipped:", e); }
  }

  useEffect(() => { unlockScroll(); }, [screen]);

  useEffect(() => { setAuthChecked(true); }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  async function loadOrders() {
    setLoading(true);
    setLoadError(null);
    if (!apiConfigured()) { setOrders([]); setLoading(false); return; }
    try {
      const rows = await listRows("orders");
      setOrders(rows.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (e) {
      console.warn("orders load error:", e);
      setLoadError(String(e.message || e));
      setOrders([]);
    }
    setLoading(false);
  }

  async function loadStockCounts() {
    setStockCountsLoading(true);
    if (apiConfigured()) {
      try {
        const rows = await listRows("stock_counts");
        setStockCounts(rows.filter((r) => !r.deleted).sort((a, b) => new Date(b.date) - new Date(a.date)));
      } catch (e) {
        console.warn("stock_counts load error:", e);
      }
    }
    setStockCountsLoading(false);
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

  function replicateOrder(order) {
    setDraft(() => {
      const next = {};
      order.items.forEach((it) => {
        next[it.vendor + "|" + it.item] = String(it.quantity);
      });
      return next;
    });
    setRecentOrder(order.items.map((it) => it.vendor + "|" + it.item));
    setToast({ type: "success", text: STR[lang].replicatedOrder });
    setScreen("order-form");
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
    // El pedido siempre se puede mandar por mail desde la confirmación;
    // guardarlo en la planilla es lo que permite que el Depósito lo vea en la app.
    setSubmitting(true);
    if (apiConfigured()) {
      try { await insertRow("orders", newOrder); }
      catch (e) {
        console.warn("orders insert error:", e);
        setToast({ type: "error", text: STR[lang].warnNotSavedMail });
      }
    }
    setSubmitting(false);
    setOrders((prev) => [newOrder, ...prev]);
    setDraft({});
    setRecentOrder([]);
    setNotes("");
    setLastOrder(newOrder);
    setScreen("sucursal-confirm");
  }

  function setStockQty(vendor, item, field, value) {
    const key = vendor + "|" + item;
    setStockDraft((d) => ({ ...d, [key]: { ...(d[key] || {}), [field]: value } }));
  }
  function setWasteQty(vendor, item, field, value) {
    const key = vendor + "|" + item;
    setWasteDraft((d) => ({ ...d, [key]: { ...(d[key] || {}), [field]: value } }));
  }

  async function addStockProduct(category, itemName) {
    const newProduct = {
      id: (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()),
      category,
      item: itemName,
      code: "",
    };
    // Se guarda en el dispositivo; si la base de datos responde, también ahí.
    writeLocalExtraProducts([...readLocalExtraProducts(), newProduct]);
    setStockExtraProducts((prev) => [...prev, newProduct]);
    if (apiConfigured()) {
      try { await insertRow("stock_extra_products", newProduct); }
      catch (e) { console.warn("stock_extra_products insert skipped:", e); }
    }
    return true;
  }

  function draftToItems(draft) {
    const items = [];
    Object.entries(draft).forEach(([key, d]) => {
      if (!stockEntryHasValue(d)) return;
      const sep = key.indexOf("|");
      const vendor = key.slice(0, sep);
      const itemName = key.slice(sep + 1);
      const p = findStockProduct(vendor, itemName, stockExtraProducts);
      const pans = filledPans(d).map(stockNum);
      const total = stockEntryTotal(p, d, gelatoTare);
      items.push({
        vendor, item: itemName, code: p.code || "",
        boxes: pans.length ? 0 : stockNum(d.b), subs: pans.length ? 0 : stockNum(d.s), units: pans.length ? total : stockNum(d.u),
        perBox: p.box || null, perSub: p.sub || null, unit: p.unit || "",
        ...(pans.length ? { pans, tare: stockNum(gelatoTare) } : {}),
        total, quantity: fmtStockNum(total),
        ...(d.r && String(d.r).trim() ? { reason: String(d.r).trim() } : {}),
      });
    });
    return items;
  }

  async function submitStockCount() {
    const items = draftToItems(stockDraft);
    const waste = draftToItems(wasteDraft);
    if (items.length === 0) {
      setToast({ type: "error", text: STR[lang].errNoQtyToSubmit });
      return;
    }
    const newCount = {
      id: (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()),
      sucursal,
      date: new Date().toISOString(),
      items,
      ...(waste.length ? { waste } : {}),
    };
    // El raconto se envía por mail desde la pantalla de confirmación.
    // Guardarlo en la base de datos es opcional: si falla, se sigue igual.
    setStockSubmitting(true);
    if (apiConfigured()) {
      try { await insertRow("stock_counts", newCount); }
      catch (e) {
        console.warn("stock_counts insert skipped:", e);
        setToast({ type: "error", text: STR[lang].warnNotSavedMail });
      }
    }
    setStockSubmitting(false);
    const previous = readLastStock(sucursal);
    writeLastStock(sucursal, items);
    setStockDraft({});
    setWasteDraft({});
    setStockStage("stock");
    setStockCounts((prev) => [newCount, ...prev]);
    setLastStockCount({ ...newCount, prev: previous.items || {}, prevDate: previous.date || null });
    setScreen("stock-confirm");
  }

  // Importar conteos históricos (archivo .json armado a partir de las planillas Excel).
  async function importStockCounts(rows) {
    try {
      await upsertRows("stock_counts", rows, depositoSession || {});
    } catch (e) {
      console.warn("stock_counts import error:", e);
      return false;
    }
    await loadStockCounts();
    return true;
  }

  // Borrar un conteo desde el Depósito: pide de nuevo la clave. Se marca como
  // eliminado en la planilla (queda el registro con fecha de baja) y desaparece de la app.
  async function deleteStockCount(id, password) {
    const email = depositoSession?.email || "";
    const ok = await apiLogin(email, password);
    if (!ok) return "wrong-password";
    try {
      await updateRow("stock_counts", id, { deleted: true, deleted_at: new Date().toISOString() }, { email, password });
    } catch (e) {
      console.warn("stock_counts delete error:", e);
      return "error";
    }
    setStockCounts((prev) => prev.filter((c) => c.id !== id));
    setToast({ type: "success", text: STR[lang].stockDeleted });
    return "ok";
  }

  async function updateStatus(orderId, status) {
    const patch = { status };
    if (status === "cancelado") patch.canceled_at = new Date().toISOString();
    let error = null;
    try { await updateRow("orders", orderId, patch, depositoSession || {}); }
    catch (e) { error = e; console.warn("orders update error:", e); }
    if (error) {
      setToast({ type: "error", text: STR[lang].errCouldNotUpdateStatus });
      return;
    }
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, ...patch } : o)));
  }

  async function importOrders(importedOrders) {
    let error = null;
    try { await upsertRows("orders", importedOrders, depositoSession || {}); }
    catch (e) { error = e; console.warn("orders upsert error:", e); }
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

  const depositoStockCounts = useMemo(() => {
    return stockCounts
      .filter((c) => filterSucursal === "Todas" || c.sucursal === filterSucursal)
      .filter((c) => {
        if (!filterDateFrom) return true;
        const countTime = new Date(c.date).getTime();
        const from = new Date(`${filterDateFrom}T00:00:00`).getTime();
        const toDay = filterDateTo || filterDateFrom;
        const to = new Date(`${toDay}T23:59:59`).getTime();
        return countTime >= from && countTime <= to;
      });
  }, [stockCounts, filterSucursal, filterDateFrom, filterDateTo]);

  return (
    <div style={{ ...styles.page, ...THEMES[theme] }} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <style>{`
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        body { margin: 0; background: var(--cream); }
        input, textarea, select, button { font-family: inherit; }
        input, textarea { transition: border-color .15s, box-shadow .15s, background .15s; }
        input:focus, textarea:focus { outline: none; border-color: var(--plum) !important; box-shadow: 0 0 0 4px var(--plum-glow); background: var(--paper); }
        button:focus-visible { outline: 2px solid var(--plum); outline-offset: 2px; }
        button { transition: transform .12s ease, box-shadow .2s ease, background-color .2s ease, opacity .2s; }
        button:active:not(:disabled) { transform: scale(0.97); }
        button:disabled { opacity: .45; cursor: default; box-shadow: none !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes sheetUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }

        .chips::-webkit-scrollbar { display: none; }
        .role-card > svg:first-child { grid-row: span 2; width: 52px; height: 52px; padding: 13px; border-radius: 16px; background: var(--paper-2); color: var(--plum); }
        .role-card::after { content: "›"; grid-column: 3; grid-row: 1 / span 2; font-size: 26px; line-height: 1; color: var(--muted-faint); }
        .role-card:hover { box-shadow: 0 2px 4px rgba(0,0,0,.06), 0 16px 36px rgba(60,30,20,.12); }
        .branch-card { transition: transform .2s ease, box-shadow .2s ease; }
        .branch-card:hover { transform: translateY(-2px); }
        .mobile-cta { display: none !important; }
        @media (min-width: 761px) { .chips { flex-wrap: wrap !important; margin: 0 0 12px !important; padding: 0 !important; overflow: visible !important; } }
        @media (max-width: 760px) {
          .mobile-cta { display: flex !important; }
          .modal-overlay { align-items: flex-end !important; padding: 10px !important; }
          .modal-box { border-radius: 26px !important; padding-bottom: calc(24px + env(safe-area-inset-bottom, 0px)) !important; }
        }
        ::placeholder { color: var(--muted-faint); }
        html, body { overscroll-behavior: none; }
        .no-scroll-screen { touch-action: none; overscroll-behavior: none; }

        .order-layout { display: grid; grid-template-columns: 1fr 320px; gap: 24px; align-items: start; }
        .order-ticket { position: sticky; top: 90px; }
        .order-layout > * { min-width: 0; }
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
        <SucursalSelect onBack={goBack} onPick={(s) => requestPin(s, OWN_SUCURSALES.includes(s) ? "sucursal-menu" : "order-form")} theme={theme} onToggleTheme={toggleTheme} lang={lang} onToggleLang={toggleLang} />
      )}

      {screen === "pin" && pendingRole && (
        <PinScreen
          roleKey={pendingRole.key}
          value={pinValue}
          setValue={setPinValue}
          error={pinError}
          onSubmit={checkPin}
          onBack={goBack}
          lang={lang}
        />
      )}

      {screen === "sucursal-menu" && (
        <SucursalMenu
          sucursal={sucursal}
          onBack={goBack}
          onCompras={() => setScreen("order-form")}
          onStocks={() => setScreen("stock-form")}
          theme={theme}
          onToggleTheme={toggleTheme}
          lang={lang}
          onToggleLang={toggleLang}
        />
      )}

      {screen === "order-form" && (
        <OrderForm
          sucursal={sucursal}
          onBack={goBack}
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

      {screen === "stock-form" && (
        <StockForm
          sucursal={sucursal}
          onBack={goBack}
          activeVendor={stockActiveVendor}
          setActiveVendor={setStockActiveVendor}
          search={stockSearch}
          setSearch={setStockSearch}
          draft={stockStage === "waste" ? wasteDraft : stockDraft}
          setQty={stockStage === "waste" ? setWasteQty : setStockQty}
          mode={stockStage}
          stockCountN={Object.values(stockDraft).filter(stockEntryHasValue).length}
          onStartWaste={() => { setStockStage("waste"); setStockActiveVendor(STOCK_VENDOR_ORDER[0]); setStockSearch(""); window.scrollTo(0, 0); }}
          gelatoTare={gelatoTare}
          setGelatoTare={setGelatoTare}
          onSubmit={submitStockCount}
          submitting={stockSubmitting}
          extraProducts={stockExtraProducts}
          onAddProduct={addStockProduct}
          theme={theme}
          onToggleTheme={toggleTheme}
          lang={lang}
          onToggleLang={toggleLang}
        />
      )}

      {screen === "stock-confirm" && (
        <StockConfirm
          sucursal={sucursal}
          lastStockCount={lastStockCount}
          onNewCount={() => setScreen("stock-form")}
          onMenu={() => setScreen("sucursal-menu")}
          onHome={() => { setSucursal(null); setScreen("home"); }}
          extraProducts={stockExtraProducts}
          lang={lang}
        />
      )}

      {screen === "sucursal-history" && (
        <SucursalHistory
          sucursal={sucursal}
          orders={mySucursalOrders}
          loading={loading}
          onBack={goBack}
          expandedOrder={expandedOrder}
          setExpandedOrder={setExpandedOrder}
          theme={theme}
          onToggleTheme={toggleTheme}
          updateStatus={updateStatus}
          onReplicateOrder={replicateOrder}
          lang={lang}
          onToggleLang={toggleLang}
        />
      )}

      {screen === "deposito-auth" && (
        <DepositoAuth
          onBack={goBack}
          onSuccess={(session) => { setDepositoSession(session); loadOrders(); loadStockCounts(); setScreen("deposito"); }}
          lang={lang}
        />
      )}

      {screen === "deposito" && (
        <Deposito
          onBack={goBack}
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
          depositoSection={depositoSection}
          setDepositoSection={setDepositoSection}
          depositoStockView={depositoStockView}
          setDepositoStockView={setDepositoStockView}
          stockCounts={depositoStockCounts}
          allStockCounts={stockCounts}
          stockExtraProducts={stockExtraProducts}
          stockCountsLoading={stockCountsLoading}
          expandedStockCount={expandedStockCount}
          setExpandedStockCount={setExpandedStockCount}
          expandedOrder={expandedOrder}
          setExpandedOrder={setExpandedOrder}
          updateStatus={updateStatus}
          onImportOrders={importOrders}
          onDeleteStockCount={deleteStockCount}
          onImportStockCounts={importStockCounts}
          userEmail={depositoSession?.email}
          onLogout={() => { clearSession(); setDepositoSession(null); setScreen("home"); }}
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
          <button className="role-card" style={styles.roleCard} onClick={onSucursal}>
            <Store size={26} strokeWidth={1.7} />
            <div style={styles.roleTitle}>{t.sucursalTitle}</div>
            <div style={styles.roleDesc}>{t.sucursalDesc}</div>
          </button>
          <button className="role-card" style={styles.roleCard} onClick={onDeposito}>
            <ClipboardList size={26} strokeWidth={1.7} />
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => () => unlockScroll(), []);

  async function handleSubmit() {
    setError(null);
    if (!email.trim() || !password.trim()) { setError(t.errNeedBoth); return; }
    if (!apiConfigured()) { setError(t.errNoDatabase); return; }
    setLoading(true);
    const ok = await apiLogin(email.trim(), password);
    setLoading(false);
    if (!ok) { setError(t.errWrongCredentials); return; }
    const session = { email: email.trim().toLowerCase(), password };
    saveSession(session);
    onSuccess(session);
  }

  return (
    <div style={styles.center}>
      <Lock size={36} color="var(--plum)" strokeWidth={1.5} />
      <div style={styles.eyebrow}>{t.authEyebrow}</div>
      <h1 style={styles.h1}>{t.loginTitle}</h1>
      <p style={styles.sub}>{t.loginSub}</p>
      <div style={{ width: "100%", maxWidth: 320, marginTop: 20 }}>
        <input type="email" placeholder={t.emailPlaceholder} style={styles.authInput} value={email}
          onChange={(e) => setEmail(e.target.value)} onFocus={lockScroll} onBlur={unlockScroll} autoComplete="username" />
        <input type="password" placeholder={t.passwordPlaceholder} style={styles.authInput} value={password}
          onChange={(e) => setPassword(e.target.value)} onFocus={lockScroll} onBlur={unlockScroll} autoComplete="current-password"
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }} />
      </div>
      {error && <div style={{ color: "var(--terracotta)", fontSize: 13, marginTop: 10, fontWeight: 600, maxWidth: 320 }}>{error}</div>}
      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button style={styles.secondaryBtn} onClick={onBack}>{t.back}</button>
        <button style={styles.primaryBtnSm} onClick={handleSubmit} disabled={loading}>
          {loading ? t.loadingWait : t.loginBtn}
        </button>
      </div>
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
          {SUCURSALES.filter((s) => !HIDDEN_SUCURSALES.includes(s)).map((s) => (
            <button
              key={s}
              className="branch-card"
              style={{
                ...styles.branchCard,
                backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%), url(${import.meta.env.BASE_URL}branches/${SUCURSAL_PHOTOS[s]})`,
              }}
              onClick={() => onPick(s)}
            >
              <span style={styles.branchCardName}>{s}</span>
              <span style={styles.branchCardGo}><ChevronRight size={18} /></span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SucursalMenu({ sucursal, onBack, onCompras, onStocks, theme, onToggleTheme, lang, onToggleLang }) {
  const t = STR[lang];
  return (
    <div style={styles.wrap}>
      <TopBar onBack={onBack} title={sucursal} subtitle={t.menuTitle} theme={theme} onToggleTheme={onToggleTheme} lang={lang} onToggleLang={onToggleLang} />
      <div style={{ ...styles.roleGrid, marginTop: 8, maxWidth: 520 }}>
        <button className="role-card" style={styles.roleCard} onClick={onCompras}>
          <Package size={26} strokeWidth={1.7} />
          <div style={styles.roleTitle}>{t.comprasTitle}</div>
          <div style={styles.roleDesc}>{t.comprasDesc}</div>
        </button>
        <button className="role-card" style={styles.roleCard} onClick={onStocks}>
          <ClipboardList size={26} strokeWidth={1.7} />
          <div style={styles.roleTitle}>{t.stocksTitle}</div>
          <div style={styles.roleDesc}>{t.stocksDesc}</div>
        </button>
      </div>
    </div>
  );
}

function ItemRow({ p, activeVendor, draft, setQty, lang, onFocusItem, onBlurItem, vendorOverride, showVendorTag }) {
  const vendor = vendorOverride || activeVendor;
  const key = vendor + "|" + p.item;
  return (
    <div style={styles.itemRow}>
      <div style={styles.itemInfo}>
        <div style={styles.itemName}>{p.item}</div>
        <div style={styles.itemCode}>{showVendorTag ? [p.code, vendor].filter(Boolean).join(" · ") : p.code}</div>
      </div>
      <input
        className="qtyInput"
        style={styles.qtyInput}
        placeholder={STR[lang].qtyPlaceholder}
        inputMode="decimal"
        value={draft[key] || ""}
        onChange={(e) => setQty(vendor, p.item, sanitizeQty(e.target.value))}
        onFocus={() => onFocusItem(key)}
        onBlur={() => onBlurItem()}
        onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
      />
    </div>
  );
}

function OrderForm({ sucursal, onBack, onViewHistory, activeVendor, setActiveVendor, search, setSearch, draft, setQty, draftCount, notes, setNotes, onSubmit, submitting, theme, onToggleTheme, onCopyLastOrder, onClearDraft, recentOrder, pastOrders, lang, onToggleLang }) {
  const t = STR[lang];
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedKey, setFocusedKey] = useState(null);
  const frozenHadValueRef = useRef(false);

  function handleFocusItem(key) {
    frozenHadValueRef.current = !!(draft[key] && draft[key].trim() !== "");
    setFocusedKey(key);
  }
  function handleBlurItem() {
    setFocusedKey(null);
  }

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

  const allItemsFlat = useMemo(() => {
    const flat = [];
    VENDOR_ORDER.filter((v) => v !== "Todos").forEach((v) => {
      VENDORS[v].forEach((p) => flat.push({ ...p, vendor: v }));
    });
    return flat;
  }, []);

  const isTodos = activeVendor === "Todos";
  const sourceItems = isTodos ? allItemsFlat : filteredItems.map((p) => ({ ...p, vendor: activeVendor }));
  const searchedItems = isTodos
    ? sourceItems.filter((p) =>
        p.item.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase())
      )
    : sourceItems;

  const withQty = [];
  const recurrent = [];
  const rest = [];
  searchedItems.forEach((p) => {
    const key = p.vendor + "|" + p.item;
    const liveHasValue = !!(draft[key] && draft[key].trim() !== "");
    const hasValue = key === focusedKey ? frozenHadValueRef.current : liveHasValue;
    if (hasValue) {
      withQty.push(p);
    } else if (!isTodos && (itemFrequency[p.item] || 0) >= 2) {
      recurrent.push(p);
    } else {
      rest.push(p);
    }
  });
  withQty.sort((a, b) => {
    const ra = recentOrder.indexOf(a.vendor + "|" + a.item);
    const rb = recentOrder.indexOf(b.vendor + "|" + b.item);
    return (ra === -1 ? Infinity : ra) - (rb === -1 ? Infinity : rb);
  });
  recurrent.sort((a, b) => (itemFrequency[b.item] || 0) - (itemFrequency[a.item] || 0));

  return (
    <div style={styles.wrap}>
      <TopBar onBack={onBack} title={sucursal} subtitle={t.orderSubtitle} theme={theme} onToggleTheme={onToggleTheme} lang={lang} onToggleLang={onToggleLang} />
      <div className="order-layout" style={styles.formLayout}>
        <div style={styles.formMain}>
          <div style={styles.tabsRow}>
            <div className="chips" style={styles.tabs}>
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
              <ItemRow key={p.vendor + "|" + p.item} p={p} vendorOverride={p.vendor} draft={draft} setQty={setQty} lang={lang} onFocusItem={handleFocusItem} onBlurItem={handleBlurItem} showVendorTag={isTodos} />
            ))}
            {recurrent.length > 0 && <div style={styles.itemSectionLabel}>{t.recurring}</div>}
            {recurrent.map((p) => (
              <ItemRow key={p.vendor + "|" + p.item} p={p} vendorOverride={p.vendor} draft={draft} setQty={setQty} lang={lang} onFocusItem={handleFocusItem} onBlurItem={handleBlurItem} showVendorTag={isTodos} />
            ))}
            {rest.length > 0 && (withQty.length > 0 || recurrent.length > 0) && (
              <div style={styles.itemSectionLabel}>{t.restOfProducts}</div>
            )}
            {rest.map((p) => (
              <ItemRow key={p.vendor + "|" + p.item} p={p} vendorOverride={p.vendor} draft={draft} setQty={setQty} lang={lang} onFocusItem={handleFocusItem} onBlurItem={handleBlurItem} showVendorTag={isTodos} />
            ))}
            {searchedItems.length === 0 && <div style={styles.emptyRow}>{t.noMatch(search)}</div>}
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
          <button style={styles.submitBtn} onClick={() => setShowConfirm(true)} disabled={submitting || draftCount === 0}>
            {submitting ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={16} />}
            {submitting ? t.sending : t.submitOrder}
          </button>
          <button style={styles.historyLink} onClick={onViewHistory}>{t.viewPrevious}</button>
        </div>
      </div>

      <div className="mobile-cta" style={styles.mobileCta}>
        <div style={styles.mobileCtaCount}>{draftCount === 0 ? t.noItemsYet : t.nInOrder(draftCount)}</div>
        <button style={{ ...styles.submitBtn, ...styles.mobileCtaBtn }} onClick={() => setShowConfirm(true)} disabled={submitting || draftCount === 0}>
          {submitting ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={16} />}
          {submitting ? t.sending : t.submitOrder}
        </button>
      </div>

      {showConfirm && (
        <div className="modal-overlay" style={styles.modalOverlay} onClick={() => setShowConfirm(false)}>
          <div className="modal-box" style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>{t.confirmSendTitle}</h2>
            <p style={styles.modalBody}>{t.confirmSendBody(draftCount)}</p>
            <div style={styles.modalActions}>
              <button style={styles.secondaryBtn} onClick={() => setShowConfirm(false)}>{t.confirmSendCancel}</button>
              <button
                style={{ ...styles.submitBtn, width: "auto", padding: "10px 18px" }}
                onClick={() => { setShowConfirm(false); onSubmit(); }}
                disabled={submitting}
              >
                {t.confirmSendOk}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PanRow({ p, d, setQty, lang, onFocusItem, onBlurItem, showVendorTag, prev, tare, open, setOpen, mode }) {
  const t = STR[lang];
  const key = p.vendor + "|" + p.item;
  const pans = Array.isArray(d.v) ? d.v : [];
  const filled = filledPans(d);
  const firstRef = useRef(null);
  const rowRef = useRef(null);
  const total = stockEntryTotal(p, d, tare);
  // Siempre hay un casillero vacío al final: al completar uno, aparece el siguiente.
  const slots = [...pans];
  while (slots.length > 0 && String(slots[slots.length - 1] ?? "").trim() === "" && String(slots[slots.length - 2] ?? "").trim() === "") slots.pop();
  if (slots.length === 0 || String(slots[slots.length - 1] ?? "").trim() !== "") slots.push("");

  function setPan(i, value) {
    const next = [...slots];
    next[i] = sanitizeStockQty(value);
    setQty(p.vendor, p.item, "v", next);
  }
  function removePan(i) {
    const next = slots.filter((_, idx) => idx !== i);
    setQty(p.vendor, p.item, "v", next);
  }
  function toggle() {
    const willOpen = !open;
    setOpen(willOpen);
    if (willOpen) setTimeout(() => firstRef.current && firstRef.current.focus(), 60);
  }
  const hasPrev = prev !== undefined && prev !== null && prev !== "";
  return (
    <div ref={rowRef} style={{ ...styles.itemRow, flexDirection: "column", alignItems: "stretch", gap: 10, padding: 0 }}>
      <button type="button" onClick={toggle} style={styles.panHead}>
        <div style={{ minWidth: 0, flex: 1, textAlign: "left" }}>
          <div style={styles.itemName}>{p.item}</div>
          <div style={styles.itemCode}>
            {showVendorTag ? getStockVendorLabel(p.vendor, lang) + " · " : ""}
            {filled.length > 0 ? t.nPans(filled.length) : t.tapToWeigh}
            {hasPrev && <span style={{ ...styles.stockPrevTag }}>{t.stockPrev}: {prev} kg</span>}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: filled.length ? "var(--ink)" : "var(--muted-faint)" }}>{fmtStockNum(total)} kg</div>
        </div>
        <ChevronDown size={18} color="var(--muted-faint)" style={{ flexShrink: 0, transition: "transform .2s", transform: open ? "rotate(180deg)" : "none" }} />
      </button>
      {open && (
        <div style={styles.panBody}>
          <div style={styles.panGrid} data-pans>
            {slots.map((w, i) => {
              const isLastEmpty = i === slots.length - 1 && String(w).trim() === "";
              return (
                <div key={i} style={{ ...styles.panCell, ...(isLastEmpty ? styles.panCellNew : {}) }}>
                  <span style={styles.panLabel}>{t.panN(i + 1)}</span>
                  <div style={styles.panInputWrap}>
                    <input
                      ref={i === 0 ? firstRef : undefined}
                      style={{ ...styles.qtyInput, width: "auto", flex: 1, minWidth: 0, background: "var(--paper)" }}
                      inputMode="decimal"
                      placeholder="0,000"
                      value={w}
                      onChange={(e) => setPan(i, e.target.value)}
                      onFocus={(e) => {
                        // Pasar de una vaschetta a otra del mismo sabor no cuenta como "nuevo foco".
                        const grid = rowRef.current && rowRef.current.querySelector("[data-pans]");
                        if (!(e.relatedTarget && grid && grid.contains(e.relatedTarget))) onFocusItem(key);
                      }}
                      onBlur={() => setTimeout(() => {
                        // Si el foco pasó a otra vaschetta del mismo sabor, no reordenar todavía.
                        if (!(rowRef.current && rowRef.current.contains(document.activeElement))) onBlurItem();
                      }, 0)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const inputs = e.currentTarget.closest("[data-pans]")?.querySelectorAll("input");
                          const nextInput = inputs && inputs[i + 1];
                          if (nextInput) nextInput.focus(); else e.currentTarget.blur();
                        }
                      }}
                    />
                    <span style={styles.panUnit}>kg</span>
                  </div>
                  {!isLastEmpty && (
                    <button type="button" aria-label={t.removePan} style={styles.panRemove} onClick={() => removePan(i)}>×</button>
                  )}
                </div>
              );
            })}
          </div>
          <div style={styles.panFooter}>
            <span>{filled.length > 0 ? `${filled.map((w) => fmtStockNum(stockNum(w))).join(" + ")}${stockNum(tare) ? ` − ${t.tareShort} ${fmtStockNum(stockNum(tare))} × ${filled.length}` : ""}` : t.panHint}</span>
            <strong style={{ color: "var(--ink)" }}>{fmtStockNum(total)} kg</strong>
          </div>
          {mode === "waste" && <div style={{ marginTop: 10 }}><WasteReason p={p} d={d} setQty={setQty} lang={lang} /></div>}
        </div>
      )}
    </div>
  );
}

function WasteReason({ p, d, setQty, lang }) {
  const t = STR[lang];
  if (!stockEntryHasValue(d)) return null;
  return (
    <input
      style={{ ...styles.authInput, marginBottom: 0, marginTop: 2, padding: "10px 12px", fontSize: 13 }}
      placeholder={t.wasteReasonPh}
      value={d.r || ""}
      onChange={(e) => setQty(p.vendor, p.item, "r", e.target.value)}
    />
  );
}

function StockItemRow({ p, draft, setQty, lang, onFocusItem, onBlurItem, showVendorTag, prev, tare, openPans, setOpenPans, mode }) {
  const t = STR[lang];
  const key = p.vendor + "|" + p.item;
  const d = draft[key] || {};
  const rowRef = useRef(null);
  const isWaste = mode === "waste";
  // En stock, el gelato se pesa por vaschetta. En desperdicio va directo en kg.
  if (isPanProduct(p) && !isWaste) {
    return <PanRow p={p} d={d} setQty={setQty} lang={lang} onFocusItem={onFocusItem} onBlurItem={onBlurItem} showVendorTag={showVendorTag} prev={prev} tare={tare} mode={mode}
      open={!!(openPans && openPans[key])} setOpen={(v) => setOpenPans && setOpenPans((o) => ({ ...o, [key]: v }))} />;
  }
  const isKg = p.unit === "kg";
  const fields = [];
  if (isWaste) {
    // Desperdicio: siempre en unidades individuales (o kg), sin cajas ni paquetes.
    fields.push({ f: "u", label: isKg ? t.stockLooseKg : t.wasteUnits, hint: "" });
  } else {
    if (p.box) fields.push({ f: "b", label: t.stockBoxes, hint: `×${p.box}` });
    if (p.sub) fields.push({ f: "s", label: t.stockPacksShort, hint: `×${p.sub}` });
    fields.push({ f: "u", label: isKg ? t.stockLooseKg : (p.box || p.sub ? t.stockLoose : t.stockQty), hint: "" });
  }
  const total = isWaste ? stockNum(d.u) : stockEntryTotal(p, d);
  const has = stockEntryHasValue(d);
  const meta = [p.code, showVendorTag ? getStockVendorLabel(p.vendor, lang) : null].filter(Boolean).join(" · ");
  const unitLabel = isKg ? " kg" : (isWaste ? " u" : (p.unit ? " " + p.unit : ""));

  // Mientras el foco se mueva entre los casilleros de este mismo producto,
  // el producto no cambia de lugar en la lista (antes saltaba arriba y se perdía).
  function handleFocusCapture(e) {
    if (!(e.relatedTarget && rowRef.current && rowRef.current.contains(e.relatedTarget))) onFocusItem(key);
  }
  function handleBlurCapture() {
    setTimeout(() => {
      if (!(rowRef.current && rowRef.current.contains(document.activeElement))) onBlurItem();
    }, 0);
  }

  return (
    <div ref={rowRef} onFocusCapture={handleFocusCapture} onBlurCapture={handleBlurCapture}
      style={{ ...styles.itemRow, flexDirection: "column", alignItems: "stretch", gap: 8 }}>
      <div style={styles.itemInfo}>
        <div style={styles.itemName}>{p.item}</div>
        {(meta || (prev !== undefined && prev !== null && prev !== "")) && (
          <div style={styles.itemCode}>
            {meta}
            {prev !== undefined && prev !== null && prev !== "" && (
              <span style={{ ...styles.stockPrevTag, marginLeft: meta ? 8 : 0 }}>{t.stockPrev}: {prev}{p.unit ? " " + p.unit : ""}</span>
            )}
          </div>
        )}
      </div>
      <div style={styles.stockFields}>
        {fields.map(({ f, label, hint }, idx) => (
          <label key={f} style={styles.stockField}>
            <span style={styles.stockFieldLabel}>{label}{hint && <span style={styles.stockFieldHint}> {hint}</span>}</span>
            <input
              className="qtyInput"
              style={{ ...styles.qtyInput, width: "100%", boxSizing: "border-box" }}
              placeholder="0"
              inputMode="decimal"
              enterKeyHint={idx < fields.length - 1 ? "next" : "done"}
              value={d[f] || ""}
              onChange={(e) => setQty(p.vendor, p.item, f, sanitizeStockQty(e.target.value))}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                const inputs = rowRef.current ? rowRef.current.querySelectorAll("input.qtyInput") : [];
                const next = inputs[idx + 1];
                if (next) next.focus(); else e.target.blur();
              }}
            />
          </label>
        ))}
        <div style={{ ...styles.stockTotal, opacity: has ? 1 : 0.45 }}>
          <span style={styles.stockFieldLabel}>{t.stockTotal}</span>
          <strong>{fmtStockNum(total)}{unitLabel}</strong>
        </div>
      </div>
      {isWaste && <WasteReason p={p} d={d} setQty={setQty} lang={lang} />}
    </div>
  );
}

function StockForm({ sucursal, onBack, activeVendor, setActiveVendor, search, setSearch, draft, setQty, mode = "stock", stockCountN = 0, onStartWaste, gelatoTare = "", setGelatoTare, onSubmit, submitting, extraProducts, onAddProduct, theme, onToggleTheme, lang, onToggleLang }) {
  const t = STR[lang];
  const [focusedKey, setFocusedKey] = useState(null);
  const frozenHadValueRef = useRef(false);
  const [newCategory, setNewCategory] = useState(STOCK_REAL_CATEGORIES[0]);
  const [newItemName, setNewItemName] = useState("");
  const [showAddConfirm, setShowAddConfirm] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [askWaste, setAskWaste] = useState(false);
  const isWaste = mode === "waste";

  const lastStock = useMemo(() => readLastStock(sucursal), [sucursal]);
  const [openPans, setOpenPans] = useState({});

  function handleFocusItem(key) {
    frozenHadValueRef.current = stockEntryHasValue(draft[key]);
    setFocusedKey(key);
  }
  function handleBlurItem() {
    setFocusedKey(null);
  }

  function getCategoryItems(cat) {
    const extras = extraProducts.filter((e) => e.category === cat).map((e) => ({ item: e.item, code: e.code || "" }));
    return [...STOCK_VENDORS[cat], ...extras];
  }

  const isTodos = activeVendor === "Todos";
  const isAddTab = activeVendor === "Agregar Producto";

  const allItemsFlat = useMemo(() => {
    const flat = [];
    STOCK_REAL_CATEGORIES.forEach((cat) => {
      getCategoryItems(cat).forEach((p) => flat.push({ ...p, vendor: cat }));
    });
    return flat;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extraProducts]);

  const draftCount = Object.values(draft).filter(stockEntryHasValue).length;

  let sourceItems = [];
  if (isTodos) {
    sourceItems = allItemsFlat.filter((p) =>
      p.item.toLowerCase().includes(search.toLowerCase())
    );
  } else if (!isAddTab) {
    sourceItems = getCategoryItems(activeVendor)
      .filter((p) => p.item.toLowerCase().includes(search.toLowerCase()))
      .map((p) => ({ ...p, vendor: activeVendor }));
  }

  // El orden de la lista (cargados arriba) se calcula una sola vez al entrar a
  // cada solapa o búsqueda. Mientras se carga, nada cambia de lugar: así no se
  // pierde el producto al pasar de un casillero a otro (en iPhone sobre todo).
  const orderSnapRef = useRef({ key: null, filled: new Set() });
  const snapKey = mode + "|" + activeVendor + "|" + search;
  if (orderSnapRef.current.key !== snapKey) {
    orderSnapRef.current = {
      key: snapKey,
      filled: new Set(Object.keys(draft).filter((k) => stockEntryHasValue(draft[k]))),
    };
  }
  const withQty = [];
  const rest = [];
  sourceItems.forEach((p) => {
    const key = p.vendor + "|" + p.item;
    if (orderSnapRef.current.filled.has(key)) withQty.push(p);
    else rest.push(p);
  });

  async function handleConfirmAdd() {
    setAddingProduct(true);
    const ok = await onAddProduct(newCategory, newItemName.trim());
    setAddingProduct(false);
    setShowAddConfirm(false);
    if (ok) {
      setNewItemName("");
    }
  }

  return (
    <div style={styles.wrap}>
      <TopBar onBack={onBack} title={sucursal} subtitle={isWaste ? t.wasteSubtitle : t.stockSubtitle} theme={theme} onToggleTheme={onToggleTheme} lang={lang} onToggleLang={onToggleLang} />
      {isWaste && (
        <div style={styles.wasteBanner}>
          <Trash2 size={20} style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700 }}>{t.wasteBannerTitle}</div>
            <div style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>{t.wasteBannerSub(stockCountN)}</div>
          </div>
        </div>
      )}
      <div className="order-layout" style={styles.formLayout}>
        <div style={styles.formMain}>
          <div className="chips" style={styles.tabs}>
            {STOCK_VENDOR_ORDER.map((v) => (
              <button
                key={v}
                onClick={() => { setActiveVendor(v); setSearch(""); }}
                style={{ ...styles.tab, ...(activeVendor === v ? styles.tabActive : {}) }}
              >
                {getStockVendorLabel(v, lang)}
              </button>
            ))}
          </div>

          {isAddTab ? (
            <div style={styles.itemList}>
              <div style={{ padding: 18 }}>
                <label style={styles.notesLabel}>{t.newProductCategory}</label>
                <select
                  style={{ ...styles.select, width: "100%", marginBottom: 14 }}
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  {STOCK_REAL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{getStockVendorLabel(cat, lang)}</option>
                  ))}
                </select>
                <label style={styles.notesLabel}>{t.newProductName}</label>
                <input
                  style={styles.authInput}
                  placeholder={t.customItemPlaceholder}
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
                <button
                  style={{ ...styles.customEntryAddBtn, width: "100%", justifyContent: "center", display: "flex", marginTop: 6 }}
                  onClick={() => setShowAddConfirm(true)}
                  disabled={!newItemName.trim()}
                >
                  {t.addItem}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={styles.searchBox}>
                <Search size={16} color="var(--muted-faint)" />
                <input
                  style={styles.searchInput}
                  placeholder={t.searchPlaceholder(getStockVendorLabel(activeVendor, lang))}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {activeVendor === "GELATO" && !isWaste && (
                <div style={styles.tareCard}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={styles.tareTitle}>{t.tareTitle}</div>
                    <div style={styles.tareSub}>{t.tareSub}</div>
                  </div>
                  <div style={styles.panInputWrap}>
                    <input
                      style={{ ...styles.qtyInput, width: 86 }}
                      inputMode="decimal"
                      placeholder="0"
                      value={gelatoTare}
                      onChange={(e) => setGelatoTare && setGelatoTare(sanitizeStockQty(e.target.value))}
                    />
                    <span style={styles.panUnit}>kg</span>
                  </div>
                </div>
              )}
              <div style={styles.itemList}>
                {withQty.map((p) => (
                  <StockItemRow key={p.vendor + "|" + p.item} p={p} tare={gelatoTare} openPans={openPans} setOpenPans={setOpenPans} draft={draft} setQty={setQty} lang={lang} onFocusItem={handleFocusItem} onBlurItem={handleBlurItem} showVendorTag={isTodos} prev={isWaste ? undefined : (lastStock.items && lastStock.items[p.vendor + "|" + p.item])} mode={mode} />
                ))}
                {rest.length > 0 && withQty.length > 0 && <div style={styles.itemSectionLabel}>{t.restOfProducts}</div>}
                {rest.map((p) => (
                  <StockItemRow key={p.vendor + "|" + p.item} p={p} tare={gelatoTare} openPans={openPans} setOpenPans={setOpenPans} draft={draft} setQty={setQty} lang={lang} onFocusItem={handleFocusItem} onBlurItem={handleBlurItem} showVendorTag={isTodos} prev={isWaste ? undefined : (lastStock.items && lastStock.items[p.vendor + "|" + p.item])} mode={mode} />
                ))}
                {sourceItems.length === 0 && <div style={styles.emptyRow}>{t.noMatch(search)}</div>}
              </div>
            </>
          )}
        </div>

        <div className="order-ticket" style={styles.ticket}>
          <div style={styles.ticketHeader}>
            <ClipboardList size={16} color="var(--plum)" />
            <span>{t.stockSummary}</span>
          </div>
          <div style={styles.ticketCount}>{draftCount} {draftCount === 1 ? t.stockCountLoaded : t.stockCountsLoaded}</div>
          <div style={styles.ticketDivider} />
          <div style={styles.ticketItems}>
            {draftCount === 0 && <div style={styles.ticketEmpty}>{t.stockNoItemsYet}</div>}
            {Object.entries(draft).filter(([, d]) => stockEntryHasValue(d)).map(([key, d]) => {
              const sep = key.indexOf("|");
              const itemName = key.slice(sep + 1);
              const prod = findStockProduct(key.slice(0, sep), itemName, extraProducts);
              return (
                <div key={key} style={styles.ticketLine}>
                  <span style={styles.ticketLineName}>{itemName}</span>
                  <span style={styles.ticketLineQty}>{fmtStockNum(stockEntryTotal(prod, d, gelatoTare))}{prod.unit ? " " + prod.unit : ""}</span>
                </div>
              );
            })}
          </div>
          <div style={styles.ticketDivider} />
          <button style={styles.submitBtn} onClick={() => setShowConfirm(true)} disabled={submitting || (!isWaste && draftCount === 0)}>
            {submitting ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={16} />}
            {submitting ? t.sending : isWaste ? t.sendWithWaste : t.sendCount}
          </button>
        </div>
      </div>

      {!isAddTab && (
        <div className="mobile-cta" style={styles.mobileCta}>
          <div style={styles.mobileCtaCount}>{isWaste ? (draftCount === 0 ? t.wasteNone : t.nWasted(draftCount)) : (draftCount === 0 ? t.stockNoItemsYet : t.nCounted(draftCount))}</div>
          <button style={{ ...styles.submitBtn, ...styles.mobileCtaBtn }} onClick={() => setShowConfirm(true)} disabled={submitting || (!isWaste && draftCount === 0)}>
            {submitting ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={16} />}
            {submitting ? t.sending : isWaste ? t.sendWithWaste : t.sendCount}
          </button>
        </div>
      )}

      {showConfirm && (
        <div className="modal-overlay" style={styles.modalOverlay} onClick={() => setShowConfirm(false)}>
          <div className="modal-box" style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>{t.confirmSendStockTitle}</h2>
            <p style={styles.modalBody}>{isWaste ? t.confirmSendWasteBody(stockCountN, draftCount) : t.confirmSendStockBody(draftCount)}</p>
            <div style={styles.modalActions}>
              <button style={styles.secondaryBtn} onClick={() => setShowConfirm(false)}>{t.confirmSendCancel}</button>
              <button
                style={{ ...styles.submitBtn, width: "auto", padding: "10px 18px" }}
                onClick={() => { setShowConfirm(false); if (isWaste) onSubmit(); else setAskWaste(true); }}
                disabled={submitting}
              >
                {isWaste ? t.confirmSendStockOk : t.confirmContinue}
              </button>
            </div>
          </div>
        </div>
      )}

      {askWaste && (
        <div className="modal-overlay" style={styles.modalOverlay} onClick={() => setAskWaste(false)}>
          <div className="modal-box" style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>{t.askWasteTitle}</h2>
            <p style={styles.modalBody}>{t.askWasteBody}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button style={{ ...styles.submitBtn }} onClick={() => { setAskWaste(false); onStartWaste && onStartWaste(); }}>
                <Trash2 size={16} /> {t.askWasteYes}
              </button>
              <button style={{ ...styles.secondaryBtn, width: "100%" }} onClick={() => { setAskWaste(false); onSubmit(); }} disabled={submitting}>
                {t.askWasteNo}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddConfirm && (
        <div className="modal-overlay" style={styles.modalOverlay} onClick={() => setShowAddConfirm(false)}>
          <div className="modal-box" style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>{t.confirmAddTitle}</h2>
            <p style={styles.modalBody}>{t.confirmAddBody(newItemName, getStockVendorLabel(newCategory, lang))}</p>
            <div style={styles.modalActions}>
              <button style={styles.secondaryBtn} onClick={() => setShowAddConfirm(false)}>{t.confirmSendCancel}</button>
              <button
                style={{ ...styles.submitBtn, width: "auto", padding: "10px 18px" }}
                onClick={handleConfirmAdd}
                disabled={addingProduct}
              >
                {addingProduct ? t.loadingWait : t.confirmAddOk}
              </button>
            </div>
          </div>
        </div>
      )}
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
      <p style={styles.sub}>{apiConfigured() ? t.depositoCanSee(sucursal) : t.orderReadyMail(sucursal)}</p>
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

// Arma el Excel de un conteo y lo comparte (celular) o lo descarga (compu).
// Devuelve "done", "cancel" o lanza error.
async function shareOrDownloadStockExcel(stockCount, extraProducts, lang) {
  const { buildStockWorkbook, stockExcelFileName } = await import("./stockExcel.js");
  const catalog = STOCK_REAL_CATEGORIES.map((cat) => ({
    category: cat,
    label: getStockVendorLabel(cat, lang),
    products: [
      ...STOCK_VENDORS[cat],
      ...extraProducts.filter((e) => e.category === cat).map((e) => ({ item: e.item, code: e.code || "" })),
    ],
  }));
  const blob = await buildStockWorkbook(stockCount, catalog, lang);
  const name = stockExcelFileName(stockCount);
  const file = new File([blob], name, { type: blob.type });
  const isTouch = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  if (isTouch && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: name });
      return "done";
    } catch (e) {
      if (e && e.name === "AbortError") return "cancel";
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return "done";
}

// Conteo anterior de la misma sucursal (para las columnas Anterior / Diferencia del Excel).
function withPreviousCount(stockCount, allStockCounts = []) {
  if (stockCount.prev && Object.keys(stockCount.prev).length) return stockCount;
  const t = new Date(stockCount.date).getTime();
  const prev = allStockCounts
    .filter((c) => c.sucursal === stockCount.sucursal && c.id !== stockCount.id && new Date(c.date).getTime() < t)
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  if (!prev) return stockCount;
  const map = {};
  (prev.items || []).forEach((it) => { map[it.vendor + "|" + it.item] = it.quantity; });
  return { ...stockCount, prev: map, prevDate: prev.date };
}

function StockConfirm({ sucursal, lastStockCount, onNewCount, onMenu, onHome, extraProducts = [], lang }) {
  const t = STR[lang];
  const [excelState, setExcelState] = useState("idle"); // idle | working | done | error

  async function handleExcel() {
    if (!lastStockCount) return;
    setExcelState("working");
    try {
      const r = await shareOrDownloadStockExcel(lastStockCount, extraProducts, lang);
      setExcelState(r === "cancel" ? "idle" : "done");
    } catch (e) {
      console.error("excel error:", e);
      setExcelState("error");
    }
  }


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
    if (!lastStockCount) return;
    const html = buildStockHtmlTable(lastStockCount, lang);
    const text = buildStockMailBody(lastStockCount, lang);
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
      <h1 style={styles.h1}>{t.stockSent}</h1>
      <p style={styles.sub}>{t.stockConfirmSub(sucursal)}</p>
      <p style={{ ...styles.sub, fontSize: 13, marginTop: 4 }}>
        {t.alsoByMail(ORDER_EMAIL)}<strong>{ORDER_EMAIL}</strong>:
      </p>
      {lastStockCount && (
        <div style={{ width: "100%", maxWidth: 460, marginTop: 14 }}>
          <button
            onClick={handleExcel}
            disabled={excelState === "working"}
            style={{ ...styles.submitBtn, width: "100%", background: "var(--pistachio-dark)", marginBottom: 6 }}
          >
            {excelState === "working" ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : excelState === "done" ? <CheckCircle2 size={16} /> : <Download size={16} />}
            {excelState === "working" ? t.excelWorking : excelState === "done" ? t.excelDone : excelState === "error" ? t.excelError : t.excelBtn}
          </button>
          <p style={{ fontSize: 12, color: "var(--muted)", margin: "0 0 14px" }}>{t.excelHint(ORDER_EMAIL)}</p>
          <ol style={{ textAlign: "left", fontSize: 13, color: "var(--muted-strong)", paddingLeft: 20, margin: "0 0 12px" }}>
            <li>{t.stepCopyTable}</li>

            <li>{t.stepOpenMail(ORDER_EMAIL)}<strong>Ctrl+V</strong> ({lang === "en" ? "or Cmd+V on Mac" : "o Cmd+V en Mac"}).</li>
            <li>{t.stockStepSameFormat}</li>
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
            {STOCK_REAL_CATEGORIES.filter((v) => lastStockCount.items.some((it) => it.vendor === v)).map((v) => (
              <div key={v} style={{ marginBottom: 14 }}>
                <div style={styles.tablePreviewVendor}>{getStockVendorLabel(v, lang)}</div>
                <table style={styles.tablePreviewTable}>
                  <tbody>
                    <tr>
                      <td style={styles.tablePreviewHeaderCell}>Item</td>
                      <td style={{ ...styles.tablePreviewHeaderCell, textAlign: "center" }}>{t.stockBoxes}</td>
                      <td style={{ ...styles.tablePreviewHeaderCell, textAlign: "center" }}>{t.stockPacks}</td>
                      <td style={{ ...styles.tablePreviewHeaderCell, textAlign: "center" }}>{t.stockLoose}</td>
                      <td style={{ ...styles.tablePreviewHeaderCell, textAlign: "center" }}>{t.stockTotal}</td>
                    </tr>
                    {lastStockCount.items.filter((it) => it.vendor === v).map((it, i) => (
                      <tr key={i}>
                        <td style={styles.tablePreviewDataCell}>{it.item}</td>
                        <td style={{ ...styles.tablePreviewDataCell, textAlign: "center" }}>{it.boxes ? fmtStockNum(it.boxes) : ""}</td>
                        <td style={{ ...styles.tablePreviewDataCell, textAlign: "center" }}>{it.subs ? fmtStockNum(it.subs) : ""}</td>
                        <td style={{ ...styles.tablePreviewDataCell, textAlign: "center" }}>{it.units ? fmtStockNum(it.units) : ""}</td>
                        <td style={{ ...styles.tablePreviewDataCell, textAlign: "center", fontWeight: 700 }}>{it.quantity}{it.unit ? " " + it.unit : ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          {lastStockCount.waste && lastStockCount.waste.length > 0 && (
            <div style={{ ...styles.tablePreviewWrap, marginTop: 4 }}>
              <div style={{ ...styles.tablePreviewVendor, color: "#B3261E", fontSize: 14 }}>{t.wasteTitle}</div>
              <table style={styles.tablePreviewTable}>
                <tbody>
                  <tr>
                    <td style={styles.tablePreviewHeaderCell}>Item</td>
                    <td style={{ ...styles.tablePreviewHeaderCell, textAlign: "center" }}>{t.stockTotal}</td>
                    <td style={styles.tablePreviewHeaderCell}>{lang === "en" ? "Reason" : "Motivo"}</td>
                  </tr>
                  {lastStockCount.waste.map((it, i) => (
                    <tr key={i}>
                      <td style={styles.tablePreviewDataCell}>{it.item}</td>
                      <td style={{ ...styles.tablePreviewDataCell, textAlign: "center", fontWeight: 700 }}>{it.quantity}{it.unit ? " " + it.unit : ""}</td>
                      <td style={styles.tablePreviewDataCell}>{it.reason || ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <details style={{ marginTop: 6 }}>
            <summary style={styles.textLink}>{t.plainTextFallback}</summary>
            <textarea
              ref={textRef}
              readOnly
              value={buildStockMailBody(lastStockCount, lang)}
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

          <a href={buildStockMailto(lastStockCount, lang)} style={{ ...styles.historyLink, display: "block", textAlign: "center" }}>
            {t.openMailApp}
          </a>
        </div>
      )}
      <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap", justifyContent: "center" }}>
        <button style={styles.secondaryBtn} onClick={onMenu}>{t.backToMenu}</button>
        <button style={styles.secondaryBtn} onClick={onNewCount}>{t.newCount}</button>
      </div>
      <button style={styles.textLink} onClick={onHome}>{t.backHome}</button>
    </div>
  );
}

function SucursalHistory({ sucursal, orders, loading, onBack, expandedOrder, setExpandedOrder, theme, onToggleTheme, updateStatus, onReplicateOrder, lang, onToggleLang }) {
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
            onReplicate={() => onReplicateOrder(o)}
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

function Deposito({ onBack, loading, orders, allOrders, filterSucursal, setFilterSucursal, filterStatus, setFilterStatus, filterDateFrom, setFilterDateFrom, filterDateTo, setFilterDateTo, depositoView, setDepositoView, depositoSection, setDepositoSection, depositoStockView, setDepositoStockView, stockCounts, allStockCounts, stockExtraProducts = [], stockCountsLoading, expandedStockCount, setExpandedStockCount, expandedOrder, setExpandedOrder, updateStatus, onImportOrders, onDeleteStockCount, onImportStockCounts, userEmail, onLogout, theme, onToggleTheme, lang, onToggleLang }) {
  const t = STR[lang];
  const pendingCount = allOrders.filter((o) => o.status === "pendiente").length;
  const [showExport, setShowExport] = useState(false);
  const isCompras = depositoSection === "compras";
  const isStocks = depositoSection === "stocks";
  const isAnalisis = depositoSection === "analisis";
  const analysisCatalog = useMemo(() => STOCK_REAL_CATEGORIES.map((cat) => ({
    category: cat,
    label: getStockVendorLabel(cat, lang),
    products: [...STOCK_VENDORS[cat], ...stockExtraProducts.filter((e) => e.category === cat).map((e) => ({ item: e.item }))],
  })), [lang, stockExtraProducts]);

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

  const stockProductSummary = useMemo(() => {
    const map = new Map();
    stockCounts.forEach((c) => {
      c.items.forEach((it) => {
        const key = `${it.vendor}|${it.item}|${it.code || ""}`;
        const qty = parseFloat(String(it.quantity).replace(",", ".")) || 0;
        if (!map.has(key)) {
          map.set(key, { vendor: it.vendor, item: it.item, code: it.code || "", total: 0 });
        }
        map.get(key).total += qty;
      });
    });
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [stockCounts]);

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

      <div style={styles.sectionToggle}>
        <button
          style={{ ...styles.sectionToggleBtn, ...(isCompras ? styles.sectionToggleBtnActive : {}) }}
          onClick={() => setDepositoSection("compras")}
        >
          {t.comprasTitle}
        </button>
        <button
          style={{ ...styles.sectionToggleBtn, ...(isStocks ? styles.sectionToggleBtnActive : {}) }}
          onClick={() => setDepositoSection("stocks")}
        >
          {t.stocksTitle}
        </button>
        <button
          style={{ ...styles.sectionToggleBtn, ...(isAnalisis ? styles.sectionToggleBtnActive : {}) }}
          onClick={() => setDepositoSection("analisis")}
        >
          {t.analisisTitle}
        </button>
      </div>

      {isAnalisis && (
        <Suspense fallback={<div style={styles.emptyRow}>{t.loadingWait}</div>}>
          {stockCountsLoading ? <div style={styles.emptyRow}>{t.loadingStocks}</div> : (
            <Analisis stockCounts={allStockCounts} catalog={analysisCatalog} theme={theme} lang={lang} />
          )}
        </Suspense>
      )}

      {isCompras && (
        <>
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
                      <td style={{ ...styles.productSummaryCell, fontWeight: 700 }}>{p.item}</td>
                      <td style={{ ...styles.productSummaryCell, textAlign: "center", color: "var(--muted-faint)" }}>{p.code}</td>
                      <td style={{ ...styles.productSummaryCell, textAlign: "center" }}>{p.vendor}</td>
                      <td style={{ ...styles.productSummaryCell, textAlign: "right", fontWeight: 700 }}>{p.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {isStocks && (
        <>
          <div style={styles.tabs}>
            <button
              style={{ ...styles.tab, ...(depositoStockView === "conteo" ? styles.tabActive : {}) }}
              onClick={() => setDepositoStockView("conteo")}
            >
              {t.byCount}
            </button>
            <button
              style={{ ...styles.tab, ...(depositoStockView === "producto" ? styles.tabActive : {}) }}
              onClick={() => setDepositoStockView("producto")}
            >
              {t.byProduct}
            </button>
          </div>

          <div style={styles.filters}>
            <select style={styles.select} value={filterSucursal} onChange={(e) => setFilterSucursal(e.target.value)}>
              <option value="Todas">{t.allBranches}</option>
              {SUCURSALES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <DateRangePicker
              from={filterDateFrom}
              to={filterDateTo}
              setFrom={setFilterDateFrom}
              setTo={setFilterDateTo}
              lang={lang}
            />
          </div>

          {onImportStockCounts && <StockImportPanel onImport={onImportStockCounts} lang={lang} />}

          {stockCountsLoading && <div style={styles.emptyRow}>{t.loadingStocks}</div>}
          {!stockCountsLoading && stockCounts.length === 0 && <div style={styles.emptyRow}>{t.noStocksMatchFilter}</div>}

          {!stockCountsLoading && stockCounts.length > 0 && depositoStockView === "conteo" && (
            <div style={styles.orderCards}>
              {stockCounts.map((c) => (
                <StockCountCard
                  key={c.id}
                  stockCount={c}
                  expanded={expandedStockCount === c.id}
                  onToggle={() => setExpandedStockCount(expandedStockCount === c.id ? null : c.id)}
                  allStockCounts={allStockCounts}
                  extraProducts={stockExtraProducts}
                  onDelete={onDeleteStockCount}
                  lang={lang}
                />
              ))}
            </div>
          )}

          {!stockCountsLoading && stockCounts.length > 0 && depositoStockView === "producto" && (
            <div style={styles.productSummaryWrap}>
              <table style={styles.productSummaryTable}>
                <thead>
                  <tr>
                    <th style={styles.productSummaryHeaderCell}>{t.product}</th>
                    <th style={{ ...styles.productSummaryHeaderCell, textAlign: "center" }}>{t.vendor}</th>
                    <th style={{ ...styles.productSummaryHeaderCell, textAlign: "right" }}>{t.totalQty}</th>
                  </tr>
                </thead>
                <tbody>
                  {stockProductSummary.map((p) => (
                    <tr key={`${p.vendor}|${p.item}|${p.code}`}>
                      <td style={{ ...styles.productSummaryCell, fontWeight: 700 }}>{p.item}</td>
                      <td style={{ ...styles.productSummaryCell, textAlign: "center" }}>{getStockVendorLabel(p.vendor, lang)}</td>
                      <td style={{ ...styles.productSummaryCell, textAlign: "right", fontWeight: 700 }}>{p.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
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

function StockImportPanel({ onImport, lang }) {
  const t = STR[lang];
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState(null);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(e) {
    setMsg(null); setRows(null);
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    try {
      const parsed = JSON.parse(await f.text());
      const ok = Array.isArray(parsed) && parsed.length && parsed.every((c) => c && c.id && c.sucursal && c.date && Array.isArray(c.items));
      if (!ok) throw new Error("format");
      setRows(parsed);
    } catch {
      setMsg({ type: "error", text: t.histBadFile });
    }
  }
  async function doImport() {
    setBusy(true);
    const ok = await onImport(rows);
    setBusy(false);
    setMsg(ok ? { type: "ok", text: t.histDone(rows.length) } : { type: "error", text: t.histError });
    if (ok) setRows(null);
  }

  if (!open) {
    return <button style={{ ...styles.secondaryBtn, marginBottom: 14 }} onClick={() => setOpen(true)}>{t.histOpen}</button>;
  }
  return (
    <div style={styles.exportPanel}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{t.histTitle}</div>
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>{t.histSub}</div>
      <input type="file" onChange={handleFile} style={{ fontSize: 13, marginBottom: 12 }} />
      {rows && (
        <div style={{ marginBottom: 12 }}>
          {rows.map((c) => (
            <div key={c.id} style={styles.detailLine}>
              <span><strong>{c.sucursal}</strong> · {fmtDate(c.date, lang)}</span>
              <span style={styles.detailQty}>{c.items.length} {t.items}{c.waste && c.waste.length ? ` · ${c.waste.length} ${t.histWaste}` : ""}</span>
            </div>
          ))}
          <button style={{ ...styles.submitBtn, marginTop: 12 }} onClick={doImport} disabled={busy}>
            {busy ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Download size={16} />}
            {busy ? t.histImporting : t.histImport(rows.length)}
          </button>
        </div>
      )}
      {msg && <div style={{ fontSize: 13, fontWeight: 600, color: msg.type === "ok" ? "var(--ok)" : "#B3261E", marginBottom: 8 }}>{msg.text}</div>}
      <button style={styles.textLink} onClick={() => { setOpen(false); setRows(null); setMsg(null); }}>{t.histClose}</button>
    </div>
  );
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

function OrderCard({ order, expanded, onToggle, showSucursal, actions, allOrders, onCancel, onReplicate, lang = "es" }) {
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
                  <span><strong>{it.item}</strong> <span style={styles.detailCode}>({it.code})</span></span>
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
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            {onReplicate && (
              <button
                style={styles.replicateOrderBtn}
                onClick={(e) => { e.stopPropagation(); onReplicate(); }}
              >
                {t.useAsBase}
              </button>
            )}
            {canCancel && (
              <button style={confirmingCancel ? styles.cancelOrderBtnConfirm : styles.cancelOrderBtn} onClick={handleCancelClick}>
                {confirmingCancel ? t.confirmCancel : t.cancelThisOrder}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StockCountCard({ stockCount, expanded, onToggle, allStockCounts = [], extraProducts = [], onDelete, lang = "es" }) {
  const t = STR[lang];
  const [excelState, setExcelState] = useState("idle");
  const [delStep, setDelStep] = useState(null); // null | "confirm" | "password"
  const [delPass, setDelPass] = useState("");
  const [delError, setDelError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  function closeDelete() { setDelStep(null); setDelPass(""); setDelError(null); }
  async function confirmDelete() {
    if (!delPass) { setDelError(t.delNeedPassword); return; }
    setDeleting(true); setDelError(null);
    const r = await onDelete(stockCount.id, delPass);
    setDeleting(false);
    if (r === "ok") { closeDelete(); return; }
    setDelError(r === "wrong-password" ? t.delWrongPassword : t.delError);
  }
  async function handleExcel(e) {
    e && e.stopPropagation();
    setExcelState("working");
    try {
      const r = await shareOrDownloadStockExcel(withPreviousCount(stockCount, allStockCounts), extraProducts, lang);
      setExcelState(r === "cancel" ? "idle" : "done");
    } catch (err) {
      console.error("excel error:", err);
      setExcelState("error");
    }
  }
  return (
    <div style={styles.orderCard}>
      <button style={styles.orderCardHead} onClick={onToggle}>
        <div>
          <div style={styles.orderCardTitle}>{stockCount.sucursal}</div>
          <div style={styles.orderCardDate}>{fmtDate(stockCount.date, lang)} · {stockCount.items.length} {t.items}</div>
        </div>
        {expanded ? <ChevronUp size={18} color="var(--muted-faint)" /> : <ChevronDown size={18} color="var(--muted-faint)" />}
      </button>
      {expanded && (
        <div style={styles.orderCardBody}>
          <button
            onClick={handleExcel}
            disabled={excelState === "working"}
            style={{ ...styles.submitBtn, background: "var(--pistachio-dark)", margin: "0 0 14px" }}
          >
            {excelState === "working" ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : excelState === "done" ? <CheckCircle2 size={16} /> : <Download size={16} />}
            {excelState === "working" ? t.excelWorking : excelState === "done" ? t.excelDone : excelState === "error" ? t.excelError : t.excelDownload}
          </button>
          {STOCK_REAL_CATEGORIES.filter((v) => stockCount.items.some((it) => it.vendor === v)).map((v) => (
            <div key={v} style={{ marginBottom: 10 }}>
              <div style={styles.vendorLabel}>{getStockVendorLabel(v, lang)}</div>
              {stockCount.items.filter((it) => it.vendor === v).map((it, i) => (
                <div key={i} style={styles.detailLine}>
                  <span><strong>{it.item}</strong>{(it.boxes || it.subs || (it.pans && it.pans.length)) ? <span style={{ color: "var(--muted-faint)", fontSize: 12 }}> · {stockItemBreakdown(it)}</span> : null}</span>
                  <span style={styles.detailQty}>{it.quantity}{it.unit ? " " + it.unit : ""}</span>
                </div>
              ))}
            </div>
          ))}
          {stockCount.waste && stockCount.waste.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ ...styles.vendorLabel, color: "#B3261E" }}>{STR[lang].wasteTitle}</div>
              {stockCount.waste.map((it, i) => (
                <div key={i} style={styles.detailLine}>
                  <span><strong>{it.item}</strong>{it.reason ? <span style={{ color: "var(--muted-faint)", fontSize: 12 }}> · {it.reason}</span> : null}</span>
                  <span style={styles.detailQty}>{it.quantity}{it.unit ? " " + it.unit : ""}</span>
                </div>
              ))}
            </div>
          )}
          {onDelete && (
            <button style={styles.dangerLink} onClick={() => setDelStep("confirm")}>
              <Trash2 size={14} /> {t.delStockBtn}
            </button>
          )}
        </div>
      )}

      {delStep === "confirm" && (
        <div className="modal-overlay" style={styles.modalOverlay} onClick={closeDelete}>
          <div className="modal-box" style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>{t.delConfirmTitle}</h2>
            <p style={styles.modalBody}>{t.delConfirmBody(stockCount.sucursal, fmtDate(stockCount.date, lang))}</p>
            <div style={styles.modalActions}>
              <button style={styles.secondaryBtn} onClick={closeDelete}>{t.confirmSendCancel}</button>
              <button style={{ ...styles.submitBtn, width: "auto", padding: "10px 18px", background: "#B3261E", boxShadow: "none" }} onClick={() => setDelStep("password")}>
                {t.delConfirmYes}
              </button>
            </div>
          </div>
        </div>
      )}

      {delStep === "password" && (
        <div className="modal-overlay" style={styles.modalOverlay} onClick={closeDelete}>
          <div className="modal-box" style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>{t.delPassTitle}</h2>
            <p style={styles.modalBody}>{t.delPassBody}</p>
            <input
              type="password"
              autoFocus
              autoComplete="current-password"
              style={styles.authInput}
              placeholder={t.passwordPlaceholder}
              value={delPass}
              onChange={(e) => setDelPass(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") confirmDelete(); }}
            />
            {delError && <div style={{ color: "#B3261E", fontSize: 13, fontWeight: 600, margin: "0 0 10px" }}>{delError}</div>}
            <div style={styles.modalActions}>
              <button style={styles.secondaryBtn} onClick={closeDelete} disabled={deleting}>{t.confirmSendCancel}</button>
              <button style={{ ...styles.submitBtn, width: "auto", padding: "10px 18px", background: "#B3261E", boxShadow: "none" }} onClick={confirmDelete} disabled={deleting}>
                {deleting ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Trash2 size={16} />}
                {deleting ? t.delDeleting : t.delFinal}
              </button>
            </div>
          </div>
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
  dangerLink: { display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8, padding: "8px 0", background: "none", border: "none", color: "#B3261E", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  wasteBanner: { display: "flex", gap: 12, alignItems: "flex-start", background: "var(--terracotta)", color: "#fff", borderRadius: 18, padding: "14px 16px", marginBottom: 14, boxShadow: "var(--shadow-sm)" },
  tareCard: { display: "flex", alignItems: "center", gap: 14, background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, padding: "14px 16px", marginBottom: 14, boxShadow: "var(--shadow-sm)" },
  tareTitle: { fontSize: 14, fontWeight: 650, color: "var(--ink)" },
  tareSub: { fontSize: 12, color: "var(--muted)", marginTop: 2, lineHeight: 1.35 },
  panHead: { display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "14px 16px", background: "none", border: "none", cursor: "pointer", color: "inherit", font: "inherit" },
  panBody: { padding: "0 16px 16px", animation: "fadeIn .2s ease both" },
  panGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 },
  panCell: { position: "relative", display: "flex", flexDirection: "column", gap: 5, background: "var(--paper-2)", borderRadius: 14, padding: "10px 10px 10px" },
  panCellNew: { background: "transparent", border: "1.5px dashed var(--line)" },
  panLabel: { fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.04em", textTransform: "uppercase" },
  panInputWrap: { display: "flex", alignItems: "center", gap: 6 },
  panUnit: { fontSize: 12, color: "var(--muted)", fontWeight: 600 },
  panRemove: { position: "absolute", top: 4, right: 6, width: 24, height: 24, borderRadius: 999, border: "none", background: "transparent", color: "var(--muted-faint)", fontSize: 18, lineHeight: 1, cursor: "pointer" },
  panFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--line)", fontSize: 12, color: "var(--muted)" },
  page: { minHeight: "100vh", background: "var(--cream)", color: "var(--ink)", fontFamily: "'Inter Variable', 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif", WebkitFontSmoothing: "antialiased" },
  center: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "calc(72px + env(safe-area-inset-top, 0px)) 22px 40px", maxWidth: 520, margin: "0 auto", animation: "fadeIn .3s ease both" },
  homeDark: { minHeight: "100dvh", overflow: "hidden", background: "var(--cream)", display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "calc(84px + env(safe-area-inset-top, 0px)) 22px calc(36px + env(safe-area-inset-bottom, 0px))", position: "relative", animation: "fadeIn .35s ease both" },
  homeToggleGroup: { position: "absolute", top: "calc(18px + env(safe-area-inset-top, 0px))", right: 18, display: "flex", gap: 8, zIndex: 5 },
  homeThemeToggleBtn: { width: 40, height: 40, borderRadius: 12, border: "1px solid var(--line)", background: "var(--glass)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--ink)", fontSize: 12, fontWeight: 700, letterSpacing: "0.04em" },
  homeInner: {
    width: "100%", maxWidth: 520, display: "flex", flexDirection: "column",
    alignItems: "center", textAlign: "center", flex: 1,
  },
  homeLogoImg: { width: 240, height: "auto", marginBottom: 28 },
  homeEyebrow: { fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 700, marginBottom: 10 },
  homeH1: { fontFamily: "'Bodoni Moda Variable', 'Bodoni Moda', Georgia, serif", fontWeight: 800, fontSize: 34, lineHeight: 1.1, margin: "0 0 28px", color: "var(--ink)", letterSpacing: "-0.01em" },
  homeTagline: { fontFamily: "'Bodoni Moda Variable', 'Bodoni Moda', Georgia, serif", fontOpticalSizing: "auto", fontWeight: 900, textTransform: "uppercase", color: "var(--ink)", fontSize: 40, lineHeight: 1.02, letterSpacing: "0.01em", marginTop: "auto", paddingTop: 48, opacity: 0.92 },
  logoImg: { width: 150, height: "auto", marginBottom: 4 },
  eyebrow: { fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 700, margin: "18px 0 8px" },
  h1: { fontFamily: "'Bodoni Moda Variable', 'Bodoni Moda', Georgia, serif", fontWeight: 800, fontSize: 32, lineHeight: 1.1, margin: "0 0 10px", color: "var(--ink)", letterSpacing: "-0.01em" },
  sub: { color: "var(--muted)", fontSize: 15, lineHeight: 1.5, margin: 0 },
  roleGrid: { display: "flex", flexDirection: "column", gap: 12, marginTop: 8, width: "100%" },
  roleCard: { background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 20, padding: "18px 18px", display: "grid", gridTemplateColumns: "52px 1fr 18px", columnGap: 14, rowGap: 2, alignItems: "center", textAlign: "left", cursor: "pointer", boxShadow: "var(--shadow)", width: "100%" },
  roleTitle: { fontWeight: 700, fontSize: 17, color: "var(--ink)", letterSpacing: "-0.01em", alignSelf: "end" },
  roleDesc: { fontSize: 13, color: "var(--muted)", alignSelf: "start", gridColumn: 2 },
  wrap: { maxWidth: 980, margin: "0 auto", padding: "0 20px calc(110px + env(safe-area-inset-bottom, 0px))", animation: "fadeIn .25s ease both" },
  wrapFull: { maxWidth: 980, margin: "0 auto", padding: "28px 24px 0", minHeight: "calc(100vh - 60px)", display: "flex", flexDirection: "column" },
  sucGridWrap: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center" },
  darkWrapScroll: { minHeight: "100vh", background: "var(--cream)", display: "flex", flexDirection: "column", alignItems: "center", padding: "0 20px 40px", width: "100%", animation: "fadeIn .25s ease both" },
  darkInner: { width: "100%", maxWidth: 980 },
  darkTopBar: { display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 20, margin: "0 -20px", padding: "calc(12px + env(safe-area-inset-top, 0px)) 20px 12px", background: "var(--cream)" },
  darkBackBtn: { width: 40, height: 40, borderRadius: 12, border: "1px solid var(--line)", background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, color: "var(--ink)" },
  darkTopTitle: { fontFamily: "'Bodoni Moda Variable', 'Bodoni Moda', Georgia, serif", fontWeight: 800, fontSize: 22, color: "var(--ink)", letterSpacing: "-0.01em" },
  darkLogoWrap: { display: "flex", justifyContent: "center", margin: "56px 0 16px" },
  darkLogoImg: { width: 210, height: "auto" },
  darkLogoWrapSmall: { display: "flex", justifyContent: "center", margin: "18px 0 22px" },
  darkLogoImgSmall: { width: 120, height: "auto" },
  branchList: { display: "flex", flexDirection: "column", gap: 14, paddingBottom: 24 },
  branchCard: { position: "relative", width: "100%", height: 168, borderRadius: 22, border: "none", backgroundSize: "cover", backgroundPosition: "center", cursor: "pointer", display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "18px 20px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.18)" },
  branchCardName: { fontWeight: 800, textTransform: "uppercase", color: "#FFFFFF", fontSize: 22, letterSpacing: "0.06em", textShadow: "0 2px 12px rgba(0,0,0,0.45)", textAlign: "left" },
  topBar: { display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 20, margin: "0 -20px 14px", padding: "calc(12px + env(safe-area-inset-top, 0px)) 20px 12px", background: "var(--cream)", borderBottom: "1px solid var(--line)" },
  backBtn: { width: 40, height: 40, borderRadius: 12, border: "1px solid var(--line)", background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, color: "var(--ink)" },
  themeToggleBtn: { width: 40, height: 40, borderRadius: 12, border: "1px solid var(--line)", background: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, color: "var(--ink)", fontSize: 12, fontWeight: 700, letterSpacing: "0.04em" },
  topTitle: { fontFamily: "'Bodoni Moda Variable', 'Bodoni Moda', Georgia, serif", fontWeight: 800, fontSize: 22, lineHeight: 1.1, color: "var(--ink)", letterSpacing: "-0.01em" },
  topSubtitle: { fontSize: 12, color: "var(--muted)", marginTop: 3, fontWeight: 500 },
  sucGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, width: "100%" },
  sucCard: {
    background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 12,
    padding: "20px 14px", display: "flex", flexDirection: "column", alignItems: "center",
    gap: 8, cursor: "pointer", fontSize: 14, fontWeight: 600, color: "var(--ink)",
  },
  formLayout: {},
  formMain: {},
  sectionToggle: { display: "flex", gap: 6, marginBottom: 18, background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 16, padding: 5, boxShadow: "var(--shadow-sm)" },
  sectionToggleBtn: { flex: 1, padding: "11px 14px", borderRadius: 12, border: "none", background: "transparent", color: "var(--muted-strong)", fontWeight: 650, fontSize: 14, cursor: "pointer" },
  sectionToggleBtnActive: { background: "var(--plum)", color: "var(--on-accent)" },
  tabs: { display: "flex", gap: 8, marginBottom: 12, flexWrap: "nowrap", overflowX: "auto", margin: "0 -20px 12px", padding: "2px 20px 4px", scrollbarWidth: "none" },
  tab: { padding: "9px 16px", borderRadius: 999, border: "1px solid var(--line)", background: "var(--paper)", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "var(--muted-strong)", whiteSpace: "nowrap", flexShrink: 0 },
  tabActive: { background: "var(--plum)", color: "var(--on-accent)", borderColor: "var(--plum)", boxShadow: "0 4px 14px var(--plum-glow)" },
  tabsRow: { display: "flex", flexDirection: "column", alignItems: "stretch", gap: 4, marginBottom: 10 },
  tabsRowActions: { display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center", padding: "0 2px" },
  tabsRowActionBtn: {
    background: "none", border: "none", padding: 0, fontSize: 13, fontWeight: 600,
    color: "var(--pistachio-dark)", cursor: "pointer", textDecoration: "underline",
  },
  tabsRowClearBtn: {
    background: "none", border: "none", padding: 0, fontSize: 13, fontWeight: 600,
    color: "var(--terracotta)", cursor: "pointer", textDecoration: "underline",
  },
  searchBox: { display: "flex", alignItems: "center", gap: 10, background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 14, padding: "12px 14px", marginBottom: 14, boxShadow: "var(--shadow-sm)" },
  searchInput: { border: "none", outline: "none", background: "transparent", fontSize: 15, width: "100%", color: "var(--ink)" },
  customEntryRow: { display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" },
  customEntryInput: {
    flex: 1, minWidth: 160, border: "1.5px solid var(--line)", borderRadius: 10,
    padding: "9px 12px", fontSize: 14, background: "var(--paper)", color: "var(--ink)",
  },
  customEntryAddBtn: { background: "var(--plum)", color: "var(--on-accent)", border: "none", borderRadius: 14, padding: "13px 18px", fontSize: 14, fontWeight: 650, cursor: "pointer", flexShrink: 0 },
  itemList: { background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 20, overflow: "hidden", boxShadow: "var(--shadow)" },
  itemRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid var(--line)", gap: 12 },
  itemInfo: { minWidth: 0 },
  itemName: { fontSize: 14, fontWeight: 650, color: "var(--ink)", lineHeight: 1.3 },
  itemCode: { fontSize: 11, color: "var(--muted-faint)", marginTop: 3, letterSpacing: "0.02em" },
  qtyInput: { width: 84, padding: "10px 10px", borderRadius: 12, border: "1px solid transparent", fontSize: 15, fontWeight: 600, textAlign: "center", flexShrink: 0, background: "var(--paper-2)", color: "var(--ink)" },
  stockFields: { display: "flex", gap: 8, alignItems: "flex-end" },
  stockField: { display: "flex", flexDirection: "column", gap: 5, flex: "1 1 0", minWidth: 0, maxWidth: 120 },
  stockFieldLabel: { fontSize: 11, color: "var(--muted)", fontWeight: 600, letterSpacing: "0.02em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  stockFieldHint: { color: "var(--muted-faint)", fontWeight: 500 },
  stockTotal: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, marginLeft: "auto", fontSize: 16, color: "var(--ink)", minWidth: 72, flexShrink: 0, paddingBottom: 9 },
  stockPrevTag: { marginLeft: 8, padding: "2px 7px", borderRadius: 999, background: "var(--ok-bg)", color: "var(--ok)", fontWeight: 600, whiteSpace: "nowrap" },
  emptyRow: { padding: "24px 16px", color: "var(--muted-faint)", fontSize: 14, textAlign: "center" },
  ticket: { background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 20, padding: 20, boxShadow: "var(--shadow)" },
  ticketHeader: { display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 14, color: "var(--ink)" },
  ticketCount: { fontSize: 12, color: "var(--muted)", marginTop: 4 },
  ticketDivider: { borderTop: "1px solid var(--line)", margin: "14px 0" },
  ticketItems: { maxHeight: 220, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 },
  ticketEmpty: { fontSize: 13, color: "var(--muted-faint)" },
  ticketLine: { display: "flex", justifyContent: "space-between", gap: 8, fontSize: 13 },
  ticketLineName: { color: "var(--ink)", fontWeight: 700 },
  ticketLineQty: { fontWeight: 600, color: "var(--pistachio-dark)", flexShrink: 0 },
  notesLabel: { fontSize: 12, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 6 },
  notesInput: { width: "100%", border: "1px solid transparent", borderRadius: 14, padding: 12, fontSize: 14, resize: "vertical", marginBottom: 14, background: "var(--paper-2)", color: "var(--ink)" },
  authInput: { width: "100%", border: "1px solid transparent", borderRadius: 14, padding: "14px 16px", fontSize: 15, marginBottom: 10, background: "var(--paper-2)", color: "var(--ink)" },
  submitBtn: { width: "100%", background: "var(--plum)", color: "var(--on-accent)", border: "none", borderRadius: 14, padding: "14px 0", fontSize: 15, fontWeight: 650, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", boxShadow: "0 6px 18px var(--plum-glow)" },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(10,6,6,0.45)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20, animation: "fadeIn .2s ease both" },
  modalBox: { background: "var(--paper)", borderRadius: 24, padding: 24, maxWidth: 400, width: "100%", boxShadow: "0 24px 60px rgba(0,0,0,0.3)", animation: "sheetUp .28s cubic-bezier(.2,.8,.2,1) both" },
  modalTitle: { fontFamily: "'Bodoni Moda Variable', 'Bodoni Moda', Georgia, serif", fontWeight: 800, fontSize: 22, color: "var(--ink)", margin: "0 0 10px" },
  modalBody: { fontSize: 14, color: "var(--muted-strong)", margin: "0 0 20px", lineHeight: 1.5 },
  modalActions: { display: "flex", gap: 10, justifyContent: "flex-end" },
  historyLink: {
    width: "100%", background: "none", border: "none", color: "var(--pistachio-dark)",
    fontSize: 13, fontWeight: 600, marginTop: 10, cursor: "pointer", textDecoration: "underline",
  },
  secondaryBtn: { padding: "12px 20px", borderRadius: 14, border: "1px solid var(--line)", background: "var(--paper)", fontSize: 14, fontWeight: 600, cursor: "pointer", color: "var(--ink)" },
  primaryBtnSm: { padding: "12px 22px", borderRadius: 14, border: "none", background: "var(--plum)", color: "var(--on-accent)", fontSize: 14, fontWeight: 650, cursor: "pointer", boxShadow: "0 6px 18px var(--plum-glow)" },
  textLink: { marginTop: 20, background: "none", border: "none", color: "var(--muted)", fontSize: 13, fontWeight: 500, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 },
  orderCards: { display: "flex", flexDirection: "column", gap: 12 },
  orderCard: { background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, overflow: "hidden", boxShadow: "var(--shadow)" },
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
  replicateOrderBtn: {
    marginTop: 14, background: "none", border: "none", padding: 0, fontSize: 13, fontWeight: 600,
    color: "var(--pistachio-dark)", cursor: "pointer", textDecoration: "underline",
  },
  cancelOrderBtnConfirm: {
    marginTop: 14, background: "#B3261E", border: "none", borderRadius: 8, padding: "8px 14px",
    fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer",
  },
  statusPill: { fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 4 },
  orderCardBody: { padding: "0 18px 18px", borderTop: "1px solid var(--line)" },
  vendorLabel: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--pistachio-dark)", margin: "14px 0 6px" },
  itemSectionLabel: { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--gold)", padding: "10px 16px", background: "var(--paper-2)", borderBottom: "1px solid var(--line)" },
  detailLine: { display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", gap: 12 },
  detailCode: { color: "var(--muted-faint)", fontSize: 11 },
  detailQty: { fontWeight: 600, flexShrink: 0 },
  notesBox: { marginTop: 12, padding: 12, background: "var(--cream)", borderRadius: 10, fontSize: 13, color: "var(--muted-strong)" },
  statusBtns: { display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" },
  statusBtn: { padding: "8px 14px", borderRadius: 999, border: "1px solid var(--line)", background: "var(--paper)", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "var(--ink)" },
  filters: { display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" },
  dateRangeWrapper: { position: "relative" },
  dateTrigger: { display: "flex", alignItems: "center", gap: 8, background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 999, padding: "10px 14px", cursor: "pointer" },
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
  select: { padding: "11px 14px", borderRadius: 12, border: "1px solid var(--line)", background: "var(--paper)", fontSize: 14, color: "var(--ink)" },
  toast: { position: "fixed", top: "calc(14px + env(safe-area-inset-top, 0px))", left: "50%", transform: "translateX(-50%)", padding: "12px 18px", borderRadius: 14, fontSize: 13, fontWeight: 600, zIndex: 200, boxShadow: "0 10px 30px rgba(0,0,0,0.18)", animation: "fadeIn .2s ease both" },
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
  productSummaryWrap: { background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, overflow: "hidden", boxShadow: "var(--shadow)" },
  productSummaryTable: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  productSummaryHeaderCell: {
    textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 700, textTransform: "uppercase",
    letterSpacing: "0.04em", color: "var(--muted)", borderBottom: "1px solid var(--line)", background: "var(--cream)",
  },
  productSummaryCell: { padding: "10px 16px", borderBottom: "1px solid var(--line)", color: "var(--ink)" },
  exportPanel: { background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 18, padding: 18, marginBottom: 18, boxShadow: "var(--shadow)" },
  branchCardGo: { width: 36, height: 36, borderRadius: 999, background: "rgba(255,255,255,0.18)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 },
  mobileCta: { position: "fixed", left: 12, right: 12, bottom: "calc(12px + env(safe-area-inset-bottom, 0px))", zIndex: 30, display: "flex", alignItems: "center", gap: 12, padding: "10px 10px 10px 18px", borderRadius: 20, background: "var(--glass-strong)", backdropFilter: "saturate(1.4) blur(18px)", WebkitBackdropFilter: "saturate(1.4) blur(18px)", border: "1px solid var(--line)", boxShadow: "0 12px 34px rgba(0,0,0,0.18)", animation: "sheetUp .3s ease both" },
  mobileCtaCount: { flex: 1, minWidth: 0, fontSize: 13, color: "var(--muted-strong)", fontWeight: 600, lineHeight: 1.25 },
  mobileCtaBtn: { width: "auto", padding: "12px 18px", flexShrink: 0 },
};
