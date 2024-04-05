require('dotenv').config()
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

const passport = require("passport");
const User = require('../models/users');


passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
        },
        async function (accessToken, refreshToken, profile, done) {
            const { _json } = profile
            console.log(profile)
            const olduser = await User.findOne({ email: _json.email })
            if (olduser) {
                if (olduser.provider == "google") {
                    return done(null, { olduser, success: 0, accessToken })
                } else {
                    // console.log(olduser)
                    return done(null, { success: "err", message: "Bạn đã đăng nhập ở một tài khoản khác google" })
                }


            } else {
                let password = _json.email + _json.sub
                let newUser = new User({ Username: _json.name, email: _json.email, password: password, avatar: _json.picture, provider: profile.provider });
                const newuser = await newUser.save()

                return done(null, { newuser, success: 1, accessToken })

            }
        }
    )
);
passport.use(
    new GithubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: `${process.env.BACKEND_URL}/auth/github/callback`,
            scope: ['user:email'],

        },
        async function (accessToken, refreshToken, profile, done) {
            const { photos, emails, username, id } = profile
            const olduser = await User.findOne({ email: emails[0].value })

            if (olduser) {
                if (olduser.provider == "github") {
                    return done(null, { olduser, success: 0, accessToken })
                } else {

                    return done(null, { success: "err", message: "Bạn đã đăng nhập ở một tài khoản khác Github" })
                }
            } else {
                let password = emails[0].value + id
                let newUser = new User({ Username: username, email: emails[0].value, password: password, avatar: photos[0].value, provider: profile.provider });
                const newuser = await newUser.save()
                return done(null, { newuser, success: 1, accessToken })

            }
        }
    )
);
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'photos', 'email']
},
    async function (accessToken, refreshToken, profile, done) {
        const { photos, emails, displayName, id } = profile
        const olduser = await User.findOne({ email: emails[0].value })

        if (olduser) {
            if (olduser.provider == "facebook") {
                return done(null, { olduser, success: 0, accessToken })
            } else {

                return done(null, { success: "err", message: "Bạn đã đăng nhập ở một tài khoản khác Facebook" })
            }
        } else {
            let password = emails[0].value + id
            let newUser = new User({ Username: displayName, email: emails[0].value, password: password, avatar: photos[0].value, provider: profile.provider });
            const newuser = await newUser.save()
            return done(null, { newuser, success: 1, accessToken })

        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});