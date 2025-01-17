const express = require('express');
const config = require('./config/env');
const db = require('./config/db'); // Assurez-vous que ce fichier exporte les fonctions connectMongo et connectRedis

const app = express();
const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');



// Vérifier que la variable d'environnement MONGODB_URI est bien définie
if (!process.env.MONGODB_URI) {
  console.error('❌ La variable d\'environnement MONGODB_URI est indéfinie.');
  process.exit(1); // Arrêter l'application si la variable est manquante
}

// Fonction pour configurer Express
function configureExpress() {
  app.use(express.json()); // Middleware pour parser les requêtes JSON
  app.use(express.urlencoded({ extended: true })); // Middleware pour parser les données URL-encodées

  // Monter les routes
  app.use('/courses', courseRoutes);
  app.use('/students', studentRoutes);
  app.use('/enrollment', enrollmentRoutes);
}

// Fonction pour connecter aux bases de données
async function connectDatabases() {
  try {
    // Connexion à MongoDB
    await db.connectMongo();
    // Connexion à Redis
    await db.connectRedis();
  } catch (error) {
    console.error('Failed to connect to databases:', error);
    throw error; // Relancer l'erreur pour qu'elle soit capturée dans le démarrage
  }
}

// Ajouter un gestionnaire d'erreurs global pour Express
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Fonction pour démarrer le serveur
async function startServer() {
  try {
    // Initialiser les connexions aux bases de données
    await connectDatabases();

    // Configurer Express
    configureExpress();

    // Démarrer le serveur sur le port configuré
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1); // Quitter avec un code d'erreur en cas de problème
  }
}

// Gestion propre de l'arrêt de l'application
process.on('SIGTERM', async () => {
  try {
    console.log('Shutting down gracefully...');
    // Fermer les connexions aux bases de données et autres ressources
    await db.disconnect(); // Assurez-vous d'avoir une fonction de déconnexion dans db.js
    console.log('Server shutdown complete.');
    process.exit(0); // Quitter avec un code de succès
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1); // Quitter avec un code d'erreur en cas de problème
  }
});

// Démarrer le serveur
startServer();