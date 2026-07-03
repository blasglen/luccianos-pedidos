-- Ejecutar esto en Supabase: Project > SQL Editor > New query > pegar y correr.

create table if not exists orders (
  id text primary key,
  sucursal text not null,
  date timestamptz not null default now(),
  items jsonb not null,
  notes text default '',
  status text not null default 'pendiente'
);

-- Habilita Row Level Security (recomendado por Supabase incluso para uso simple).
alter table orders enable row level security;

-- Esta app usa PIN por rol (definidos en el código, no autenticación real de Supabase).
-- Por eso las políticas de abajo permiten lectura y escritura a cualquiera con la
-- clave pública (anon key) de tu proyecto -- es el mismo nivel de seguridad "candado
-- simple" que ya tenía la versión de artifact. No pongas datos sensibles acá.

create policy "Cualquiera puede leer pedidos"
  on orders for select
  using (true);

create policy "Cualquiera puede crear pedidos"
  on orders for insert
  with check (true);

-- Antes cualquiera con el link podía cambiar el estado de un pedido (candado simple).
-- Ahora que Depósito tiene cuentas reales (mail + contraseña), solo alguien logueado
-- puede cambiar el estado. Cargar/leer pedidos sigue abierto (lo usan las sucursales
-- sin cuenta, solo con su PIN).
create policy "Solo usuarios logueados pueden actualizar pedidos"
  on orders for update
  using (auth.role() = 'authenticated');
