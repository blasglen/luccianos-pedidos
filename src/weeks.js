// Semanas de un mes para las entradas de mercadería.
// Regla: semanas de lunes a domingo, cortadas en el cambio de mes (nunca mezclan
// días de dos meses). Si al cortar queda un pedazo de menos de 4 días al
// principio o al final del mes, se suma a la semana de al lado.
// Resultado: siempre 4 o 5 semanas por mes.

const pad = (n) => String(n).padStart(2, "0");

// period "YYYY-MM" → [{ n, from, to, start: "YYYY-MM-DD", end: "YYYY-MM-DD" }]
export function monthWeeks(period) {
  const [y, m] = period.split("-").map(Number);
  const days = new Date(y, m, 0).getDate();
  const chunks = [];
  let from = 1;
  for (let d = 1; d <= days; d++) {
    const dow = new Date(y, m - 1, d).getDay(); // 0 = domingo
    if (dow === 0 || d === days) { chunks.push([from, d]); from = d + 1; }
  }
  if (chunks.length > 1 && chunks[0][1] - chunks[0][0] + 1 < 4) {
    const first = chunks.shift();
    chunks[0][0] = first[0];
  }
  const last = chunks[chunks.length - 1];
  if (chunks.length > 1 && last[1] - last[0] + 1 < 4) {
    chunks.pop();
    chunks[chunks.length - 1][1] = last[1];
  }
  return chunks.map(([a, b], i) => ({
    n: i + 1, from: a, to: b,
    start: `${y}-${pad(m)}-${pad(a)}`, end: `${y}-${pad(m)}-${pad(b)}`,
  }));
}

// Fecha → { period, week, weeks }. Acepta "YYYY-MM-DD" o ISO completo
// (si es ISO, usa el día local, que es como se carga en el formulario).
export function weekOf(date) {
  let y, m, d;
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) [y, m, d] = date.split("-").map(Number);
  else { const dt = new Date(date); y = dt.getFullYear(); m = dt.getMonth() + 1; d = dt.getDate(); }
  const period = `${y}-${pad(m)}`;
  const weeks = monthWeeks(period);
  const w = weeks.find((x) => d >= x.from && d <= x.to);
  return { period, week: w.n, weeks, range: w };
}
