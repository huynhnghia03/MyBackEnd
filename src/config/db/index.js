const mongoose = require('mongoose')
require('dotenv').config()


function connect() {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('database Connected!'))
        .catch(() => console.log('failure!'))
}

module.exports = { connect }