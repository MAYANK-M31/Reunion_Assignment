const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { AuthenticateToken } = require("../Middlewares/AuthenticateToken");
const { Error, Success } = require("../Modules/Response");
const Posts = require("../Modals/posts");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

router.post("/posts", AuthenticateToken, async (req, res) => {
  try {
    const schema = Joi.object().keys({
      title: Joi.string().trim().required(),
      description: Joi.string().trim().required(),
    });
    const { error, value } = schema.validate(req.body);
    const { uuid } = req.user;

    if (error !== undefined) return Error(res, "Bad Request Parameters");

    const PostData = new Posts({
      uuid,
      title: value?.title,
      description: value?.description,
    });

    PostData.save()
      .then((data) => {
        if (!data) {
          return Error(res, "Failed to Post");
        }

        const Payload = {
          title: data.title,
          description: data.description,
          id: data._id,
          created_at: data.created_at,
        };

        return Success(res, "Post added successfully", Payload);
      })
      .catch((e) => {
        return Error(res, "Failed to Post", 500, "SOMETHING_WENT_WRONG");
      });
  } catch (err) {
    console.log(err);
    return Error(res, err);
  }
});

router.delete("/posts/:id", AuthenticateToken, async (req, res) => {
  try {
    const schema = Joi.string().trim().required();
    const { error, value } = schema.validate(req.params.id);
    const { uuid } = req.user;

    if (error !== undefined) return Error(res, "Bad Request Parameters");

    Posts.deleteOne({ $and: [{ uuid: uuid }, { _id: value }] })
      .then(({ deletedCount }) => {
        if (deletedCount == 0) {
          return Error(res, "Failed to delete Post", 401, "UNAUTHORIZED");
        }
        return Success(res, "Post Deleted successfully");
      })
      .catch((e) => {
        return Error(res, "Failed to Delete Post", 500, "SOMETHING_WENT_WRONG");
      });
  } catch (err) {
    console.log(err);
    return Error(res, err);
  }
});

router.get("/posts/:id", async (req, res) => {
  try {
    const schema = Joi.string().trim().required();
    const { error, value } = schema.validate(req.params.id);
    if (error !== undefined) return Error(res, "Bad Request Parameters");

    Posts.aggregate([
      {
        $match: {
          _id: ObjectId(value),
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "post_id",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post_id",
          as: "comments",
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          likes: { $size: "$likes" },
          comments: { $size: "$comments" },
        },
      },
    ])
      .then((data) => {
        return Success(res, "success", data);
      })
      .catch((err) => {
        console.log(err);
        return Error(res, err);
      });
  } catch (err) {
    console.log(err);
    return Error(res, err);
  }
});

router.get("/all_posts", AuthenticateToken, async (req, res) => {
  try {
    const { uuid } = req.user;

    Posts.aggregate([
      {
        $match: {
          uuid: uuid,
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "post_id",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post_id",
          as: "comments",
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          title:1,
          desc:"$description",
          created_at:1,
          likes: "$likes",
          comments: "$comments",
        },
      },
    ])
      .then((data) => {
        return Success(res, "success", data);
      })
      .catch((err) => {
        console.log(err);
        return Error(res, err);
      });
  } catch (err) {
    console.log(err);
    return Error(res, err);
  }
});

module.exports = router;
