const { Schema, model } = require("mongoose");

const RoomModel = new Schema(
  {
    roomPicture: { type: String },
    roomName: { type: String, required: true, unique: true },
    membersList: [{ type: Schema.Types.ObjectId, ref: "User" }],
    messages: [
      {
        receiver: [{ type: String }],
        sender: { type: String },
        text: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("ChatRoom", RoomModel);
