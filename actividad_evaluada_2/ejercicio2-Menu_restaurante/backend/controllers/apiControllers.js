const { leerDatos, guardarDatos } = require("../utils/helpers.js");

const datos = leerDatos();

function mostrarMenu(req, res) {
  try {
    res.json(datos.menu);
  } catch (error) {
    res.status(500).json({ error: "Error al leer el menu disponible." });
  }
}

function mostrarReserva(req, res) {
  try {
    res.json(datos.reserva);
  } catch (error) {
    res.status(500).json({ error: "Error al leer la reserva actual" });
  }
}

function agregarPlatoAReserva(req, res) {
  try {
    let { alimentoId, cantidad } = req.body;

    const id = Number(alimentoId);
    const cant = Number(cantidad);

    if (!id || !cant || cant < 0 || id < 0) {
      return res.status(400).json({ error: "Ingresar valores validos" });
    }

    const plato = datos.menu.find((p) => p.id === id);

    if (!plato) {
      return res
        .status(404)
        .json({ error: "El alimento solicitado no existe en el menu." });
    }

    if (plato.stock < cant) {
      return res.status(400).json({
        error: `Stock insuficiente. Solo hay ${plato.stock} unidades disponibles`,
      });
    }

    const precioTotal = plato.precio * cant;

    if (datos.reserva.saldo < precioTotal) {
      return res
        .status(400)
        .json({ error: "Saldo insuficiente para esta reserva" });
    }

    plato.stock -= cant;

    // Actualizamos la reserva

    const itemExistente = datos.reserva.itemsReservados.find(
      (item) => item.id === id,
    );

    if (itemExistentem) {
      itemExistente.cantidad += cant;
    } else {
      datos.reserva.itemsReservados.push({ id, cantidad: cant });
    }

    guardarDatos(datos);

    res.json({
      mensaje: "Alimento agregado a la reserva correctamente",
      reserva: datos.reserva,
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno al procesar la reserva" });
  }
}

module.exports = {
  mostrarMenu,
  mostrarReserva,
  agregarPlatoAReserva,
};
