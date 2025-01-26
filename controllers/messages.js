const Messages = require("../model/Messages");
const mongoose = require("mongoose");
const User = require("../model/User"); // Assurez-vous que ce chemin est correct



// Ajouter un message
exports.postMessage = async (req, res) => {
  const { name, email, phone, message, idUser } = req.body; // Ajout de idUser

  try {
    // Créer un ObjectId valide avec 'new'
    const userObjectId = new mongoose.Types.ObjectId(idUser);  // Utiliser 'new' ici

    // Création d'un nouveau message avec les données reçues
    const newMessage = new Messages({
      name,
      email,
      phone,
      message,
      idUser: userObjectId,  // Assurez-vous que c'est un ObjectId
      reponse: "", // Réponse par défaut
      statut: "non lu", // Statut par défaut
    });

    // Sauvegarde du message
    await newMessage.save();

    // Si l'enregistrement réussit
    res.status(200).send({
      success: [{ msg: "Message envoyé..." }],
      newMessage,
    });

  } catch (error) {
    console.error("Erreur dans postMessage:", error);  // Ajout de logs détaillés
    res.status(400).send({
      msg: "Message non envoyé",
      error: error.message || error,  // Affichage du message d'erreur détaillé
    });
  }
};

// Récupérer les messages
exports.getMessages = async (req, res) => {
    try {
      const listMessages = await Messages.find().populate("idUser", "name email");  // Populate 'idUser' avec les champs 'name' et 'email'
      console.log("Messages récupérés :", listMessages);  // Debug pour vérifier les messages récupérés
      res.status(200).send({ msg: "Messages récupérés avec succès", listMessages });
    } catch (error) {
      console.error("Erreur lors de la récupération des messages :", error);  // Log détaillé
      res.status(400).send({ msg: "Impossible de récupérer les messages", error: error.message });
    }
  };
  
// Répondre à un message
exports.replyToMessage = async (req, res) => {
    const { id } = req.params;
    const { reponse } = req.body;
  
    try {
      // Mettre à jour le message avec la réponse et définir le statut comme "traité"
      const updatedMessage = await Messages.findByIdAndUpdate(
        id,
        { reponse, statut: "traité" },
        { new: true }
      );
  
      if (!updatedMessage) {
        return res.status(404).send({ msg: "Message non trouvé" });
      }
  
      res.status(200).send({
        msg: "Réponse ajoutée avec succès",
        updatedMessage,
      });
    } catch (error) {
      res.status(400).send({ msg: "Impossible de répondre au message", error });
    }
  };
// Mettre à jour le statut d'un message
exports.updateMessageStatus = async (req, res) => {
    const { id } = req.params;
    const { statut } = req.body;
  
    try {
      const updatedMessage = await Messages.findByIdAndUpdate(
        id,
        { statut },
        { new: true }
      );
  
      if (!updatedMessage) {
        return res.status(404).send({ msg: "Message non trouvé" });
      }
  
      res.status(200).send({
        msg: "Statut mis à jour avec succès",
        updatedMessage,
      });
    } catch (error) {
      res.status(400).send({ msg: "Impossible de mettre à jour le statut", error });
    }
  };
      // Dans votre contrôleur (messages.js)
exports.getMessagesByUser = async (req, res) => {
    const userId = req.params.userId;  
  
    try {
      const listMessages = await Messages.find({ idUser: userId }).populate("idUser", "name email");
      res.status(200).send({
        msg: "Messages récupérés avec succès",
        listMessages,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des messages :", error);
      res.status(400).send({ msg: "Impossible de récupérer les messages", error });
    }
  };
  