//TOOLS IMPORTS
const {
  addMember,
  getMembersList,
  getMember,
  removeMember,
} = require("./roomTools")
const { saveMessage } = require("./chatTools")
const UserModel = require('../services/users/model')

//JOIN ROOM
const joinRoom = (socket, subscriberSocket, io) => {
  return socket.on("joinRoom", async (data) => {
    try {
      //ADD MEMBER
      const { username, roomName } = await addMember({
        socketId: subscriberSocket,
        ...data,
      })

      //SOCKET JOIN TO ROOM
      socket.join(roomName, async () => {
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
      })
    } catch (error) {
      console.log(error)
    }
  })
}

//CHATGROUP
const chat = (socket, subscriberSocket, io) => {
  return socket.on("chat", async ({ roomName, message }) => {
    //FIND USER
    const member = await getMember(roomName, subscriberSocket)
    //MESSAGE
    const messageContent = {
      text: message,
      sender: member.username,
      // roomName,
    }

    //SAVE MESSAGE IN DB
    await saveMessage(messageContent, roomName)

    //SEND MeSSAGE TO CHAT
    io.to(roomName).emit("message", messageContent)
  })
}

//LEAVE ROOM
const leaveRoom = (socket, subscriberSocket, io) => {
  return socket.on("leaveRoom", async ({ roomName }) => {
    try {
      const member = await removeMember(roomName, subscriberSocket)

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

//UPDATE USER WITH SOCKET ID
const getUserId = (socket, io)=>{
    socket.on('getUser', async (userId) =>{
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
      return subscriberSocket
    })
}

//EXPORTS
module.exports = { joinRoom, chat, leaveRoom, getUserId}
