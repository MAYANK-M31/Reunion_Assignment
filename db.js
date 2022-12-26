const mongoose = require("mongoose");
const connectDb = async () => {
  try {
    const uri = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.bulz383.mongodb.net/reunion?retryWrites=true&w=majority`;
    mongoose.connect(
      uri,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (err) => {
        if (err) {
          console.log("Connection to database failed");
          console.log(err);
        }
      }
    );
    const db = mongoose.connection;
    db.on("error", (error) => console.error(error));
    db.once("open", () => console.log("connected to database"));
    console.log("Connection to database success");
  } catch (error) {
    console.log("Error");
  }
};
module.exports = connectDb;
