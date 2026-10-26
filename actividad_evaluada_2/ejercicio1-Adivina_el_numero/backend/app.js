const express = require("express");
const cors = require("cors");

const app = express();
const puerto = 3000;

app.use(express.json());
app.use(cors());

// Implementacion logica

const generarNumeroAleatorio = () => {
  return Math.floor(Math.random() * 100) + 1;
};

let numeroAdivinar = generarNumeroAleatorio();
console.log(`Numero secreto inicial: ${numeroAdivinar}`);

app.post("/reset", (req, res) => {
  numeroAdivinar = generarNumeroAleatorio();

  res.json({ mensaje: "El juego se ha reiniciado!" });
});

app.post("/guess", (req, res) => {
  const numeroElejido = Number(req.body.numero);

  if (isNaN(numeroElejido)) {
    return res.status(400).json({ error: "Se debe enviar un numero valido" });
  }

  if (numeroElejido < 0 || numeroElejido > 100) {
    return res
      .status(400)
      .json({ error: "El numero elejido debe estar en el rango de eleccion" });
  }

  if (numeroElejido > numeroAdivinar) {
    return res.json({
      resultado: "Menor",
      mensaje: "El numero a adivinar es menor!",
    });
  } else if (numeroElejido < numeroAdivinar) {
    return res.json({
      resultado: "Mayor",
      mensaje: "El numero a adivinar es mayor!",
    });
  } else {
    return res.json({
      resultado: "Acierto",
      mensaje: "Se ha acertado el numero secreto!",
    });
  }
});

app.listen(puerto, () => {
  console.log(`Servidor corriendo en http://localhost:${puerto}`);
});
