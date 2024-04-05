const mongoose = require('mongoose')
const mongoosedelete = require('mongoose-delete')
const Schema = mongoose.Schema;

const loveComment = new Schema({
    userID: { type: String, default: '' },
    commentID: { type: String, default: '' },
    courseID: { type: String, default: '' },
    type: { type: String, default: '' },
}, {
    timestamps: true,
});


//Add plugin
loveComment.plugin(mongoosedelete, {
    overrideMethods: 'all',
    deletedAt: true,
})


module.exports = mongoose.model('loveComment', loveComment)