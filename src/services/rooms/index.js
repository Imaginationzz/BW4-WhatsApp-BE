const roomRoute = require("express").Router()
const RoomModel = require("./model")

//METHODS
//POST
roomRoute.route("/").post(async (req, res, next) => {
  try {
    const newRoom = await new RoomModel(req.body),
      { _id } = await newRoom.save()
    res.send(newRoom)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

//DELETE ROOM_MODEL

roomRoute.route("/").delete(async (req, res) => {})

//EXPORT
module.exports = roomRoute
