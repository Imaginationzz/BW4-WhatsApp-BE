//TOOLS IMPORTS
const {
  addMember,
  getMembersList,
  getMember,
  removeMember,
} = require("./roomTools");
const { saveMessage } = require("./chatTools");
const UserModel = require("../services/users/model");

//JOIN ROOM
const joinRoom = (socket, subscriberSocket, io) => {
  return socket.on("joinRoom", async (data) => {
    try {
      //ADD MEMBER
      const { username, roomId } = await addMember({
        socketId: subscriberSocket,
        ...data,
      });
      // console.log("subscribersocket", subscriberSocket);
      //SOCKET JOIN TO ROOM
      socket.join(roomId, async () => {
        //ALERT MESSAGE WHEN JOIN THE ROOM
        const joinAlert = {
          sender: "Admin",
          text: `${username} has joined the room`,
          createdAt: new Date(),
        };
        // console.log("roomId", roomId);
        //SEND THE ALERT TO THE ROOM
        // socket.broadcast.to(roomId).emit("message", joinAlert);

        //MEMBERS LIST
        const membersList = await getMembersList(roomId);
        // console.log("memberList", membersList);
        //FOR LOOP
        //io.sockets.connected[member.socketId].join(roomId)
        //SEND MEMBERS LIST
        io.to(roomId).emit("membersList", { roomId, list: membersList });
      });
    } catch (error) {
      console.log(error);
    }
  });
};
//CHATGROUP
const chat = (socket, subscriberSocket, io) => {
  return socket.on("chat", async ({ roomId, message }) => {
    const userId = socket.handshake.query.userId;
    //FIND USER
    const member = await getMember(roomId, userId);
    console.log("member", member);
    //MESSAGE
    const messageContent = {
      text: message,
      sender: member.username,
      // roomName,
    };
    console.log("chat", messageContent);

    //SEND MeSSAGE TO CHAT
    io.to(roomId).emit("message", messageContent);
    //SAVE MESSAGE IN DB
    await saveMessage(messageContent, roomId);
  });
};

//LEAVE ROOM
const leaveRoom = (socket, subscriberSocket, io) => {
  return socket.on("leaveRoom", async ({ roomId }) => {
    try {
      const member = await removeMember(roomId, subscriberSocket);

      //LEAVE ALERT
      const leaveAlert = {
        sender: "Admin",
        text: `${member.username} has left the room (${roomId})`,
        createdAt: new Date(),
      };

      //SEND LEAVE ALERT
      io.to(roomId).emit("message", leaveAlert);

      //UPDATE MEMBERS LIST
      const membersList = await getMembersList(roomId);

      //SEND UPDATED MEMBERS LIST
      io.to(roomId).emit("membersList", { roomId, list: membersList });
    } catch (error) {
      console.log(error);
    }
  });
};

//GET USER ID
const getUserSocket = async (socket) => {
  const userId = socket.handshake.query.userId;
  const user = await UserModel.findById(userId);
  console.log(userId);
  console.log("user", user);
  let subscriberSocket;
  if (!user.socketId) {
    const newUser = await UserModel.findByIdAndUpdate(userId, {
      socketId: socket.id,
    });
    await newUser.save();
    subscriberSocket = socket.id;
  } else {
    subscriberSocket = user.socketId;
  }
  // console.log("subscribeSocket", subscriberSocket);
  return subscriberSocket;
};

//EXPORTS
module.exports = { joinRoom, chat, leaveRoom, getUserSocket };
