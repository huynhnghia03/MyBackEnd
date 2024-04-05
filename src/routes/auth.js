const express = require('express')
const router = express.Router()
const authController = require('../app/controllers/authController')

// router.use('/:slug',sitesController.show)

router.post('/login', authController.handleLogin)
router.post('/resgister', authController.handleRegister)
router.post('/handle-forget-password', authController.handleForgetPassword)
router.get('/reset-password', authController.resetPassword)
router.post('/handle-reset-password', authController.handleResetRassword)
router.get('/logout', authController.logout)




module.exports = router