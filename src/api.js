// Conexión con la "base de datos" en Google Sheets (ver google-sheets/Code.gs).
// Se usa Content-Type text/plain para evitar el preflight CORS de Apps Script.
import { SHEETS_URL } from "./config";

export const apiConfigured = () => !!SHEETS_URL;

async function call(payload, { timeoutMs = 20000 } = {}) {
  if (!SHEETS_URL) throw new Error("not-configured");
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(SHEETS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
      redirect: "follow",
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || "error");
    return data;
  } finally {
    clearTimeout(timer);
  }
}

export async function listRows(table) {
  const data = await call({ action: "list", table });
  return data.rows || [];
}

export async function insertRow(table, row) {
  await call({ action: "insert", table, row });
}

export async function updateRow(table, id, patch, auth) {
  await call({ action: "update", table, id, patch, ...auth });
}

export async function upsertRows(table, rows, auth) {
  await call({ action: "upsert", table, rows, ...auth }, { timeoutMs: 60000 });
}

export async function login(email, password) {
  if (!SHEETS_URL) return false;
  try {
    const data = await call({ action: "login", email, password });
    return !!data.ok;
  } catch {
    return false;
  }
}

// Sesión del Depósito guardada en el dispositivo (para no pedir la clave cada vez).
const KEY = "deposito_session";
export function readSession() {
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; }
}
export function saveSession(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
}
export function clearSession() {
  try { localStorage.removeItem(KEY); } catch {}
}

// ── Usuarios de Sucursal ───────────────────────────────────────────────
// El script valida usuario y contraseña y devuelve las sucursales habilitadas.
export async function branchLogin(user, password) {
  if (!SHEETS_URL) return null;
  try {
    const data = await call({ action: "branchLogin", user, password });
    return Array.isArray(data.sucursales) && data.sucursales.length ? data.sucursales : null;
  } catch {
    return null;
  }
}

const BKEY = "sucursal_session";
export function readBranchSession() {
  try { return JSON.parse(localStorage.getItem(BKEY) || "null"); } catch { return null; }
}
export function saveBranchSession(s) {
  try { localStorage.setItem(BKEY, JSON.stringify(s)); } catch {}
}
export function clearBranchSession() {
  try { localStorage.removeItem(BKEY); } catch {}
}

// Eliminar de verdad (fila + detalle). Si el script todavía no tiene esta
// acción, devuelve "unsupported" para que la app use la baja lógica.
export async function deleteRow(table, id, auth) {
  try {
    await call({ action: "delete", table, id, ...auth });
    return "ok";
  } catch (e) {
    if (String(e.message || e).includes("unknown action")) return "unsupported";
    throw e;
  }
}
