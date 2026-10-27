const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
app.use(express.json());

// Generar número aleatorio entre 1 y 100
const generarNumeroAleatorio = () => {
  return Math.floor(Math.random() * 100) + 1;
};

let numeroAdivinar = generarNumeroAleatorio();
console.log(`Numero secreto inicial: ${numeroAdivinar}`);

// Ruta POST /reset
app.post("/reset", (req, res) => {
  numeroAdivinar = generarNumeroAleatorio();
  console.log(`Nuevo numero secreto: ${numeroAdivinar}`);
  res.json({ mensaje: "¡El juego se ha reiniciado correctamente!" });
});

// Ruta POST /guess
app.post("/guess", (req, res) => {
  const numeroElejido = Number(req.body.numero);

  // Validar si es un entero válido dentro del rango [1, 100]
  if (!Number.isInteger(numeroElejido) || numeroElejido < 1 || numeroElejido > 100) {
    return res.status(400).json({ 
      error: "Debes enviar un número entero válido entre 1 y 100." 
    });
  }

  if (numeroElejido > numeroAdivinar) {
    return res.json({
      resultado: "menor",
      mensaje: "El número oculto es MENOR.",
    });
  } else if (numeroElejido < numeroAdivinar) {
    return res.json({
      resultado: "mayor",
      mensaje: "El número oculto es MAYOR.",
    });
  } else {
    return res.json({
      resultado: "correcto",
      mensaje: "¡Felicidades! Has acertado el número secreto.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});