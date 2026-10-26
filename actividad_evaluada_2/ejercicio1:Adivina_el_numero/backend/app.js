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

app.listen(puerto, () => {
  console.log(`Servidor corriendo en http://localhost:${puerto}`);
});
