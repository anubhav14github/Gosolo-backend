const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/user.model');
const Blog = require('../models/Blogs.model');

const CommentSchema = new Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
   },
   blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog"
   },
   body: {
      type: String,
   },
   createdAt: {
      default: Date.now(),
      type: Date,
  },
})



const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;