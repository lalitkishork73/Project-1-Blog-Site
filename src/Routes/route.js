const express = require("express");
const router = express.Router();

const authorController = require("../Controller/authorController");
const blogController = require("../Controller/blogController");
const midAuth = require("../Middleware/auth");

router.post("/authors", authorController.createAuthor); // Creating Author
router.post("/blogs", midAuth.Authentication, blogController.createBlogs); // Creating Blogs
router.get("/blogs", midAuth.Authentication, blogController.getBlogs); // Getting Blogs and check login Auth

router.put(
  "/blogs/:blogId",
  midAuth.Authentication,
  blogController.updateBlogsData
); // Updating Blogs
router.delete(
  "/blogs/:blogId",
  midAuth.Authentication,
  logController.deleteByBlogId
); // DeletingBlog by path Params
router.delete(
  "/blogs",
  midAuth.Authentication,
  blogController.deleteBlogByQuery
); // DeletingBlog by query Params

module.exports = router;
