// Charge les variables d'environnement depuis un fichier .env
require("dotenv").config();

// Importation des modules nécessaires
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config/db"); // Connexion à la base de données Sequelize
const User = require("./models/User"); // Modèle utilisateur
const Invoice = require("./models/Invoice"); // Modèle de facture
const Purchase = require("./models/Purchase"); // Modèle d'achat

// Création de l'application Express
const app = express();

// Activation de CORS pour permettre les requêtes cross-origin
app.use(cors());

// Middleware pour parser le corps des requêtes en JSON
app.use(bodyParser.json());

// Définition des routes de l'API
app.use("/api/auth", require("./routes/auth")); // Routes d'authentification
app.use("/api/invoices", require("./routes/invoices")); // Routes pour les factures

// Définition du port du serveur
const PORT = process.env.PORT || 5000;

// Synchronisation de la base de données et démarrage du serveur
sequelize.sync().then(() => {
  console.log("Database synced"); // Confirme la synchronisation de la base de données
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Lancement du serveur
});
