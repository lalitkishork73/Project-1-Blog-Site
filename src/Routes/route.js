const express = require("express");
const router = express.Router();
const { createAuthor, LoginAuthor } = require("../Controller/authorController");
const {
  createBlogs,
  getBlogs,
  updateBlogsData,
  deleteByBlogId,
  deleteBlogByQuery,
} = require("../Controller/blogController");
const { authentication, autherisation } = require("../Middleware/auth");


router.post("/authors", createAuthor); // Creating Author
router.post("/login", LoginAuthor);
router.post("/blogs", authentication, createBlogs); // Creating Blogs
router.get("/blogs", authentication, getBlogs); // Getting Blogs and check login Auth

router.put("/blogs/:blogId", authentication, autherisation, updateBlogsData); // Updating Blogs
router.delete("/blogs/:blogId", authentication, autherisation, deleteByBlogId); // DeletingBlog by path Params
router.delete("/blogs", authentication, deleteBlogByQuery); // DeletingBlog by query Params

module.exports = router;
