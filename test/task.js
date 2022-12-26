let chai = require("chai");
let chaiHttp = require("chai-http");
const { response } = require("../index");
let server = require("../index");
const Post = require("../Modals/posts");

// Assertion Style
chai.should();
chai.use(chaiHttp);

const mongoose = require("mongoose");

// tells mongoose to use ES6 implementation of promises
mongoose.Promise = global.Promise;
const MONGODB_URI = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.bulz383.mongodb.net/reunion?retryWrites=true&w=majority`;
mongoose.connect(MONGODB_URI);

mongoose.connection
  .once("open", () => console.log("Connected!"))
  .on("error", (error) => {
    console.warn("Error : ", error);
  });

describe("ReUnion Assignment API", () => {
  // runs before each test

  var Token = "";
  it("It should get ACCESS TOKEN", (done) => {
    chai
      .request(server)
      .post("/api/authenticate")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({ email: "test@reunion.com", password: "Goinglive@2022" })
      .end((err, response) => {
        response.should.have.status(200);
        response.body.data.token.should.be.a("string");
        Token = response.body.data.token;
        done();
      });
  });

  it("It should get post created", (done) => {
    chai
      .request(server)
      .post("/api/posts")
      .set("content-type", "application/x-www-form-urlencoded")
      .set("Authorization", "Bearer " + Token)
      .send({ title: "TESTING POST", description: "lorep epsum new test" })
      .end((error, response) => {
        response.should.have.status(200);
        response.body.data.title.should.be.a("string");
        response.body.data.description.should.be.a("string");
        response.body.data.id.should.be.a("string");
        response.body.data.created_at.should.be.a("string");
        Post.findOne({ _id: response.body.data.id }).then((data) => {
          if (data) {
            done();
          }
        });
      });
  });

  it("Not sending title in POST", (done) => {
    chai
      .request(server)
      .post("/api/posts")
      .set("content-type", "application/x-www-form-urlencoded")
      .set("Authorization", "Bearer " + Token)
      .send({ description: "lorep epsum new test" })
      .end((error, response) => {
        response.should.not.have.status(200);
        done();
      });
  });

  

});
