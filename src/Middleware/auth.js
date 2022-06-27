const jwt = require("jsonwebtoken");
const authorModel = require("../Models/authorModel");
const blogModel = require("../Models/blogModel");

const authentication = async function (req, res, next) {
  try {
    let token = req.headers["x-Api-key"] || req.headers["x-api-key"];
    if (!token)
      return res
        .status(403)
        .send({ status: false, msg: "Warning! Token Must Be Present" });

    let decodedToken = jwt.verify(token, "Secretkey");
    let LoginAuthorId= decodedToken.authorId;
    if (!decodedToken)
      return res
        .status(403)
        .send({ status: false, msg: "Warning! Invalid Token" });
        req["authorId"]=LoginAuthorId;
    next();
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

let autherisation = async function (req, res, next) {
  try {
    let token = req.headers["x-Api-key"] || req.headers["x-api-key"];

    let decodedToken = jwt.verify(token, "Secretkey");
    let LoginAuthorId = decodedToken.authorId;

    let authorId = await blogModel
      .findOne({ authorId: LoginAuthorId })
      .select({ _id: 0, authorId: 1 });

    if (!authorId) {
      return res.status(404).send({ status: false, msg: "author no alowed" });
    }
    req["authorId"] = LoginAuthorId;
    next();
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.authentication = authentication;
module.exports.autherisation = autherisation;
