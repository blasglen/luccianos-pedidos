import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages sirve el sitio en tuusuario.github.io/NOMBRE-DEL-REPO/,
// así que la app necesita saber que vive en esa subcarpeta.
// Si cambiás el nombre del repositorio, actualizá este valor también.
export default defineConfig({
  base: "/luccianos-pedidos/",
  plugins: [react()],
});
