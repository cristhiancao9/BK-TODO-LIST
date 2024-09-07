const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Almacenar las tareas
let tasks = [];

// Middleware para verificar el token JWT
function authenticateToken(req, res, next) {
  // Obtener el token del encabezado Authorization
  const token = req.header("Authorization");

  // Si no hay token, devolver un error de acceso denegado
  if (!token) return res.status(401).json({ message: "Acceso denegado" });

  // Verificar el token usando la clave secreta
  jwt.verify(token, "secret_key", (err, user) => {
    if (err) return res.status(403).json({ message: "Token no válido" });

    // Adjuntar la información del usuario a la solicitud
    req.user = user;

    // Continuar con la siguiente función de la ruta
    next();
  });
}

// Crear una nueva tarea (ruta protegida)
router.post("/", authenticateToken, (req, res) => {
  const { title, description } = req.body;

  const newTask = {
    id: tasks.length + 1,
    title,
    description,
    completed: false,
    user: req.user.email, // Asociar la tarea con el usuario autenticado
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Obtener todas las tareas del usuario autenticado (ruta protegida)
router.get("/", authenticateToken, (req, res) => {
  // Filtrar las tareas que pertenecen al usuario autenticado
  const userTasks = tasks.filter((task) => task.user === req.user.email);
  res.json(userTasks);
});

// Actualizar una tarea (ruta protegida)
router.put("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  // Buscar la tarea por ID y asegurarse de que pertenece al usuario autenticado
  const task = tasks.find(
    (task) => task.id === parseInt(id) && task.user === req.user.email
  );

  if (task) {
    task.title = title || task.title;
    task.description = description || task.description;
    task.completed = completed !== undefined ? completed : task.completed;
    res.json(task);
  } else {
    res
      .status(404)
      .json({ message: "Tarea no encontrada o no pertenece al usuario" });
  }
});

// Eliminar una tarea (ruta protegida)
router.delete("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  // Filtrar las tareas para eliminar solo la que pertenece al usuario autenticado
  const taskIndex = tasks.findIndex(
    (task) => task.id === parseInt(id) && task.user === req.user.email
  );

  if (taskIndex > -1) {
    tasks.splice(taskIndex, 1);
    res.status(204).send();
  } else {
    res
      .status(404)
      .json({ message: "Tarea no encontrada o no pertenece al usuario." });
  }
});

module.exports = router;
