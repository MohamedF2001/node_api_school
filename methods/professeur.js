const db = require("../config/db");

// Méthode GET : Vérifie/crée la table et récupère son contenu
const getProfesseur = (req, res) => {
  const createTableSQL = `
      CREATE TABLE IF NOT EXISTS professeur (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        prenom VARCHAR(255) NOT NULL,
        email VARCHAR(200) NOT NULL UNIQUE,
        matiere_id INT,
        FOREIGN KEY (matiere_id) REFERENCES matiere(id) ON DELETE SET NULL
      );
    `;

  db.query(createTableSQL, (err) => {
    if (err) {
      console.error("Erreur lors de la création de la table :", err);
      res.status(500).send("Erreur lors de la création de la table");
      return;
    }

    const selectSQL = `
        SELECT professeur.*, matiere.nom AS matiere_nom
        FROM professeur
        LEFT JOIN matiere ON professeur.matiere_id = matiere.id
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
};

// Méthode POST : Insère un nouveau professeur
const postProfesseur = (req, res) => {
  const { nom, prenom, email, matiere_id } = req.body;

  if (!nom || typeof nom !== "string") {
    res
      .status(400)
      .send('Le champ "nom" est requis et doit être une chaîne de caractères');
    return;
  }
  if (!prenom || typeof prenom !== "string") {
    res
      .status(400)
      .send(
        'Le champ "prenom" est requis et doit être une chaîne de caractères'
      );
    return;
  }
  if (!email || typeof email !== "string") {
    res
      .status(400)
      .send(
        'Le champ "email" est requis et doit être une chaîne de caractères'
      );
    return;
  }

  const insertSQL =
    "INSERT INTO professeur (nom, prenom, email, matiere_id) VALUES (?, ?, ?, ?)";
  db.query(
    insertSQL,
    [nom, prenom, email, matiere_id || null],
    (err, result) => {
      if (err) {
        console.error("Erreur lors de l'insertion des données :", err);
        res.status(500).send("Erreur lors de l'insertion des données");
      } else {
        res
          .status(201)
          .json({ id: result.insertId, nom, prenom, email, matiere_id });
      }
    }
  );
};

// Méthode PUT : Modifie un professeur par son ID
const updateProfesseur = (req, res) => {
  const { id } = req.params;
  const { nom, prenom, email, matiere_id } = req.body;

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

  if (!prenom || typeof prenom !== "string") {
    res
      .status(400)
      .send(
        'Le champ "prenom" est requis et doit être une chaîne de caractères'
      );
    return;
  }

  if (!email || typeof email !== "string") {
    res
      .status(400)
      .send(
        'Le champ "email" est requis et doit être une chaîne de caractères'
      );
    return;
  }

  if (matiere_id !== null && matiere_id !== undefined && isNaN(matiere_id)) {
    res.status(400).send('Le champ "matiere_id" doit être un entier ou null');
    return;
  }

  // Requête SQL pour la mise à jour
  const updateSQL = `
      UPDATE professeur 
      SET nom = ?, prenom = ?, email = ?, matiere_id = ? 
      WHERE id = ?
    `;

  db.query(
    updateSQL,
    [nom, prenom, email, matiere_id || null, id],
    (err, result) => {
      if (err) {
        console.error("Erreur lors de la mise à jour du professeur :", err);
        res.status(500).send("Erreur lors de la mise à jour du professeur");
        return;
      }

      if (result.affectedRows === 0) {
        res.status(404).send("Professeur non trouvé");
        return;
      }

      res.json({ id, nom, prenom, email, matiere_id });
    }
  );
};

// Méthode DELETE : Supprime un professeur par son ID
const deleteProfesseur = (req, res) => {
  const { id } = req.body;

  if (!id || isNaN(id)) {
    res.status(400).send("Un ID valide est requis");
    return;
  }

  const deleteSQL = "DELETE FROM professeur WHERE id = ?";
  db.query(deleteSQL, [id], (err, result) => {
    if (err) {
      console.error("Erreur lors de la suppression des données :", err);
      res.status(500).send("Erreur lors de la suppression des données");
    } else if (result.affectedRows === 0) {
      res.status(404).send("Professeur non trouvé");
    } else {
      res.send(`Professeur avec ID ${id} supprimé avec succès`);
    }
  });
};

// Méthode GET : Récupère les professeurs en fonction de la matière
const getProfesseursByMatiere = (req, res) => {
  const { matiere_id } = req.params;

  if (!matiere_id || isNaN(matiere_id)) {
    res.status(400).send("Un ID de matière valide est requis");
    return;
  }

  const selectSQL = `
    SELECT professeur.*, matiere.nom AS matiere_nom
    FROM professeur
    LEFT JOIN matiere ON professeur.matiere_id = matiere.id
    WHERE professeur.matiere_id = ?
  `;

  db.query(selectSQL, [matiere_id], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des professeurs :", err);
      res.status(500).send("Erreur lors de la récupération des professeurs");
    } else if (results.length === 0) {
      res.status(404).send("Aucun professeur trouvé pour cette matière");
    } else {
      res.json(results);
    }
  });
};


module.exports = {
  getProfesseur,
  postProfesseur,
  updateProfesseur,
  deleteProfesseur,
  getProfesseursByMatiere
};
