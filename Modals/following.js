const mongoose = require("mongoose");
const { Schema } = mongoose;
 
const FollowingSchema = new Schema(
 {
   uuid: {
     type: String,
     trim: true,
     unique: true,
     index: true,
     required: true,
   },
   follow_id: {
     type: String,
     trim: true,
     required: true,
     unique: true,
   },
 },
 { timestamps: { createdAt: "created_at" } },
 { collection: "following" }
);
 
module.exports = mongoose.model("following", FollowingSchema);