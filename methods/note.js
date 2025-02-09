const db = require("../config/db");

// Méthode GET : Vérifie/crée la table note et récupère les notes
const getNotes = (req, res) => {
  // Créer la table 'note' si elle n'existe pas
  const createTableSQL = `
      CREATE TABLE IF NOT EXISTS note (
        id INT AUTO_INCREMENT PRIMARY KEY,
        eleve_id INT NOT NULL,
        matiere_id INT NOT NULL,
        typenote_id INT NOT NULL,
        classe_id INT NOT NULL,
        valeur DECIMAL(5, 2),
        FOREIGN KEY (eleve_id) REFERENCES eleve(id),
        FOREIGN KEY (matiere_id) REFERENCES matiere(id),
        FOREIGN KEY (typenote_id) REFERENCES typenote(id),
        FOREIGN KEY (classe_id) REFERENCES classe(id)
      );
    `;

  db.query(createTableSQL, (err) => {
    if (err) {
      console.error("Erreur lors de la création de la table note :", err);
      res.status(500).send("Erreur lors de la création de la table note");
      return;
    }

    // Une fois la table créée (si elle n'existait pas), récupérer les données
    const selectSQL = `
        SELECT note.id, eleve.nom AS eleve_nom, eleve.prenom AS eleve_prenom, 
               matiere.nom AS matiere_nom, typenote.nom AS typenote_nom, 
               note.valeur, classe.nom AS classe_nom
        FROM note
        INNER JOIN eleve ON note.eleve_id = eleve.id
        INNER JOIN matiere ON note.matiere_id = matiere.id
        INNER JOIN typenote ON note.typenote_id = typenote.id
        INNER JOIN classe ON note.classe_id = classe.id
      `;

    db.query(selectSQL, (err, results) => {
      if (err) {
        console.error("Erreur lors de la récupération des notes :", err);
        res.status(500).send("Erreur lors de la récupération des notes");
      } else {
        res.json(results);
      }
    });
  });
};

// Méthode POST : Ajoute une nouvelle note
const postNote = (req, res) => {
  const { eleve_id, matiere_id, typenote_id, classe_id, valeur } = req.body;

  if (!eleve_id || isNaN(eleve_id)) {
    res
      .status(400)
      .send('Le champ "eleve_id" est requis et doit être un entier');
    return;
  }

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

  if (!classe_id || isNaN(classe_id)) {
    res
      .status(400)
      .send('Le champ "classe_id" est requis et doit être un entier');
    return;
  }

  if (typeof valeur !== "number") {
    res.status(400).send('Le champ "valeur" est requis et doit être un nombre');
    return;
  }

  const insertSQL =
    "INSERT INTO note (eleve_id, matiere_id, typenote_id, classe_id, valeur) VALUES (?, ?, ?, ?, ?)";
  db.query(
    insertSQL,
    [eleve_id, matiere_id, typenote_id, classe_id, valeur],
    (err, result) => {
      if (err) {
        console.error("Erreur lors de l'insertion de la note :", err);
        res.status(500).send("Erreur lors de l'insertion de la note");
      } else {
        res.status(201).json({
          id: result.insertId,
          eleve_id,
          matiere_id,
          typenote_id,
          classe_id,
          valeur,
        });
      }
    }
  );
};

// Méthode PUT : Modifie une note existante
const updateNote = (req, res) => {
  const { id } = req.params;
  const { eleve_id, matiere_id, typenote_id, classe_id, valeur } = req.body;

  if (!id || isNaN(id)) {
    res.status(400).send("Un ID valide est requis");
    return;
  }

  if (!eleve_id || isNaN(eleve_id)) {
    res
      .status(400)
      .send('Le champ "eleve_id" est requis et doit être un entier');
    return;
  }

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

  if (!classe_id || isNaN(classe_id)) {
    res
      .status(400)
      .send('Le champ "classe_id" est requis et doit être un entier');
    return;
  }

  if (typeof valeur !== "number") {
    res.status(400).send('Le champ "valeur" est requis et doit être un nombre');
    return;
  }

  const updateSQL =
    "UPDATE note SET eleve_id = ?, matiere_id = ?, typenote_id = ?, classe_id = ?, valeur = ? WHERE id = ?";
  db.query(
    updateSQL,
    [eleve_id, matiere_id, typenote_id, classe_id, valeur, id],
    (err, result) => {
      if (err) {
        console.error("Erreur lors de la mise à jour de la note :", err);
        res.status(500).send("Erreur lors de la mise à jour de la note");
      } else if (result.affectedRows === 0) {
        res.status(404).send("Note non trouvée");
      } else {
        res.json({ id, eleve_id, matiere_id, typenote_id, classe_id, valeur });
      }
    }
  );
};

// Méthode DELETE : Supprime une note par son ID
const deleteNote = (req, res) => {
  const { id } = req.body;

  if (!id || isNaN(id)) {
    res.status(400).send("Un ID valide est requis");
    return;
  }

  const deleteSQL = "DELETE FROM note WHERE id = ?";
  db.query(deleteSQL, [id], (err, result) => {
    if (err) {
      console.error("Erreur lors de la suppression de la note :", err);
      res.status(500).send("Erreur lors de la suppression de la note");
    } else if (result.affectedRows === 0) {
      res.status(404).send("Note non trouvée");
    } else {
      res.send(`Note avec ID ${id} supprimée avec succès`);
    }
  });
};

// Méthode GET : Récupère les notes avec des filtres dynamiques
/* const getNotesFiltered = (req, res) => {
  const { classe_id, eleve_id, matiere_id, typenote_id } = req.query;

  // Construction dynamique de la requête SQL
  let filters = [];
  let values = [];

  if (classe_id && !isNaN(classe_id)) {
    filters.push("note.classe_id = ?");
    values.push(classe_id);
  }

  if (eleve_id && !isNaN(eleve_id)) {
    filters.push("note.eleve_id = ?");
    values.push(eleve_id);
  }

  if (matiere_id && !isNaN(matiere_id)) {
    filters.push("note.matiere_id = ?");
    values.push(matiere_id);
  }

  if (typenote_id && !isNaN(typenote_id)) {
    filters.push("note.typenote_id = ?");
    values.push(typenote_id);
  }

  // Construction de la requête SQL avec les filtres
  const selectSQL = `
    SELECT note.id, eleve.nom AS eleve_nom, eleve.prenom AS eleve_prenom,
           matiere.nom AS matiere_nom, typenote.nom AS typenote_nom,
           note.valeur, classe.nom AS classe_nom
    FROM note
    INNER JOIN eleve ON note.eleve_id = eleve.id
    INNER JOIN matiere ON note.matiere_id = matiere.id
    INNER JOIN typenote ON note.typenote_id = typenote.id
    INNER JOIN classe ON note.classe_id = classe.id
    ${filters.length > 0 ? "WHERE " + filters.join(" AND ") : ""}
  `;

  db.query(selectSQL, values, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des notes :", err);
      res.status(500).send("Erreur lors de la récupération des notes");
    } else {
      res.json(results);
    }
  });
};   */

const getNotesFiltered = (req, res) => {
  const { classe_id, eleve_id, matiere_id, typenote_id } = req.query;

  console.log("Requête reçue avec paramètres :", req.query);

  let filters = [];
  let values = [];

  const parsedClasseId = parseInt(classe_id, 10);
  const parsedEleveId = parseInt(eleve_id, 10);
  const parsedMatiereId = parseInt(matiere_id, 10);
  const parsedTypeNoteId = parseInt(typenote_id, 10);

  if (!isNaN(parsedClasseId)) {
    filters.push("note.classe_id = ?");
    values.push(parsedClasseId);
  }

  if (!isNaN(parsedEleveId)) {
    filters.push("note.eleve_id = ?");
    values.push(parsedEleveId);
  }

  if (!isNaN(parsedMatiereId)) {
    filters.push("note.matiere_id = ?");
    values.push(parsedMatiereId);
  }

  if (!isNaN(parsedTypeNoteId)) {
    filters.push("note.typenote_id = ?");
    values.push(parsedTypeNoteId);
  }

  const querySQL = `
    SELECT note.id, eleve.nom AS eleve_nom, eleve.prenom AS eleve_prenom,
           matiere.nom AS matiere_nom, typenote.nom AS typenote_nom,
           note.valeur, classe.nom AS classe_nom
    FROM note
    INNER JOIN eleve ON note.eleve_id = eleve.id
    INNER JOIN matiere ON note.matiere_id = matiere.id
    INNER JOIN typenote ON note.typenote_id = typenote.id
    INNER JOIN classe ON note.classe_id = classe.id
    ${filters.length > 0 ? "WHERE " + filters.join(" AND ") : ""}`;

  console.log("Requête SQL exécutée :", querySQL);
  console.log("Valeurs utilisées :", values);

  db.query(querySQL, values, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des notes :", err);
      res.status(500).send("Erreur lors de la récupération des notes");
    } else {
      res.json(results);
    }
  });
};



module.exports = { getNotes, postNote, updateNote, deleteNote, getNotesFiltered };
