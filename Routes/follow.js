const bcryptjs = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const express = require("express");
const Joi = require("joi");
const { AuthenticateToken } = require("../Middlewares/AuthenticateToken");
const router = express.Router();
const Follow = require("../Modals/following");
const { Error, Success } = require("../Modules/Response");
const users = require("../Modals/users");

const schema = Joi.string().trim().required();

router.post("/follow/:id", AuthenticateToken, async (req, res) => {
  try {
    const { error, value } = schema.validate(req.params.id);
    const uuid = req.user.uuid;

    if (error !== undefined) return Error(res, "Bad Request Parameters");

    users.findOne({ uuid: value }, { uuid: 1 }).then((follow_id) => {
      if (!follow_id?.uuid) return Error(res, "User does not exist", 404);

      Follow.updateOne(
        { follow_id: follow_id?.uuid },
        { follow_id: follow_id?.uuid, uuid: uuid },
        { upsert: true }
      )
        .then((r) => {
          Success(res, "Followed user successfully");
        })
        .catch((e) => {
          Error(res, "Unable to Follow", 500, "SOMETHING_WENT_WRONG");
        });
    });
  } catch (err) {
    console.log(err);
    return Error(res, err);
  }
});

router.post("/unfollow/:id", AuthenticateToken, async (req, res) => {
  try {
    const { error, value } = schema.validate(req.params.id);
    const uuid = req.user.uuid;

    if (error !== undefined) return Error(res, "Bad Request Parameters");

    users.findOne({ uuid: value }, { uuid: 1 }).then((follow_id) => {
      if (!follow_id?.uuid) return Error(res, "User does not exist", 404);

      Follow.deleteOne(
        { follow_id: follow_id?.uuid }
      )
        .then((r) => {
          Success(res, "Unfollowed user successfully");
        })
        .catch((e) => {
          Error(res, "Unable to unfollow", 500, "SOMETHING_WENT_WRONG");
        });
    });

  } catch (err) {
    console.log(err);
    return Error(res, err);
  }
});

module.exports = router;
