const db = require("../config/db");

// Méthode GET : Vérifie/crée la table et récupère son contenu
const getMatiere = (req, res) => {
  const createTableSQL = `
        CREATE TABLE IF NOT EXISTS matiere (
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
    const selectSQL = "SELECT * FROM matiere";
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

// Méthode POST : Insère une nouvelle matière
const postMatiere = (req, res) => {
  const { nom } = req.body;

  if (!nom || typeof nom !== "string") {
    res
      .status(400)
      .send('Le champ "nom" est requis et doit être une chaîne de caractères');
    return;
  }

  const insertSQL = "INSERT INTO matiere (nom) VALUES (?)";
  db.query(insertSQL, [nom], (err, result) => {
    if (err) {
      console.error("Erreur lors de l'insertion des données :", err);
      res.status(500).send("Erreur lors de l'insertion des données");
    } else {
      res.status(201).json({ id: result.insertId, nom });
    }
  });
};

// Méthode PUT : Modifie une matière par son ID
const updateMatiere = (req, res) => {
  const { id } = req.params; // ID récupéré depuis l'URL
  const { nom } = req.body; // Données envoyées dans le corps de la requête

  // Validation des données
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

  // Requête SQL pour la mise à jour
  const updateSQL = "UPDATE matiere SET nom = ? WHERE id = ?";
  db.query(updateSQL, [nom, id], (err, result) => {
    if (err) {
      console.error("Erreur lors de la mise à jour de la matière :", err);
      res.status(500).send("Erreur lors de la mise à jour de la matière");
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).send("Matière non trouvée");
      return;
    }

    // Réponse avec les données mises à jour
    res.json({ id, nom });
  });
};

// Méthode DELETE : Supprime une matière par son ID
const deleteMatiere = (req, res) => {
  const { id } = req.body;

  if (!id || isNaN(id)) {
    res.status(400).send("Un ID valide est requis");
    return;
  }

  const deleteSQL = "DELETE FROM matiere WHERE id = ?";
  db.query(deleteSQL, [id], (err, result) => {
    if (err) {
      console.error("Erreur lors de la suppression des données :", err);
      res.status(500).send("Erreur lors de la suppression des données");
    } else if (result.affectedRows === 0) {
      res.status(404).send("Matière non trouvée");
    } else {
      res.send(`Matière avec ID ${id} supprimée avec succès`);
    }
  });
};

module.exports = { getMatiere, postMatiere, updateMatiere, deleteMatiere };
