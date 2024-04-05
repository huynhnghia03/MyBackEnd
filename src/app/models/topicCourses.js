const mongoose = require('mongoose')
const mongoosedelete = require('mongoose-delete')
const slug = require('mongoose-slug-generator')
const Course = require('./Courses')
const Schema = mongoose.Schema;


const Topic = new Schema({
    name: { type: String },
    slogan: { type: String },
    image: { type: String },
    description: { type: String },
    level: { type: String },
    subject: { type: String },
    is_resgister: { type: Boolean, default: false },
    slug: { type: String, slug: "name", unique: true },
    last_completed_at: { type: String, default: null },
    courses: [{ type: mongoose.Types.ObjectId, ref: "Course" }]
}, {
    timestamps: true,
});

//Add plugin
mongoose.plugin(slug)
Topic.plugin(mongoosedelete, {
    overrideMethods: 'all',
    deletedAt: true,
})


module.exports = mongoose.model('Topic', Topic)