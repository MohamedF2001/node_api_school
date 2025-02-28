const db = require("../config/db");

// Méthode GET : Vérifie/crée la table et récupère son contenu
const getEleve = (req, res) => {
    const createTableSQL = `
          CREATE TABLE IF NOT EXISTS eleve (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nom VARCHAR(255) NOT NULL,
            prenom VARCHAR(255) NOT NULL,
            sexe VARCHAR(50),
            nationalite VARCHAR(100),
            date_naissance VARCHAR(255) NOT NULL,
            classe_id INT,
            FOREIGN KEY (classe_id) REFERENCES classe(id) ON DELETE SET NULL
          );
        `;
  
    db.query(createTableSQL, (err) => {
      if (err) {
        console.error("Erreur lors de la création de la table :", err);
        res.status(500).send("Erreur lors de la création de la table");
        return;
      }
  
      // Récupérer les données après avoir vérifié/créé la table
      const selectSQL = `
            SELECT eleve.*, classe.nom AS classe_nom
            FROM eleve
            LEFT JOIN classe ON eleve.classe_id = classe.id
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

// Méthode POST : Insère un nouvel élève
/* const postEleve = (req, res) => {
  const { nom, prenom, date_naissance, classe_id , matricule } = req.body;

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
  if (!date_naissance || typeof date_naissance !== "string") {
    res
      .status(400)
      .send(
        'Le champ "date_naissance" est requis et doit être une chaîne de caractères'
      );
    return;
  }
  if (!matricule || typeof matricule !== "string") {
    res.status(400).send('Le champ "matricule" est requis et doit être une chaîne de caractères');
    return;
  }

  const insertSQL =
    "INSERT INTO eleve (nom, prenom, date_naissance, classe_id) VALUES (?, ?, ?, ?)";
  db.query(
    insertSQL,
    [matricule, nom, prenom, date_naissance, classe_id || null],
    (err, result) => {
      if (err) {
        console.error("Erreur lors de l'insertion des données :", err);
        res.status(500).send("Erreur lors de l'insertion des données");
      } else {
        res.status(201).json({
          id: result.insertId,
          matricule,
          nom,
          prenom,
          date_naissance,
          classe_id,
        });
      }
    }
  );
}; */

const postEleve = (req, res) => {
  const { nom, prenom, date_naissance, classe_id, matricule, sexe, nationalite } = req.body;

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
  if (!date_naissance || typeof date_naissance !== "string") {
    res
      .status(400)
      .send(
        'Le champ "date_naissance" est requis et doit être une chaîne de caractères'
      );
    return;
  }
  if (!matricule || typeof matricule !== "string") {
    res.status(400).send('Le champ "matricule" est requis et doit être une chaîne de caractères');
    return;
  }
  if (!sexe || typeof sexe !== "string") {
    res.status(400).send('Le champ "sexe" est requis et doit être une chaîne de caractères');
    return;
  }
  if (!nationalite || typeof nationalite !== "string") {
    res.status(400).send('Le champ "nationalite" est requis et doit être une chaîne de caractères');
    return;
  }

  const insertSQL =
    "INSERT INTO eleve (matricule, nom, prenom, sexe, nationalite, date_naissance, classe_id) VALUES (?, ?, ?, ?, ?, ?, ?)";

  db.query(
    insertSQL,
    [matricule, nom, prenom, sexe, nationalite, date_naissance, classe_id || null],
    (err, result) => {
      if (err) {
        console.error("Erreur lors de l'insertion des données :", err);
        res.status(500).send("Erreur lors de l'insertion des données");
      } else {
        res.status(201).json({
          id: result.insertId,
          matricule,
          nom,
          prenom,
          sexe,
          nationalite,
          date_naissance,
          classe_id,
        });
      }
    }
  );
};


// Méthode PUT : Modifie un élève par son ID
const updateEleve = (req, res) => {
  const { id } = req.params;
  const { nom, prenom, sexe, nationalite, date_naissance, classe_id } = req.body;

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

  if (!sexe || typeof sexe !== "string") {
    res
      .status(400)
      .send(
        'Le champ "sexe" est requis et doit être une chaîne de caractères'
      );
    return;
  }

  if (!nationalite || typeof nationalite !== "string") {
    res
      .status(400)
      .send(
        'Le champ "nationalité" est requis et doit être une chaîne de caractères'
      );
    return;
  }

  if (!date_naissance || typeof date_naissance !== "string") {
    res
      .status(400)
      .send(
        'Le champ "date_naissance" est requis et doit être une chaîne de caractères'
      );
    return;
  }

  if (classe_id !== null && classe_id !== undefined && isNaN(classe_id)) {
    res.status(400).send('Le champ "classe_id" doit être un entier ou null');
    return;
  }

  // Requête SQL pour la mise à jour
  const updateSQL = `
        UPDATE eleve 
        SET nom = ?, prenom = ?, sexe = ?, nationalite = ?, date_naissance = ?, classe_id = ? 
        WHERE id = ?
      `;
  db.query(
    updateSQL,
    [nom, prenom, sexe, nationalite, date_naissance, classe_id || null, id],
    (err, result) => {
      if (err) {
        console.error("Erreur lors de la mise à jour de l'élève :", err);
        res.status(500).send("Erreur lors de la mise à jour de l'élève");
        return;
      }

      if (result.affectedRows === 0) {
        res.status(404).send("Élève non trouvé");
        return;
      }

      // Réponse avec les données mises à jour
      res.json({ id, nom, prenom,sexe, nationalite, date_naissance, classe_id });
    }
  );
};

// Méthode DELETE : Supprime un élève par son ID
const deleteEleve = (req, res) => {
  const { id } = req.body;

  if (!id || isNaN(id)) {
    res.status(400).send("Un ID valide est requis");
    return;
  }

  const deleteSQL = "DELETE FROM eleve WHERE id = ?";
  db.query(deleteSQL, [id], (err, result) => {
    if (err) {
      console.error("Erreur lors de la suppression des données :", err);
      res.status(500).send("Erreur lors de la suppression des données");
    } else if (result.affectedRows === 0) {
      res.status(404).send("Élève non trouvé");
    } else {
      res.send(`Élève avec ID ${id} supprimé avec succès`);
    }
  });
};

// Méthode GET : Récupère les élèves par ID de classe
const getElevesByClasse = (req, res) => {
  const { classe_id } = req.params;

  if (!classe_id || isNaN(classe_id)) {
    res.status(400).send("Un ID de classe valide est requis");
    return;
  }

  const selectSQL = `
    SELECT eleve.*, classe.nom AS classe_nom
    FROM eleve
    LEFT JOIN classe ON eleve.classe_id = classe.id
    WHERE eleve.classe_id = ?
  `;

  db.query(selectSQL, [classe_id], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des élèves :", err);
      res.status(500).send("Erreur lors de la récupération des élèves");
    } else {
      res.json(results);
    }
  });
};  


module.exports = { getEleve, postEleve, updateEleve, deleteEleve, getElevesByClasse };
