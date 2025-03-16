// Importation de DataTypes depuis Sequelize pour définir les types des champs
const { DataTypes } = require("sequelize");
// Importation de l'instance Sequelize pour se connecter à la base de données
const sequelize = require("../config/db");

// Définition du modèle "User" (Utilisateur) dans la base de données
const User = sequelize.define("User", {
  // Définition du champ "name" pour le nom de l'utilisateur
  name: { type: DataTypes.STRING, allowNull: false }, // Ne peut pas être nul
  // Définition du champ "email" pour l'email de l'utilisateur
  email: { type: DataTypes.STRING, unique: true, allowNull: false }, // Unique et ne peut pas être nul
  // Définition du champ "password" pour le mot de passe de l'utilisateur
  password: { type: DataTypes.STRING, allowNull: false }, // Ne peut pas être nul
  // Définition du champ "accountantEmail" pour stocker l'email du comptable
  accountantEmail: { type: DataTypes.STRING, allowNull: true }, // Peut être nul si l'utilisateur n'est pas un comptable
});

// Exportation du modèle "User" pour l'utiliser dans d'autres fichiers
module.exports = User;
