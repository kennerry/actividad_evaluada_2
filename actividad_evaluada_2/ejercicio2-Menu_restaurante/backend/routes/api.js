const express = require("express");
const router = express.Router();
const controller = require("../controllers/apiControllers.js");

function leerDatos() {
  const contenido = fs.readFileSync(rutaArchivo, "utf-8");
  return JSON.parse(contenido);
}

function guardarDatos(datos) {
  fs.writeFileSync(rutaArchivo, JSON.stringify(datos, null, 2), "utf-8");
}

router.get("/menu", controller.mostrarMenu);
router.get("/reserva", controller.mostrarReserva);

router.post("/reserva/agregar", controller.agregarPlatoAReserva);
router.put(
  "/reserva/actualizar-porciones/:id",
  controller.actualizarReservas,
);
router.delete("/reserva/eliminar/:id", controller.borrarPlatoDeLaReserva);

module.exports = router;