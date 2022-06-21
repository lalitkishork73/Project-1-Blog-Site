const blogModel = require("../Models/blogModel")

const crateBlogs = async function(req, res) {
    let blogData = req.body
    let saveBlogs = await blogModel.create(blogData)
    res.send({status: true, data: saveBlogs})

}

module.exports.crateBlogs = crateBlogs