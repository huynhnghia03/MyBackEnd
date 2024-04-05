const express = require('express')
const router = express.Router()
const BlogsController = require('../app/controllers/Blogscontroller')
const middlerwareVerify = require('../app/middleware/verifymidelware')
const getblosmiddlerwareVerify = require('../app/middleware/getBlogsmidelware')
const upload = require('../app/middleware/uploadBlogmiddleware')


router.post('/create', middlerwareVerify.verifyToken, BlogsController.postLog)
router.get('/getAllBlogs', getblosmiddlerwareVerify.verifyToken, BlogsController.getAllLogs)
router.get('/getDetail/:slug', getblosmiddlerwareVerify.verifyToken, BlogsController.getLogPublic)
router.get('/:id/show-for-edit', BlogsController.getLogPrivate)
router.get('/own/my-bolgs', middlerwareVerify.verifyToken, BlogsController.getOnwPosts)
router.post('/:id/save-published', middlerwareVerify.verifyToken, upload.single('image'), BlogsController.updateSavePublished)
router.post('/image/upload', middlerwareVerify.verifyToken, upload.single('image'), BlogsController.uploadimage)
router.put('/update/:id', middlerwareVerify.verifyToken, BlogsController.updateBlog)
router.delete('/:id/delete', middlerwareVerify.verifyToken, BlogsController.deleteBlog)
router.post('/:id/reactions', middlerwareVerify.verifyToken, BlogsController.reactionBlog)
module.exports = router