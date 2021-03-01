const socketio = require("socket.io")

// SOCKET UTILITIES
const { joinRoom, chat, leaveRoom } = require("./socketUtils")

const createSocket = (server) => {
  const io = socketio(server)

  io.on("connection", (socket) => {
    // console.log(`SocketId => ${socket.id}`);
    joinRoom(socket, io)
    chat(socket, io)
    leaveRoom(socket, io)
  })
}

module.exports = createSocket
