const express = require("express");
const { AuthenticateToken } = require("../Middlewares/AuthenticateToken");
const Follow = require("../Modals/following");
const router = express.Router();
const admin = require("../Modals/users");
const { Error, Success } = require("../Modules/Response");

router.get("/", AuthenticateToken, async (req, res) => {
  try {
    const { uuid, username } = req.user;

    Promise.all([
      Follow.find({ follow_id: uuid }).count(),
      Follow.find({ uuid: uuid }).count(),
    ]).then(([followers, following]) => {
      return Success(res, "User details", { username, followers, following });
    });
  } catch (err) {
    console.log(err);
    return Error(res, err);
  }
});

module.exports = router;
