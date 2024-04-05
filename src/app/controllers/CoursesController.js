const Course = require('../models/Courses')
const Topic = require('../models/topicCourses')
const Blog = require('../models/newBlog')
const learningCourse = require('../models/learningCourse')
const registerTopic = require('../models/registerTopics')

class CoursesController {

    //[GET] courses/:slug
    async getListCourse(req, res, next) {
        try {

            const allCourses = await Topic.findOne({ slug: req.params.slug }).populate('courses')
            const { _doc } = allCourses
            const { is_resgister, ...rest } = _doc
            const topicRegister = await registerTopic.findOne({
                $and: [
                    { userID: req.id },
                    { TopicID: allCourses._id.toString() }
                ]
            })
            if (topicRegister) {
                const courseOfUsers = await learningCourse.find({
                    $and: [
                        { userID: req.id },
                        { topicID: allCourses._id.toString() }
                    ]
                })

                if (courseOfUsers.length <= 0) {
                    console.log(courseOfUsers)
                    return res.json({
                        topics: { ...rest, is_resgister: true },
                        firstID: rest.courses[0]._id,
                        lastID: rest.courses[rest.courses.length - 1]._id,
                    })
                } else {
                    const topicIDs = courseOfUsers.map((course) => course.courseID)
                    const statusCourses = allCourses.courses.map(course => ({
                        ...course.toObject(),
                        is_course_active: topicIDs?.includes(course._id.toString()),
                        is_Completed: topicIDs?.includes(course._id.toString())
                    }));

                    let foundLastActive = false;
                    let getIdNextCourse

                    for (let i = 0; i < statusCourses.length; i++) {
                        if (statusCourses[i].is_Completed && statusCourses[i].is_course_active) {
                            foundLastActive = true;
                            if (statusCourses[i] == statusCourses[statusCourses.length - 1]) {
                                getIdNextCourse = statusCourses[i]._id
                                break
                            }
                        } else if (foundLastActive) {
                            statusCourses[i].is_course_active = true;
                            getIdNextCourse = statusCourses[i]._id
                            break; // Stop after setting is_course_active for the next object
                        } else {
                            break
                        }
                    }
                    const { courses, ...restChild } = rest
                    return res.json({
                        topics: { courses: statusCourses, ...restChild, is_resgister: true },
                        nextStepCourse: getIdNextCourse,
                        firstID: statusCourses[0]._id,
                        lastID: statusCourses[statusCourses.length - 1]._id,
                    })
                }
            } else {
                return res.json({
                    topics: { ...rest, is_resgister: false },
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
    async getTrackListCourse(req, res, next) {
        try {
            const allCourses = await Topic.findOne({ slug: req.params.slug }).populate('courses')
            const { _doc } = allCourses
            const { is_resgister, ...rest } = _doc
            const topicRegister = await registerTopic.findOne({
                $and: [
                    { userID: req.id },
                    { TopicID: allCourses._id.toString() }
                ]
            })
            console.log(topicRegister)
            if (topicRegister) {
                console.log('ok')
                return res.json({
                    courses: { ...rest, is_resgister: true },
                })

            } else {
                console.log('ok2')
                return res.json({
                    courses: { ...rest, is_resgister: false },
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
    //[GET] search course
    async searchCourses(req, res, next) {
        try {
            var search
            if (req.query.q) {
                search = req.query.q
            } else {
                search = ''
            }
            if (req.query.hasOwnProperty('q') && search) {
                let topicDatas = await Topic.find({
                    name: { $regex: search, $options: 'i' }
                }).limit(5)
                let blogDatas = await Blog.find({
                    $or: [
                        { Title: { $regex: search, $options: 'i' } },
                        { tag: { $regex: search, $options: 'i' } }
                    ]

                }).limit(5)
                let courseDatas = await Course.find({
                    name: { $regex: search, $options: 'i' }
                }).limit(5)
                if (topicDatas.length > 0 || blogDatas.length > 0 || courseDatas.length > 0)
                    return res.json({ success: 1, topicDatas, blogDatas, courseDatas })
                else {
                    return res.json({ success: 2, datas: [], })
                }

            }
            else {
                return res.json({
                    message: 'The given data was invalid',
                    errors: {
                        q: [
                            'the q field is required'
                        ]
                    }
                })
            }
        } catch (err) {
            return res.json(err)
        }
    }


    async getDetailCourse(req, res, next) {
        try {
            const finishedCourse = await learningCourse.findOne({ courseID: req.params.id, userID: req.id })
            const course = await Course.findById(req.params.id)
            if (finishedCourse) {
                course.is_Completed = true
                course.is_course_active = true
                const nextCourse = await Course.findOne(
                    { _id: { $gt: req.params.id } },
                    {},
                    { sort: { _id: 1 }, limit: 1 })
                return res.json({
                    course: course,
                    learning_user: finishedCourse,
                    nextCourseID: nextCourse._id,

                })
            } else {
                course.is_course_active = true
                return res.json({
                    course: course,
                })
            }

        }
        catch (err) {
            return res.json({ err: 0, message: "Lỗi server" })
        }
    }

    async nextCourse(req, res, next) {
        try {

            const course = await Course.findOne({ _id: { $gt: req.params.id } }).sort({ _id: 1 }).limit(1)
            return res.json({
                course: course
            })
        }
        catch (err) {
            return res.json({ err: 0, message: "Lỗi server" })
        }
    }

    async previousCourse(req, res, next) {
        try {

            const course = await Course.findOne({ _id: { $lt: req.params.id } }).sort({ _id: -1 }).limit(1)
            return res.json({
                course: course
            })
        }
        catch (err) {
            return res.json({ err: 0, message: "Lỗi server" })
        }
    }
    async finishedCourse(req, res, next) {
        try {
            // {
            //     userID: '646f642863a8c57fded3d2bc',
            //     courseID: '647fe2ca04b32ff0324454a8',
            //     totalTime: 273,
            //     topicID: '647de281a0491541c04fb257',
            //     TimeFinished: '02:17'
            //   }
            const data = {
                userID: req.id,
                courseID: req.params.id,
                totalTime: req.body.totalTime,
                topicID: req.body.topicID,
                TimeFinished: req.body.TimeFinished
            }
            const finishCourse = await learningCourse.create(data)
            const updateTimeStudy = await registerTopic.updateOne({ userID: req.id, TopicID: req.body.topicID }, {
                $set: {
                    last_completed_at: req.body.last_completed_at
                }
            })
            console.log('ok')
            if (finishCourse && updateTimeStudy) {
                const currentCourse = await Course.findOne({ _id: req.params.id })
                currentCourse.is_Completed = true
                currentCourse.is_course_active = true
                const nextCourse = await Course.findOne(
                    { _id: { $gt: req.params.id } },
                    {},
                    { sort: { _id: 1 }, limit: 1 })
                return res.json({
                    success: 1,
                    course: currentCourse,
                    nextCourseID: nextCourse._id,
                })
            }


        }
        catch (err) {
            return res.json({ err: 0, message: "Lỗi server" })
        }
    }


}
module.exports = new CoursesController