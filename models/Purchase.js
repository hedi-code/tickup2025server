// Importation de DataTypes depuis Sequelize pour définir les types des champs
const { DataTypes } = require("sequelize");
// Importation de l'instance Sequelize pour se connecter à la base de données
const sequelize = require("../config/db");
// Importation du modèle Invoice pour établir la relation avec Purchase
const Invoice = require("./Invoice");

// Définition du modèle "Purchase" (Achat) dans la base de données
const Purchase = sequelize.define("Purchase", {
  // Définition du champ "label" pour la description de l'achat
  label: { type: DataTypes.STRING, allowNull: false }, // Ne peut pas être nul
  // Définition du champ "singlePrice" pour le prix unitaire de l'achat
  singlePrice: { type: DataTypes.FLOAT, allowNull: false }, // Ne peut pas être nul
  // Définition du champ "quantity" pour la quantité d'articles achetés
  quantity: { type: DataTypes.INTEGER, allowNull: false }, // Ne peut pas être nul
  // Définition du champ "invoiceId" pour l'identifiant de la facture associée
  invoiceId: { type: DataTypes.INTEGER, allowNull: false }, // Ne peut pas être nul
});

// Définition de la relation entre "Invoice" et "Purchase" (Une facture peut avoir plusieurs achats)
Invoice.hasMany(Purchase, { foreignKey: "invoiceId", onDelete: "CASCADE" });
// Définition de la relation inverse : Un achat appartient à une facture
Purchase.belongsTo(Invoice, { foreignKey: "invoiceId", onDelete: "CASCADE" });

// Exportation du modèle "Purchase" pour l'utiliser dans d'autres fichiers
module.exports = Purchase;
