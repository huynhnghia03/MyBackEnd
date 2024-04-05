const reactComment = require('../models/loveComment')
const Comment = require('../models/CommentBlogs')
require('dotenv').config()

class CommentsController {
    async postComment(req, res, next) {
        try {
            const { _doc } = req.data
            const { token, password, phoneNumber, topics, blog, oauths, ...rest } = _doc
            const data = {
                ...req.body.data,
                user_id: req.id,
                user: rest
            }
            const newComment = await Comment.create(data)
            console.log(req.body.data)
            if (req.body.data.commenttable_type == 'reply-Comment' && newComment) {
                const countAllReplies = await Comment.countDocuments({ reply_id: req.body.data.reply_id, commenttable_type: req.body.data.commenttable_type })
                const updateComment = await Comment.updateOne({ commenttable_id: req.body.data.reply_id }, {
                    $set: {
                        comment_count: countAllReplies
                    }
                })

                if (updateComment) {
                    return res.json({ success: 1, data: newComment })
                }
            }
            if (newComment) {
                return res.json({ success: 1, data: newComment })
            } else {
                return res.json({ success: 0, message: "Lỗi bình luận không thành công" })
            }

        } catch (err) {
            return res.json({ success: 0, message: "lỗi server" })
        }
    }
    async getAllComments(req, res, next) {
        try {
            if (req.query.hasOwnProperty('type') && req.query.hasOwnProperty('courseID') && req.query.hasOwnProperty('replyID') && req.query.hasOwnProperty('page')) {
                if (req.query.replyID == "" || req.query.replyID == " ") {
                    req.query.replyID = null
                }
                var page = parseInt(req.query.page) || 1;
                var limit = 9;
                var skip = (page - 1) * limit;
                console.log(req.query)
                const countAll = Comment.countDocuments({ blog_id: req.query.courseID })
                const itemAll = Comment.find({ blog_id: req.query.courseID, commenttable_type: req.query.type, reply_id: req.query.replyID }).sort({ '_id': -1 }).limit(limit).skip(skip)
                const AllLoveComments = reactComment.find({ courseID: req.query.courseID, userID: req.id })
                const [count, items, loveItems] = await Promise.all([countAll, itemAll, AllLoveComments])
                const totalPage = Math.ceil(count / limit)
                if (loveItems.length > 0) {
                    const textReaction = {
                        like: "Thích",
                        love: "Yêu thích",
                        sad: "Buồn",
                        anger: "Phẫn nộ",
                        Wow: "Wow",
                        laugh: "Haha",
                        crush: "Thương thương"
                    }
                    const newItems = items.map((val) => {
                        const matchingLoveItem = loveItems.find((val2) => val.commenttable_id === val2.commentID);
                        if (matchingLoveItem) {
                            val.reactionText = textReaction[matchingLoveItem.type]
                        }
                        return val
                    })
                    console.log(newItems)
                    return res.json({
                        success: 1,
                        count,
                        data: newItems,
                        totalPage,
                    })
                }
                return res.json({
                    success: 1,
                    count,
                    data: items,
                    totalPage,
                })
            } else {
                return res.json({
                    success: 0,
                    message: "Lỗi không lấy được bình luận"
                })
            }

        } catch (err) {
            return res.json({ success: 0, message: "Lỗi server" })
        }
    }
    async deleteComment(req, res, next) {
        try {

            const comment = await Comment.deleteOne({ commenttable_id: req.params.secondID })
            const countAllReplies = await Comment.countDocuments({ reply_id: req.params.firstID, commenttable_type: 'reply-Comment' })
            const updateComment = await Comment.updateOne({ commenttable_id: req.params.firstID }, {
                $set: {
                    comment_count: countAllReplies
                }
            })
            if (comment && updateComment) {
                return res.json({ success: 1 })
            } else {
                return res.json({ success: 0, message: 'Xóa không thành công' })
            }

        } catch (err) {
            return res.json({ success: 0, message: "Lỗi server" })
        }
    }
    async deleteParentComment(req, res, next) {
        try {
            const getAllReplyComments = await Comment.find({ reply_id: req.params.id })
            const getReplyCommentIDs = await getAllReplyComments.map((id) => id._id)
            const deleteComment = await Comment.deleteOne({ commenttable_id: req.params.id })
            const deleteAllComments = await Comment.deleteMany({ _id: { $in: getReplyCommentIDs } })
            if (deleteComment && deleteAllComments) {
                return res.json({ success: 1 })
            } else {
                return res.json({ success: 0, message: 'Xóa không thành công' })
            }

        } catch (err) {
            return res.json({ success: 0, message: "Lỗi server" })
        }
    }
    async updateComment(req, res, next) {
        try {
            console.log(req.body.data)
            const comment = await Comment.updateOne({ commenttable_id: req.params.id }, req.body.data)
            if (comment) {
                return res.json({ success: 1 })
            } else {
                return res.json({ success: 0, message: 'Update không thành công' })
            }

        } catch (err) {
            return res.json({ success: 0, message: "Lỗi server" })
        }
    }
    async uploadImage(req, res, next) {
        try {
            if (req.fileValidationError) {

                return res.json({ err: 0, message: 'jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF Only image files are allowed!' });
            } else {
                return res.json({
                    success: 1,
                    url: `${process.env.BACKEND_URL}/comment/${req.data.nickname}/${req.file.filename}`
                })

            }

        } catch (err) {
            return res.json({ success: 0, message: "Lỗi server" })
        }
    }
    async reactComment(req, res, next) {
        try {
            const confirmLoveComment = await reactComment.findOne({ commentID: req.params.id, userID: req.id });
            const dataComment = await Comment.findOne({ commenttable_id: req.params.id });
            const textReaction = {
                like: "Thích",
                love: "Yêu thích",
                sad: "Buồn",
                anger: "Phẫn nộ",
                Wow: "Wow",
                laugh: "Hahha",
                crush: "Thương thương"
            };

            if (confirmLoveComment) {
                // Handle existing reaction
                if (req.body.type === confirmLoveComment.type) {
                    const deleteLoveComment = await reactComment.deleteOne({ _id: confirmLoveComment._id });
                    if (deleteLoveComment) {
                        const countAmountOfReactType = await reactComment.countDocuments({ commentID: req.params.id, type: req.body.type });
                        const type = { ...dataComment.reaction_summary, [req.body.type]: countAmountOfReactType };
                        if (countAmountOfReactType <= 0) {
                            delete type[req.body.type];
                        }

                        const countAmountOfReact = await reactComment.countDocuments({ commentID: req.params.id });
                        const updateBlog = await Comment.updateOne(
                            { commenttable_id: req.params.id },
                            {
                                $set: {
                                    reactions_count: countAmountOfReact,
                                    reaction_summary: type
                                },
                                $pull: { reactions: { _id: confirmLoveComment._id } },
                            }
                        );

                        if (updateBlog) {
                            const dataBlog = await Comment.findOne({ commenttable_id: req.params.id });
                            return res.json({ success: 1, data: dataBlog });
                        } else {
                            return res.json({ success: 0, message: "Xóa không thành công" });
                        }
                    }
                } else {
                    // Handle changing reaction
                    const updateLoveComment = await reactComment.updateOne(
                        { _id: confirmLoveComment._id },
                        {
                            $set: { type: req.body.type }
                        }
                    );

                    if (updateLoveComment) {
                        const getLoveComment = await reactComment.findOne({ _id: confirmLoveComment._id });
                        const countAmountOfReactTypeOld = await reactComment.countDocuments({
                            commentID: confirmLoveComment.commentID,
                            type: confirmLoveComment.type
                        });

                        const countAmountOfReactType = await reactComment.countDocuments({
                            commentID: req.params.id,
                            type: req.body.type
                        });

                        const type = {
                            ...dataComment.reaction_summary,
                            [req.body.type]: countAmountOfReactType,
                            [confirmLoveComment.type]: countAmountOfReactTypeOld
                        };

                        if (countAmountOfReactTypeOld <= 0) {
                            delete type[confirmLoveComment.type];
                        }

                        const updateBlog = await Comment.updateOne(
                            { commenttable_id: req.params.id, 'reactions._id': confirmLoveComment._id },
                            {
                                $set: { reaction_summary: type },
                                $push: { reactions: getLoveComment }
                            },
                            { new: true }
                        );

                        if (updateBlog) {
                            const dataBlog = await Comment.findOne({ commenttable_id: req.params.id });
                            const { _doc } = dataBlog;
                            const newDataBlog = { ..._doc, reactionText: textReaction[req.body.type] };
                            return res.json({ success: 1, data: newDataBlog });
                        } else {
                            return res.json({ success: 0, message: "Xóa không thành công" });
                        }
                    }
                }
            } else {
                // Handle new reaction
                const datas = {
                    userID: req.id,
                    commentID: req.params.id,
                    type: req.body.type,
                    courseID: req.body.courseID
                };

                const rComment = await reactComment.create(datas);
                if (rComment) {
                    const countAmountOfReact = await reactComment.countDocuments({ commentID: req.params.id });
                    const countAmountOfReactType = await reactComment.countDocuments({
                        commentID: req.params.id,
                        type: req.body.type
                    });

                    const type = { ...dataComment.reaction_summary, [req.body.type]: countAmountOfReactType };

                    const updateBlog = await Comment.updateOne(
                        { commenttable_id: req.params.id },
                        {
                            $set: {
                                reactions_count: countAmountOfReact,
                                reaction_summary: type
                            },
                            $push: { reactions: rComment }
                        }
                    );

                    if (updateBlog) {
                        const dataBlog = await Comment.findOne({ commenttable_id: req.params.id });
                        const { _doc } = dataBlog;
                        const newDataBlog = { ..._doc, reactionText: textReaction[req.body.type] };
                        return res.json({ success: 1, data: newDataBlog });
                    }
                } else {
                    return res.json({ success: 0, message: "Lỗi lưu không thành công" });
                }
            }
        } catch (err) {
            console.error(err); // Log the error for debugging purposes
            return res.json({ success: 0, message: "lỗi server" });
        }
    }


}
module.exports = new CommentsController 
