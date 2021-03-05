//MAIN IMPORTS
const RoomModel = require("../services/rooms/model");
const UserModel = require("../services/users/model");
const mongoose = require("mongoose");
//ADD USER TO ROOM
const addMember = async ({ username, socketId, roomId }) => {
  try {
    //FIND MEMBER
    const isMemberJoined = await RoomModel.findOne({
      _id: roomId,
      membersList: username,
    });

    // console.log(isMemberJoined);
    if (isMemberJoined) {
      //IF ALREADY JOINED ROOM INSERT SOCKET ID
      const user = await UserModel.findOneAndUpdate(
        { _id: username },
        { socketId: socketId }
      );
      // console.log("userSocket", user.socketId, "currentSocket", socketId);
    } else {
      //IF NOT JOINED - ADD NEW MEMBER
      const newMember = await UserModel.findOneAndUpdate(
        { _id: username },
        { socketId: socketId }
      );
    }
    // console.log(roomId);
    return { username, roomId };
  } catch (error) {
    console.log(error);
  }
};

//GET MEMBERS LIST IN A ROOM
const getMembersList = async (roomId) => {
  try {
    const room = await RoomModel.findById(roomId).populate("membersList");
    // console.log("roomTools 38", room);
    // console.log("room from line 37 roomTools.js", room);
    return room.membersList;
  } catch (error) {
    console.log(error);
  }
};

//GET MEMBER BY SOCKET ID
const getMember = async (roomId, socketId) => {
  try {
    const room = await RoomModel.findById(roomId).populate("membersList");
    // console.log(room);
    const sender = room.membersList.find(
      (member) => member.socketId === socketId
    );
    const receiver = room.membersList.filter(
      (member) => member.socketId !== socketId
    );
    // console.log(sender);
    return { sender, receiver };
  } catch (error) {
    console.log(error);
  }
};

//REMOVE MEMBER FROM DB
const removeMember = async (roomId, socketId, userId) => {
  try {
    const member = await UserModel.findById(userId);

    await RoomModel.findOneAndUpdate(
      { _id: roomId },
      { $pull: { membersList: userId } }
    );

    return member;
  } catch (error) {
    console.log(error);
  }
};

//EXPORT
module.exports = { addMember, getMembersList, getMember, removeMember };
