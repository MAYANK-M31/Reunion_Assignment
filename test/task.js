let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
const Post = require("../Modals/posts");
const Follow = require("../Modals/following");
const Like = require("../Modals/likes");

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
  it("GET ACCESS TOKEN : POST /api/authenticate", (done) => {
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

  it("CREATE NEW POST : POST /api/posts", (done) => {
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

  it("Not sending title in POST : POST /api/posts", (done) => {
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

  it("Cannot Follow Self : POST /api/follow", (done) => {
    const UUID = "7cc80f86-0d9c-43f2-90aa-3be3ae0889f1";
    chai
      .request(server)
      .post("/api/follow/" + UUID)
      .set("content-type", "application/x-www-form-urlencoded")
      .set("Authorization", "Bearer " + Token)
      .end((error, response) => {
        response.should.not.have.status(200);
        Follow.findOne({ $and: [{ follow_id: UUID }, { uuid: UUID }] }).then(
          (exist) => {
            if (!exist) {
              done();
            }
          }
        );
      });
  });

  it("Cannot Unlike Unliked Post : POST /api/unlike/", (done) => {
    const PostId = "63a9be18e1951da44a6971b9";
    chai
      .request(server)
      .post("/api/unlike/" + PostId)
      .set("content-type", "application/x-www-form-urlencoded")
      .set("Authorization", "Bearer " + Token)
      .end((error, response) => {
        response.should.not.have.status(200);
        Like.findOne({
          $and: [
            { post_id: PostId },
            { uuid: "bc95010a-a453-43d5-bc74-f91cb2ef0d0d" },
          ],
        }).then((exist) => {
          if (!exist) {
            done();
          }
        });
      });
  });

  it("Liking Post do not exist : POST: /api/like", (done) => {
    const PostId = "63a9be29e1951da44a6971b9";
    chai
      .request(server)
      .post("/api/like/" + PostId)
      .set("content-type", "application/x-www-form-urlencoded")
      .set("Authorization", "Bearer " + Token)
      .end((error, response) => {
        response.should.not.have.status(200);
        Like.findOne({
          $and: [
            { post_id: PostId },
            { uuid: "bc95010a-a453-43d5-bc74-f91cb2ef0d0d" },
          ],
        }).then((exist) => {
          if (!exist) {
            done();
          }
        });
      });
  });

  it("Getting all Post auth user : GET: /api/all_posts", (done) => {
    chai
      .request(server)
      .get("/api/all_posts")
      .set("content-type", "application/x-www-form-urlencoded")
      .set("Authorization", "Bearer " + Token)
      .end((error, response) => {
        response.should.have.status(200);
        var countResponse = response.body.data;
        countResponse.should.be.a("array");

        Post.find({
          $and: [{ uuid: "7cc80f86-0d9c-43f2-90aa-3be3ae0889f1" }],
        })
          .count()
          .then((count) => {
            if (count == countResponse.length) {
              done();
            }
          });
      });
  });
});
