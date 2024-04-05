
const User = require('../models/users')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const ramdomstring = require('randomstring')
const makeMiddleware = require('multer/lib/make-middleware')
const { use } = require('passport')
require('dotenv').config()


class authController {


    //[POST] /resgister/auth-resgister
    async handleRegister(req, res, next) {
        const { name, email, pass } = req.body.data
        console.log(name, email, pass)
        try {
            const checkEmail = await User.findOne({ email: email })

            if (checkEmail) {
                return res.json({ success: 0, message: "Email đã tồn tại" })
            } else {


                const hashed = bcrypt.hashSync(pass, 10)
                const newUser = new User({
                    Username: name,
                    email: email,
                    password: hashed
                })
                const user = await newUser.save()
                if (user) {

                    const acesstoken = jwt.sign({
                        id: user._id,
                        admin: user.admin

                    }, process.env.SERCETKEY_VALUES1,
                        { expiresIn: '1d' }
                    )
                    const refreshtoken = jwt.sign({
                        id: user._id,
                        admin: user.admin

                    }, process.env.SERCETKEY_VALUES2,
                        { expiresIn: '365d' }
                    )


                    const { _doc } = user
                    const { token, password, topics, ...rest } = _doc
                    return res.json({ success: 1, acesstoken, rest, message: "Đăng ký thành công" })

                }
            }
        }
        catch (err) {
            return res.json({ success: -1, message: "Lỗi server" })
        }



    }


    //[POST] /login/auth-login
    async handleLogin(req, res, next) {
        const { email, pass } = req.body.data
        try {
            const user = await User.findOne({ email: email })
            if (!user) {
                return res.json({ err: 1, message: "Email không tồn tại" })
            } else {
                const validPassword = await bcrypt.compare(
                    pass,
                    user.password
                )
                if (!validPassword) {
                    return res.json({ err: 0, message: "mật khẩu không đúng" })
                }
                else if (user && validPassword) {
                    const acesstoken = jwt.sign({
                        id: user._id,
                        admin: user.admin

                    }, process.env.SERCETKEY_VALUES1,
                        { expiresIn: '1d' }
                    )
                    const refreshtoken = jwt.sign({
                        id: user._id,
                        admin: user.admin

                    }, process.env.SERCETKEY_VALUES2,
                        { expiresIn: '365d' }
                    )

                    const { _doc } = user
                    const { token, password, topics, ...rest } = _doc

                    return res.json({ success: 1, acesstoken, rest })
                }
            }

        } catch (err) {
            return res.json({ err: -1, message: "Lỗi server" })
        }
    }

    //[POST] / handle-forget-password
    handleForgetPassword(req, res, next) {
        var email = req.body.data.email
        User.findOne({ email: email })
            .then(async (val) => {
                if (val) {
                    const randomstr = ramdomstring.generate()
                    console.log(val)
                    const updateuse = await User.updateOne({ email: email }, { $set: { token: randomstr } })
                    const transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 587,
                        secure: false,
                        requireTLS: true,
                        auth: {
                            user: 'huynhanhtbag8888@gmail.com',
                            pass: 'lrunnmbpobabnjlb'
                        }
                    })
                    const mailoptions = {
                        from: 'noreply@gmail.com',
                        to: val.email,
                        subject: "For Reset PassWord",
                        html: '<p>Hello ' + val.Username + ',</p>' +
                            '<p>We wanted to let you know that your Mycourse password was reset.</p>' +
                            '<p>' + val.Username + ', Please copy the link <a href="http://localhost:3000/auths/reset-password?token=' + randomstr + '">Rest your password</a></p>' +
                            '<p>Please do not reply to this email with your password. We will never ask for your password, and we strongly discourage you from sharing it with anyone.</p>'
                    }
                    if (updateuse)
                        transporter.sendMail(mailoptions, function (err, info) {
                            if (err) {
                                res.json({ success: 0 })
                            } else {
                                console.log(info.response)
                                res.json({ success: 1 })
                            }
                        })
                    else {
                        return res.json({ success: 0 })
                    }
                } else {
                    return res.json({ success: 0 })
                }
            })
            .catch(next)

    }
    resetPassword(req, res, next) {
        return res.render('auths/resetpassword', {
            token: req.query.token
        })
    }

    handleResetRassword(req, res, next) {
        console.log(req.body.token)
        const token = req.body.token
        User.findOne({ token: token })
            .then(val => {
                console.log(val)
                if (token) {

                    const Newpassword = req.body.formValues.newPassword
                    const password = bcrypt.hashSync(Newpassword, 10)
                    User.updateOne(
                        { _id: val._id },
                        {
                            $set: { password: password, token: '' }
                        }, { new: true }
                    ).then(() => res.json({ success: 1 }))
                        .catch(next)
                } else {
                    return res.json({ success: 0 })
                }
            })
            .catch(next)

    }
    //[GET]auths/logout
    logout(req, res, next) {
        res.cookie('acesstoken', '', { maxAge: 1 })
        return res.redirect('/')
    }





}


module.exports = new authController