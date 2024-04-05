const mongoose = require('mongoose')
const mongoosedelete = require('mongoose-delete')
const Schema = mongoose.Schema;

const registerTopic = new Schema({
    userID: { type: String, default: '' },
    TopicID: { type: String, default: '' },
    is_Active: { type: Boolean, default: false },
    last_completed_at: { type: String, default: null },
}, {
    timestamps: true,
});


//Add plugin
registerTopic.plugin(mongoosedelete, {
    overrideMethods: 'all',
    deletedAt: true,
})


module.exports = mongoose.model('registerTopic', registerTopic)