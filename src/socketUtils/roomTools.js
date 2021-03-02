//MAIN IMPORTS
const RoomModel = require("../services/rooms/model");

//ADD USER TO ROOM
const addMember = async ({ username, socketId, roomName }) => {
  try {
    //FIND MEMBER
    const isMemberJoined = await RoomModel.findOne({
      roomName,
      "membersList.username": username,
    });

    if (isMemberJoined) {
      //IF ALREADY JOINED ROOM INSERT SOCKET ID
      const user = await RoomModel.findOneAndUpdate(
        { roomName, "membersList.username": username },
        { "membersList.$.socketId": socketId }
      );
    } else {
      //IF NOT JOINED - ADD NEW MEMBER
      const newMember = await RoomModel.findOneAndUpdate(
        { roomName: roomName },
        { $addToSet: { membersList: { username, socketId } } }
      );
    }
    return { username, roomName };
  } catch (error) {
    console.log(error);
  }
};

//GET MEMBERS LIST IN A ROOM
const getMembersList = async (roomName) => {
  try {
    const room = await RoomModel.findOne({ roomName: roomName });
    // console.log(room)
    // console.log(roomName)
    return room.membersList;

  } catch (error) {
    console.log(error);
  }
};

//GET MEMBER BY SOCKET ID
const getMember = async (roomName, socketId) => {
  try {
    const room = await RoomModel.findOne({ roomName });
    const member = room.membersList.find((user) => user.socketId === socketId);
    return member;
  } catch (error) {
    console.log(error);
  }
};

//REMOVE MEMBER FROM DB
const removeMember = async (roomName, socketId) => {
  try {
    const member = await getMember(roomName, socketId);

    await RoomModel.findOneAndUpdate(
      { roomName },
      { $pull: { membersList: { socketId } } }
    );

    return member;
  } catch (error) {
    console.log(error);
  }
};

//EXPORT
module.exports = { addMember, getMembersList, getMember, removeMember };
