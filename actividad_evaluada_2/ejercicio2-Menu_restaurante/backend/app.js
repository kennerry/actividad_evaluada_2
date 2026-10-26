const express = require("express");
const cors = require("cors")
const app = express();
const apiRoutes = require("./routes/api.js");

const PUERTO = 3000;

app.use(express.json());
app.use(cors());

app.use("/api", apiRoutes);

app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});
