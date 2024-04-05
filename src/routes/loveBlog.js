const express = require('express')
const router = express.Router()
const LoveBLogController = require('../app/controllers/LoveBlogsController')


router.post('/toggle-bookmark/:id', LoveBLogController.createBookMark)
router.get('/saved', LoveBLogController.getBookMarks)

module.exports = router