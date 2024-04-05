const mongoose = require('mongoose')
const mongoosedelete = require('mongoose-delete')
const Schema = mongoose.Schema;
const MessageSchema = new Schema(
    {
        chatId: {
            type: String,
        },
        senderId: {
            type: String,
        },
        text: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);
MessageSchema.plugin(mongoosedelete, {
    overrideMethods: 'all',
    deletedAt: true,
})
module.exports = mongoose.model("Message", MessageSchema);