const mongoose = require('mongoose')
const mongoosedelete = require('mongoose-delete')
const Schema = mongoose.Schema;

const newFeed = new Schema({
    title: { type: String, default: '' },
    content: { type: String, default: '' },
    published_at: { type: String, default: '' },
    user: { type: Object, default: {} },
    is_published: { type: Boolean, default: true },
}, {
    timestamps: true,
});


//Add plugin
newFeed.plugin(mongoosedelete, {
    overrideMethods: 'all',
    deletedAt: true,
})


module.exports = mongoose.model('newFeed', newFeed)