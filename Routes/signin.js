const bcryptjs = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
 
const express = require("express");
const Joi = require("joi");
const { AuthenticateToken } = require("../Middlewares/AuthenticateToken");
const router = express.Router();
const admin = require("../Modals/users");
const { Error, Success } = require("../Modules/Response");
 
 
 
 
 
router.post("/",async (req, res) => {
 try {
   const { error, value } = schema.validate(req.body);
 
   if (error !== undefined)
     return Error(
       res,
       "Bad Request Parameters",
       undefined,
       error?.message?.search("match") == -1
         ? error.message
         : "Invalid Password"
     );
 
   admin.findOne({ email: value.email }).then(async (data) => {
     if (!data || !data?.email)
       return Error(res, "Invalid email or password", 401, "UNAUTHORIZED");
 
     const token = Generate_Access_Token({ uuid: data?.uuid });
     return Success(res, "Signedin successfully", { token });
   });
 } catch (err) {
   console.log(err);
   return Error(res, err);
 }
});
 
 
 
 
 
 
router.post("/signup", async (req, res) => {
 try {
   const { error, value } = schema.validate(req.body);
 
   if (error !== undefined)
     return Error(
       res,
       "Bad Request Parameters",
       undefined,
       error?.message?.search("match") == -1
         ? error.message
         : "Password must contain atleast 8 character, 1 special character, 1 Uppercase character , 1 Numeric character"
     );
 
   admin.findOne({ email: value.email }).then(async (data) => {
     if (data && data?.email)
       return Error(res, "User already Exist please sign in", 409);
 
     // Genrating salt and then hashing password
     const salt = await bcryptjs.genSalt(10);
     const HashPassword = await bcryptjs.hash(value.password, salt);
 
     //Generating Unique User Id
     const UID = uuidv4();
 
     const adminData = new admin({
       uuid: UID,
       email: value?.email,
       password: HashPassword,
     });
     adminData
       .save()
       .then(() => {
         return Success(res, "User account created successfully");
       })
       .catch((err) => {
         console.log(err);
         return Error(res, "Something went wrong", undefined, err);
       });
   });
 } catch (err) {
   console.log(err);
   return Error(res, err);
 }
});
 
 
const schema = Joi.object().keys({
 email: Joi.string().trim().email().required(),
 password: Joi.string()
   .trim()
   .min(8)
   .regex(
     new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})")
   )
   .required(),
});
 
const Generate_Access_Token = ({ uuid }) => {
 const payload = {
   uuid,
 };
 const TOKEN = jwt.sign(payload, process.env.JWT_SECRET, {
   expiresIn: "24h",
 });
 
 return TOKEN;
};
 
module.exports = router;