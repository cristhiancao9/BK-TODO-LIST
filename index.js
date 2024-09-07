const express = require("express");
const app = express();
const PORT = 5000;
const taskRoutes = require("./routes/tasks");
const authRoutes = require("./routes/auth");

const cors = require("cors"); 
app.use(cors());

// Middleware para manejar JSON
app.use(express.json());

// Rutas para las tareas
app.use("/api/tasks", taskRoutes);

app.use("/api/auth", authRoutes);

// Ruta base
app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
