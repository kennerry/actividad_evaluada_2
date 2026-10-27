import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rutaMenu = path.join(__dirname, "..", "menu.json");

export function leerDatos() {
  const contenido = fs.readFileSync(rutaMenu, "utf-8");
  return JSON.parse(contenido);
}

export function guardarDatos(datos) {
  fs.writeFileSync(rutaMenu, JSON.stringify(datos, null, 2), "utf-8");
}