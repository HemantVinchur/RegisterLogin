const mongoose = require('mongoose')
const Schema = mongoose.Schema

let authSchema = new Schema({
    email: String,
    accessToken:String,
    createdAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('authSchema', authSchema) 