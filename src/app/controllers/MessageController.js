const Message = require('../models/message')
const User = require('../models/users')

class ChatController {

    async createMessage(req, res, next) {
        try {
            const message = await Message.create(req.body)
            console.log(message)
            if (message) {
                return res.json({ success: 1, data: message })
            } else {
                return res.json({ success: 0, message: "Lỗi tạo message không thành công" })
            }
        } catch (err) {
            return res.json({ success: 0, message: "lỗi server" })
        }
    }
    async getUserMessage(req, res, next) {
        try {

            const message = await Message.find({ chatId: req.params.id })

            if (message) {
                return res.json({ success: 1, data: message })
            } else {
                return res.json({ success: 0, message: 'lỗi không tìm thấy message' })
            }

        } catch (err) {
            return res.json({ success: 0, message: "Lỗi server" })
        }
    }
}
module.exports = new ChatController