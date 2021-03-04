const roomRoute = require("express").Router();
const RoomModel = require("./model");
const MessageModel = require("../messages/model");

//METHODS
//POST
roomRoute.route("/").post(async (req, res, next) => {
  try {
    const newRoom = await new RoomModel(req.body),
      { _id } = await newRoom.save();
    res.send(newRoom);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//GET
roomRoute.route("/").get(async (req, res, next) => {
  try {
    const rooms = await RoomModel.find();
    res.send(rooms);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
//GET
roomRoute.route("/:roomId").get(async (req, res, next) => {
  try {
    const room = await RoomModel.findById(req.params.roomId).populate(
      "messages"
    );
    res.send(room);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//DELETE ROOM_MODEL

roomRoute.route("/").delete(async (req, res) => {});

//EXPORT
module.exports = roomRoute;
