const mainRoute = require("express").Router()

// //SERVICES ROUTES IMPORTS
const userRoute = require("./users")
const roomRoute = require("./rooms")

//ENDPOINT
mainRoute.use("/users", userRoute)
mainRoute.use("/rooms", roomRoute)

//EXPORT
module.exports = mainRoute
