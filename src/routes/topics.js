const express = require('express')
const router = express.Router()
const TopicsController = require('../app/controllers/TopicsController')
const { verifyToken, checkAdmin } = require('../app/middleware/verifymidelware')
const verifyRegisterTopicMidelware = require('../app/middleware/verifyRegisterTopicMidelware')

router.get('/allTopics', verifyRegisterTopicMidelware, TopicsController.getAllTopics)
// router.get('/allTopics/admin', verifyRegisterTopicMidelware, TopicsController.getAllTopicsAdmin)
router.get('/OwnTopics/registered', verifyToken, TopicsController.getOwnTopics)
router.post('/:id/resgister', verifyToken, TopicsController.registerTopics)
// router.get('/:id', verifyToken, checkAdmin, TopicsController.getDetailTopic)
// router.post('/addTopic', verifyToken, checkAdmin, TopicsController.addTopic)
// router.put('/:id/edit', verifyToken, checkAdmin, TopicsController.editTopic)
// router.delete('/:id/delete', verifyToken, checkAdmin, TopicsController.destroyTopic)



module.exports = router