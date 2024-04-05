const mongoose = require('mongoose')
const mongoosedelete = require('mongoose-delete')
const slug = require('mongoose-slug-generator')
const Schema = mongoose.Schema;

const Course = new Schema({
    name: { type: String },
    description: { type: String },
    image: { type: String },
    videoID: { type: String },
    level: { type: String },
    is_Completed: { type: Boolean, default: false },
    is_course_active: { type: Boolean, default: false },
    slug: { type: String, slug: "name", unique: true }
}, {
    timestamps: true,
});


//Add plugin
mongoose.plugin(slug)
Course.plugin(mongoosedelete, {
    overrideMethods: 'all',
    deletedAt: true,
})


module.exports = mongoose.model('Course', Course)