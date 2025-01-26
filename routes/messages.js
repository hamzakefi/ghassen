// routes/messages.js
const express = require("express");
const messagesController = require("../controllers/messages"); // Import du contrôleur messages
const router = express.Router();

// Route pour récupérer les messages d'un utilisateur spécifique
router.get("/getMessagesByUser/:userId", messagesController.getMessagesByUser);

// Autres routes
router.post("/postMessage", messagesController.postMessage);
router.get("/allMessages", messagesController.getMessages);
router.post("/reply/:id", messagesController.replyToMessage);
router.patch("/status/:id", messagesController.updateMessageStatus);

module.exports = router;
