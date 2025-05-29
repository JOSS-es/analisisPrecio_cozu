const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const productosMock = [
  { Cod_Art: "P001", Desc_Esp: "Producto Mock 1" },
  { Cod_Art: "P002", Desc_Esp: "Producto Mock 2" },
  { Cod_Art: "P003", Desc_Esp: "Producto Mock 3" }
];

const preciosMock = {
  P001: [
    { Codigo: "P001", Fecha: "2025-01-10T00:00:00", Usuario: "Admin", Precio: 100, PrecioMax: 120 },
    { Codigo: "P001", Fecha: "2025-02-15T00:00:00", Usuario: "Admin", Precio: 110, PrecioMax: 130 }
  ],
  P002: [
    { Codigo: "P002", Fecha: "2025-03-05T00:00:00", Usuario: "Admin", Precio: 200, PrecioMax: 220 },
    { Codigo: "P002", Fecha: "2025-04-10T00:00:00", Usuario: "Admin", Precio: 210, PrecioMax: 230 }
  ],
  P003: [
    { Codigo: "P003", Fecha: "2025-01-20T00:00:00", Usuario: "Admin", Precio: 300, PrecioMax: 320 },
    { Codigo: "P003", Fecha: "2025-05-01T00:00:00", Usuario: "Admin", Precio: 310, PrecioMax: 330 }
  ]
};

const cambiosPrecioMensualesMock = [
  { Año: 2025, Mes: 1, CambiosDePrecioMax: 5 },
  { Año: 2025, Mes: 2, CambiosDePrecioMax: 3 },
  { Año: 2025, Mes: 3, CambiosDePrecioMax: 6 }
];

// Rutas
app.get("/productos", (req, res) => {
  res.json(productosMock);
});

app.get("/precios/:codigo", (req, res) => {
  const codigo = req.params.codigo;
  res.json(preciosMock[codigo] || []);
});

app.get("/cambios-precio-mensuales", (req, res) => {
  res.json(cambiosPrecioMensualesMock);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});

