const blogModel = require("../Models/blogModel");
const authorModel = require("../Models/authorModel");

const createBlogs = async function (req, res) {
  try {
    let { ...blogData } = req.body;
    let usualReg = /^([a-zA-Z0-9]+)/;
    let normReg = /^([a-zA-Z])/;
    if (Object.keys(blogData).length == 0)
      return res
        .status(400)
        .send({ status: false, msg: "BlogData is required" });
    if (!blogData.title)
      return res
        .status(400)
        .send({ status: false, msg: "title Name is required" });
    if (!usualReg.test(blogData.title))
      return res
        .status(400)
        .send({ status: false, msg: "Title must be characters and numbers" });
    if (!blogData.authorId) {
      return res
        .status(400)
        .send({ status: false, msg: "Author Id is required" });
    }
    const checkAuthor = await authorModel.findById(blogData.authorId);
    console.log(checkAuthor);
    if (!checkAuthor) {
      return res.status(400).send({
        status: false,
        msg: "This author is not exit. Please enter correct author ObjectId",
      });
    }
    let saveBlogs = await blogModel.create(blogData);
    res.status(201).send({ status: true, data: saveBlogs });
  } catch (err) {
    console.log("This is the error :", err.message);
    res.status(500).send({ msg: "Error", msg: err.message });
  }
};

// Returns all blogs in the collection that aren't deleted and are published

const getBlogs = async function (req, res) {
  let getBlogs = blogModel.find();
  res.status(200).send({ status: true, getBlogs: getBlogs });
};

module.exports.createBlogs = createBlogs;
module.exports.getBlogs = getBlogs;
