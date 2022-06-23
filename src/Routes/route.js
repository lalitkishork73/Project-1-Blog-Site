const express = require("express");
const router = express.Router();

const authorController = require("../Controller/authorController");
const blogController = require("../Controller/blogController");
const middleWare = require("../Middleware/auth")

router.post("/authors", authorController.createAuthor); // Creating Author
router.post("/blogs",middleWare.authentication, blogController.createBlogs); // Creating Blogs
router.get('/blogs',middleWare.authentication, blogController.getBlogs); // Getting Blogs
router.put('/blogs/:blogId',middleWare.authentication,blogController.updateBlogsData);// Updating Blogs
router.delete("/blogs/:blogId",middleWare.authentication, blogController.deleteByBlogId) // DeletingBlog by path Params
router.delete("/blogs", middleWare.authentication,blogController.deleteBlogByQuery)   // DeletingBlog by query Params


module.exports = router;

