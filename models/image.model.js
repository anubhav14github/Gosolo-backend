const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/user.model');

const ImageSchema = new Schema({
    filename: {
        type: String
    },
    caption: {
        type: String
    },
    category: {
        type: String,
    },
    fileId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        default: Date.now(),
        type: Date,
    },
});

const Image = mongoose.model('Image', ImageSchema);

module.exports = Image;