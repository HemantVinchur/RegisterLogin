const mongoose = require('mongoose')
const Schema = mongoose.Schema

let registerSchema = new Schema({
    name: String,
    email: String,
    password: String,
    salt: String,
    createdAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('register', registerSchema)