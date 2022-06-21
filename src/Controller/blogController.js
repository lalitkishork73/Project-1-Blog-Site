const blogModel = require("../Models/blogModel")
const authorModel = require("../Models/blogModel")

const createBlogs = async function(req, res) {
    let blogData = req.body
    let saveBlogs = await blogModel.
    res.send({status: true, data: saveBlogs})

}

const getBlogs= async function(req, res){
    let getBlogs=blogModel.find()
    res.status(200).send({status: true, getBlogs:getBlogs});
}


module.exports.createBlogs = createBlogs
module.exports.getBlogs = getBlogs