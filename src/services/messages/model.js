const { Schema, model } = require("mongoose");

const MessageModel = new Schema(
  {
    text: { type: String },
    sender: { type: String },
  },
  { timestamps: true }
);

module.exports = model("Message", MessageModel);
