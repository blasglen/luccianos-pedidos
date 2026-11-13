# Lucciano's · Compras y Stocks

App web (React + Vite) para que las sucursales armen el pedido semanal y hagan el
raconto de inventario, y para que el Depósito vea todo en un solo lugar.

- **Publicación:** GitHub Pages — https://blasglen.github.io/luccianos-pedidos/
  Cada cambio que se sube a `main` se compila y publica solo (`.github/workflows/deploy.yml`).
- **Datos:** una planilla de Google Sheets con un Apps Script (`google-sheets/`).
  Ver `google-sheets/INSTRUCCIONES.md`. La URL del script va en `src/config.js`.
  Sin esa URL la app funciona igual, pero los pedidos y conteos salen solo por mail / Excel.
- **Acceso:** PIN por sucursal (en `src/App.jsx`). El usuario y la clave del Depósito
  se configuran en las propiedades del script de Google, no en el código.

## Desarrollo local
```
npm install
npm run dev
```
