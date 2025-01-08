// Question : Comment gérer efficacement le cache avec Redis ?
// Réponse :
// Question: Quelles sont les bonnes pratiques pour les clés Redis ?
// Réponse :

const redis = require('redis');
const client = redis.createClient({ url: process.env.REDIS_URI });

client.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

// Fonction générique de mise en cache des données
async function cacheData(key, data, ttl = 3600) {  // TTL par défaut : 1 heure
  try {
    // Convertir l'objet 'data' en chaîne JSON
    const jsonData = JSON.stringify(data);
    
    // Mettre les données en cache avec une expiration
    await client.setEx(key, ttl, jsonData);
    console.log(`Données mises en cache sous la clé: ${key}`);
  } catch (error) {
    console.error('Erreur lors de la mise en cache:', error);
  }
}

// Fonction pour récupérer les données mises en cache
async function getCacheData(key) {
  try {
    const data = await client.get(key);
    if (data) {
      return JSON.parse(data); // Retourner les données sous forme d'objet
    } else {
      return null;  // Si la clé n'existe pas dans le cache
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du cache:', error);
    return null;
  }
}

// Export des fonctions de cache
module.exports = {
  cacheData,
  getCacheData,
};
