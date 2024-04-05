const Course = require('../models/Courses')
const Topic = require('../models/topicCourses')
const { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose')

class AdminController {
    //[GET] me/stored/course
    async storedCourses(req, res, next) {
        try {
            const topics = await Topic.find({})
            return res.json({
                data: topics
            })
        }
        catch (err) {
            return res.json({ err: 'lỗi server' })
        }
        // var search = ''
        // if (req.query.search) {
        //     search = req.query.search
        // }

        // var page = parseInt(req.query.page) || 1;

        // var limit = 5;
        // var skip = (page - 1) * limit;

        // let TopicQuery = Topic.find({
        //     name: { $regex: search, $options: 'i' }
        // }).skip(skip).limit(limit)

        // if (req.query.hasOwnProperty('_sort')) {
        //     courseQuery = courseQuery.sort({
        //         [req.query.column]: req.query.type,
        //     })
        // }

        // Promise.all([TopicQuery, Topic.countDocumentsDeleted(), Topic.countDocuments()])
        //     .then(([topics, deletedcount, countNotDelete]) => {
        //         res.render('me/storedCourses', {
        //             username: mongooseToObject(req.data),
        //             countNotDelete,
        //             page,
        //             totalpage: Math.ceil(countNotDelete / limit),
        //             deletedcount,
        //             topics: mutipleMongooseToObject(topics)
        //         })
        //     })
        //     .catch(next)

    }

    //[GET] me/trash/course
    trashCourses(req, res, next) {
        return res.render('me/trashCourses', {
            username: mongooseToObject(req.data),
        })
    }

    trashAllCourses(req, res, next) {
        var s = req.body.data.s
        var page = parseInt(req.body.data.dataPage) || 1;
        var limit = 5;
        var skip = (page - 1) * limit;

        if (!s) {
            s = ''
        }
        var queryCourseDel = Course.findDeleted({ name: { $regex: s, $options: 'i' } }).skip(skip).limit(limit)
        Promise.all([queryCourseDel, Course.countDocumentsDeleted(), Course.countDocuments()])
            .then(([Courses, deletedcount, countNotDelete]) => res.json({
                countNotDelete,
                page,
                totalpagedel: Math.ceil(deletedcount / limit),
                Courses,
            }))
            .catch(next)
    }

    async getDetailCourse(req, res, next) {
        try {
            const course = await Course.findById(req.params.id)
            if (course) {
                return res.json({
                    course: course,
                    success: 1

                })
            } else {
                return res.json({
                    course: course,
                    success: 1,
                    message: "Khong tim thay khoa hoc"
                })
            }

        }
        catch (err) {
            return res.json({ err: 0, message: "Lỗi server" })
        }
    }
    async getListCourse(req, res, next) {
        try {

            const allCourses = await Topic.findOne({ slug: req.params.slug }).populate('courses')
            if (allCourses) {
                return res.json({
                    data: allCourses,
                    success: 1
                })
            }
        }
        catch (err) {
            return res.json({
                error: 1,
                message: "Không tìm thấy khóa học"
            })
        }

    }
    edit(req, res, next) {
        Course.updateOne({ _id: req.params.id }, req.body.data)
            .then(() => res.json({ success: 1 }))
            .catch(next)
    }

    //[Delete] course/:id
    destroyCourse(req, res, next) {

        Course.deleteOne({ _id: req.params.id })
            .then(() => res.json({ success: 1 }))
            .catch(next)
    }
    //[PUT] course/:id
    async addCourse(req, res, next) {
        req.body.data.image = `https://img.youtube.com/vi/${req.body.data.videoID}/sddefault.jpg`
        const datas = req.body.data
        const newcourse = await Course.create(datas)

        Topic.updateOne({ slug: req.params.slug }, {
            $push: {
                courses: newcourse._id
            }
        })
            .then(() => res.json({ success: 1 }))
            .catch(next)
    }
    //[get] getAllTopics/admin
    async getAllTopicsAdmin(req, res, next) {
        try {
            const topics = await Topic.find({})

            return res.json({
                data: topics,
                success: 1
            })

        } catch (err) {
            return res.json({ err: 0, message: "lỗi server" })
        }
    }
    //[get] getDetailTopic
    async getDetailTopic(req, res, next) {
        try {
            const topic = await Topic.findById({ _id: req.params.id })
            return res.json({
                data: topic
            })
        }
        catch (err) {
            return res.json({ err: "lỗi server" })
        }
    }

    //[Put] course/id/edit topic
    editTopic(req, res, next) {
        Topic.updateOne({ _id: req.params.id }, req.body.data)
            .then(() => res.json({ success: 1 }))
            .catch(next)
    }

    //[POST] /addTopic
    addTopic(req, res, next) {
        if (req.body.data.name === '' || req.body.data.description === '' || req.body.data.image === '' || req.body.data.level === '' || req.body.data.subject === '') {
            return res.json({ success: 0 })
        } else {
            Topic.create(req.body.data)
                .then(() => {
                    return res.json({ success: 1 })
                })
                .catch(next)
        }
    }



    //[DELETE] course/:id
    destroyTopic(req, res, next) {
        Topic.delete({ _id: req.params.id })
            .then(() => res.json({ success: 1 }))
            .catch(next)
    }

}

module.exports = new AdminController