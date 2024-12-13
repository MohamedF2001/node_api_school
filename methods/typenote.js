const db = require("../config/db");

// Méthode GET : Vérifie/crée les tables et récupère les types de note associés aux matières
const getTypeNote = (req, res) => {
  const createTypeNoteTableSQL = `
      CREATE TABLE IF NOT EXISTS typenote (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(255) NOT NULL
      );
    `;

  const createMatiereTypeNoteTableSQL = `
      CREATE TABLE IF NOT EXISTS matiere_typenote (
        id INT AUTO_INCREMENT PRIMARY KEY,
        matiere_id INT NOT NULL,
        typenote_id INT NOT NULL,
        FOREIGN KEY (matiere_id) REFERENCES matiere(id) ON DELETE CASCADE,
        FOREIGN KEY (typenote_id) REFERENCES typenote(id) ON DELETE CASCADE
      );
    `;

  // Créer les deux tables
  db.query(createTypeNoteTableSQL, (err) => {
    if (err) {
      console.error("Erreur lors de la création de la table TypeNote :", err);
      res.status(500).send("Erreur lors de la création de la table TypeNote");
      return;
    }

    db.query(createMatiereTypeNoteTableSQL, (err) => {
      if (err) {
        console.error(
          "Erreur lors de la création de la table MatiereTypeNote :",
          err
        );
        res
          .status(500)
          .send("Erreur lors de la création de la table MatiereTypeNote");
        return;
      }

      // Récupérer les types de notes associés aux matières
      const selectSQL = `
          SELECT matiere_typenote.*, matiere.nom AS matiere_nom, typenote.nom AS typenote_nom
          FROM matiere_typenote
          INNER JOIN matiere ON matiere_typenote.matiere_id = matiere.id
          INNER JOIN typenote ON matiere_typenote.typenote_id = typenote.id
        `;
      db.query(selectSQL, (err, results) => {
        if (err) {
          console.error("Erreur lors de la récupération des données :", err);
          res.status(500).send("Erreur lors de la récupération des données");
        } else {
          res.json(results);
        }
      });
    });
  });
};

// Méthode POST : Ajoute un nouveau type de note global
const postTypeNote = (req, res) => {
  const { nom } = req.body;

  if (!nom || typeof nom !== "string") {
    res
      .status(400)
      .send('Le champ "nom" est requis et doit être une chaîne de caractères');
    return;
  }

  const insertSQL = "INSERT INTO typenote (nom) VALUES (?)";
  db.query(insertSQL, [nom], (err, result) => {
    if (err) {
      console.error("Erreur lors de l'insertion des données :", err);
      res.status(500).send("Erreur lors de l'insertion des données");
    } else {
      res.status(201).json({ id: result.insertId, nom });
    }
  });
};

// Méthode POST : Associe un type de note à une matière
const linkTypeNoteToMatiere = (req, res) => {
  const { matiere_id, typenote_id } = req.body;

  if (!matiere_id || isNaN(matiere_id)) {
    res
      .status(400)
      .send('Le champ "matiere_id" est requis et doit être un entier');
    return;
  }

  if (!typenote_id || isNaN(typenote_id)) {
    res
      .status(400)
      .send('Le champ "typenote_id" est requis et doit être un entier');
    return;
  }

  const insertSQL =
    "INSERT INTO matiere_typenote (matiere_id, typenote_id) VALUES (?, ?)";
  db.query(insertSQL, [matiere_id, typenote_id], (err, result) => {
    if (err) {
      console.error(
        "Erreur lors de l'association du type de note à la matière :",
        err
      );
      res
        .status(500)
        .send("Erreur lors de l'association du type de note à la matière");
    } else {
      res.status(201).json({ id: result.insertId, matiere_id, typenote_id });
    }
  });
};

// Méthode DELETE : Supprime l'association entre un type de note et une matière
const unlinkTypeNoteFromMatiere = (req, res) => {
  const { matiere_id, typenote_id } = req.body;

  if (!matiere_id || isNaN(matiere_id)) {
    res
      .status(400)
      .send('Le champ "matiere_id" est requis et doit être un entier');
    return;
  }

  if (!typenote_id || isNaN(typenote_id)) {
    res
      .status(400)
      .send('Le champ "typenote_id" est requis et doit être un entier');
    return;
  }

  const deleteSQL =
    "DELETE FROM matiere_typenote WHERE matiere_id = ? AND typenote_id = ?";
  db.query(deleteSQL, [matiere_id, typenote_id], (err, result) => {
    if (err) {
      console.error("Erreur lors de la suppression de l'association :", err);
      res.status(500).send("Erreur lors de la suppression de l'association");
    } else if (result.affectedRows === 0) {
      res.status(404).send("Association non trouvée");
    } else {
      res.send("Association supprimée avec succès");
    }
  });
};

module.exports = {
  getTypeNote,
  postTypeNote,
  linkTypeNoteToMatiere,
  unlinkTypeNoteFromMatiere,
};
