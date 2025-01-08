// Question : Pourquoi créer un module séparé pour les connexions aux bases de données ?
// Réponse : Créer un module séparé pour les connexions aux bases de données améliore la maintenabilité et l'organisation du code. Cela permet :
            //Réutilisabilité ,Séparation des responsabilités, Facilité de modification, Gestion des erreurs centralisée
// Question : Comment gérer proprement la fermeture des connexions ?
// Réponse : Pour éviter des fuites de ressources et garantir que les connexions sont fermées correctement lorsque l'application s'arrête, vous pouvez :
            //Utiliser des gestionnaires d'événements : Par exemple, capturer les signaux système comme SIGINT (Ctrl + C) pour fermer les connexions avant que le processus ne se termine.
            //Méthodes spécifiques : Utiliser les méthodes fournies par les clients des bases de données pour fermer les connexions (e.g., client.close() pour MongoDB).
            //Encapsulation dans une fonction : Créer une fonction de nettoyage dédiée qui est appelée dans les gestionnaires d'événements ou avant la fin du script.

const { MongoClient } = require('mongodb');
const Redis = require("ioredis");
const redis = new Redis();
const config = require('./env');

let mongoClient, redisClient, db;
const mongoose = require('mongoose');
async function connectMongo() {
  console.log('MongoDB URI:', process.env.MONGODB_URI); // Pour vérifier l'URL
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1); // Quitte l'application en cas d'erreur critique
  }
}

async function connectRedis() {
  try {
    const { createClient } = require('redis');
    redisClient = createClient({ url: config.REDIS_URL });
    redisClient.on('error', (err) => console.error('❌ Redis connection error:', err));
    await redisClient.connect();
    console.log('✅ Connected to Redis');
  } catch (error) {
    console.error('❌ Redis connection error:', error);
    process.exit(1);
  }
}
function closeConnections() {
  if (mongoClient) {
    mongoClient.close().then(() => console.log('🛑 MongoDB connection closed'));
  }
  if (redisClient) {
    redisClient.quit().then(() => console.log('🛑 Redis connection closed'));
  }
}

// Capture les signaux système pour fermer proprement
process.on('SIGINT', () => {
  closeConnections();
  process.exit(0);
});

// Export des fonctions et clients
module.exports = {
  connectMongo,
  connectRedis,
  closeConnections,
  getMongoDB: () => db, // Pour accéder à la base MongoDB
  getRedisClient: () => redisClient // Pour accéder au client Redis
};