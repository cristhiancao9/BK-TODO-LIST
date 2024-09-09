const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

// Ruta del archivo donde se almacenarán las tareas
const tasksFilePath = path.join(__dirname, "../tasks.json");

// Función para cargar tareas desde el archivo
function loadTasks() {
  if (fs.existsSync(tasksFilePath)) {
    const data = fs.readFileSync(tasksFilePath, "utf8");
    return JSON.parse(data);
  }
  return [];
}

// Función para guardar tareas en el archivo
function saveTasks(tasks) {
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2), "utf8");
}

// Middleware para verificar el token JWT
function authenticateToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({
      status: false,
      msg: "Acceso denegado",
      obj: {},
    });
  }
  jwt.verify(token, "secret_key", (err, user) => {
    if (err) {
      return res.status(403).json({
        status: false,
        msg: "Token no válido",
        obj: {},
      });
    }
    req.user = user;
    next();
  });
}

// Crear una nueva tarea (POST /api/tasks)
router.post("/", authenticateToken, (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      status: false,
      msg: "El título y la descripción son obligatorios",
      obj: {},
    });
  }

  let tasks = loadTasks();

  const newTask = {
    id: tasks.length + 1,
    title,
    description,
    completed: false,
    user: req.user.email,
  };

  tasks.push(newTask);
  saveTasks(tasks);

  res.status(201).json({
    status: true,
    msg: "Tarea creada exitosamente",
    obj: newTask,
  });
});

// Obtener todas las tareas del usuario autenticado y filtrar por estado (GET /api/tasks)
router.get("/", authenticateToken, (req, res) => {
  const tasks = loadTasks();
  const userTasks = tasks.filter((task) => task.user === req.user.email);

  // Leer el query parameter "completed" para filtrar
  const { completed } = req.query;

  let filteredTasks = userTasks;

  // Si se recibe  filtrar por estado
  if (completed !== undefined) {
    const isCompleted = completed === "true"; // Convertir el string a booleano
    filteredTasks = userTasks.filter((task) => task.completed === isCompleted);
  }

  res.status(200).json({
    status: true,
    msg: "Tareas obtenidas exitosamente",
    obj: filteredTasks,
  });
});

// Actualizar una tarea existente (PUT /api/tasks/:id)
router.put("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  let tasks = loadTasks();
  const task = tasks.find(
    (task) => task.id === parseInt(id) && task.user === req.user.email
  );

  if (!task) {
    return res.status(404).json({
      status: false,
      msg: "Tarea no encontrada o no pertenece al usuario",
      obj: {},
    });
  }

  task.title = title || task.title;
  task.description = description || task.description;
  task.completed = completed !== undefined ? completed : task.completed;

  saveTasks(tasks);

  res.status(200).json({
    status: true,
    msg: "Tarea actualizada exitosamente",
    obj: task,
  });
});

// Eliminar una tarea (DELETE /api/tasks/:id)
router.delete("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  let tasks = loadTasks();
  const taskIndex = tasks.findIndex(
    (task) => task.id === parseInt(id) && task.user === req.user.email
  );

  if (taskIndex === -1) {
    return res.status(404).json({
      status: false,
      msg: "Tarea no encontrada o no pertenece al usuario",
      obj: {},
    });
  }

  // Guardar la tarea eliminada antes de eliminarla
  const deletedTask = tasks[taskIndex];

  tasks.splice(taskIndex, 1);
  saveTasks(tasks);

  res.status(200).json({
    status: true,
    msg: "Tarea eliminada exitosamente",
    obj: deletedTask,
  });
});

module.exports = router;
