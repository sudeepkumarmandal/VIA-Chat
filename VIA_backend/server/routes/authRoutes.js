const express = require("express");
const { registerUser, loginUser } = require("../controllers/authControll");
const router = express.Router();

router.post("/regi", registerUser);
router.post("/login", loginUser);

module.exports = router;
