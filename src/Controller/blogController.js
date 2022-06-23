const blogModel = require("../Models/blogModel");
const authorModel = require("../Models/authorModel");

// Controller Modeul for Api ===> POST /blogs
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
    //let blog = await blogModel.findById(blogId)
    let date= new Date();
    let {...data} = req.body;
    //  let title= data.title
 //   let upadteTitle= blog.title
  //  upadteTitle.push(title)
    if (!blogId){
      return res.status(404).send({ status: false, Msg: "BlogId is must be present" });
    }
    if  (Object.keys(data).length == 0){            
     return res.status(400).send({ status: false, Msg: "Input data not found" });
    }
    let updateData = await blogModel.findByIdAndUpdate(
      { _id: blogId },  
      {       
        $set: {      
          title: upadteTitle,   
          body: data.body,
          tags: data.tags,
          subcategory: data.subcategory,
        },
        Published: true,
        PublishedAt: date,
      },
      { new: true }
    );
    res.status(200).send({ data: updateData });
    
  } catch (err) {
    console.log("this is the error", err);
    res.status(500).send({ error: err.message });
  }
};
// Controller Module for Api ===> DELETE /blogs/:blogId

const deleteByBlogId = async function (req, res) {
  try {
    const blogId = req.params.blogId;
    let blog = await blogModel.findById(blogId);
    let currentDate = new Date();

    if (!blog) {
      return res
        .status(404)
        .send({ status: false, msg: "No blog exist from this Id" });
    }

    if (blog.isDeleted == true) {
      return res
        .status(404)
        .send({ status: false, msg: "Blog not found or Blog already deleted" });
    }

    let abc = await blogModel.findByIdAndUpdate(
      { _id: blogId },
      { $set: { isDeleted: true, deletedAt: currentDate } }
    );
    console.log(abc);
    res.status(200).send(); 
  } catch (err) {
    res.status(500).send({ status: false, msg: err });
  }
};

// Controller Module for Api ===> DELETE /blogs?queryParams

const deleteBlogByQuery = async function (req, res) {
  try {
    let category = req.query.category;
    let authorId = req.query.authorId;
    let tags = req.query.tags;
    let subcategory = req.query.subcategory;
    let isPublished = req.query.isPublished;
    let currentDate = new Date();

    let data = await blogModel.find({
      $or: [
        { category: category },
        { authorId: authorId },
        { tags: tags },
        { subcategory: subcategory },
        { isPublished: isPublished },
      ],
    });
    if (data.length === 0) {
      return res.status(403).send({ status: false, message: "No data exists" });
    }

    let deleteUpdate = await blogModel.updateMany(
      {
        $or: [
          { category: category },
          { authorId: authorId },
          { tags: tags },
          { subcategory: subcategory },
          { isPublished: isPublished },
        ],
      },
      { $set: { isDeleted: true } },
      { new: true }
    );
    res.send({ status: true, data: deleteUpdate });
  } catch (msg) {
    res.status(500).send({ status: false, Error: msg.message });
  }
};


module.exports.createBlogs = createBlogs;
module.exports.getBlogs = getBlogs;
module.exports.updateBlogsData = updateBlogsData;
module.exports.deleteByBlogId = deleteByBlogId
module.exports.deleteBlogByQuery = deleteBlogByQuery