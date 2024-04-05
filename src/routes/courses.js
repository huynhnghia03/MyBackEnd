const express = require('express')
const router = express.Router()
const CoursesController = require('../app/controllers/CoursesController')
const { verifyToken, checkAdmin } = require('../app/middleware/verifymidelware')
const getBlogsmidelware = require('../app/middleware/getBlogsmidelware')

router.get('/search', CoursesController.searchCourses)
router.get('/:slug', verifyToken, CoursesController.getListCourse)
router.get('/:slug/tracklist', getBlogsmidelware.verifyToken, CoursesController.getTrackListCourse)
router.get('/nextCourse/:id', verifyToken, CoursesController.nextCourse)
router.get('/previousCourse/:id', verifyToken, CoursesController.previousCourse)
router.get('/:id/detail', verifyToken, CoursesController.getDetailCourse)
router.put('/:id/finished', verifyToken, CoursesController.finishedCourse)
// router.put('/edit/:id', verifyToken, checkAdmin, CoursesController.edit)
// router.put('/Addcourse/:slug', verifyToken, checkAdmin, CoursesController.addCourse)
// router.delete('/delete/:id', verifyToken, checkAdmin, CoursesController.destroyCourse)



module.exports = router