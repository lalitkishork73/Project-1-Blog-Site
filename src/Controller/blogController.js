const blogModel = require("../Models/blogModel");
const authorModel = require("../Models/authorModel");
const { default: mongoose } = require("mongoose");

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
      publishedAt: data.publishedAt ? new Data() : null,
    };
    let usualReg = /^([a-zA-Z0-9]+)/;

    let authorLoggedIn = req["authorId"];
    if (authorLoggedIn != blogData.authorId) {
      res.status(404).send({ status: false, msg: "Must be Authorised" });
    }

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
    let authorLoggedIn = req["authorId"];
    let check = {
      isDeleted: false,
      Published: true,
    };
    if (!authorLoggedIn) {
      res.status(401).send({ status: false, msg: "user is not Authorised" });
    }
    if (Object.keys(queryData).length == 0) {
      let getBlogs = await blogModel.find(check);

      if (getBlogs.length === 0) {
        return res.status(404).send({ status: false, msg: "Blog not Found" });
      }
      return res.status(200).send({ status: true, data: getBlogs });
    }
    /*  queryData.Published = true;
    queryData.isDeleted = false; */

    let getfiller = await blogModel.find(queryData);
    if (getfiller.length === 0)
      return res
        .status(404)
        .send({ status: false, msg: "Given Data is NOt Found" });

    if (getfiller.length != 0) {
      var fliterdata = getfiller.filter(
        (x) => x.isPublished === true && x.isDeleted === false
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
    let BlogId = req.params.blogId;
    let data = req.body;
    let currentDate = new Date();
    let authorLoggedIn = req["authorId"];
    let authoridBlog = req["loginAuthorId"];
    let { body, title, tags, subcategory, isPublished, isDeleted } = data;

    const isValidObjectId = (ObjectId) => {
      return mongoose.Types.ObjectId.isValid(ObjectId);
    };

    if (Object.values(data).length === 0) {
      return res.status(400).send({ status: false, msg: "Input Missing" });
    }
    if (!isValidObjectId(BlogId)) {
      return res.status(403).send({ msg: "enter valid blog id" });
    }

    let blog = await blogModel.findOne({
      _id: BlogId,
      isDeleted: false,
      deletedAt: "",
    });

    if (!blog) {
      return res.status(404).send({ status: false, msg: "no blog exist" });
    }

    if (blog.authorId.toString() != authoridBlog) {
      res.status(404).send({ status: false, msg: " Unauthorised access!" });
    }

    let blogAuhor = blog.authorId.toString();
    if (blog.authorId != blogAuhor) {
      res.status(401).send({ status: false, msg: "not authorised" });
    }
    //Verify that the document is deleted or not
    if (blog.isDeleted)
      return res.status(404).send({
        status: false,
        msg: "No such blog found or has already been deleted",
      });

    let updateNewBlog = await blogModel.findOneAndUpdate(
      { _id: BlogId },
      {
        $set: {
          body: body,
          title: title,
          isPublished: isPublished,
          isDeleted: isDeleted,
        },
        $push: { tags: tags, subcategory: subcategory },
      },
      { new: true }
    );

    if (updateNewBlog.isPublished == true) {
      let update = await blogModel.findOneAndUpdate(
        { _id: BlogId },
        { publishedAt: currentDate }
      );
      return res.status(200).send({ status: true, data: update });
    }

    if (updateNewBlog.isPublished == false) {
      let update = await blogModel.findOneAndUpdate(
        { _id: BlogId },
        { $set: { publishedAt: "" } }
      );
      return res.status(200).send({ status: true, data: update });
    }

    if (updateNewBlog.isDeleted == true) {
      return res.status(404).send({ status: false, msg: "blog not found" });
    }

    if (updateNewBlog.isDeleted == false) {
      let update = await blogModel.findOneAndUpdate(
        { _id: BlogId },
        { deletedAt: "" }
      );
      res.status(200).send({ status: true, data: update });
    }
    return res.status(200).send({
      status: true,
      data: updateNewBlog,
      msg: "blog updated successfuly",
    });
  } catch (error) {
    console.log("server error", error.message);
    res.status(500).send({ msg: "server error", error: error.message });
  }
};

// Controller Module for Api ===> DELETE /blogs/:blogId

const deleteByBlogId = async function (req, res) {
  try {
    let authorLoggedIn = req["authorId"];
    const blogId = req.params.blogId;
    let blog = await blogModel.findById(blogId);
    let authorid = blog.authorId.toString();
    let currentDate = new Date();
    console.log(authorLoggedIn);

    if (!blog) {
      return res
        .status(404)
        .send({ status: false, msg: "No blog exist from this Id" });
    }

    if (blog.isDeleted == true) {
      return res
        .status(404)
        .send({ status: false, msg: "Blog not found or Blog already deleted" });
    } else {
      if (authorLoggedIn === authorid) {
        let deleteBlog = await blogModel.findByIdAndUpdate(
          { _id: blogId },
          { $set: { isDeleted: true, deletedAt: currentDate } },
          { new: true }
        );
        return res.status(200).send({ status: true, data: deleteBlog });
      }
    }
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

    let data = Object.values(querydata);
    
    if (data.length == 0) {
      res.status(404).send({ status: false, Error: "Blog does not exist!" });
    }
    if(!(authorLoggedIn === data[0])){
      
      //console.log(deleteUpdate);
      return res.status(404).send({ status: false, msg: "Unaurthorised" });

    }
    else {
      let deleteUpdate = await blogModel.updateMany(querydata, {
        $set: { isDeleted: true, deletedAt: currentDate, Published: false },
      });
      return res.status(200).send({ status: true, Data: [deleteUpdate] });
    }
    
    // console.log(deleteUpdate);
    // return res.status(200).send({ status: true, Data: [deleteUpdate] });
  } catch (err) {
    res.status(500).send({
      status: false,
      error: err.message,
    });
  }
};



module.exports.createBlogs = createBlogs;
module.exports.getBlogs = getBlogs;
module.exports.updateBlogsData = updateBlogsData;
module.exports.deleteByBlogId = deleteByBlogId;
module.exports.deleteBlogByQuery = deleteBlogByQuery;

// Previosly aproched This Method
