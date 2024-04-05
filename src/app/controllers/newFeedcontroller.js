require('dotenv').config()
const newFeed = require('../models/newFeed')

class takeNoteController {

    async createNewFeed(req, res, next) {
        try {
            const user = {
                Username: req.data.Username,
                nickname: req.data.nickname,
                bio: req.data.bio,
                profile_url: req.data.profile_url,
                avatar: req.data.avatar,
                admin: req.data.admin
            }

            const data = {
                ...req.body,
                user: user
            }
            console.log(data, req.body)
            const newfeed = await newFeed.create(data)

            if (newfeed) {
                return res.json({ success: 1 })
            } else {
                return res.json({ success: 0, message: "Lỗi tạo bảng tin không thành công" })
            }

        } catch (err) {
            return res.json({ success: 0, message: "lỗi server" })
        }
    }

    async editNewFeed(req, res, next) {
        try {

            const user = {
                Username: req.data.Username,
                nickname: req.data.nickname,
                bio: req.data.bio,
                profile_url: req.data.profile_url,
                avatar: req.data.avatar,
                admin: req.data.admin
            }

            const data = {
                ...req.body,
                user: user
            }

            const newfeed = await newFeed.updateOne({ _id: req.params.id }, data)
            if (newfeed) {
                return res.json({ success: 1 })
            } else {
                return res.json({ success: 0, message: "Lỗi update bảng tin không thành công" })
            }

        } catch (err) {
            return res.json({ success: 0, message: "lỗi server" })
        }
    }

    async deleteNewFeed(req, res, next) {
        try {
            const newfeed = await newFeed.deleteOne({ _id: req.params.id })
            if (newfeed)
                return res.json({ success: 1 })
            else {
                return res.json({ success: 0 })
            }
        } catch (err) {
            return res.json({ success: 0, message: "lỗi server" })
        }
    }
    async uploadImage(req, res, next) {
        try {
            if (req.fileValidationError) {

                return res.json({ err: 0, message: 'jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF Only image files are allowed!' });
            } else {
                return res.json({
                    success: 1,
                    url: `${process.env.BACKEND_URL}/newfeed/${req.data.nickname}/${req.file.filename}`
                })

            }

        } catch (err) {
            return res.json({ success: 0, message: "Lỗi server" })
        }
    }

    async getNewFeed(req, res, next) {
        try {

            const newfeeds = await newFeed.find({

            }).sort({ '_id': -1 })
            if (newfeeds.length > 0)
                return res.json({ success: 1, data: newfeeds })
            else {
                return res.json({ success: 1, data: [] })
            }
        } catch (err) {
            return res.json(err)
        }
    }

    async getDetailNewFeed(req, res, next) {
        try {
            const newfeed = await newFeed.findOne({
                _id: req.params.id
            })
            if (newfeed)
                return res.json({ success: 1, data: newfeed })
        } catch (err) {
            return res.json(err)
        }
    }



}
module.exports = new takeNoteController