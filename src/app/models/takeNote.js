const mongoose = require('mongoose')
const mongoosedelete = require('mongoose-delete')
const Schema = mongoose.Schema;

const takeNote = new Schema({
    userID: { type: String, default: '' },
    courseID: { type: String, default: '' },
    topicID: { type: String, default: '' },
    content: { type: String, default: '' },
    time: { type: String, default: '' },
    lesson: { type: String, default: '' },
}, {
    timestamps: true,
});


//Add plugin
takeNote.plugin(mongoosedelete, {
    overrideMethods: 'all',
    deletedAt: true,
})


module.exports = mongoose.model('takeNote', takeNote)