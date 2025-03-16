// Importation des modules nécessaires
const express = require("express");
const bcrypt = require("bcryptjs"); // Utilisé pour le hachage des mots de passe
const jwt = require("jsonwebtoken"); // Utilisé pour la génération de jetons JWT pour l'authentification
const User = require("../models/User"); // Modèle utilisateur pour accéder à la base de données

// Création du routeur pour l'authentification
const router = express.Router();

// Route pour enregistrer un nouvel utilisateur
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Hachage du mot de passe avant de l'enregistrer
  const hashedPassword = await bcrypt.hash(password, 10);

  // Création d'un nouvel utilisateur avec le mot de passe haché
  const user = await User.create({ name, email, password: hashedPassword });

  // Réponse avec un message de succès et les informations de l'utilisateur
  res.json({ message: "User registered", user });
});

// Route pour l'authentification de l'utilisateur (connexion)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Recherche de l'utilisateur par son email
  const user = await User.findOne({ where: { email } });

  // Si l'utilisateur n'existe pas ou si le mot de passe est incorrect
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Création d'un jeton JWT pour l'utilisateur avec une durée de vie de 1 heure
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  // Réponse avec le jeton JWT pour l'authentification future
  res.json({ token });
});

// Exportation du routeur pour l'utiliser dans l'application Express
module.exports = router;
