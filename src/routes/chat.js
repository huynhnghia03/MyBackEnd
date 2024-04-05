const express = require('express')
const router = express.Router()
const ChatController = require('../app/controllers/ChatController')


router.post('/create', ChatController.createChat)
router.post('/OwnChat', ChatController.createOwnChat)
router.get('/getAllMemembers/:id', ChatController.getAllMemembers)
router.get('/getUserChat/:id', ChatController.getUserChat)

module.exports = router