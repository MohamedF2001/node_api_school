// methods.js

const db = require("../config/db");

// Méthode GET : Vérifie/crée la table et récupère son contenu
const getClasse = (req, res) => {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS classe (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nom VARCHAR(255) NOT NULL
    );
  `;

  db.query(createTableSQL, (err) => {
    if (err) {
      console.error("Erreur lors de la création de la table :", err);
      res.status(500).send("Erreur lors de la création de la table");
      return;
    }

    // Récupérer les données après avoir vérifié/créé la table
    const selectSQL = "SELECT * FROM classe";
    db.query(selectSQL, (err, results) => {
      if (err) {
        console.error("Erreur lors de la récupération des données :", err);
        res.status(500).send("Erreur lors de la récupération des données");
      } else {
        res.json(results);
      }
    });
  });
};

// Méthode POST : Insère un nom dans la table
const postClasse = (req, res) => {
  const { nom } = req.body;

  if (!nom || typeof nom !== "string") {
    res
      .status(400)
      .send('Le champ "nom" est requis et doit être une chaîne de caractères');
    return;
  }

  const insertSQL = "INSERT INTO classe (nom) VALUES (?)";
  db.query(insertSQL, [nom], (err, result) => {
    if (err) {
      console.error("Erreur lors de l'insertion des données :", err);
      res.status(500).send("Erreur lors de l'insertion des données");
    } else {
      res.status(201).json({ id: result.insertId, nom });
    }
  });
};

// Méthode PUT : Modifie une classe par son ID (ID dans le body)
const updateClassee = (req, res) => {
  const { id, nom } = req.body;

  if (!id || isNaN(id)) {
    res.status(400).send("Un ID valide est requis");
    return;
  }

  if (!nom || typeof nom !== "string") {
    res
      .status(400)
      .send('Le champ "nom" est requis et doit être une chaîne de caractères');
    return;
  }

  const updateSQL = "UPDATE classe SET nom = ? WHERE id = ?";
  db.query(updateSQL, [nom, id], (err, result) => {
    if (err) {
      console.error("Erreur lors de la mise à jour des données :", err);
      res.status(500).send("Erreur lors de la mise à jour des données");
    } else if (result.affectedRows === 0) {
      res.status(404).send("Classe non trouvée");
    } else {
      res.json({ id, nom });
    }
  });
};

// Méthode PUT : Modifie une classe par son ID
const updateClasse = (req, res) => {
  const { id } = req.params;
  const { nom } = req.body;

  if (!id || isNaN(id)) {
    res.status(400).send("Un ID valide est requis");
    return;
  }

  if (!nom || typeof nom !== "string") {
    res
      .status(400)
      .send('Le champ "nom" est requis et doit être une chaîne de caractères');
    return;
  }

  const updateSQL = "UPDATE classe SET nom = ? WHERE id = ?";
  db.query(updateSQL, [nom, id], (err, result) => {
    if (err) {
      console.error("Erreur lors de la mise à jour des données :", err);
      res.status(500).send("Erreur lors de la mise à jour des données");
    } else if (result.affectedRows === 0) {
      res.status(404).send("Classe non trouvée");
    } else {
      res.json({ id, nom });
    }
  });
};

// Méthode DELETE : Supprime une classe par son ID
const deleteClasse = (req, res) => {
  const { id } = req.body;

  if (!id || isNaN(id)) {
    res.status(400).send("Un ID valide est requis");
    return;
  }

  const deleteSQL = "DELETE FROM classe WHERE id = ?";
  db.query(deleteSQL, [id], (err, result) => {
    if (err) {
      console.error("Erreur lors de la suppression des données :", err);
      res.status(500).send("Erreur lors de la suppression des données");
    } else if (result.affectedRows === 0) {
      res.status(404).send("Classe non trouvée");
    } else {
      res.send(`Classe avec ID ${id} supprimée avec succès`);
    }
  });
};

module.exports = {
  getClasse,
  postClasse,
  updateClasse,
  deleteClasse,
};
