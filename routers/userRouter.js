const express = require('express');
const router = express.Router();

const userController = require('../controllers/userControllers');

router.post('/register', userController.register);
router.post('/activate', userController.activate);

router.post('/login', userController.login);
router.post('/logout', userController.logout);

router.post('/friends', userController.friend);
router.post('/friendsList', userController.friendList);

router.get('/user', userController.user);

module.exports = router;