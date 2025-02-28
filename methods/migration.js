const db = require("../config/db"); // Import de la connexion MySQL

const alterTableSQL = `
  ALTER TABLE eleve ADD COLUMN sexe VARCHAR(50) UNIQUE NOT NULL;
`;

db.query(alterTableSQL, (err) => {
  if (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log("La colonne 'sexe' existe déjà.");
    } else {
      console.error("Erreur lors de la modification de la table :", err);
    }
  } else {
    console.log("Colonne 'sexe' ajoutée avec succès !");
  }
  
  db.end(); // Fermer la connexion après l'exécution
});
