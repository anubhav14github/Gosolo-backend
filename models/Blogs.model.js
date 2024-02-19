const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/user.model');
const Comment = require('../models/comments.model');

const BlogSchema = new Schema({
    title: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    body: {
        type: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default:null
    }],
    category: {
        type: String
    },
    createdAt: {
        default: Date.now(),
        type: Date,
    },
})


const Blog = mongoose.model("Blog", BlogSchema);
module.exports = Blog;