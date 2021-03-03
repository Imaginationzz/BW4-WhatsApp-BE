const mongoose = require("mongoose"),
  { Schema } = require("mongoose"),
  {
    findMethod,
    jsonMethod,
    preSave,
  } = require("../../utilities/auth/modelUtils");

const UserModel = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String },
    password: { type: String },
    email: { type: String },
    phone: { type: Number },
    picture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    bio: { type: String, default: "Hey there! I am using WhatsApp." },
    googleId: { type: String },
    facebookId: { type: String },
    socketId: { type: String },
    roomsId: [{ type: String }],
  },
  { timestamps: true }
);

findMethod(UserModel);
jsonMethod(UserModel);
preSave(UserModel);

module.exports = mongoose.model("User", UserModel);
