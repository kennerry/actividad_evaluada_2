const fs = require("fs");
const { validateHeaderValue } = require("http");
const path = require("path");

const rutaMenu = path.join(__dirname, "..", "menu.json");

function leerDatos() {
  const contenido = fs.readFileSync(rutaMenu, "utf-8");
  return JSON.parse(contenido);
}

function guardarDatos(datos) {
  fs.writeFileSync(rutaMenu, JSON.stringify(datos, null), "utf-8");
}

module.exports = {
  leerDatos,
  guardarDatos,
};
