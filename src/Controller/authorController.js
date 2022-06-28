const jwt = require("jsonwebtoken");
const authorModel = require("../Models/authorModel");

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0;
};

const isValidTitle = function (title) {
  return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1;
};

const namReg = /^[a-zA-Z ]{2,12}$/;
const mailReg = /^([a-zA-Z0-9]+)@([a-zA-Z]+)\.([a-zA-Z]{2,3}$)/;
const passwd = /^[a-zA-Z0-9]{4,10}$/;

// ===> Creat Author Account

const createAuthor = async function (req, res) {
  try {
    let { ...Userdata } = req.body;

    if (!isValidRequestBody(Userdata))
      return res
        .status(400)
        .send({ status: false, msg: "Data is required to add a Author" });

    if (!isValid(Userdata.fname))
      return res
        .status(400)
        .send({ status: false, msg: "First Name is required" });

    if (!namReg.test(Userdata.fname))
      return res
        .status(400)
        .send({ status: false, msg: "First Name must be characters" });

    if (!isValid(Userdata.lname))
      return res
        .status(400)
        .send({ status: false, msg: "Last Name is required" });

    if (!namReg.test(Userdata.lname))
      return res
        .status(400)
        .send({ status: false, msg: "Last Name must be characters" });

    if (!isValidTitle(Userdata.title))
      return res
        .status(400)
        .send({ status: false, msg: "Title should be among Mr,Mrs,Miss" });

    if (!isValid(Userdata.email))
      return res.status(400).send({ status: false, msg: "Email is required" });

    if (!isValid(Userdata.password))
      return res
        .status(400)
        .send({ status: false, msg: "Password is required" });

    if (!mailReg.test(Userdata.email))
      return res
        .status(400)
        .send({ status: false, msg: "Provide right Email" });

    if (!passwd.test(Userdata.password))
      return res
        .status(400)
        .send({ status: false, msg: "password must be characters or numbers" });

    // check Blog Auther already exist or not

    let checkAuthor = await authorModel.findOne({ email: Userdata.email });

    if (!checkAuthor) {
      let CreatAuthor = await authorModel.create(Userdata);
      return res.status(201).send({
        status: true,
        msg: "Author created Successfully",
        data: CreatAuthor,
      });
    }
    res
      .status(409)
      .send({ status: false, msg: `${email} This user already exist` });
  } catch (err) {
    res
      .status(500)
      .send({ status: false, msg: "Bad Request", erroe: err.message });
  }
};

// Controller Module for Api ===> Login BlogAuthor

const LoginAuthor = async function (req, res) {
  try {
    let email = req.body.email;
    let password = req.body.password;

    if (!isValid(email)) {
      res
        .status(400)
        .send({ status: false, Error: "Please enter an email address." });
    } else if (!mailReg.test(email))
      return res
        .status(400)
        .send({ status: false, msg: "Provide right Email" });
    else if (!isValid(password)) {
      res.status(400).send({ status: false, Error: "Please enter Password." });
    } else {
      let author = await authorModel.findOne({
        email: email,
        password: password,
      });
      if (!author)
        return res.status(400).send({
          status: false,
          Error: "Email or the Password is incorrect.",
        });

      let token = jwt.sign(
        {
          authorId: author._id.toString(),
          batch: "Blogs",
          organisation: "Bloger",
        },
        "Secretkey",
        { expiresIn: "36h" }
      );
      res.setHeader("x-api-key", token);
      res
        .status(200)
        .send({ status: true, msg: "author login successfuly", data: token });
    }
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.createAuthor = createAuthor;
module.exports.LoginAuthor = LoginAuthor;
