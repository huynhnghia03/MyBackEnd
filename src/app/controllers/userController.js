const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Users = require('../models/users')
const newBlog = require('../models/newBlog')
const Comment = require('../models/Comments')

class SitesController {

    //[Get] users/AllUsers
    getAllUser(req, res, next) {
        Users.find({})
            .then((users) => {
                if (users) {
                    return res.json({
                        users: users
                    })
                } else {
                    return res.json({
                        err: 1,
                        msg: "Không có bât kỳ users nào!"
                    })
                }

            })
            .catch((next))
    }
    //[get] users/:id/edit
    edit(req, res, next) {
        Users.findById(req.params.id)
            .then(user => res.json({
                data: user,
            })).catch(next)

    }

    //[put]/:id
    async update(req, res, next) {
        const newuser = await Users.updateOne({ nickname: req.params.nickname }, req.body.data)
        if (newuser) {
            const getuser = await Users.findOne({ nickname: req.params.nickname })
            const { _doc } = getuser
            const { token, password, blogs, ...data } = _doc
            return res.json({ success: 1, data: data })
        } else {
            return res.json(
                { success: 0 }
            )
        }
    }
    //[put]/:nickname/upload
    async uploadImage(req, res, next) {
        try {
            if (req.fileValidationError) {

                return res.json({ err: 0, message: 'jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF Only image files are allowed!' });
            } else {
                const { firstElement, ...rest } = req.body
                if (rest.profile_url == '') {
                    rest.profile_url = req.file.filename
                }
                else if (rest.avatar == '') {
                    rest.avatar = req.file.filename
                } console.log(rest)

                const newuser = await Users.updateOne({ nickname: req.params.nickname }, { $set: rest }, { new: true })
                if (newuser) {
                    const getuser = await Users.findOne({ nickname: req.params.nickname })

                    const { _doc } = getuser
                    const { token, password, blog, ...data } = _doc
                    const blogUpdate = await newBlog.updateMany({ user_id: req.id }, {
                        $set: {
                            user: data
                        }
                    })
                    const comment = await Comment.updateMany({ user_id: req.id }, {
                        $set: {
                            user: data
                        }
                    })
                    if (blogUpdate && comment)
                        return res.json({ success: 1, data: data })
                } else {
                    return res.json(
                        { success: 0 }
                    )
                }
            }
        }
        catch (err) {
            return res.json({ success: 0 })
        }

    }

    //[put]  admin/update
    async adminUpdate(req, res, next) {
        Users.updateOne({ _id: req.params.id }, req.body.data)
            .then((user) => {
                return res.json({ success: 1, user })
            })
            .catch(next)

    }


    //[delete]/:id
    destroy(req, res, next) {
        Users.deleteOne({ _id: req.params.id })
            .then(() => res.json({ success: 1 }))
            .catch(next)
    }


    //[GET] /:nickname/
    getUser(req, res, next) {
        Users.findOne({ nickname: req.params.nickname })
            .then(user => {
                const { _doc } = user
                const { token, password, ...data } = _doc
                return res.json({
                    data: data,
                })
            }).catch(next)
    }

    //[GET] /profile/user/
    profileUser(req, res, next) {
        const { _doc } = req.data
        const { token, password, topics, oauths, ...data } = _doc
        return res.json({ data })
    }


    upadatePasswordUser(req, res, next) {
        const { OldPassword, newPassword } = req.body.data
        const _id = req.id
        const validPassword = bcrypt.compare(
            OldPassword,
            req.data.password
        )
        validPassword
            .then(val => {
                console.log(val)
                if (!val) {
                    return res.json({ success: 0 })
                } else {
                    var password = bcrypt.hashSync(newPassword, 10)
                    Users.updateOne(
                        { _id },
                        {
                            $set: { password }
                        },
                        { new: true }
                    ).then(() => res.json({ success: 1 }))
                        .catch(next)

                }
            })
            .catch(next)
    }



}


module.exports = new SitesController