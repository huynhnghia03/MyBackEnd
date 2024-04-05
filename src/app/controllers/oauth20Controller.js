const jwt = require('jsonwebtoken')
const User = require('../models/users')
require('dotenv').config()

const acessToken = (user) => {
    return jwt.sign({
        id: user._id,
        admin: user.admin

    }, process.env.SERCETKEY_VALUES1,
        { expiresIn: '1d' }
    )
}
const refreshToken = (user) => {
    return jwt.sign({
        id: user._id,
        admin: user.admin

    }, process.env.SERCETKEY_VALUES2,
        { expiresIn: '365d' }
    )
}
class oauth20Controller {

    //[post] /google/success
    async googleLoginSucces(req, res, next) {
        try {
            const { displayName, email, photoURL, providerId } = req.body.data
            console.log(req.body.data)
            const olduser = await User.findOne({ email: email })
            const confirmCurrentUser = await User.findOne({ 'oauths.email': email })
            console.log(olduser)
            if (confirmCurrentUser) {
                var selectGoogle = confirmCurrentUser.oauths.find((val) => val.provider === "google.com")

            }
            if (olduser || confirmCurrentUser) {
                if (olduser?.provider == "google.com" || selectGoogle?.provider === "google.com") {
                    const { _doc } = olduser || confirmCurrentUser
                    const { token, password, ...rest } = _doc
                    const acesstoken = acessToken(olduser || confirmCurrentUser)
                    const refreshtoken = refreshToken(olduser || confirmCurrentUser)
                    return res.json({ success: true, rest, acesstoken, is_Login: true })
                } else {
                    return res.json({ success: 'err', message: "Bạn đã đăng nhập ở một tài khoản khác google!" })
                }
            } else {
                let createpassword = email + providerId + displayName
                let newUser = new User({ Username: displayName, email: email, password: createpassword, avatar: photoURL, provider: providerId });
                const newusers = await newUser.save()
                const { _doc } = newusers
                const { token, password, topics, ...rest } = _doc
                const acesstoken = acessToken(newusers)
                const refreshtoken = refreshToken(newusers)
                return res.json({ rest, success: true, acesstoken, is_Login: false })

            }
        }
        catch (err) {
            return res.status(401).json({
                success: false,
                message: "Lỗi server",
            });
        }
    }

    //[post] /facebook/success
    async facebookLoginSucces(req, res, next) {
        try {
            const { displayName, email, photoURL, providerId } = req.body.data
            const olduser = await User.findOne({ email: email })
            const confirmCurrentUser = await User.findOne({ 'oauths.email': email })
            if (confirmCurrentUser) {
                var selectFacebook = confirmCurrentUser.oauths.find((val) => val.provider === "facebook.com")
            }

            if (olduser || confirmCurrentUser) {
                if (olduser?.provider == "facebook.com" || selectFacebook?.provider === "facebook.com") {
                    const { _doc } = olduser || confirmCurrentUser
                    const { token, password, ...rest } = _doc
                    const acesstoken = acessToken(olduser || confirmCurrentUser)
                    const refreshtoken = refreshToken(olduser || confirmCurrentUser)
                    return res.json({ success: true, rest, acesstoken, is_Login: true })
                } else {
                    console.log(olduser)
                    return res.json({ success: 'err', message: "Bạn đã đăng nhập ở một tài khoản khác Facebook!" })
                }
            } else {
                let createpassword = email + providerId + displayName
                let newUser = new User({ Username: displayName, email: email, password: createpassword, avatar: photoURL, provider: providerId });
                const newuser = await newUser.save()
                const { _doc } = newuser
                const { token, password, topics, ...rest } = _doc
                const acesstoken = acessToken(newuser)
                const refreshtoken = refreshToken(newuser)
                return res.json({ rest, success: true, acesstoken, is_Login: false })

            }
        }
        catch (err) {
            return res.status(401).json({
                success: false,
                message: "Lỗi server",
            });
        }
    }

    //[post] /github/success
    async githubLoginSucces(req, res, next) {
        try {
            const { screenName, email, photoUrl, providerId } = req.body.data
            const olduser = await User.findOne({ email: email })
            if (olduser) {
                if (olduser.provider == "github.com") {
                    const { _doc } = olduser
                    const { token, password, ...rest } = _doc
                    const acesstoken = acessToken(olduser)
                    const refreshtoken = refreshToken(olduser)
                    return res.json({ success: true, rest, acesstoken, is_Login: true })
                } else {
                    // console.log(olduser)
                    return res.json({ success: 'err', message: "Bạn đã đăng nhập ở một tài khoản khác Github!" })
                }
            } else {
                let createpassword = email + providerId + displayName
                let newUser = new User({ Username: screenName, email: email, password: createpassword, avatar: photoUrl, provider: providerId });
                const newusers = await newUser.save()
                const { _doc } = newusers
                const { token, password, topics, ...rest } = _doc
                console.log(newusers, rest)
                const acesstoken = acessToken(newusers)
                const refreshtoken = refreshToken(newusers)
                return res.json({ rest, success: true, acesstoken, is_Login: false })

            }
        }
        catch (err) {
            return res.status(401).json({
                success: false,
                message: "Lỗi server",
            });
        }
    }



    //[post] /google/linked
    async linkWithhGoogle(req, res, next) {
        try {

            const { displayName, email, photoURL, provider } = req.body.data
            const finduser = await User.findOne({ email: email })
            const confirmCurrentUser = await User.findOne({ 'oauths.email': email })

            if (confirmCurrentUser !== null || finduser !== null) {
                return res.json({ success: 'err', message: "Bạn đã đăng nhập ở một phương thức khác google!" })
            } else {
                console.log('ok')
                const newUser = await User.updateOne({ _id: req.id }, {
                    $push: {
                        oauths: { email, displayName, photoURL, provider },
                    }
                })
                if (newUser) {
                    const getNewUser = await User.findOne({ _id: req.id })
                    const { _doc } = getNewUser
                    const { token, password, topics, ...data } = _doc
                    return res.json({ success: 1, data, message: "Liên kết thành công" })
                }
            }
        }
        catch (err) {
            return res.status(401).json({
                success: false,
                message: "Lỗi server",
            });
        }
    }

    //[post] /facebook/linked
    async linkWithFacebook(req, res, next) {
        try {
            const { displayName, email, photoURL, provider } = req.body.data
            const finduser = await User.findOne({ email: email })
            const confirmCurrentUser = await User.findOne({ 'oauths.email': email })
            if (confirmCurrentUser !== null || finduser !== null) {
                // console.log(olduser)
                return res.json({ success: 'err', message: "Bạn đã đăng nhập ở một tài khoản khác Facebook!" })

            } else {
                const newUser = await User.updateOne({ _id: req.id }, {
                    $push: {
                        oauths: { email, displayName, photoURL, provider },
                    }
                })
                if (newUser) {
                    const getNewUser = await User.findOne({ _id: req.id })
                    const { _doc } = getNewUser
                    const { token, password, topics, ...data } = _doc
                    return res.json({ success: 1, data, message: "Liên kết thành công" })
                }

            }
        }
        catch (err) {
            return res.status(401).json({
                success: false,
                message: "Lỗi server",
            });
        }
    }
    //[post] /phone/linked
    async checkWithPhone(req, res, next) {
        try {
            const finduser = await User.findOne({ phoneNumber: req.params.number })
            console.log(finduser)
            const confirmCurrentUser = await User.findOne({ 'oauths.phoneNumber': req.params.number })

            if (confirmCurrentUser !== null || finduser !== null) {

                return res.json({ success: 'err', message: "Số điện thoại đã tồn tại!" })

            } else {
                return res.json({ success: 1 })
            }
        }
        catch (err) {
            return res.status(401).json({
                success: false,
                message: "Lỗi server",
            });
        }
    }
    async linkWithPhone(req, res, next) {
        try {
            const { phoneNumber, provider } = req.body.data
            const newUser = await User.updateOne({ _id: req.id }, {
                $push: {
                    oauths: { phoneNumber, provider },
                }
            })
            if (newUser) {
                const getNewUser = await User.findOne({ _id: req.id })
                const { _doc } = getNewUser
                const { token, password, topics, ...data } = _doc
                return res.json({ success: 1, data, message: "Liên kết thành công" })
            }


        }
        catch (err) {
            return res.status(401).json({
                success: false,
                message: "Lỗi server",
            });
        }
    }

    async cancelWithFacebook(req, res, next) {
        try {
            const newUser = await User.updateOne(
                { _id: req.id },
                { $pull: { oauths: { email: req.body.data.email } } },
                { new: true })
            if (newUser) {
                const getNewUser = await User.findOne({ _id: req.id })
                const { _doc } = getNewUser
                const { token, password, topics, ...data } = _doc
                return res.json({ success: 1, data, message: "Hủy liên kết thành công" })
            }
        }

        catch (err) {
            return res.status(401).json({
                success: false,
                message: "Lỗi server",
            });
        }
    }
    async cancelWithhGoogle(req, res, next) {
        try {
            const newUser = await User.updateOne(
                { _id: req.id },
                { $pull: { oauths: { email: req.body.data.email } } },
                { new: true })
            if (newUser) {
                const getNewUser = await User.findOne({ _id: req.id })
                const { _doc } = getNewUser
                const { token, password, topics, ...data } = _doc
                return res.json({ success: 1, data, message: "Hủy liên kết thành công" })
            }
        }

        catch (err) {
            return res.status(401).json({
                success: false,
                message: "Lỗi server",
            });
        }
    }
    async cancelWithPhone(req, res, next) {
        try {
            const newUser = await User.updateOne(
                { _id: req.id },
                { $pull: { oauths: { phoneNumber: req.body.data.phoneNumber } } },
                { new: true })
            if (newUser) {
                const getNewUser = await User.findOne({ _id: req.id })
                const { _doc } = getNewUser
                const { token, password, topics, ...data } = _doc
                return res.json({ success: 1, data, message: "Hủy liên kết thành công" })
            }
        }

        catch (err) {
            return res.status(401).json({
                success: false,
                message: "Lỗi server",
            });
        }
    }


}

module.exports = new oauth20Controller