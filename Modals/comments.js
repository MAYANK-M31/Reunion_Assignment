const mongoose = require("mongoose");
const { Schema } = mongoose;
 
const CommentSchema = new Schema(
 {
   uuid: {
     type: String,
     trim: true,
     index: true,
     required: true,
   },
   post_id: {
     type: String,
     trim: true,
     index: true,
     required: true,
   },
   comment: {
    type: String,
    trim: true,
    required: true,
  },
 },
 { timestamps: { createdAt: "created_at" } },
 { collection: "comments" }
);
 
module.exports = mongoose.model("comments", CommentSchema);