// This is Token Verifier middleware

const admin = require("../Modals/users");
const jwt = require("jsonwebtoken");
const { Error } = require("../Modules/Response");

function AuthenticateToken(req, res, next) {
  try {
    const auth_header = req.headers["authorization"];
    const token = auth_header && auth_header.split(" ")[1];

    if (!token) {
      return Error(res, "Authorization error", 403);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (err) return Error(res, "Invalid token", 403, "Authorization error");

      admin
        .findOne({
          uuid: data?.uuid,
        },{uuid:1})
        .then((detail) => {
          if(!detail) return Error(res, "Invalid Token", 403,"INVALID_USER");
          req.user = detail;
          next();
        })
        .catch((e) => {
          return Error(res, "Invalid Token", 403);
        });
    });
  } catch (error) {
    return Error(res, err);
  }
}

module.exports = { AuthenticateToken };
