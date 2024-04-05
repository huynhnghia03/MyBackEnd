const jwt = require('jsonwebtoken')
const User = require('../models/users')
require('dotenv').config()

const verifyRegisterTopicMidelware = (req, res, next) => {
    // const tokens = req.headers.Authorization

    if (!(true && req.headers?.token)) {
        console.log("ok")
        req.id = null
        next()
        return
    }

    const token = req.headers?.token


    const decode1 = JSON.parse(Buffer.from(token.split('.')[1], 'base64'));
    // console.log(decode1.exp * 1000 > new Date().getTime())
    if (decode1.exp * 1000 > new Date().getTime()) {
        try {
            jwt.verify(token, process.env.SERCETKEY_VALUES1, async function (err, decode) {
                if (err) {
                    req.id = null
                    next()
                    return
                }
                var user = await User.findById(decode.id)
                if (user) {
                    req.id = decode.id
                    req.data = user
                    next()
                }
            })
        } catch (err) {
            req.id = null
            next()
        }

    }
    else {
        req.id = null
        next()
    }
}






module.exports = verifyRegisterTopicMidelware