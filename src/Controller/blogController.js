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
  let data = req.query;
  filter = {};
  if (data.authorId) {
    filter.authorId;
  }

  res.status(200).send({ status: true, getBlogs: getBlogs });
};

const updateBlogsData = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let date= new Date();
    let data = req.body;
    if (!blogId)
      res.status(400).send({ status: false, Msg: "BlogId is not there" });
    if (!data)
      res.status(400).send({ status: false, Msg: "Input data not found" });
    let updateData = await blogModel.findByIdAndUpdate(
      { _id: blogId },
      {
        $set: {
          title: data.title,
          body: data.body,
          tags: data.tags,
          subcategory: data.subcategory,
        },
        isPublished: true,
        PublishedAt: date,
      },
      { new: true }
    );
    res.status(201).send({ data: updateData });
  } catch (err) {
    console.log("this is the error", err);
    res.status(500).send({ error: err.message });
  }
};

module.exports.createBlogs = createBlogs;
module.exports.getBlogs = getBlogs;
module.exports.updateBlogsData = updateBlogsData;
