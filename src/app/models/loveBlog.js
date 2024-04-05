const mongoose = require('mongoose')
const mongoosedelete = require('mongoose-delete')
const Schema = mongoose.Schema;

const loveBlog = new Schema({
    userID: { type: String, default: '' },
    blogID: { type: String, default: '' },
    listBlog: { type: Object, default: {} },
}, {
    timestamps: true,
});


//Add plugin
loveBlog.plugin(mongoosedelete, {
    overrideMethods: 'all',
    deletedAt: true,
})


module.exports = mongoose.model('loveBlog', loveBlog)