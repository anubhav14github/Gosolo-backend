const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const Role = require('./role.model');
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");


const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("email is invalid");
      }
    }
  },
  password: {
    type: String,
    required: true,
    minLength: [6, 'password should exceed than 6 characters'],
    maxlength: 15
  },
  cnfpass: {
    type: String,
    required: true,
    minLength: [6, 'password should exceed than 6 characters'],
    maxlength: 15
  },
  role: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role"
  }],
  profileID: {
    type: String,
    default: null
  },
  fullname: {
    type: String,
    default: null
  },
  image: {
    type: String,
    default: null
  }
});

// UserSchema.methods.generateAuthToken = async function (next) {
//   try {
//     var token1 = jwt.sign({ _id: this._id }, config.secret);
//     this.tokens = this.tokens.concat({ token: token1 })
//     const login = await this.save();
//     console.log(login);
//     return token1;
//   } catch (error) {
//     console.log(error)
//   }
//   next();
// }
UserSchema.statics.getUserByIds = async function (ids) {
  try {
    const users = await this.find({ _id: { $in: ids } });
    return users;
  } catch (error) {
    throw error;
  }
}

//pre
UserSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  this.cnfpass = undefined;
  next();
});

const User = mongoose.model('User', UserSchema, 'Users');

module.exports = User;


