const jwt = require("jsonwebtoken");
const authorModel = require("../Models/authorModel");
const blogModel = require("../Models/blogModel");
const mongoose = require("mongoose");

const isValidObjectId = (ObjectId) => {
  return mongoose.Types.ObjectId.isValid(ObjectId);
};

const authentication = async function (req, res, next) {
  try {
    let token = req.headers["x-Api-key"] || req.headers["x-api-key"];
    if (!token)
      return res
        .status(403)
        .send({ status: false, msg: "Warning! Token Must Be Present" });

    let decodedToken = jwt.verify(token, "Secretkey");
    let LoginAuthorId = decodedToken.authorId;
    if (!decodedToken)
      return res
        .status(403)
        .send({ status: false, msg: "Warning! Invalid Token" });
    req["authorId"] = LoginAuthorId;
    next();
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

let autherisation = async function (req, res, next) {
  try {
    let token = req.headers["x-Api-key"] || req.headers["x-api-key"];

    let decodedToken = jwt.verify(token, "Secretkey");
    let loggedInUser = decodedToken.authorId;
    let authorLogging;

    if (req.body.hasOwnProperty("authorId")) {
      //if authorId is present in request body

      //checking whether the authorId is valid or not
      if (!isValidObjectId(req.body.authorId))
        return res
          .status(400)
          .send({ status: false, msg: "Enter a valid author Id" });
      authorLogging = req.body.authorId; //getting authorId from request body
    }

    if (req.params.hasOwnProperty("blogId")) {
      //if blogId is present in request params

      //checking whether the blogId is valid or not
      if (!isValidObjectId(req.params.blogId))
        return res
          .status(400)
          .send({ status: false, msg: "Enter a valid blog Id" });
      let blogData = await blogModel.findById(req.params.blogId); //getting blog data from database using blogId
      if (!blogData)
        return res
          .status(404)
          .send({ status: false, msg: "Error, Please check Id and try again" });
      authorLogging = blogData.authorId.toString(); //getting authorId from blog data using blogId and converting it to string
    }

    //if authorId is not present in request body or request params or request query
    if (!authorLogging)
      return res
        .status(400)
        .send({ status: false, msg: "AuthorId is required" });

    //checking whether the loggedInUser is same as authorLogging or not
    if (loggedInUser !== authorLogging)
      return res
        .status(403)
        .send({ status: false, msg: "Error, authorization failed" });

    next();
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports = { authentication, autherisation };
