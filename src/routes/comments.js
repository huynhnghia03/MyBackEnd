const express = require('express')
const router = express.Router()
const CommentsController = require('../app/controllers/CommentsController')
const upload = require('../app/middleware/uploadCommentmiddleware')


router.post('/create', CommentsController.postComment)
router.get('/get', CommentsController.getAllComments)
router.delete('/:id/deleteParent', CommentsController.deleteParentComment)
router.delete('/:firstID/:secondID/delete', CommentsController.deleteComment)
router.put('/:id/update', CommentsController.updateComment)
router.post('/upload/image', upload.single('image'), CommentsController.uploadImage)
router.post('/:id/reactions', CommentsController.reactComment)

module.exports = router