const jwt = require("jsonwebtoken");
const authorModel = require("../Models/authorModel");

const createAuthor = async function (req, res) {
  try {
    let namReg = /^([a-zA-Z])/;
    let mailReg = /^([a-zA-Z0-9]+)@([a-zA-Z]+)\.([a-zA-Z]{2,7}$)/;
    let { ...Userdata } = req.body;

    if (Object.keys(Userdata).length == 0)
      return res
        .status(400)
        .send({ status: false, msg: "Data is required to add a Author" });
    if (!Userdata.firstName)
      return res
        .status(400)
        .send({ status: false, msg: "First Name is required" });
    if (!namReg.test(Userdata.firstName))
      return res
        .status(400)
        .send({ status: false, msg: "First Name must be characters" });
    if (!Userdata.lastName)
      return res
        .status(400)
        .send({ status: false, msg: "Last Name is required" });
    if (!namReg.test(Userdata.lastName))
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

    let CreatAuthor = await authorModel.create(Userdata);
    res.status(201).send({ status: true, data: CreatAuthor });
  } catch (err) {
    res.status(500).send({ status: false, msg: "Bad Request" });
  }
};

// Controller Module for Api ===>

const LoginPost = async function (req, res) {
  try {
    let email = req.body.email;
    let password = req.body.password;

    let author = await authorModel.findOne({
      email: email,
      password: password,
    });
    if (!author)
      return res.status(401).send({
        status: false,
        msg: "username or the password is not corerct",
      });
    let token = jwt.sign(
      {
        authorId: author._id.toString(),
        Post: "Author",
        organisation: "Bloger",
      },
      "SecretKey"
    );
    res.setHeader("x-api-key", token);
    res.status(201).send({ status: true, token: token });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.createAuthor = createAuthor;
module.exports.LoginPost = LoginPost;

