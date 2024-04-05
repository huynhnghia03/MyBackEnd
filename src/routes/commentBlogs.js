const express = require('express')
const router = express.Router()
const CommentBlogsController = require('../app/controllers/CommentBlogsController')
const upload = require('../app/middleware/uploadCommentmiddleware')


router.post('/create', CommentBlogsController.postComment)
router.get('/get', CommentBlogsController.getAllComments)
router.delete('/:id/deleteParent', CommentBlogsController.deleteParentComment)
router.delete('/:firstID/:secondID/delete', CommentBlogsController.deleteComment)
router.put('/:id/update', CommentBlogsController.updateComment)
router.post('/upload/image', upload.single('image'), CommentBlogsController.uploadImage)
router.post('/:id/reactions', CommentBlogsController.reactComment)

module.exports = router