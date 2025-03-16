// Importation de DataTypes depuis Sequelize pour définir les types des champs
const { DataTypes } = require("sequelize");
// Importation de l'instance Sequelize pour se connecter à la base de données
const sequelize = require("../config/db");
// Importation du modèle User pour établir la relation avec Invoice
const User = require("./User");

// Définition du modèle "Invoice" (Facture) dans la base de données
const Invoice = sequelize.define("Invoice", {
  // Définition du champ "date" pour la date de la facture
  date: { type: DataTypes.DATE, allowNull: false }, // Ne peut pas être nul
  // Définition du champ "totalPrice" pour le prix total de la facture
  totalPrice: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 }, // Ne peut pas être nul, valeur par défaut 0
});

// Définition de la relation entre "Invoice" et "User" (Une facture appartient à un utilisateur)
Invoice.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

// Exportation du modèle "Invoice" pour l'utiliser dans d'autres fichiers
module.exports = Invoice;
