// Importation du module jwt pour vérifier les jetons d'authentification
const jwt = require("jsonwebtoken");

// Middleware pour vérifier l'authentification via le jeton JWT
module.exports = (req, res, next) => {
  // Récupération du token depuis l'en-tête "Authorization"
  const token = req.header("Authorization")?.split(" ")[1];

  // Si aucun token n'est présent, renvoie une erreur 401 (non autorisé)
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    // Vérification du token avec la clé secrète pour le décoder
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Si le token est valide, on ajoute les informations de l'utilisateur à la requête
    req.user = decoded;

    // Passage au prochain middleware ou à la route
    next();
  } catch (err) {
    // Si le token est invalide, renvoie une erreur 401
    res.status(401).json({ message: "Invalid token" });
  }
};
