const mongoose = require('mongoose')
const mongoosedelete = require('mongoose-delete')
const slug = require('mongoose-slug-generator')
const user = require('./users')
const Schema = mongoose.Schema;


const newBlog = new Schema({
    Title: { type: String, default: '' },
    image: { type: String, default: '' },
    meta_description: { type: String, default: '' },
    Tag: { type: Array, default: [] },
    content: { type: String, default: '' },
    user_id: { type: mongoose.Types.ObjectId, ref: "user" },
    user: { type: Object, default: {} },
    slug: { type: String, slug: "Title", unique: true },
    reactions_count: { type: Number, default: 0 },
    comments_count: { type: Number, default: 0 },
    is_reacted: { type: Boolean, default: false },
    is_bookmark: { type: Boolean, default: false },
    is_approved: { type: Boolean, default: true },
    is_published: { type: Boolean, default: false },
}, {
    timestamps: true,
});

//Add plugin
mongoose.plugin(slug)
newBlog.plugin(mongoosedelete, {
    overrideMethods: 'all',
    deletedAt: true,
})
newBlog.pre("save", function (next) {
    this.slug = this.Title.split(" ").join("-");
    next();
});

module.exports = mongoose.model('newBlog', newBlog)