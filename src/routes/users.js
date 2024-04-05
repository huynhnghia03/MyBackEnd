const express = require('express')
const router = express.Router()
const usersController = require('../app/controllers/userController')
const upload = require('../app/middleware/uploadmiddleware')
const middlerwareVerify = require('../app/middleware/verifymidelware')
// router.use('/:slug',sitesController.show)

router.get('/getUse/:nickname', usersController.getUser)
router.put('/:nickname', usersController.update)
router.put('/:nickname/upload', upload.single('image'), usersController.uploadImage)
router.post('/upadate-Password-User', usersController.upadatePasswordUser)
router.get('/persional-profile', usersController.profileUser)
router.get('/:id/edit', middlerwareVerify.checkAdmin, usersController.edit)
router.get('/', middlerwareVerify.checkAdmin, usersController.getAllUser)
router.put('/:id/update', middlerwareVerify.checkAdmin, usersController.adminUpdate)
router.delete('/:id/delete', middlerwareVerify.checkAdmin, usersController.destroy)




module.exports = router