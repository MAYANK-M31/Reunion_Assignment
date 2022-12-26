const express = require("express");
const router = express.Router();
const Like = require("../Modals/likes");
const Posts = require("../Modals/posts");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const users = require("../Modals/users");
const Joi = require("joi");
const { AuthenticateToken } = require("../Middlewares/AuthenticateToken");
const { Error, Success } = require("../Modules/Response");

const schema = Joi.string().trim().required();

router.post("/like/:id", AuthenticateToken, async (req, res) => {
  try {
    const { error, value } = schema.validate(req.params.id);
    const { uuid } = req.user;

    if (error !== undefined) return Error(res, "Bad Request Parameters");

    Like.updateOne(
      { $and: [{ uuid: uuid }, { post_id: value }] },
      { uuid: uuid, post_id: value },
      { upsert: true }
    )
      .then((r) => {
        console.log(r);
        Success(res, "Post liked successfully");
      })
      .catch((e) => {
        Error(res, "Failed to Like Post", 500, "SOMETHING_WENT_WRONG");
      });
  } catch (err) {
    console.log(err);
    return Error(res, err);
  }
});

router.post("/unlike/:id", AuthenticateToken, async (req, res) => {
  try {
    const { error, value } = schema.validate(req.params.id);
    const { uuid } = req.user;

    if (error !== undefined) return Error(res, "Bad Request Parameters");

    Like.deleteOne({ $and: [{ post_id: value }, { uuid: uuid }] })
      .then(({ deletedCount }) => {
        if (deletedCount == 0) {
          return Error(res, "Cannot unlike Post", 404);
        }
        Success(res, "Post Unliked successfully");
      })
      .catch((e) => {
        Error(res, "Failed to unlike", 500, "SOMETHING_WENT_WRONG");
      });
  } catch (err) {
    console.log(err);
    return Error(res, err);
  }
});

module.exports = router;
