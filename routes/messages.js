const express = require("express") ;
const { postMessage, getMessages, deleteMessage } = require("../controllers/messages");
const router = express.Router();


router.post('/postMessage', postMessage)

router.get('/allMessages', getMessages)

router.delete('/:_id', deleteMessage);


module.exports = router;