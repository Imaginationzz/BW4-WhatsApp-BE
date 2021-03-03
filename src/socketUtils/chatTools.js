const MessageModel = require("../services/messages/model");
const RoomModel = require("../services/rooms/model");

const saveMessage = async (messageContent, roomId) => {
  try {
    const newMessage = await new MessageModel(messageContent);
    const updatedChat = await RoomModel.findOneAndUpdate(
      { _id: roomId },
      { $addToSet: { messages: newMessage } }
    );

    // const savedMessage = await newMessage.save()
    return newMessage;
  } catch (error) {
    console.log(error);
  }
};

// const getMessages = async (roomName) => {
//   try {
//   }
//   catch (error) {console.log(error)}
// }

module.exports = { saveMessage };
