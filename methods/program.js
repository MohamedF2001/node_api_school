const db = require("../config/db");

// Méthode GET : Vérifie/crée la table Programme et récupère tous les programmes
const getProgramme = (req, res) => {
  const createProgrammeTableSQL = `
      CREATE TABLE IF NOT EXISTS programme (
        id INT AUTO_INCREMENT PRIMARY KEY,
        matiere_id INT NOT NULL,
        classe_id INT NOT NULL,
        jour VARCHAR(50) NOT NULL,
        heure_debut TIME NOT NULL,
        heure_fin TIME NOT NULL,
        FOREIGN KEY (matiere_id) REFERENCES matiere(id) ON DELETE CASCADE,
        FOREIGN KEY (classe_id) REFERENCES classe(id) ON DELETE CASCADE
      );
    `;

  db.query(createProgrammeTableSQL, (err) => {
    if (err) {
      console.error("Erreur lors de la création de la table Programme :", err);
      res.status(500).send("Erreur lors de la création de la table Programme");
      return;
    }

    const selectSQL = `
      SELECT programme.*, matiere.nom AS matiere_nom, classe.nom AS classe_nom
      FROM programme
      INNER JOIN matiere ON programme.matiere_id = matiere.id
      INNER JOIN classe ON programme.classe_id = classe.id
    `;
    
    db.query(selectSQL, (err, results) => {
      if (err) {
        console.error("Erreur lors de la récupération des programmes :", err);
        res.status(500).send("Erreur lors de la récupération des programmes");
      } else {
        res.json(results);
      }
    });
  });
};

// Méthode POST : Ajouter un programme
const postProgramme = (req, res) => {
  const { matiere_id, classe_id, jour, heure_debut, heure_fin } = req.body;

  if (!matiere_id || !classe_id || !jour || !heure_debut || !heure_fin) {
    res.status(400).send("Tous les champs sont requis");
    return;
  }

  const insertSQL = `INSERT INTO programme (matiere_id, classe_id, jour, heure_debut, heure_fin) VALUES (?, ?, ?, ?, ?)`;
  db.query(insertSQL, [matiere_id, classe_id, jour, heure_debut, heure_fin], (err, result) => {
    if (err) {
      console.error("Erreur lors de l'ajout du programme :", err);
      res.status(500).send("Erreur lors de l'ajout du programme");
    } else {
      res.status(201).json({ id: result.insertId, matiere_id, classe_id, jour, heure_debut, heure_fin });
    }
  });
};

// Méthode PUT : Modifier un programme
const updateProgramme = (req, res) => {
  const { id } = req.params;
  const { jour, heure_debut, heure_fin } = req.body;

  if (!id || isNaN(id)) {
    res.status(400).send('Le champ "id" est requis et doit être un entier');
    return;
  }

  if (!jour || !heure_debut || !heure_fin) {
    res.status(400).send("Tous les champs sont requis");
    return;
  }

  const updateSQL = "UPDATE programme SET jour = ?, heure_debut = ?, heure_fin = ? WHERE id = ?";
  db.query(updateSQL, [jour, heure_debut, heure_fin, id], (err, result) => {
    if (err) {
      console.error("Erreur lors de la mise à jour du programme :", err);
      res.status(500).send("Erreur lors de la mise à jour du programme");
    } else if (result.affectedRows === 0) {
      res.status(404).send("Programme non trouvé");
    } else {
      res.send("Programme mis à jour avec succès");
    }
  });
};

// Méthode DELETE : Supprimer un programme
const deleteProgramme = (req, res) => {
  const { id } = req.body;

  if (!id || isNaN(id)) {
    res.status(400).send('Le champ "id" est requis et doit être un entier');
    return;
  }

  const deleteSQL = "DELETE FROM programme WHERE id = ?";
  db.query(deleteSQL, [id], (err, result) => {
    if (err) {
      console.error("Erreur lors de la suppression du programme :", err);
      res.status(500).send("Erreur lors de la suppression du programme");
    } else if (result.affectedRows === 0) {
      res.status(404).send("Programme non trouvé");
    } else {
      res.send("Programme supprimé avec succès");
    }
  });
};

// Récupérer les programmes d'une classe spécifique
const getProgrammesByClasse = (req, res) => {
  const { classe_id } = req.params;

  if (!classe_id || isNaN(classe_id)) {
    res.status(400).send('Le champ "classe_id" est requis et doit être un entier');
    return;
  }

  const selectSQL = `
    SELECT programme.id, matiere.nom AS matiere_nom, classe.nom AS classe_nom, programme.jour, programme.heure_debut, programme.heure_fin
    FROM programme
    INNER JOIN matiere ON programme.matiere_id = matiere.id
    INNER JOIN classe ON programme.classe_id = classe.id
    WHERE programme.classe_id = ?
  `;

  db.query(selectSQL, [classe_id], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des programmes :", err);
      res.status(500).send("Erreur lors de la récupération des programmes");
    } else {
      res.json(results);
    }
  });
};


module.exports = {
  getProgramme,
  postProgramme,
  updateProgramme,
  deleteProgramme,
  getProgrammesByClasse
};
