const express = require("express");
const router = express.Router();

const authorController = require("../Controller/authorController");
const blogController = require("../Controller/blogController");
//const {getBlogs, updateBlog, deleteBlogById, deleteBlogs} = require("../Controller/blogController")

router.post("/authors", authorController.createAuthor); // Creating Author
router.post("/blogs", blogController.createBlogs); // Creating blogs

router.delete("/blogs/:blogId", blogController.deleteByBlogId)
router.delete("/blogs", blogController.deleteBlogByQuery)

// router.get('/blogs', getBlogs.getBlogs);
// router.put('/blogs/:blogId', updateBlog);
// router.delete('/blogs/:blogId', deleteBlogById);
// router.delete('/blogs', deleteBlogs);

module.exports = router;

