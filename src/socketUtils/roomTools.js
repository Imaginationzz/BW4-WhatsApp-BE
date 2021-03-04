//MAIN IMPORTS
const RoomModel = require("../services/rooms/model");
const UserModel = require("../services/users/model");

//ADD USER TO ROOM
const addMember = async ({ username, socketId, roomId }) => {
  try {
    //FIND MEMBER
    const isMemberJoined = await RoomModel.findOne({
      _id: roomId,
      "membersList.username": username,
    });

    if (isMemberJoined) {
      //IF ALREADY JOINED ROOM INSERT SOCKET ID
      const user = await RoomModel.findOneAndUpdate(
        { _id: roomId, "membersList.username": username },
        { "membersList.$.socketId": socketId }
      );
    } else {
      //IF NOT JOINED - ADD NEW MEMBER
      const newMember = await RoomModel.findOneAndUpdate(
        { _id: roomId },
        { $addToSet: { membersList: { username, socketId } } }
      );
    }
    console.log(roomId);
    return { username, roomId };
  } catch (error) {
    console.log(error);
  }
};

//GET MEMBERS LIST IN A ROOM
const getMembersList = async (roomId) => {
  try {
    const room = await RoomModel.findOne({ _id: roomId });
    // console.log("room from line 37 roomTools.js", room);
    return room.membersList;
  } catch (error) {
    console.log(error);
  }
};

//GET MEMBER BY SOCKET ID
const getMember = async (roomId, userId) => {
  try {
    const room = await RoomModel.findOne({ _id: roomId });
    const member = await UserModel.findById(userId);
    // console.log("roomTools 48", member, room);
    return member;
  } catch (error) {
    console.log(error);
  }
};

//REMOVE MEMBER FROM DB
const removeMember = async (roomId, socketId) => {
  try {
    const member = await getMember(roomId, socketId);

    await RoomModel.findOneAndUpdate(
      { _id: roomId },
      { $pull: { membersList: { socketId } } }
    );

    return member;
  } catch (error) {
    console.log(error);
  }
};

//EXPORT
module.exports = { addMember, getMembersList, getMember, removeMember };
