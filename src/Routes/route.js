const express = require('express');
const router = express.Router();

const authorController = require("../Controller/authorController")
const blogController = require("../Controller/blogController")

router.post("/authors", authorController.createAuthor) // Creating Author

router.post("/blogs", blogController.crateBlogs)  // Creating blogs

module.exports = router