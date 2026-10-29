import { leerDatos, guardarDatos } from "../utils/helpers.js";

export function mostrarMenu(req, res) {
  try {
    const datos = leerDatos();
    res.json(datos.menu);
  } catch (error) {
    res.status(500).json({ error: "Error al leer el menu disponible." });
  }
}

export function mostrarReserva(req, res) {
  try {
    const datos = leerDatos();
    res.json(datos.reserva);
  } catch (error) {
    res.status(500).json({ error: "Error al leer la reserva actual" });
  }
}

export function agregarPlatoAReserva(req, res) {
  try {
    let { alimentoId, cantidad } = req.body;

    const id = Number(alimentoId);
    const cant = Number(cantidad);
    const cantLimpia = parseInt(cant);
    // Utilizar para validaciones Number.isInteger();

    const datos = leerDatos();

    if (!id || !cant || cant < 0) {
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
    datos.reserva.total += precioTotal;
    datos.reserva.saldo -= precioTotal;

    const itemExistente = datos.reserva.itemsReservados.find(
      (item) => item.id === id,
    );

    if (itemExistente) {
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

export function actualizarReservas(req, res) {
  try {
    const alimentoId = parseInt(req.params.id, 10);
    const cantidad = Number(req.body.cantidad);

    const datos = leerDatos();

    if (!alimentoId || !cantidad || cantidad < 1) {
      return res.status(400).json({ error: "Ingresar datos validos" });
    }

    const plato = datos.menu.find((p) => p.id === alimentoId);

    if (!plato) {
      return res
        .status(404)
        .json({ error: "El alimento a actualizar no existe en el menu" });
    }

    const itemEnReserva = datos.reserva.itemsReservados.find(
      (item) => item.id === alimentoId,
    );

    if (!itemEnReserva) {
      return res
        .status(404)
        .json({ error: "El alimento no se encuentra en la reserva" });
    }

    const diferenciaCantidad = cantidad - itemEnReserva.cantidad;

    if (diferenciaCantidad > 0) {
      if (plato.stock < diferenciaCantidad) {
        return res.status(400).json({
          error: `Stock insuficiente. Solo quedan ${plato.stock} unidades adicionales disponibles`,
        });
      }

      const costoExtra = plato.precio * diferenciaCantidad;

      if (costoExtra > datos.reserva.saldo) {
        return res
          .status(400)
          .json({ error: "Saldo insuficiente para esta cantidad" });
      }

      plato.stock -= diferenciaCantidad;
      datos.reserva.saldo -= costoExtra;
      datos.reserva.total += costoExtra;
    } else if (diferenciaCantidad < 0) {
      const unidadesADevolver = Math.abs(diferenciaCantidad);
      const reembolso = plato.precio * unidadesADevolver;

      plato.stock += unidadesADevolver;
      datos.reserva.saldo += reembolso;
      datos.reserva.total -= reembolso;
    } else {
      return res.json({
        mensaje: "La cantidad no ha cambiado",
        reserva: datos.reserva,
      });
    }

    itemEnReserva.cantidad = cantidad;

    guardarDatos(datos);

    return res.json({
      mensaje: "Reserva actualizada correctamente",
      reserva: datos.reserva,
      menu: datos.menu,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al procesar la actualizacion" });
  }
}

export function borrarPlatoDeLaReserva(req, res) {
  try {
    const datos = leerDatos();

    const id = parseInt(req.params.id, 10);

    if (!id) {
      return res.status(400).json({ error: "Ingresar un valor valido" });
    }

    const plato = datos.menu.find((p) => p.id === id);

    if (!plato) {
      return res.status(404).json({ error: "El plato no existe en el menu" });
    }

    const indexReserva = datos.reserva.itemsReservados.findIndex(
      (item) => item.id === id,
    );

    if (indexReserva === -1) {
      return res.status(404).json({ error: "El plato no esta en la reserva" });
    }

    const itemEnReserva = datos.reserva.itemsReservados[indexReserva];

    const precioPlatoTotal = plato.precio * itemEnReserva.cantidad;

    plato.stock += itemEnReserva.cantidad;
    datos.reserva.total -= precioPlatoTotal;
    datos.reserva.saldo += precioPlatoTotal;

    datos.reserva.itemsReservados.splice(indexReserva, 1);

    guardarDatos(datos);

    return res.json({
      mensaje: "Platillo eliminado de la reserva exitosamente.",
      reserva: datos.reserva,
      menu: datos.menu,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error interno al eliminar el plato de la reserva" });
  }
}

export function reiniciarReserva(req, res) {
  try {
    const datos = leerDatos();

    datos.reserva.itemsReservados.forEach((item) => {
      const plato = datos.menu.find((d) => d.id == item.id);

      if (plato) {
        plato.stock += item.cantidad;
      }
    });

    datos.reserva.saldo += datos.reserva.total;

    datos.reserva.total = 0;
    datos.reserva.itemsReservados = [];

    guardarDatos(datos);

    return res.json({
      message: "La reservacion se ha reiniciado exitosamente!",
      reserva: datos.reserva,
      menu: datos.menu,
    });
  } catch (error) {
    console.error("Error tratando de reiniciar la reservacion", error);
    return res
      .status(500)
      .json({ error: "Error interno al reiniciar la reservacion" });
  }
}
