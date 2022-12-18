const mongoose = require('mongoose')

const esquemaUser = new mongoose.Schema({
    mail: {type: String, require: true},
    password: {type: String, require: true}
})

module.exports = mongoose.model('user', esquemaUser)