const MessageModel = require("../services/messages/model")
const RoomModel = require("../services/rooms/model")

const saveMessage = async (messageContent, roomName) => {
  try {
    const newMessage = await new MessageModel(messageContent)
    const updatedChat = await RoomModel.findOneAndUpdate(
      { roomName: roomName },
      { $addToSet: { messages: newMessage } }
    )

    // const savedMessage = await newMessage.save()
    return newMessage
  } catch (error) {
    console.log(error)
  }
}

module.exports = { saveMessage }
