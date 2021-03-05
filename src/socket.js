const socketio = require("socket.io")
const UserModel = require("./services/users/model")

// SOCKET UTILITIES
const { joinRoom, chat, leaveRoom, sendImage } = require("./socketUtils")

const createSocket = (server) => {
  const io = socketio(server)

  io.on("connection", async (socket) => {
    // console.log(`SocketId => ${socket.id}`);
    joinRoom(socket, io)
    chat(socket, io)
    leaveRoom(socket, io)
    sendImage(socket, io)
  })
}

module.exports = createSocket
