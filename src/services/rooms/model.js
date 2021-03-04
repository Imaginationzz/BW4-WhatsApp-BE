const { Schema, model } = require("mongoose");

const RoomModel = new Schema(
  {
    roomName: { type: String, required: true, unique: true },
    membersList: [{ memberId: { type: String } }],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  },
  { timestamps: true }
);

module.exports = model("ChatRoom", RoomModel);
