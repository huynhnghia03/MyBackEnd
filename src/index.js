const path = require('path')
const morgan = require('morgan')
const express = require('express')
const methodOverride = require('method-override')
const cors = require('cors')
const cookiParser = require('cookie-parser')
require('dotenv').config()
const cookieSession = require('cookie-session')
const passport = require("passport");
require('./app/Oauth/passport.js')

const sortmiddleware = require('./app/middleware/sortmiddleware')
const pagemiddleware = require('./app/middleware/pagemiddleware')
const searchmiddleware = require('./app/middleware/searchmiddleware')
const searchTakeNoteMiddleware = require('./app/middleware/searchTakeNotemiddleware.js')
const searchCommentMiddleware = require('./app/middleware/searchCommentmiddleware.js')

const app = express()
const PORT = process.env.PORT
const route = require('./routes')
const db = require('./config/db')

//database connect
db.connect()

app.use(
  cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
  optionsSuccessStatus: 200
}))
app.use(cookiParser())

//check staic file
app.use(express.static(path.join(__dirname, "uploads")))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({
  extended: true,
}))
app.use(express.json())

//http course
app.use(morgan('combined'))
app.use(methodOverride('_method'))

// use middlerware
app.use(sortmiddleware)
app.use(pagemiddleware)
app.use(searchmiddleware)
app.use(searchTakeNoteMiddleware)
app.use(searchCommentMiddleware)

//route init
route(app)

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})

// //socket
// const io = require('socket.io')(server, {
//   cors: {
//     origin: 'http://localhost:3001'
//   }
// })
// console.log("connected socket")
// socketAPP(io)
