const Course = require('../models/Courses')
const Topic = require('../models/topicCourses')
const User = require('../models/users')
const registerTopic = require('../models/registerTopics')

class TopicsController {

    //[get] getAllTopics
    async getAllTopics(req, res, next) {
        try {
            const topicsLT = await Topic.find({ subject: "LT" })
            const topicsEnglish = await Topic.find({ subject: "English" })
            console.log(topicsEnglish)
            if (req.id === null || req.data?.topics.length <= 0) {
                return res.json({
                    data1: topicsLT,
                    data2: topicsEnglish,
                    success: 1
                })
            } else {

                const topicIDs = req.data.topics.map((topic) => topic._id.toString())
                const mapTopics = (topicsArray) =>
                    topicsArray.map((course) => ({
                        ...course.toObject(),
                        is_resgister: topicIDs.includes(course._id.toString()),
                    }));

                const LT = mapTopics(topicsLT)
                const english = mapTopics(topicsEnglish)

                return res.json({
                    data1: LT,
                    data2: english,
                    success: 1
                })
            }
        } catch (err) {
            return res.json({ err: 0, message: "lỗi server" })
        }
    }

    async getOwnTopics(req, res, next) {

        try {
            const topicIDS = await registerTopic.find({ userID: req.id })
            const getTopicIDs = topicIDS.map((id) => id.TopicID)
            const topics = await Topic.find({ _id: { $in: getTopicIDs } })
            if (topics) {
                const newDataTopics = topics.map(topic => {
                    const matchingTopicIDS = topicIDS.find(item => item.TopicID === topic._id.toString());
                    if (matchingTopicIDS) {
                        return {
                            ...topic.toObject(),
                            last_completed_at: matchingTopicIDS.last_completed_at
                        };
                    }
                    return topic;
                });
                console.log(newDataTopics)
                return res.json({
                    datas: newDataTopics
                })
            } else {
                return res.json({
                    datas: topics,
                    message: 'Bạn chưa đăng ký khóa học nào'
                })
            }
        }
        catch (err) {

            return res.json({ err: 1, message: 'Lỗi server' })
        }
    }

    async registerTopics(req, res, next) {
        try {
            const userId = req.id; // User's unique identifier
            const topicId = req.params.id
            const topic = await Topic.findById(topicId);
            const { _doc } = topic
            const { is_resgister, courses, ...rest } = _doc
            const newtopic = { ..._doc, is_resgister: true }
            const newUser = await User.findByIdAndUpdate(userId, { $push: { topics: rest } });
            const registered = await registerTopic.create({ userID: userId, TopicID: topicId })
            if (newUser && registered) {
                const getNewUser = await User.findOne({ _id: userId })
                const { _doc } = getNewUser
                const { token, password, topics, ...data } = _doc
                return res.json({ success: 1, data, newtopic })
            }
        }
        catch (err) {
            return res.json({ err: "lỗi server" })
        }
    }

    // //[PATCH] course/handle-restore-form-action
    // handledoubleformaction(req, res, next) {
    //     switch (req.body.data.formValues.action) {
    //         case 'delete':
    //             Course.deleteMany({ _id: { $in: req.body.data.coursesID } })
    //                 .then(() => res.json({ success: 0 }))
    //                 .catch(next)
    //             break
    //         case 'patch':
    //             Course.restore({ _id: { $in: req.body.data.coursesID } })
    //                 .then(() => res.json({ success: 1 }))
    //                 .catch(next)
    //             break
    //         default:
    //             res.json({ message: 'action is invalid' })
    //     }
    // }

}
module.exports = new TopicsController