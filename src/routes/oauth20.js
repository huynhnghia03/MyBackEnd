const express = require('express')
const router = express.Router()
const passport = require("passport");
const oauth20Controller = require('../app/controllers/oauth20Controller')
const middlerwareVerify = require('../app/middleware/verifymidelware')

router.get("/phone/:number/check", oauth20Controller.checkWithPhone);
router.post("/google/success", oauth20Controller.googleLoginSucces);
router.post("/facebook/success", oauth20Controller.facebookLoginSucces);
router.post("/github/success", oauth20Controller.githubLoginSucces);
router.put("/google/Linked", middlerwareVerify.verifyToken, oauth20Controller.linkWithhGoogle);
router.put("/facebook/Linked", middlerwareVerify.verifyToken, oauth20Controller.linkWithFacebook);
router.put("/phone/Linked", middlerwareVerify.verifyToken, oauth20Controller.linkWithPhone);
router.put("/google/canceled", middlerwareVerify.verifyToken, oauth20Controller.cancelWithhGoogle);
router.put("/facebook/canceled", middlerwareVerify.verifyToken, oauth20Controller.cancelWithFacebook);
router.put("/phone/canceled", middlerwareVerify.verifyToken, oauth20Controller.cancelWithPhone);


module.exports = router