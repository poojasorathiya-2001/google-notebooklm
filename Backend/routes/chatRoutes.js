const express = require('express');
const router = express.Router();
const { sendMessage, getChatHistory } = require('../controllers/chatController');

// Send message
router.post('/message', sendMessage);

// Get chat history
// router.get('/:chatId', getChatHistory);

module.exports = router;
