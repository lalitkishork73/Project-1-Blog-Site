
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

const updateBlogsData= async function(req,res) {
    
  let blogId = req.params.blogId;
  let blog = await blogModel.findById(blogId);

  if (!blog) {
    return res.send("No such blog exists");
  }

  let blogData = req.body;
  let updateData = await blogModel.findOneAndUpdate({ _id: blogId }, blogData);
  res.send({ status: updateData, data: updateData });
};


//    ### DELETE /blogs/:blogId   

const deleteByBlogId = async function(req, res) {
  try {
    const blogId = req.params.blogId;
    let blog = await blogModel.findById(blogId)
    //console.log(blog)
    let currentDate = new Date()

    if(!blog) {
      return res.status(404).send({status: false, msg: "No blog exist from this Id"})
    }
  
    if(blog.isDeleted == true) {
      return res.status(404).send({status: false, msg: "Blog not found or Blog already deleted"})
    }
    
    let abc = await blogModel.findByIdAndUpdate({_id: blogId}, {$set: {isDeleted: true, deletedAt: currentDate}})
    console.log(abc)
    res.status(200).send() // {status: true, msg: "Blog deleted S " }

  }
  catch(err) {
    res.status(500).send({status: false, msg: err})
  }
    
}


// ### DELETE /blogs?queryParams

const deleteBlogByQuery = async function(req, res) {
  //try{
  try {
    let category = req.query.category
    let authorId = req.query.authorId
    let tags = req.query.tags
    let subcategory = req.query.subcategory
    let isPublished = req.query.isPublished
    let currentDate = new Date()

    

    let data = await blogModel.find({ $or: [{ category: category }, { authorId: authorId }, { tags: tags }, { subcategory: subcategory }, { isPublished: isPublished }] });
        if (data.length === 0) {
            return res.status(403).send({ status: false, message: "No data exists" })
        }

        let deleteUpdate = await blogModel.updateMany({ $or: [{ category: category }, { authorId: authorId }, { tags: tags }, { subcategory: subcategory }, { isPublished: isPublished }] }, { $set: { isDeleted: true } }, { new: true })
        res.send({ status: true, data: deleteUpdate })
        
    } catch (msg) {
        res.status(500).send({ status: false, Error: msg.message });
    }
  
  
}  




module.exports.createBlogs = createBlogs
module.exports.getBlogs = getBlogs
module.exports.deleteByBlogId = deleteByBlogId
module.exports.deleteBlogByQuery = deleteBlogByQuery