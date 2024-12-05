const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Configura el servidor para servir archivos estáticos en la carpeta "public"
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
