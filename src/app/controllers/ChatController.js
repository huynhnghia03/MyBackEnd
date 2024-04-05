const chatMessage = require('../models/chatMessage')
const User = require('../models/users')

class ChatController {
    async createChat(req, res, next) {
        try {
            const oldchat = await chatMessage.find({ members: { $all: [req.body.id, '646f642863a8c57fded3d2bc'] } })
            if (oldchat.length > 0 || req.id == '646f642863a8c57fded3d2bc') {
                return res.json({ success: 1 })
            } else {
                const data = {
                    members: [req.body.id, '646f642863a8c57fded3d2bc']
                }

                const chat = await chatMessage.create(data)
                console.log(chat)
                if (chat) {
                    return res.json({ success: 1 })
                } else {
                    return res.json({ success: 0, message: "Lỗi tạo chat không thành công" })
                }
            }
        } catch (err) {
            return res.json({ success: 0, message: "lỗi server" })
        }
    }
    async createOwnChat(req, res, next) {
        try {
            const oldchat = await chatMessage.find({ members: { $all: [req.body.chatId, req.body.sendId] } })
            if (oldchat.length > 0) {
                console.log('not')
                return res.json({ success: 1 })
            } else {
                const data = {
                    members: [req.body.chatId, req.body.sendId]
                }

                const chat = await chatMessage.create(data)
                console.log(chat)
                if (chat) {
                    return res.json({ success: 1 })
                } else {
                    return res.json({ success: 0, message: "Lỗi tạo chat không thành công" })
                }
            }
        } catch (err) {
            return res.json({ success: 0, message: "lỗi server" })
        }
    }
    async getAllMemembers(req, res, next) {
        try {

            const chats = await chatMessage.find({ members: { $in: [req.params.id] } })

            if (chats) {
                return res.json({ success: 1, data: chats })
            } else {
                return res.json({ success: 0, message: 'lỗi không tìm thấy chat' })
            }

        } catch (err) {
            return res.json({ success: 0, message: "Lỗi server" })
        }
    }
    async getUserChat(req, res, next) {
        try {

            const getuser = await User.findOne({ _id: req.params.id })
            // const {token,password,topics,...rét}
            if (getuser) {
                return res.json({ success: 1, data: getuser })
            } else {
                return res.json({ success: 0, message: 'lỗi không tìm thấy user' })
            }

        } catch (err) {
            return res.json({ success: 0, message: "Lỗi server" })
        }
    }

}
module.exports = new ChatController