const Message = require('../models/message')
const loveBlog = require('../models/loveBlog')
const Blog = require('../models/newBlog')

class LoveBlogController {

    async createBookMark(req, res, next) {
        try {

            const dataBlog = await Blog.findOne({ _id: req.params.id })
            const { _doc } = dataBlog
            // console.log(dataBlog)
            const {
                Tag,
                reactions_count,
                comments_count,
                is_reacted,
                is_approved, content, ...rest } = _doc

            // console.log(datas)
            const confirmLoveBlog = await loveBlog.findOne({ blogID: req.params.id, userID: req.id })
            if (confirmLoveBlog) {
                const deleteLoveBlog = await loveBlog.deleteOne({ _id: confirmLoveBlog._id })
                if (deleteLoveBlog) {
                    return res.json({ deleteSuccess: 1 })
                } else {
                    return res.json({ success: 0, message: "Xóa không thành công" })
                }
            } else {
                const datas = {
                    userID: req.id,
                    blogID: req.params.id,
                    listBlog: rest,
                }
                const message = await loveBlog.create(datas)
                if (message) {
                    return res.json({ createSuccess: 1 })
                } else {
                    return res.json({ success: 0, message: "Lỗi lưu không thành công" })
                }
            }
        } catch (err) {
            return res.json({ success: 0, message: "lỗi server" })
        }
    }
    async getBookMarks(req, res, next) {
        try {

            const loveBlogs = await loveBlog.find({ userID: req.id })

            if (loveBlogs.length > 0) {
                return res.json({ success: 1, data: loveBlogs })
            } else {
                return res.json({ success: 0, data: [] })
            }

        } catch (err) {
            return res.json({ success: 0, message: "Lỗi server" })
        }
    }
}
module.exports = new LoveBlogController