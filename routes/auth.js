const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Arreglo para almacenar usuarios
let users = [];

// Registro de usuario
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // Verificar si el usuario ya existe
  const userExists = users.find((user) => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: "El usuario ya existe" });
  }

  // Encriptar la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear un nuevo usuario
  const newUser = { email, password: hashedPassword };
  users.push(newUser);
  res.status(201).json({ message: "Usuario registrado exitosamente" });
});

// Login de usuario
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

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

  // Crear y enviar un token
  const token = jwt.sign({ email: user.email }, "secret_key", {
    expiresIn: "1h",
  });

  res.json({ token });
});

module.exports = router;
