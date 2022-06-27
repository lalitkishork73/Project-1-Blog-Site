const jwt = require("jsonwebtoken");
const authorModel = require("../Models/authorModel");

// ===> Creat Author Account

const createAuthor = async function (req, res) {
  try {
    let namReg = /^[a-zA-Z ]{2,7}$/;
    let mailReg = /^([a-zA-Z0-9]+)@([a-zA-Z]+)\.([a-zA-Z]{2,3}$)/;
    let passwd = /^[a-zA-Z0-9]{4,10}$/;
    let { ...Userdata } = req.body;

    if (Object.keys(Userdata).length == 0)
      return res
        .status(400)
        .send({ status: false, msg: "Data is required to add a Author" });
    if (!Userdata.fname)
      return res
        .status(400)
        .send({ status: false, msg: "First Name is required" });
    if (!namReg.test(Userdata.fname))
      return res
        .status(400)
        .send({ status: false, msg: "First Name must be characters" });
    if (!Userdata.lname)
      return res
        .status(400)
        .send({ status: false, msg: "Last Name is required" });
    if (!namReg.test(Userdata.lname))
      return res
        .status(400)
        .send({ status: false, msg: "Last Name must be characters" });
    if (!Userdata.title)
      return res.status(400).send({ status: false, msg: "Title is required" });
    if (!Userdata.email)
      return res.status(400).send({ status: false, msg: "Email is required" });
    if (!mailReg.test(Userdata.email))
      return res
        .status(400)
        .send({ status: false, msg: "Provide right Email" });
    if (!Userdata.password)
      return res
        .status(400)
        .send({ status: false, msg: "Password is required" });
    if (!passwd.test(Userdata.password))
      return res
        .status(400)
        .send({ status: false, msg: "password must be characters or numbers" });

    // check Blog Auther already exist or not

    let checkAuthor = await authorModel.findOne({ email: Userdata.email });

    if (!checkAuthor) {
      let CreatAuthor = await authorModel.create(Userdata);
      return res.status(201).send({ status: true, data: CreatAuthor });
    }
    res.status(409).send({ status: false, msg: "This user already exist" });
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

    if (!email) {
      res
        .status(400)
        .send({ status: false, Error: "Please enter an email address." });
    } else if (!password) {
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
      res.status(200).send({ status: true, data: token });
    }
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.createAuthor = createAuthor;
module.exports.LoginAuthor = LoginAuthor;
