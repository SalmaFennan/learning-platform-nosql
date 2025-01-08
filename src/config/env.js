// Question: Pourquoi est-il important de valider les variables d'environnement au démarrage ?
// Réponse : Valider les variables d'environnement dès le démarrage de l'application garantit que toutes les configurations nécessaires sont définies et correctes. Cela permet :
            //Stabilité : Évite des erreurs imprévues pendant l'exécution causées par des configurations manquantes ou incorrectes.
            //Sécurité : Empêche des informations sensibles (comme des clés API ou des URI) d'être accidentellement absentes ou mal définies.
             //Détection précoce des erreurs : Identifie les problèmes dès le démarrage au lieu de les découvrir plus tard dans l'exécution, ce qui facilite le débogage.
// Question: Que se passe-t-il si une variable requise est manquante ?
// Réponse : Si une variable d'environnement requise est manquante :
             //L'application risque de se comporter de manière imprévisible (par exemple, échec de la connexion à la base de données).
             //Des erreurs critiques peuvent survenir, ce qui peut entraîner l'arrêt de l'application.
            //En absence de validation explicite, ces erreurs peuvent être difficiles à diagnostiquer.

const dotenv = require('dotenv');
dotenv.config();

const requiredEnvVars = [
  'MONGODB_URI',
  'MONGODB_DB_NAME',
  'REDIS_URI'
];

// Validation des variables d'environnement
function validateEnv() {
  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
  if (missingVars.length > 0) {
    console.error(`❌ Erreur : Les variables d'environnement suivantes sont manquantes : ${missingVars.join(', ')}`);
    process.exit(1); // Arrête l'application avec un code d'erreur
  }
  console.log('✅ Toutes les variables d\'environnement nécessaires sont présentes.');
}

// Exécuter la validation
validateEnv();

module.exports = {
  mongodb: {
    uri: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_DB_NAME
  },
  redis: {
    uri: process.env.REDIS_URI
  },
  port: process.env.PORT || 3000
};
