const blogModel = require("../Models/blogModel");
const authorModel = require("../Models/authorModel");

// Controller Module for Api ===> POST /blogs
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

// Controller Module for Api ===> GET /blogs
const getBlogs = async function (req, res) {
  try {
    let queryData = req.query;

    if (Object.keys(queryData).length == 0) {
      let getBlogs = await blogModel
        .find({ isDeleated: false, Published: true })
        .populate(queryData.authorId);
      if (!getBlogs)
        return res.status(404).send({ status: false, msg: "Blog not Found" });
      res.status(200).send({ status: true, data: getBlogs });
    }

    let getfiller = await blogModel.find({
      $or: [
        { authorId: queryData.authorId },
        { category: queryData.category },
        { tags: queryData.tag },
        { subcategory: queryData.subcategory },
      ],
    });
    if (getfiller.length === 0)
      return res
        .status(404)
        .send({ status: false, msg: "Given Data is NOt Found" });

    if (getfiller.length != 0) {
      var fliterdata = getfiller.filter(
        (x) => x.Published === true && x.isDeleated === false
      );
    }

    if (fliterdata.length === 0) {
      return res.status(404).send({ Error: "Blog does not exist" });
    } else if (fliterdata) {
      return res.status(200).send({ status: true, Data: fliterdata });
    }
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

// Controller Module for Api ===> PUT /blogs/:blogId

const updateBlogsData = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let date = new Date();
    let data = req.body;
    if (!blogId)
      res.status(400).send({ status: false, Msg: "BlogId is not there" });
    if (!data==0)
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

// Controller Module for Api ===> DELETE /blogs/:blogId

// Controller Module for Api ===> DELETE /blogs?queryParams

module.exports.createBlogs = createBlogs;
module.exports.getBlogs = getBlogs;
module.exports.updateBlogsData = updateBlogsData;
