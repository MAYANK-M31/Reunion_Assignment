const mongoose = require("mongoose");
const { Schema } = mongoose;
 
const PostsSchema = new Schema(
 {
   id: {
     type: String,
     trim: true,
     index: true,
     required: true,
   },
   title: {
     type: String,
     trim: true,
     required: true,
   },
   description: {
     type: String,
     trim: true,
     required: true,
   },
 },
 { timestamps: { createdAt: "created_at" } },
 { collection: "posts" }
);
 
module.exports = mongoose.model("posts", PostsSchema);