const { Schema, model } = require("mongoose")

const RoomModel = new Schema(
  {
    roomName: { type: String, required: true, unique: true },
    membersList: [{ username: { type: String }, socketId: { type: String } }],
    messages: [{ messageId: { type: Schema.Types.ObjectId, ref: "Message" } }],
  },
  { timestamps: true }
)

module.exports = model("ChatRoom", RoomModel)
