const blogModel = require("../Models/blogModel");
const authorModel = require("../Models/authorModel");
const mongoose = require("mongoose");

const isValidObjectId = (ObjectId) => {
  return mongoose.Types.ObjectId.isValid(ObjectId);
};

// Controller Modeul for Api ===> POST /blogs
const createBlogs = async function (req, res) {
  try {
    let data = req.body;
    let blogData = {
      title: data.title,
      body: data.body,
      authorId: data.authorId,
      category: data.category,
      isPublished: data.isPublished ? isPublished : false,
      publishedAt: data.publishedAt ? new Date() : "",
    };
    let usualReg = /^([a-zA-Z0-9]+)/;

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

    if (!checkAuthor) {
      return res.status(400).send({
        status: false,
        msg: "This author is not exit. Please enter correct author ObjectId",
      });
    }
    let saveBlogs = await blogModel.create(blogData);
    res.status(201).send({ status: true, data: saveBlogs });
  } catch (err) {
    res.status(500).send({ msg: "Error", msg: err.message });
  }
};

// Controller Module for Api ===> GET /blogs
const getBlogs = async function (req, res) {
  try {
    let queryData = req.query;

    let check = {
      isDeleted: false,
      isPublished: true,
    };

    if (Object.keys(queryData).length == 0) {
      let getBlogs = await blogModel.find(check).populate("authorId");

      if (getBlogs.length === 0) {
        return res.status(404).send({ status: false, msg: "Blog not Found" });
      }
      return res.status(200).send({ status: true, data: getBlogs });
    }
    if (Object.keys(queryData).length != 0) {
      queryData.isDeleted = false;
      queryData.isPublished = true;
      let getfiller = await blogModel.find(queryData).populate("authorId");
      if (getfiller.length === 0)
        return res
          .status(404)
          .send({ status: false, msg: "Given Data is NOt Found" });

      return res.status(201).send({ status: true, data: getfiller });
    }
    return res.status(400).send({ status: true, msg: "Bad Request" });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

// Controller Module for Api ===> PUT /blogs/:blogId

const updateBlogsData = async function (req, res) {
  try {
    let BlogId = req.params.blogId;
    let { ...data } = req.body;
    let currentDate = new Date();

    if (Object.values(data).length === 0) {
      return res.status(400).send({ status: false, msg: "Input Missing" });
    }

    // if (!isValidObjectId(BlogId)) {
    //   return res.status(403).send({ msg: "enter valid blog id" });
    // }

    let findBlogId = await blogModel.findById(BlogId); //finding the blogId in the database to check whether it is valid or not
    if (!findBlogId)
      return res.status(404).send({ status: false, msg: "No such blog exist" });

    if (findBlogId.isDeleted)
      return res.status(404).send({
        status: false,
        msg: "No such blog found or has already been deleted",
      });

    if (Object.keys(data).length == 0)
      return res
        .status(400)
        .send({ status: false, msg: "Data is required to update a Blog" });

    if (
      data.hasOwnProperty("isDeleted") ||
      data.hasOwnProperty("authorId") ||
      data.hasOwnProperty("deletedAt") ||
      data.hasOwnProperty("publishedAt")
    )
      return res
        .status(403)
        .send({ status: false, msg: "Action is Forbidden" });

    //Verify that the document is deleted or not

    let updateNewBlog = await blogModel.findByIdAndUpdate(
      { _id: BlogId },
      {
        $set: {
          body: data.body,
          title: data.title,
          isPublished: data.isPublished,
          isDeleted: data.isDeleted,
        },
        $push: { tags: data.tags, subcategory: data.subcategory },
      },
      { new: true }
    );

    if (!findBlogId.isPublished && updateNewBlog.isPublished) {
      let updateData = await Blog.findOneAndUpdate(
        { _id: BlogId }, //finding the blogId in the database to update the publishedAt
        { publishedAt: currentDate }, //updating the publishedAt
        { new: true } //returning the updated data
      );
      return res.status(200).send({ status: true, data: updateData });
    }

    res.status(200).send({ status: true, data: updateNewBlog });
  } catch (error) {
    res.status(500).send({ msg: "server error", error: error.message });
  }
};

// Controller Module for Api ===> DELETE /blogs/:blogId

const deleteByBlogId = async function (req, res) {
  try {
    const blogId = req.params.blogId;
    let currentDate = new Date();

    if (!isValidObjectId(blogId))
      return res
        .status(404)
        .send({ status: false, msg: "Enter a valid blog Id" });

    let data = await blogModel.findById(blogId); //finding the blogId in the database to check whether it is valid or not
    if (!data)
      return res.status(404).send({ status: false, msg: "No such blog found" });

    if (data.isDeleted == true) {
      return res.status(404).send({
        status: false,
        msg: "Blog not found or Blog already  has been deleted",
      });
    }
    let deleteBlog = await blogModel.findByIdAndUpdate(
      { _id: blogId },
      { $set: { isDeleted: true, deletedAt: currentDate, isPublished: false } },
      { new: true }
    );
    return res
      .status(200)
      .send({ status: true, msg: "Blog is Deleted", data: deleteBlog });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

const deleteBlogByQuery = async function (req, res) {
  try {
    let authorLoggedIn = req["authorId"];
    let { ...querydata } = req.query;
    let currentDate = new Date();

    if (Object.keys(querydata).length == 0) {
      return res.status(404).send({
        status: false,
        msg: " Details are needed to delete a blog",
      });
    }

    if (querydata.hasOwnProperty("authorId")) {
      //checking that the authorId is present or not
      if (!isValidObjectId(querydata.authorId))
        return res
          .status(400)
          .send({ status: false, msg: "Enter a valid author Id" });
      if (authorLoggedIn !== querydata.authorId) {
        return res.status(403).send({ status: false, msg: "Action Forbidden" });
      }
    }

    let getBlogData = await blogModel.find({
      authorId: authorLoggedIn,
      querydata,
    });

    //if any blog document doesn't match with  query data
    if (getBlogData.length == 0) {
      return res.status(404).send({ status: false, msg: "No blog found" });
    }

    const getNotDeletedBlog = getBlogData.filter(
      (item) => item.isDeleted === false
    );

    if (getNotDeletedBlog.length == 0) {
      return res
        .status(404)
        .send({ status: false, msg: "The Blog is already deleted" });
    }

    querydata.authorId = authorLoggedIn;
    let deletedBlogs = await blogModel.updateMany(querydata, {
      isDeleted: true,
      isPublished: false,
      deletedAt: currentDate,
    });

    res.status(200).send({
      status: true,
      msg: `${deletedBlogs.modifiedCount} blogs has been deleted`,
    });

    // return res.status(200).send({ status: true, Data: [deleteUpdate] });
  } catch (err) {
    res.status(500).send({
      status: false,
      error: err.message,
    });
  }
};

module.exports = {
  createBlogs,
  getBlogs,
  updateBlogsData,
  deleteByBlogId,
  deleteBlogByQuery,
};

// Previosly aproched This Method
