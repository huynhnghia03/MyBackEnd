const mongoose = require('mongoose')
const mongoosedelete = require('mongoose-delete')
const slug = require('mongoose-slug-generator')
const user = require('./users')
const course = require('./Courses')
const Schema = mongoose.Schema;


const Comment = new Schema({
    comment: { type: String, default: '' },
    commenttable_id: { type: String, default: '' },
    commenttable_type: { type: String, default: '' },
    reply_id: { type: String, default: null },
    user_id: { type: mongoose.Types.ObjectId, ref: "user" },
    course_id: { type: mongoose.Types.ObjectId, ref: "course" },
    comment_count: { type: Number, default: 0 },
    user: { type: Object, default: {} },
    is_Comment: { type: Boolean, default: false },
    reaction_summary: { type: Object, default: {} },
    reactionText: { type: String, default: null },
    reactions: { type: Array, default: [] },
    reactions_count: { type: Number, default: 0 }
}, {
    timestamps: true,
});

//Add plugin
Comment.plugin(mongoosedelete, {
    overrideMethods: 'all',
    deletedAt: true,
})


module.exports = mongoose.model('Comment', Comment)