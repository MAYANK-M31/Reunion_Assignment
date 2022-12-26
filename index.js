const express = require("express");
const App = express();
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
// const fileupload = require("express-fileupload");
const { PORT } = require("./config");
 
// MIDDLEWARES
require("dotenv").config();
const cors = require("cors");
App.use(bodyParser.json({ limit: "200mb" }));
App.use(bodyParser.urlencoded());
// App.use(fileupload({ useTempFiles: true,preserveExtension:true }));
App.use(cors());
 
//CONNECT TO DATABASE
const uri = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.bulz383.mongodb.net/reunion?retryWrites=true&w=majority`;
 
mongoose.connect(uri, {
 useNewUrlParser: true,
 useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("connected to database"));
 
// ROUTES
const SignIn = require("./Routes/signin");
const Follow = require("./Routes/follow");

 
App.use("/api/authenticate", SignIn);
App.use("/api", Follow);

 
App.get("/", (req, res) => {
 res.status(200).send("Welcome to NoApp API");
});
App.listen(PORT, async () => {
 console.log("Server started on port", PORT);
});
 
module.exports = App;