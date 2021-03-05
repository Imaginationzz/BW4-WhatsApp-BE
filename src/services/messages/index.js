const messageRoute = require("express").Router();
const MessageModel = require("./model");

//
messageRoute.route("/").post(async (req, res, next) => {
  try {
    const newMessage = await MessageModel(req.body);
    const { _id } = await newMessage.save();
    res.send(newMessage);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

messageRoute.route("/").get(async (req, res, next) => {
  try {
    const messages = await MessageModel.find();
    res.send(messages);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = messageRoute;
