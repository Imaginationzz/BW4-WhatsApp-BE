//TOOLS IMPORTS
const {
  addMember,
  getMembersList,
  getMember,
  removeMember,
} = require("./roomTools")
const { saveMessage } = require("./chatTools")

//JOIN ROOM
const joinRoom = (socket, io) => {
  return socket.on("joinRoom", async (data) => {
    try {
      //ADD MEMBER
      const { username, roomName } = await addMember({
        socketId: socket.id,
        ...data,
      })

      //SOCKET JOIN TO ROOM
      socket.join(roomName)

      //ALERT MESSAGE WHEN JOIN THE ROOM
      const joinAlert = {
        sender: "Admin",
        text: `${username} has joined the room (${roomName})`,
        createdAt: new Date(),
      }

      //SEND THE ALERT TO THE ROOM
      socket.broadcast.to(roomName).emit("message", joinAlert)

      //MEMBERS LIST
      const membersList = await getMembersList(roomName)

      //SEND MEMBERS LIST
      io.to(roomName).emit("membersList", { roomName, list: membersList })
    } catch (error) {
      console.log(error)
    }
  })
}

//CHATGROUP
const chat = (socket, io) => {
  return socket.on("chat", async ({ roomName, message }) => {
    //FIND USER
    const member = await getMember(roomName, socket.id)

    //MESSAGE
    const messageContent = {
      text: message,
      sender: member.username,
      roomName,
    }

    //SAVE MESSAGE IN DB
    await saveMessage(messageContent)

    //SEND MeSSAGE TO CHAT
    io.to(roomName).emit("message", messageContent)
  })
}

//LEAVE ROOM
const leaveRoom = (socket, io) => {
  return socket.on("leaveRoom", async ({ roomName }) => {
    try {
      const member = await removeMember(roomName, socket.id)

      //LEAVE ALERT
      const leaveAlert = {
        sender: "Admin",
        text: `${member.username} has left the room (${roomName})`,
        createdAt: new Date(),
      }

      //SEND LEAVE ALERT
      io.to(roomName).emit("message", leaveAlert)

      //UPDATE MEMBERS LIST
      const membersList = await getMembersList(roomName)

      //SEND UPDATED MEMBERS LIST
      io.to(roomName).emit("membersList", { roomName, list: membersList })
    } catch (error) {
      console.log(error)
    }
  })
}

//EXPORTS
module.exports = { joinRoom, chat, leaveRoom }