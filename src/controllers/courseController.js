// Question: Quelle est la différence entre un contrôleur et une route ?
// Réponse:Route : Une route définit l'URL et la méthode HTTP (GET, POST, PUT, DELETE, etc.) qui doivent être écoutées par le serveur. Elle agit comme un point d'entrée pour l'application en définissant le chemin auquel les requêtes doivent être adressées.
          //Un contrôleur contient la logique spécifique à l'opération. Il traite la requête reçue par la route, applique la logique métier (business logic), interagit avec les services ou les bases de données, et retourne une réponse appropriée au client.
// Question : Pourquoi séparer la logique métier des routes ?
// Réponse :Lisibilité et clarté :
            //Séparer la logique métier des routes rend le code plus lisible et organisé. Les routes ne contiennent que des définitions de chemins et délèguent le travail aux contrôleurs.
            //Réutilisabilité : La logique métier définie dans les contrôleurs ou les services peut être réutilisée par plusieurs routes, réduisant la duplication du code.
            //Testabilité :Tester une logique métier isolée (dans un contrôleur ou un service) est plus simple que de tester un fichier de route contenant tout le code.
            // Respect des bonnes pratiques :La séparation des responsabilités est une pratique clé dans le développement logiciel. Les routes se concentrent sur la gestion des requêtes, tandis que les contrôleurs se concentrent sur la logique métier.

            const { ObjectId } = require('mongodb');
            const db = require('../config/db');
            const mongoService = require('../services/mongoService');
            const redisService = require('../services/redisService');
            
            // Fonction pour créer un cours
            async function createCourse(req, res) {
              try {
                const { title, description } = req.body;
            
                // Valider les données d'entrée
                if (!title || !description) {
                  return res.status(400).json({ error: 'Titre et description sont requis.' });
                }
            
                // Utiliser un service pour gérer la création en base
                const newCourse = await mongoService.createCourse({ title, description });
            
                // Envoyer une réponse au client
                res.status(201).json(newCourse);
              } catch (error) {
                console.error('Erreur lors de la création du cours:', error);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
              }
            }
            
            // Fonction pour récupérer un cours par ID
            async function getCourse(req, res) {
              try {
                const courseId = req.params.id;
            
                // Vérifier si l'ID du cours est valide
                if (!ObjectId.isValid(courseId)) {
                  return res.status(400).json({ error: 'ID de cours invalide.' });
                }
            
                // Chercher le cours en base de données
                const course = await mongoService.getCourseById(courseId);
            
                // Si le cours n'existe pas
                if (!course) {
                  return res.status(404).json({ error: 'Cours non trouvé.' });
                }
            
                res.status(200).json(course);
              } catch (error) {
                console.error('Erreur lors de la récupération du cours:', error);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
              }
            }
            
            // Fonction pour obtenir des statistiques sur les cours
            async function getCourseStats(req, res) {
              try {
                // Exemple de statistiques (vous pouvez personnaliser selon vos besoins)
                const totalCourses = await mongoService.getTotalCourses();
            
                res.status(200).json({ totalCourses });
              } catch (error) {
                console.error('Erreur lors de la récupération des statistiques:', error);
                res.status(500).json({ error: 'Erreur interne du serveur.' });
              }
            }
            
            module.exports = {
              createCourse,
              getCourse,
              getCourseStats
            };
            