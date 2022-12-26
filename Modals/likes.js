const mongoose = require("mongoose");
const { Schema } = mongoose;
 
const LikesSchema = new Schema(
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
 },
 { timestamps: { createdAt: "created_at" } },
 { collection: "likes" }
);
 
module.exports = mongoose.model("likes", LikesSchema);
