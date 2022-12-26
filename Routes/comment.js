const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { AuthenticateToken } = require("../Middlewares/AuthenticateToken");
const { Error, Success } = require("../Modules/Response");
const Comment = require("../Modals/comments");
const Post = require("../Modals/posts");

router.post("/", AuthenticateToken, async (req, res) => {
  try {
    const schema = Joi.object().keys({
      post_id: Joi.string().trim().required(),
      comment: Joi.string().trim().required(),
    });

    const { error, value } = schema.validate(req.body);
    const { uuid } = req.user;

    if (error !== undefined) return Error(res, "Bad Request Parameters");

    const CommentData = new Comment({
      uuid,
      post_id: value?.post_id,
      comment: value?.comment,
    });

    Post.findById(value?.post_id)
      .then(({ _id }) => {
        if (!_id)
          return Error(res, "Post does not exist", 404, "SOMETHING_WENT_WRONG");
        CommentData.save()
          .then((data) => {
            if (!data) {
              return Error(res, "Failed to add Comment");
            }

            return Success(res, "comment added successfully", {
              comment_id: data?._id,
            });
          })
          .catch((e) => {
            return Error(
              res,
              "Failed to add comment",
              500,
              "SOMETHING_WENT_WRONG"
            );
          });
      })
      .catch((e) => {
        return Error(res, "Post does not exist", 404, "SOMETHING_WENT_WRONG");
      });
  } catch (err) {
    console.log(err);
    return Error(res, err);
  }
});

module.exports = router;
