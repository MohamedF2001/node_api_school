const express = require("express");
const swaggerUi = require("swagger-ui-express");
//const swaggerDocument = require("./swagger.json");
const path = require('path');
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
} = require("./methods/professeur");
const {
  getTypeNote,
  postTypeNote,
  linkTypeNoteToMatiere,
  unlinkTypeNoteFromMatiere,
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



// Middleware pour parser le JSON
app.use(express.json());

// Ajouter la page Swagger
//app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Serve Swagger UI HTML file
app.use('/api-docs', express.static(path.join(__dirname, 'public')));

// Serve Swagger JSON file
app.use('/swagger.json', express.static(path.join(__dirname, 'public', 'swagger.json')));



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

// Routes pour la table Professeur
app.get("/api/professeur", getProfesseur); // Récupère les professeurs
app.post("/api/professeur", postProfesseur); // Ajoute un nouveau professeur
app.put("/api/professeur/:id", updateProfesseur); // Modifie un professeur
app.delete("/api/professeur", deleteProfesseur); // Supprime un professeur

app.get("/api/typenote", getTypeNote); // Récupérer les associations
app.post("/api/typenote", postTypeNote); // Ajouter un type de note global
app.post("/api/typenote/link", linkTypeNoteToMatiere); // Associer un type de note à une matière
app.delete("/api/typenote/unlink", unlinkTypeNoteFromMatiere); // Supprimer l'association

app.get("/api/notes", getNotes); // Récupérer toutes les notes
app.post("/api/notes", postNote); // Ajouter une nouvelle note
app.put("/api/notes/:id", updateNote); // Modifier une note existante
app.delete("/api/notes", deleteNote); // Supprimer une note

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
