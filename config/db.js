// Importation de Sequelize, un ORM (Object-Relational Mapping) pour Node.js
const { Sequelize } = require("sequelize");

// Création d'une instance Sequelize configurée pour utiliser SQLite
const sequelize = new Sequelize({
  dialect: "sqlite", // Spécifie que nous utilisons une base de données SQLite
  storage: "./database.sqlite", // Définit l'emplacement du fichier de la base de données
});

// Exportation de l'instance Sequelize pour une utilisation dans d'autres fichiers
module.exports = sequelize;
