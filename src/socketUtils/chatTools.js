const MessageModel = require("../services/messages/model");
const RoomModel = require("../services/rooms/model");

const saveMessage = async (messageContent, roomId) => {
  try {
    // const newMessage = await new MessageModel(messageContent);
    const updatedChat = await RoomModel.findOneAndUpdate(
      { _id: roomId },
      { $addToSet: { messages: messageContent } }
    );
    // console.log("bodytext", messageContent);
    // console.log(updatedChat);
    // const savedMessage = await newMessage.save()
    return messageContent;
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
