const express = require('express');
const router = express.Route();

const AdminChatControllers = require('../controllers/adminChatContrillers.js');

router.post('/chatAdmin_addUser', AdminChatControllers.adminChatAdd);
router.post('/chatAdmin_giveAdmin', AdminChatControllers.adminChatGiveAdmin);
router.post('/chatAdmin_blockesUser', AdminChatControllers.adminChatBlockes);//1
router.post('/chatAdmin_deleteUser', AdminChatControllers.adminChatDelete);
router.post('/chatAdmin_setting', AdminChatControllers.adminChatSetting);

module.exports = router;