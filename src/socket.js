const socketio = require("socket.io")
const UserModel = require("./services/users/model")

// SOCKET UTILITIES
const { joinRoom, chat, leaveRoom, getUserId } = require("./socketUtils")

const createSocket = (server) => {
  const io = socketio(server)

  io.on("connection", async (socket) => {
    // console.log(`SocketId => ${socket.id}`);

    const subscriberSocket = getUserId(socket, io)
    console.log(subscriberSocket)

    joinRoom(socket, subscriberSocket, io)
    chat(socket, subscriberSocket, io)
    leaveRoom(socket, subscriberSocket, io)
  })
}

module.exports = createSocket
