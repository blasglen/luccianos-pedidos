# Conectar la app a Google Sheets (una sola vez, ~10 minutos)

La app guarda pedidos y conteos en una planilla de Google. Las sucursales no la
tocan nunca: la app escribe sola. El Depósito los ve desde la app y vos podés
abrir la planilla cuando quieras.

## 1. Crear la planilla
1. Entrá a Google Sheets con la cuenta de la empresa y creá una planilla nueva
   (por ejemplo "Lucciano's · Pedidos y Stocks").
2. Menú **Extensiones → Apps Script**.

## 2. Pegar el script
1. Borrá todo lo que aparece en `Código.gs` y pegá el contenido de `Code.gs`
   (está en esta misma carpeta del repo).
2. Guardá (ícono de disquete).
3. Arriba, en el selector de funciones, elegí **setup** y tocá **Ejecutar**.
   Google pide permisos: **Revisar permisos → tu cuenta → Avanzado → Ir a … (no seguro) → Permitir**.
   (Es tu propio script; el aviso aparece siempre con scripts nuevos.)

## 3. Usuario y clave del Depósito
1. En el editor, ícono ⚙️ **Configuración del proyecto** → abajo, **Propiedades del script** → **Agregar propiedad**:
   - `DEPOSITO_EMAIL` = el mail con el que entra el Depósito
   - `DEPOSITO_PASSWORD` = la clave que quieras
2. Guardar. Para cambiar la clave más adelante, se edita acá.

## 4. Publicar
1. **Implementar → Nueva implementación** → tipo **Aplicación web**.
2. Ejecutar como: **Yo**. Quién tiene acceso: **Cualquier persona**.
3. **Implementar** y copiá la **URL de la aplicación web** (termina en `/exec`).
4. Esa URL va en `src/config.js` (`SHEETS_URL`).

> Si más adelante cambiás el script, usá **Implementar → Gestionar implementaciones → editar (lápiz) → Versión: nueva**
> para que la URL siga siendo la misma.
