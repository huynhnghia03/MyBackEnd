const mongoose = require('mongoose')
const mongoosedelete = require('mongoose-delete')
const Schema = mongoose.Schema;

const reactBlog = new Schema({
    userID: { type: String, default: '' },
    blogID: { type: String, default: '' },
}, {
    timestamps: true,
});


//Add plugin
reactBlog.plugin(mongoosedelete, {
    overrideMethods: 'all',
    deletedAt: true,
})


module.exports = mongoose.model('reactBlog', reactBlog)