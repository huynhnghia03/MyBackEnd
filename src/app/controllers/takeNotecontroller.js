
const takeNote = require('../models/takeNote')

class takeNoteController {

    async createTakeNote(req, res, next) {
        try {
            const takenote = await takeNote.create(req.body)
            if (takenote) {
                return res.json({ success: 1 })
            } else {
                return res.json({ success: 0, message: "Lỗi ghi chú không thành công" })
            }

        } catch (err) {
            return res.json({ success: 0, message: "lỗi server" })
        }
    }

    async getTakeNote(req, res, next) {
        try {

            if (req.query.hasOwnProperty('type') && req.query.hasOwnProperty('courseID') && req.query.hasOwnProperty('topicID')) {
                let takeNoteData
                if (req.query.type == 'current') {
                    takeNoteData = await takeNote.find({ topicID: req.query.topicID, courseID: req.query.courseID, userID: req.id, }).sort({ '_id': -1 })
                } else {
                    takeNoteData = await takeNote.find({
                        userID: req.id,
                        topicID: req.query.topicID
                    }).sort({ '_id': -1 })

                }
                console.log(takeNoteData)
                if (takeNoteData.length > 0)
                    return res.json({ success: 1, data: takeNoteData })
                else {
                    return res.json({ success: 1, data: [] })
                }



            }
            else {
                return res.json({
                    message: 'The given data was invalid',
                    errors: {
                        id: [
                            'the id field is required'
                        ],
                        type: [
                            'the type field is required'
                        ]
                    }
                })
            }
        } catch (err) {
            return res.json(err)
        }
    }
    async deleteTakeNote(req, res, next) {
        try {
            const takenote = await takeNote.deleteOne({ _id: req.params.id })
            if (takenote) {
                return res.json({ success: 1 })
            } else {
                return res.json({ success: 0, message: "Lỗi xóa không thành công" })
            }

        } catch (err) {
            return res.json({ success: 0, message: "lỗi server" })
        }
    }
    async updateTakeNote(req, res, next) {
        try {
            console.log(req.body)
            const takenote = await takeNote.updateOne({ _id: req.params.id }, req.body)
            if (takenote) {
                return res.json({ success: 1 })
            } else {
                return res.json({ success: 0, message: "Lỗi sửa không thành công" })
            }

        } catch (err) {
            return res.json({ success: 0, message: "lỗi server" })
        }
    }

}
module.exports = new takeNoteController