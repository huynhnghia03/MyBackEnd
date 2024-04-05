const mongoose = require('mongoose')
const mongoosedelete = require('mongoose-delete')
const Schema = mongoose.Schema;

const learningCourse = new Schema({
    userID: { type: String, default: '' },
    courseID: { type: String, default: '' },
    topicID: { type: String, default: '' },
    totalTime: { type: Number, default: 0 },
    TimeFinished: { type: Number, default: 0 },
}, {
    timestamps: true,
});


//Add plugin
learningCourse.plugin(mongoosedelete, {
    overrideMethods: 'all',
    deletedAt: true,
})


module.exports = mongoose.model('learningCourse', learningCourse)