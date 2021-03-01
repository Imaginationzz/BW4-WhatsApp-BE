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
    username: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: Number },
    picture: { type: String },
    refresh_token: [{ token: String }],
  },
  { timestamps: true }
)

findMethod(UserModel)
jsonMethod(UserModel)
preSave(UserModel)

module.exports = mongoose.model("User", UserModel)
