const express = require('express')
const router = express.Router()
const newFeedController = require('../app/controllers/newFeedcontroller')
const upload = require('../app/middleware/uploadNewFeedmiddleware')
const middlerwareVerify = require('../app/middleware/verifymidelware')

router.post('/create', middlerwareVerify.verifyToken, middlerwareVerify.checkAdmin, newFeedController.createNewFeed)
router.post('/upload/image', middlerwareVerify.verifyToken, middlerwareVerify.checkAdmin, upload.single('image'), newFeedController.uploadImage)
router.delete('/:id/delete', newFeedController.deleteNewFeed)
router.put('/:id/edit', middlerwareVerify.verifyToken, middlerwareVerify.checkAdmin, newFeedController.editNewFeed)
router.get('/get', newFeedController.getNewFeed)
router.get('/:id', middlerwareVerify.verifyToken, middlerwareVerify.checkAdmin, newFeedController.getDetailNewFeed)

module.exports = router