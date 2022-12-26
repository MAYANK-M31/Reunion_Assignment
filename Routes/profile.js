const express = require("express");
const { AuthenticateToken } = require("../Middlewares/AuthenticateToken");
const router = express.Router();
const admin = require("../Modals/users");
const { Error, Success } = require("../Modules/Response");

router.get("/", AuthenticateToken, async (req, res) => {
  try {
    return Success(res, "User details", req.user);
  } catch (err) {
    console.log(err);
    return Error(res, err);
  }
});

module.exports = router;
