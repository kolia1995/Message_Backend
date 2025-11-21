const express = require('express');
const router = express.Router();

const MessageControllers = require('../controllers/messageContrillers.js');

router.post('/chat/save', MessageControllers.chatSave);
router.post('/chat/exit', MessageControllers.chatExit);

router.post('/post', MessageControllers.messagePost);
router.post('/delete', MessageControllers.messageDelete);

router.get('/chat/get/:id', MessageControllers.chatGet);

module.exports = router;