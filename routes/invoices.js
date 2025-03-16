// Importation des modules nécessaires
const express = require("express");
const Invoice = require("../models/Invoice"); // Modèle Invoice pour gérer les factures
const Purchase = require("../models/Purchase"); // Modèle Purchase pour gérer les achats
const authMiddleware = require("../middleware/authMiddleware"); // Middleware pour l'authentification

// Création d'un routeur pour les routes liées aux factures
const router = express.Router();

// Route pour créer une nouvelle facture avec des achats
router.post("/", authMiddleware, async (req, res) => {
  const { purchases, date } = req.body;

  // Vérifie que des achats sont fournis
  if (!purchases || purchases.length === 0) {
    return res.status(400).json({ message: "Purchases cannot be empty" });
  }

  // Calcul du prix total en fonction des achats (prix unitaire * quantité)
  const totalPrice = purchases.reduce((sum, item) => sum + item.singlePrice * item.quantity, 0);

  // Création de la facture avec le prix total et la date
  const invoice = await Invoice.create({ userId: req.user.id, date, totalPrice });

  // Création des achats associés à cette facture
  const createdPurchases = await Promise.all(
    purchases.map((item) =>
      Purchase.create({ ...item, invoiceId: invoice.id })
    )
  );

  // Renvoie la facture et les achats créés
  res.json({ invoice, purchases: createdPurchases });
});

// Route pour obtenir toutes les factures d'un utilisateur
router.get("/", authMiddleware, async (req, res) => {
  const invoices = await Invoice.findAll({
    where: { userId: req.user.id }, // Sélectionne les factures de l'utilisateur authentifié
    include: Purchase, // Inclut les achats associés à chaque facture
  });
  res.json(invoices); // Renvoie la liste des factures
});

// Route pour obtenir une facture spécifique par son ID
router.get("/:id", authMiddleware, async (req, res) => {
  const invoice = await Invoice.findOne({
    where: { id: req.params.id, userId: req.user.id }, // Vérifie que l'utilisateur est propriétaire de la facture
    include: Purchase, // Inclut les achats associés à la facture
  });

  // Si la facture n'existe pas, renvoie une erreur 404
  if (!invoice) return res.status(404).json({ message: "Invoice not found" });

  res.json(invoice); // Renvoie la facture avec ses achats
});

// Route pour mettre à jour une facture existante
router.put("/:id", authMiddleware, async (req, res) => {
  const { purchases, date } = req.body;

  // Vérifie que des achats sont fournis
  if (!purchases || purchases.length === 0) {
    return res.status(400).json({ message: "Purchases cannot be empty" });
  }

  // Calcul du prix total en fonction des achats
  const totalPrice = purchases.reduce((sum, item) => sum + item.singlePrice * item.quantity, 0);

  // Mise à jour de la facture avec la nouvelle date et le prix total
  await Invoice.update({ date, totalPrice }, { where: { id: req.params.id, userId: req.user.id } });

  // Suppression des achats existants liés à la facture
  await Purchase.destroy({ where: { invoiceId: req.params.id } });

  // Création des nouveaux achats
  const updatedPurchases = await Promise.all(
    purchases.map((item) =>
      Purchase.create({ ...item, invoiceId: req.params.id })
    )
  );

  // Renvoie le message de mise à jour et les nouveaux achats
  res.json({ message: "Invoice updated", purchases: updatedPurchases });
});

// Route pour supprimer une facture
router.delete("/:id", authMiddleware, async (req, res) => {
  // Suppression de la facture et de ses achats associés
  await Invoice.destroy({ where: { id: req.params.id, userId: req.user.id } });
  res.json({ message: "Invoice deleted" }); // Renvoie un message de confirmation
});

// Exportation du routeur pour l'utiliser dans l'application Express
module.exports = router;
