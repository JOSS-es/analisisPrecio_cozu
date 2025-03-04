require("dotenv").config();
const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static("public"));

// Configuración de la base de datos
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    enableArithAbort: process.env.DB_ARITHABORT === "true",
  },
};

// Conectar a SQL Server
sql.connect(config)
  .then(() => console.log("Conectado a SQL Server"))
  .catch(err => console.error("Error al conectar a SQL Server", err));

// Ruta para obtener productos
app.get("/productos", async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT Cod_Art, Desc_Esp FROM [001INVART] WHERE Cod_Art IS NOT NULL
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener precios de un producto
app.get("/precios/:codigo", async (req, res) => {
  try {
    const { codigo } = req.params;
    const result = await sql.query(`
      SELECT Codigo, Fecha, Usuario, Precio, PrecioMax 
      FROM [001COMPRE2] 
      WHERE Codigo = '${codigo}' AND PrecioMax IS NOT NULL 
      ORDER BY Fecha ASC
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Nueva ruta para obtener cambios de precio por mes
app.get("/cambios-precio-mensuales", async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT YEAR(Fecha) AS Año, MONTH(Fecha) AS Mes, COUNT(*) AS CambiosDePrecioMax
      FROM [BACK].[dbo].[001COMPRE2]
      WHERE PrecioMax IS NOT NULL
      GROUP BY YEAR(Fecha), MONTH(Fecha)
      ORDER BY Año, Mes
    `);
    res.json(result.recordset);  // Enviar los datos de cambios de precio por mes
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta principal para servir el archivo dashboard.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// Iniciar el servidor y escuchar en todas las interfaces (0.0.0.0)
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Servidor en http://0.0.0.0:${PORT}`));

