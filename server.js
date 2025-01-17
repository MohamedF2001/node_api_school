const express = require("express");
const cors = require("cors"); // Importer le module CORS
//const path = require('path');
const {
  getMatiere,
  postMatiere,
  updateMatiere,
  deleteMatiere,
} = require("./methods/matiere");

const {
  getEleve,  
  postEleve,
  updateEleve,
  deleteEleve,
  //getElevesByClasse,
} = require("./methods/eleve");
const {
  getNotes,
  postNote,
  updateNote,
  deleteNote,
} = require("./methods/note");
const {
  getProfesseur,
  postProfesseur,
  updateProfesseur,
  deleteProfesseur,
  //getProfesseursByMatiere,
} = require("./methods/professeur");
const {
  getTypeNote,
  postTypeNote,
  linkTypeNoteToMatiere,
  unlinkTypeNoteFromMatiere,
  //getNotesFiltered,
} = require("./methods/typenote");
const {
  getClasse,
  postClasse,
  updateClasse,
  deleteClasse,
} = require("./methods/classe"); // Import des méthodes

const app = express();
const PORT = 3000;

/* "src": "/api/(.*)", */

app.use(cors());

// Middleware pour parser le JSON
app.use(express.json());


/* // Serve Swagger UI HTML file
app.use('/api-docs', express.static(path.join(__dirname, 'public', 'swagger.html')));

// Serve Swagger JSON file
app.use('/swagger.json', express.static(path.join(__dirname, 'public', 'swagger.json'))); */



app.get('/', (req, res) => {
  res.status(200).json('Welcome, your app is working well okk');
});

// Routes utilisant les méthodes définies dans methods.js
app.get("/api/classe", getClasse); // Route GET
app.post("/api/classe", postClasse); // Route POST
app.put("/api/classe/:id", updateClasse); // Route PUT
app.delete("/api/classe", deleteClasse); // Route DELETE

// Routes pour la table Matière
app.get("/api/matiere", getMatiere); // Récupère les matières
app.post("/api/matiere", postMatiere); // Ajoute une nouvelle matière
app.put("/api/matiere/:id", updateMatiere); // Modifie une matière
app.delete("/api/matiere", deleteMatiere); // Supprime une matière

// Routes pour la table Eleve
app.get("/api/eleve", getEleve); // Récupère les élèves
app.post("/api/eleve", postEleve); // Ajoute un nouvel élève
app.put("/api/eleve/:id", updateEleve); // Modifie un élève
app.delete("/api/eleve", deleteEleve); // Supprime un élève
//app.get("/api/eleve/classe/:classe_id", getElevesByClasse);

// Routes pour la table Professeur
app.get("/api/professeur", getProfesseur); // Récupère les professeurs
app.post("/api/professeur", postProfesseur); // Ajoute un nouveau professeur
app.put("/api/professeur/:id", updateProfesseur); // Modifie un professeur
app.delete("/api/professeur", deleteProfesseur); // Supprime un professeur
//app.get("api/professeurs/matiere/:matiere_id", getProfesseursByMatiere);

app.get("/api/typenote", getTypeNote); // Récupérer les associations
app.post("/api/typenote", postTypeNote); // Ajouter un type de note global
app.post("/api/typenote/link", linkTypeNoteToMatiere); // Associer un type de note à une matière
app.delete("/api/typenote/unlink", unlinkTypeNoteFromMatiere); // Supprimer l'association

app.get("/api/notes", getNotes); // Récupérer toutes les notes
app.post("/api/notes", postNote); // Ajouter une nouvelle note
app.put("/api/notes/:id", updateNote); // Modifier une note existante
app.delete("/api/notes", deleteNote); // Supprimer une note
//router.get("/notes/classe/:classe_id", noteController.getNotesByClasse);
//app.get("api/notes/filter", getNotesFiltered);

//Filtrer par classe :
//GET /notes/filter?classe_id=2

//Filtrer par classe et matière :
//GET /notes/filter?classe_id=2&matiere_id=4

//Filtrer par élève, matière et type de note :
//GET /notes/filter?eleve_id=5&matiere_id=3&typenote_id=1

//Sans filtre (renvoie toutes les notes) :
//GET /notes/filter


// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
