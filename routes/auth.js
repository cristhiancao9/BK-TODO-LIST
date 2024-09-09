const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Ruta del archivo donde se almacenarán los usuarios
const usersFilePath = path.join(__dirname, "../users.json");

// Función para cargar usuarios desde el archivo
function loadUsers() {
  if (fs.existsSync(usersFilePath)) {
    const data = fs.readFileSync(usersFilePath, "utf8");
    return JSON.parse(data);
  }
  return [];
}

// Función para guardar usuarios en el archivo
function saveUsers(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), "utf8");
}

// Middleware para verificar el token JWT y obtener la información del usuario
function authenticateToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Acceso denegado" });

  jwt.verify(token, "secret_key", (err, user) => {
    if (err) return res.status(403).json({ message: "Token no válido" });

    // Guardar la información del usuario decodificada en el request
    req.user = user;
    next();
  });
}

// Registro de usuario
router.post("/register", async (req, res) => {
  const { email, password, name, lastName } = req.body;

  // Cargar usuarios desde el archivo
  let users = loadUsers();

  // Verificar si el usuario ya existe
  const userExists = users.find((user) => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: "El usuario ya existe" });
  }

  // Encriptar la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear un nuevo usuario con name y lastName
  const newUser = { email, password: hashedPassword, name, lastName };

  // Agregar el nuevo usuario a la lista
  users.push(newUser);

  // Guardar usuarios en el archivo
  saveUsers(users);

  res.status(201).json({ message: "Usuario registrado exitosamente" });
});

// Login de usuario
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Cargar usuarios desde el archivo
  const users = loadUsers();

  // Verificar si el usuario existe
  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(400).json({ message: "Usuario no encontrado" });
  }

  // Verificar la contraseña
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Contraseña incorrecta" });
  }

  // Crear y enviar un token con el nombre y apellido
  const token = jwt.sign(
    { email: user.email, name: user.name, lastName: user.lastName },
    "secret_key", // Esta es tu clave secreta
    { expiresIn: "1h" } // El token expirará en 1 hora
  );

  res.json({ token });
});

// Obtener información del usuario logueado (name, lastName)
router.get("/user", authenticateToken, (req, res) => {
  res.json({
    email: req.user.email,
    name: req.user.name,
    lastName: req.user.lastName,
  });
});

module.exports = router;
