const mongoose = require("mongoose"),
  { Schema } = require("mongoose"),
  {
    findMethod,
    jsonMethod,
    preSave,
  } = require("../../utilities/auth/modelUtils")

const UserModel = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String },
    password: { type: String },
    email: { type: String },
    phone: { type: Number },
    picture: { type: String },
    googleId: { type: String },
    facebookId: { type: String },
    socketId: { type: String },
  },
  { timestamps: true }
)

findMethod(UserModel)
jsonMethod(UserModel)
preSave(UserModel)

module.exports = mongoose.model("User", UserModel)
