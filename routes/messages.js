const express = require("express");
const messagesController = require("../controllers/messages");
const router = express.Router();

// Récupérer les messages d'un utilisateur spécifique
router.get("/getMessagesByUser/:userId", messagesController.getMessagesByUser);

// Ajouter un message
router.post("/postMessage", messagesController.postMessage);

// Récupérer tous les messages
router.get("/allMessages", messagesController.getMessages);

// Répondre à un message
router.post("/reply/:id", messagesController.replyToMessage);

// Mettre à jour le statut d’un message
router.patch("/status/:id", messagesController.updateMessageStatus);

// ✅ Supprimer un message
router.delete("/:id", messagesController.deleteMessage);

module.exports = router;
