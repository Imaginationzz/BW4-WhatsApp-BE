const mainRoute = require("express").Router();

// //SERVICES ROUTES IMPORTS
const userRoute = require("./users");
const roomRoute = require("./rooms");
const messageRoute = require("./messages");

//ENDPOINT
mainRoute.use("/users", userRoute);
mainRoute.use("/rooms", roomRoute);
mainRoute.use("/messages", messageRoute);

//EXPORT
module.exports = mainRoute;
