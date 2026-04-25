const express = require("express")
const routes = express.Router()
const {signup,login} = require("../controllers/user_auth_controllers.js")


routes.post("/signup",signup);
routes.post("/login",login);


module.exports = routes;