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
const joinRoom = (socket, io) => {
  return socket.on("joinRoom", async (data) => {
    try {
      //ADD MEMBER
      const { username, roomId } = await addMember({
        socketId: socket.id,
        ...data,
      });
      // console.log("subscribersocket", subscriberSocket);
      //SOCKET JOIN TO ROOM
      socket.join((roomId, io), async () => {
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

        membersList.forEach((member) => {
          const socketOfMember = io.sockets.connected[member.socketId];
          // console.log(socketOfMember);
          if (socketOfMember) {
            socketOfMember.join(roomId);
          }
        });
        //SEND MEMBERS LIST
        io.to(roomId).emit("membersList", { roomId, list: membersList });
      });
    } catch (error) {
      console.log(error);
    }
  });
};
//CHATGROUP
const chat = (socket, io) => {
  return socket.on("chat", async ({ roomId, message }) => {
    //FIND USER
    const { sender, receiver } = await getMember(roomId, socket.id);
    // console.log("member", member);
    //MESSAGE
    const messageContent = {
      receiver: roomId,
      sender: sender.username,
      text: message,
    };
    // console.log("chat", messageContent);

    //SEND MeSSAGE TO CHAT
    io.to(roomId).emit("message", messageContent);
    //SAVE MESSAGE IN DB
    await saveMessage(messageContent, roomId);
  });
};

//LEAVE ROOM
const leaveRoom = (socket, io) => {
  return socket.on("leaveRoom", async ({ roomId, userId }) => {
    try {
      const member = await removeMember(roomId, socket.id, userId);
      console.log(member);
      //LEAVE ALERT
      const leaveAlert = {
        sender: "Admin",
        text: `${member.username} has left the room (${roomId})`,
        createdAt: new Date(),
      };

      //SEND LEAVE ALERT
      // io.to(roomId).emit("message", leaveAlert);

      //UPDATE MEMBERS LIST
      const membersList = await getMembersList(roomId);

      //SEND UPDATED MEMBERS LIST
      io.to(roomId).emit("membersList", { roomId, list: membersList });
    } catch (error) {
      console.log(error);
    }
  });
};

//EXPORTS
module.exports = { joinRoom, chat, leaveRoom };
