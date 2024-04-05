const loveBlog = require('../models/loveBlog')
const newBlog = require('../models/newBlog')
const commentBlog = require('../models/CommentBlogs')
const reactBlog = require('../models/reactBlog')
class BlogsController {

    async postLog(req, res, next) {
        try {



            const { _doc } = req.data

            const { token, password, phoneNumber, topics, blog, ...rest } = _doc

            const data = {
                ...req.body,
                user_id: req.id,
                user: rest
            }
            const blogs = await newBlog.create(data)
            if (blogs) {
                return res.json({ success: 1, data: blogs })
            } else {
                return res.json({ success: 0, message: "Lỗi đăng bài không thành công" })
            }

        } catch (err) {
            return res.json({ success: 0, message: "lỗi server" })
        }
    }
    async getAllLogs(req, res, next) {
        try {
            var page = parseInt(req.query.page) || 1;
            var limit = 9;
            var skip = (page - 1) * limit;
            const countAll = newBlog.estimatedDocumentCount({ is_published: true })
            const itemAll = newBlog.find({ is_published: true }).sort({ '_id': -1 }).limit(limit).skip(skip)
            const [count, items] = await Promise.all([countAll, itemAll])
            const totalPage = Math.ceil(count / limit)
            var links = []
            for (var i = 0; i < totalPage; i++) {
                links.push(i)
            }
            const LoveBlogs = await loveBlog.find({ userID: req.id })
            const reactBlogs = await reactBlog.find({ userID: req.id })

            if (LoveBlogs.length > 0) {
                const LoveBlogsID = LoveBlogs.map((ll) => ll.blogID)
                const newItemBlogs = items.map((blog) => ({
                    ...blog.toObject(),
                    is_bookmark: LoveBlogsID.includes(blog._id.toString()),
                    is_reacted: reactBlogs.includes(blog._id.toString())
                }));
                return res.json({
                    success: 1,
                    count,
                    data: newItemBlogs,
                    totalPage,
                    links
                })

            }
            return res.json({
                success: 1,
                count,
                data: items,
                totalPage,
                links
            })


        } catch (err) {
            return res.json({ success: 0, message: "Lỗi server" })
        }
    }
    async getLogPublic(req, res, next) {
        try {

            const blog = await newBlog.findOne({ slug: req.params.slug })
            const countAllComments = await commentBlog.countDocuments({ blog_id: blog._id.toString() })
            const LoveBlog = await loveBlog.findOne({ userID: req.id, blogID: blog._id })
            const confirmLoveBlog = await reactBlog.findOne({ blogID: blog._id, userID: req.id })
            const newBLog = {
                ...blog.toObject(),
                comments_count: countAllComments,
                is_bookmark: LoveBlog ? true : false,
                is_reacted: confirmLoveBlog ? true : false
            }
            return res.json({ success: 1, data: newBLog })
        } catch (err) {
            return res.json({ success: 0, message: "Lỗi server" })
        }
    }
    async getLogPrivate(req, res, next) {
        try {
            const blog = await newBlog.findOne({ _id: req.params.id })
            if (blog) {
                return res.json({ success: 1, data: blog })
            } else {
                return res.json({ success: 0, message: 'lỗi không tìm thấy blog' })
            }

        } catch (err) {
            return res.json({ success: 0, message: "Lỗi server" })
        }
    }
    async getOnwPosts(req, res, next) {
        try {

            const unpublishBlogs = await newBlog.find({ is_published: false, user_id: req.id }).sort({ 'updatedAt': -1 })
            const publishedBlogs = await newBlog.find({ is_published: true, user_id: req.id }).sort({ 'updatedAt': -1 })

            if (unpublishBlogs && publishedBlogs) {
                return res.json({ success: 1, draft: unpublishBlogs, published: publishedBlogs })
            } else {
                return res.json({ success: 0, message: 'lỗi không tìm thấy blog' })
            }

        } catch (err) {
            return res.json({ success: 0, message: "Lỗi server" })
        }
    }

    async updateBlog(req, res, next) {
        try {

            const blog = await newBlog.updateOne({ _id: req.params.id }, req.body)
            if (blog) {
                const getBlog = await newBlog.findOne({ _id: req.params.id })
                return res.json({ success: 1, data: getBlog })
            } else {
                return res.json({ success: 0, message: 'Update không thành công' })
            }

        } catch (err) {
            return res.json({ success: 0, message: "Lỗi server" })
        }
    }
    async updateSavePublished(req, res, next) {
        try {
            if (req.fileValidationError) {

                return res.json({ err: 0, message: 'jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF Only image files are allowed!' });
            } else {
                console.log(req.body)
                const { Title, meta_description, Tag, ...rest } = req.body
                let image
                if (req.file) {
                    image = 'blog/' + req.data.nickname + '/' + req.file.filename
                } else {
                    image = ""
                }

                const datas = {
                    Title, meta_description, Tag: JSON.parse(Tag), image, is_published: true
                }
                const getBlog = await newBlog.findOne({ _id: req.params.id })
                const updateBlog = await getBlog.updateOne(datas)
                const saveblog = await getBlog.save(datas)
                if (updateBlog && saveblog) {
                    return res.json({ success: 1, data: saveblog })
                } else {
                    return res.json({ success: 0, message: 'Update không thành công' })
                }
            }
        } catch (err) {
            return res.json({ success: 0, message: "Lỗi server" })
        }
    }
    async deleteBlog(req, res, next) {
        try {

            const blog = await newBlog.deleteOne({ _id: req.params.id })
            if (blog) {
                return res.json({ success: 1 })
            } else {
                return res.json({ success: 0, message: 'Xóa không thành công' })
            }

        } catch (err) {
            return res.json({ success: 0, message: "Lỗi server" })
        }
    }

    async uploadimage(req, res, next) {
        try {
            if (req.fileValidationError) {

                return res.json({ err: 0, message: 'jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF Only image files are allowed!' });
            } else {
                return res.json({
                    success: 1,
                    url: `http://localhost:3000/blog/${req.data.nickname}/${req.file.filename}`
                })

            }

        } catch (err) {
            return res.json({ success: 0, message: "Lỗi server" })
        }
    }

    async reactionBlog(req, res, next) {
        try {
            let flag = 0
            // console.log(datas)
            const confirmLoveBlog = await reactBlog.findOne({ blogID: req.params.id, userID: req.id })
            const LoveBlog = await loveBlog.findOne({ userID: req.id, blogID: req.params.id })
            if (confirmLoveBlog) {
                const deleteLoveBlog = await reactBlog.deleteOne({ _id: confirmLoveBlog._id })
                if (deleteLoveBlog) {
                    flag = 1
                } else {
                    return res.json({ success: 0, message: "Xóa không thành công" })
                }
            } else {
                const datas = {
                    userID: req.id,
                    blogID: req.params.id,
                }
                const rBlog = await reactBlog.create(datas)
                if (rBlog) {
                    flag = 2
                } else {
                    return res.json({ success: 0, message: "Lỗi lưu không thành công" })
                }
            }
            const countAmountOfReact = await reactBlog.countDocuments({ blogID: req.params.id })
            const updateBlog = await newBlog.updateOne({ _id: req.params.id }, {
                $set: {
                    reactions_count: countAmountOfReact
                }
            })
            if (updateBlog) {
                const dataBlog = await newBlog.findOne({ _id: req.params.id })

                const newData = {
                    ...dataBlog.toObject(),
                    is_bookmark: LoveBlog ? true : false,
                    is_reacted: flag == 1 ? false : true
                }

                return res.json({ success: 1, data: newData })

            }

        } catch (err) {
            return res.json({ success: 0, message: "lỗi server" })
        }
    }


}
module.exports = new BlogsController