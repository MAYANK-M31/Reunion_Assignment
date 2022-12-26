const mongoose = require("mongoose");
const { Schema } = mongoose;
 
const UserSchema = new Schema(
 {
   uuid: {
     type: String,
     trim: true,
     index: true,
     required: true,
   },
   email: {
     type: String,
     trim: true,
     lowercase: true,
     required: true,
     index: true,
   },
   password: {
     type: String,
     trim: true,
     required: true,
   },
   username: {
    type: String,
    trim: true,
  },
 },
 { timestamps: { createdAt: "created_at" } },
 { collection: "users" }
);
 
module.exports = mongoose.model("users", UserSchema);
