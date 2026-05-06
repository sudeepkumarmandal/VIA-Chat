const express = require("express");
const UserRouter = express.Router();

const { getAlluser } = require("../controllers/userController");

UserRouter.get("/get-Alluser", getAlluser);

module.exports = UserRouter;
