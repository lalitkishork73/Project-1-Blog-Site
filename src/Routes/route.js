const express = require("express");
const router = express.Router();

const authorController = require("../Controller/authorController");
const blogController = require("../Controller/blogController");

router.post("/authors", authorController.createAuthor); // Creating Author
router.post("/blogs", blogController.createBlogs); // Creating Blogs
router.get('/blogs', blogController.getBlogs); // Getting Blogs
router.put('/blogs/:blogId',blogController.updateBlogsData);// Updating Blogs

module.exports = router;
