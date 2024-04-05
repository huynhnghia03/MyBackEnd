const express = require('express')
const router = express.Router()
const AdminController = require('../app/controllers/AdminController')


router.post('/trashAllCourses', AdminController.trashAllCourses)
router.get('/stored/course', AdminController.storedCourses)
router.get('/trash/course', AdminController.trashCourses)



module.exports = router