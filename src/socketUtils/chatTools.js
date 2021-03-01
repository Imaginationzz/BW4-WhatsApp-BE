const MessageModel = require("../services/messages/model")

const saveMessage = async (messageContent) => {
  try {
    const newMessage = await new MessageModel(messageContent)
    const savedMessage = await newMessage.save()
    return savedMessage
  } catch (error) {
    console.log(error)
  }
}

module.exports = { saveMessage }
