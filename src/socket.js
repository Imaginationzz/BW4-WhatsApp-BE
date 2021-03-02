const socketio = require("socket.io")
const UserModel = require("./services/users/model")

// SOCKET UTILITIES
const { joinRoom, chat, leaveRoom } = require("./socketUtils")

const createSocket = (server) => {
  const io = socketio(server)

  io.on("connection", async (socket, userId) => {
    // console.log(`SocketId => ${socket.id}`);
    console.log(userId)

    const user = await UserModel.findOne({ socketId: socket.id })
    let subscriberSocket

    if (!user) {
      const newUser = await UserModel.findByIdAndUpdate(userId, {
        socketId: socket.id,
      })
      await newUser.save()
      subscriberSocket = socket.id
    } else {
      subscriberSocket = user.sockedId
    }

    joinRoom(socket, subscriberSocket, io)
    chat(socket, subscriberSocket, io)
    leaveRoom(socket, subscriberSocket, io)
  })
}

module.exports = createSocket
