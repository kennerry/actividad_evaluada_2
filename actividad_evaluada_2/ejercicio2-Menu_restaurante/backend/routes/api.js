import express from "express";
import * as controller from "../controllers/apiControllers.js";

const router = express.Router();

router.get("/menu", controller.mostrarMenu);
router.get("/reserva", controller.mostrarReserva);
router.post("/reserva/agregar", controller.agregarPlatoAReserva);
router.put("/reserva/actualizar-porciones/:id", controller.actualizarReservas);
router.delete("/reserva/eliminar/:id", controller.borrarPlatoDeLaReserva);
router.post("/reserva/reiniciar", controller.reiniciarReserva);

// Exportación por defecto compatible con: import apiRoutes from './routes/api.js'
export default router;
