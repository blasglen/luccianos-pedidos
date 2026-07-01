# Pedidos de stock - Lucciano's

App interna para que las 6 sucursales pidan stock y depósito los gestione.
Instalable como app en el celular (PWA), con ícono y pantalla completa reales.

## Qué incluye

- React + Vite (el mismo diseño y funcionalidad de la versión de Claude)
- Supabase como base de datos real (gratis, multiusuario, sin que se resetee)
- manifest.json + service worker → se puede instalar como app desde el navegador
- Ícono generado a partir del logo oficial de Lucciano's

## Pasos para publicarla (100% gratis)

### 1. Crear el proyecto en Supabase

1. Andá a https://supabase.com y creá una cuenta gratis.
2. Creá un nuevo proyecto (elegí cualquier nombre, por ejemplo "luccianos-pedidos").
3. Una vez creado, andá a **SQL Editor** → **New query**.
4. Abrí el archivo `supabase-schema.sql` de esta carpeta, copiá todo su contenido, pegalo ahí, y apretá **Run**. Esto crea la tabla de pedidos.
5. Andá a **Project Settings** → **API**. Ahí vas a encontrar:
   - **Project URL** (algo como `https://xxxxx.supabase.co`)
   - **anon public key** (una clave larga)
   Guardalos, los vas a necesitar en el paso 3.

### 2. Subir el código a GitHub

1. Creá una cuenta gratis en https://github.com si no tenés.
2. Creá un repositorio nuevo (puede ser privado).
3. Subí todos los archivos de esta carpeta a ese repositorio (podés arrastrar los archivos desde la web de GitHub, opción "uploading an existing file", o usar git si sabés).

### 3. Desplegar en Vercel

1. Andá a https://vercel.com y creá una cuenta gratis (podés entrar directo con tu cuenta de GitHub).
2. Apretá **Add New... → Project**, y elegí el repositorio que acabás de subir.
3. Antes de apretar "Deploy", abrí la sección **Environment Variables** y cargá:
   - `VITE_SUPABASE_URL` → pegá el Project URL de Supabase
   - `VITE_SUPABASE_ANON_KEY` → pegá el anon public key de Supabase
4. Apretá **Deploy**. En un minuto te da un link como `https://luccianos-pedidos.vercel.app`.

Ese es el link final para compartir con las sucursales y depósito.

### 4. Instalarla como app en el celular

1. Abrí el link de Vercel desde el navegador del celular (Chrome en Android, Safari en iPhone).
2. **Android (Chrome):** va a aparecer un aviso de "Agregar a pantalla de inicio" o lo encontrás en el menú ⋮ → "Instalar app".
3. **iPhone (Safari):** apretá el botón de compartir (el cuadrado con la flecha) → "Agregar a pantalla de inicio".
4. Les queda un ícono con el logo de Lucciano's, y al abrirlo funciona a pantalla completa, como una app real.

## PINs configurados

Están en `src/App.jsx`, en la constante `PINS` al principio del archivo. Para cambiarlos, editás ese objeto y volvés a subir el cambio a GitHub — Vercel lo redespliega solo.

| Sucursal | PIN |
|---|---|
| American Dream | 1001 |
| Aventura | 1002 |
| Sawgrass | 1003 |
| Florida Mall | 1004 |
| Vineland | 1005 |
| Weston | 1006 |
| Depósito | 2000 |

## Actualizar la app en el futuro

Cualquier cambio de código que suban a GitHub, Vercel lo publica solo, automáticamente, en el mismo link — sin que se pierdan los pedidos (ahora viven en Supabase, no en el código).

## Seguridad — léelo

Los PINs son un candado simple para uso interno, visibles en el código fuente. Las políticas de la base de datos (`supabase-schema.sql`) permiten leer y escribir con la clave pública del proyecto, mismo nivel de protección que tenía la versión anterior. Para autenticación real por sucursal, se puede migrar más adelante a Supabase Auth.
