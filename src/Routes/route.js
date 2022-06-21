const express = require('express');
const router = express.Router();

const authorController = require("../Controller/authorController")
const {blogController,getBlogs, updateBlog, deleteBlogById, deleteBlogs} = require("../Controller/blogController")

router.post("/authors", authorController.createAuthor) // Creating Author
router.post("/blogs", blogController.crateBlogs)  // Creating blogs

router.get('/blogs', getBlogs.getBlogs);
router.put('/blogs/:blogId', updateBlog);
router.delete('/blogs/:blogId', deleteBlogById);
router.delete('/blogs', deleteBlogs);

module.exports = router;