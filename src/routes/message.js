const express = require('express')
const router = express.Router()
const MessageController = require('../app/controllers/MessageController')


router.post('/create', MessageController.createMessage)
router.get('/getUserMessage/:id', MessageController.getUserMessage)

module.exports = router