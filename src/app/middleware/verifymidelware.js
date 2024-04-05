const jwt = require('jsonwebtoken')
const User = require('../models/users')
require('dotenv').config()

class middlerwareVerify {

    verifyToken(req, res, next) {
        // const tokens = req.headers.Authorization
        if (!(true && req.headers?.token) && !(true && req.body.headers?.token)) {
            return res.json({ message: "unauthorized", err: 0 })
        }

        const token = req.headers.token || req.body.headers.token;


        const decode1 = JSON.parse(Buffer.from(token.split('.')[1], 'base64'));
        // console.log(decode1.exp * 1000 > new Date().getTime())
        if (decode1.exp * 1000 > new Date().getTime()) {
            try {
                jwt.verify(token, process.env.SERCETKEY_VALUES1, async function (err, decode) {
                    if (err) {
                        return res.json({ err: 0 })
                    }
                    var user = await User.findById(decode.id)
                    if (user) {
                        req.data = user
                        req.id = decode.id

                        next()
                    }
                    // .then((user) => {
                    //     req.data = user
                    //     next()
                    // })
                })
            } catch (err) {
                return res.json({ err: 0 })
            }

        }
        else {
            console.log("het han")
            return res.json({ err: 0 })
        }
    }

    checkAdmin(req, res, next) {
        const Admin = req.data.admin
        if (Admin) {
            next()
        } else {
            return res.json('You are not admin')
        }
    }


}

module.exports = new middlerwareVerify