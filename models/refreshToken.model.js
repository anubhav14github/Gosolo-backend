const mongoose = require('mongoose');
const config = require("../config/auth.config");
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user.model');


const RefreshTokenSchema = new mongoose.Schema({
  token: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  expiryDate: {
    type: Date
  }
});

RefreshTokenSchema.statics.createToken = async function (user) {
  let expiredAt = new Date();

  expiredAt.setSeconds(
    expiredAt.getSeconds() + config.jwtRefreshExpiration
  );

  let _token = uuidv4();

  let _object = new this({
    token: _token,
    user: user._id,
    expiryDate: expiredAt.getTime(),
  });

  console.log(_object);

  let refreshToken = await _object.save();

  return refreshToken.token;
};

RefreshTokenSchema.statics.verifyExpiration = (token) => {
  return token.expiryDate.getTime() < new Date().getTime();
}

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

module.exports = RefreshToken;