const express = require('express')
const router = express.Router()
const takeNoteController = require('../app/controllers/takeNotecontroller')

router.post('/create', takeNoteController.createTakeNote)
router.get('/get', takeNoteController.getTakeNote)
router.delete('/:id/delete', takeNoteController.deleteTakeNote)
router.put('/:id/update', takeNoteController.updateTakeNote)
module.exports = router