const mongoose = require('mongoose')
const newBlog = require('./newBlog')
const Topics = require('./topicCourses')
const Schema = mongoose.Schema;



const User = new Schema({
    Username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false },
    nickname: { type: String, unique: true },
    bio: { type: String },
    facebook_url: { type: String, unique: true, default: "" },
    youtube_url: { type: String, unique: true, default: "" },
    LinkIn_url: { type: String, unique: true, default: "" },
    twitter_url: { type: String, unique: true, default: "" },
    instagram_url: { type: String, unique: true, default: "" },
    phoneNumber: { type: String, default: '' },
    Country: { type: String, default: '' },
    provider: { type: String, default: '' },
    oauths: { type: Array, default: null },
    address: { type: String, default: '' },
    avatar: { type: String, default: '' },
    profile_url: { type: String, default: '' },
    token: { type: String, default: '' },
    topics: { type: Array, default: null },
    blog: [{ type: mongoose.Types.ObjectId, ref: "newBlog" }]
}, {
    timestamps: true,
});
User.pre("save", function (next) {
    var newNickName = ''
    for (var i = 0; i < (this.email).length; i++) {

        if ((this.email)[i] == "@") {
            break;
        }
        newNickName += (this.email)[i]
    }
    this.nickname = newNickName
    next();
});

module.exports = mongoose.model('User', User)