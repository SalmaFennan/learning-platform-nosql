// Question: Pourquoi créer des services séparés ?
// Réponse: 

const { ObjectId } = require('mongodb');
const db = require('../config/db'); // Assurez-vous que db est correctement configuré

// Fonction utilitaire pour trouver un document par ID
async function findOneById(collection, id) {
  try {
    // Vérifier si l'ID est valide
    if (!ObjectId.isValid(id)) {
      throw new Error('ID invalide');
    }

    // Rechercher le document dans la collection
    const document = await db.collection(collection).findOne({ _id: ObjectId(id) });

    // Vérifier si le document existe
    if (!document) {
      throw new Error('Document non trouvé');
    }

    return document;
  } catch (error) {
    console.error('Erreur dans mongoService.findOneById:', error);
    throw error;
  }
}

// Fonction pour créer un cours
async function createCourse(courseData) {
  try {
    const result = await db.collection('courses').insertOne(courseData);
    return result.ops[0]; // Retourner le cours créé
  } catch (error) {
    console.error('Erreur dans mongoService.createCourse:', error);
    throw error;
  }
}

// Fonction pour récupérer un cours par ID
async function getCourseById(courseId) {
  try {
    const course = await findOneById('courses', courseId); // Utilisation de la fonction findOneById
    return course;
  } catch (error) {
    throw new Error('Erreur lors de la récupération du cours');
  }
}

// Fonction pour obtenir le nombre total de cours
async function getTotalCourses() {
  try {
    const count = await db.collection('courses').countDocuments();
    return count;
  } catch (error) {
    throw new Error('Erreur lors du calcul des statistiques');
  }
}

// Export des services
module.exports = {
  findOneById,
  createCourse,
  getCourseById,
  getTotalCourses
};
