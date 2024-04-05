const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const chatMessage = new Schema(
    {
        members: {
            type: Array,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("chatMessage", chatMessage);