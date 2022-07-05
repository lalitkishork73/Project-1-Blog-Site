const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const mongoose = require("mongoose");
const { update } = require("../models/authorModel");

const isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId);
};

const isValid = function(value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

let validString = /\d/;

// Controller Modeul for Api ===> POST /blogs
const createBlogs = async function(req, res) {
    try {

        let {...blogData } = req.body;

        let usualReg = /^([a-zA-Z0-9]+)/;

        if (Object.keys(blogData).length == 0)
            return res
                .status(400)
                .send({ status: false, msg: "BlogData is required" });
        if (!isValid(blogData.title))
            return res
                .status(400)
                .send({ status: false, msg: "title Name is required" });

        if (!usualReg.test(blogData.title)) {
            return res
                .status(400)
                .send({ status: false, msg: "please input correct " });

        }
        if (!isValid(blogData.body))
            return res
                .status(400)
                .send({ status: false, msg: "body is required" });

        if (!isValid(blogData.authorId))
            return res
                .status(400)
                .send({ status: false, msg: "body is required" });

        if (!isValid(blogData.category))
            return res
                .status(400)
                .send({ status: false, msg: "Category of book is required" });

        if (validString.test(blogData.body) ||
            validString.test(blogData.tags) ||
            validString.test(blogData.category) ||
            validString.test(blogData.subcategory))
            return res
                .status(400)
                .send({ status: false, msg: "Data must not contains numbers" });

        if (!isValidObjectId(blogData.authorId))
            return res
                .status(404)
                .send({ status: false, msg: "Enter a valid author Id" });


        const checkAuthor = await authorModel.findById(blogData.authorId);

        if (!checkAuthor) {
            return res.status(400).send({
                status: false,
                msg: "This author is not exit. Please enter correct author ObjectId",
            });
        }
        let saveBlogs = await blogModel.create(blogData);
        res.status(201).send({ status: true, data: saveBlogs });
    } catch (err) {
        res.status(500).send({ msg: "Error", msg: err.message });
    }
};

// Controller Module for Api ===> GET /blogs
const getBlogs = async function(req, res) {
    try {
        let queryData = req.query;

        let check = {
            isDeleted: false,
            isPublished: true,
        };

        if (Object.keys(queryData).length == 0) {
            let getBlogs = await blogModel.find(check).populate("authorId");

            if (getBlogs.length === 0) {
                return res.status(404).send({ status: false, msg: "Blog not Found" });
            }
            return res.status(200).send({ status: true, data: getBlogs });
        }
        if (Object.keys(queryData).length != 0) {
            queryData.isDeleted = false;
            queryData.isPublished = true;
            let getfiller = await blogModel.find(queryData).populate("authorId");
            if (getfiller.length === 0)
                return res
                    .status(404)
                    .send({ status: false, msg: "Given Data is NOt Found" });

            return res.status(200).send({ status: true, data: getfiller });
        }
        return res.status(400).send({ status: true, msg: "Bad Request" });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

// Controller Module for Api ===> PUT /blogs/:blogId

const updateBlogsData = async function(req, res) {
    try {
        let BlogId = req.params.blogId;
        let {...data } = req.body;
        let currentDate = new Date();


        // part where checking params

        if (!isValidObjectId(BlogId)) {
            return res.status(403).send({ msg: "enter valid blog id" });
        }

        let findBlogId = await blogModel.findById(BlogId); //finding the blogId in the database to check whether it is valid or not
        if (!findBlogId)
            return res.status(404).send({ status: false, msg: "No such blog exist" });

        if (findBlogId.isDeleted)
            return res.status(404).send({
                status: false,
                msg: "No such blog found or has already been deleted",
            });

        //part where checking req body inputs

        if (Object.keys(data).length == 0)
            return res
                .status(400)
                .send({ status: false, msg: "Data is required to update a Blog" });

        if (
            data.hasOwnProperty("isDeleted") ||
            data.hasOwnProperty("authorId") ||
            data.hasOwnProperty("deletedAt") ||
            data.hasOwnProperty("publishedAt")
        )
            return res
                .status(403)
                .send({ status: false, msg: "Action is Forbidden" });

        if (validString.test(data))
            return res
                .status(400)
                .send({ status: false, msg: "Data must not contains numbers" });


        //updating blog

        let updateNewBlog = await blogModel.findByIdAndUpdate({ _id: BlogId }, {
            body: data.body,
            title: data.title,
            isPublished: data.isPublished,
            isDeleted: data.isDeleted,
            $push: { tags: data.tags, subcategory: data.subcategory },
        }, { new: true });


        // if published set time
        if ((!findBlogId.isPublished) || updateNewBlog.isPublished) {
            console.log("this blog is running")

            let updateData = await blogModel.findOneAndUpdate({ _id: BlogId }, {
                $set: { publishedAt: currentDate }
            }, { new: true });
            return res.status(200).send({ status: true, data: updateData });
        }


        if (updateNewBlog) {

            return res.status(200).send({
                status: true,
                message: "Blog update is successful",
                data: updateNewBlog
            });
        }
        return res.status(404).send({
            status: false,
            message: "not Updated "
        })
    } catch (error) {
        res.status(500).send({ msg: "server error", error: error.message });
    }
};

// Controller Module for Api ===> DELETE /blogs/:blogId

const deleteByBlogId = async function(req, res) {
    try {
        const blogId = req.params.blogId;
        let currentDate = new Date();

        if (!isValidObjectId(blogId))
            return res
                .status(404)
                .send({ status: false, msg: "Enter a valid blog Id" });

        let data = await blogModel.findById(blogId); //finding the blogId in the database to check whether it is valid or not
        if (!data)
            return res.status(404).send({ status: false, msg: "No such blog found" });

        if (data.isDeleted == true) {
            return res.status(404).send({
                status: false,
                msg: "Blog not found or Blog already  has been deleted",
            });
        }
        let deleteBlog = await blogModel.findByIdAndUpdate({ _id: blogId }, { $set: { isDeleted: true, deletedAt: currentDate, isPublished: false } }, { new: true });
        return res
            .status(200)
            .send({ status: true, msg: "Blog is Deleted", data: deleteBlog });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

const deleteBlogByQuery = async function(req, res) {
    try {
        let authorLoggedIn = req["authorId"];
        let {...querydata } = req.query;
        let currentDate = new Date();

        if (Object.keys(querydata).length == 0) {
            return res.status(404).send({
                status: false,
                msg: " Details are needed to delete a blog",
            });
        }

        //checking that the authorId is present or not
        if (querydata.hasOwnProperty("authorId")) {
            if (!isValidObjectId(querydata.authorId))
                return res
                    .status(400)
                    .send({ status: false, msg: "Enter a valid author Id" });
            if (authorLoggedIn !== querydata.authorId) {
                return res.status(403).send({ status: false, msg: "Action Forbidden" });
            }
        }



        // finding releed auther id doc and if any blog document doesn't match with  query data
        let getBlogData = await blogModel.find({
            authorId: authorLoggedIn,
            querydata,
        });

        if (getBlogData.length == 0) {
            return res.status(404).send({ status: false, msg: "No blog found" });
        }

        const getNotDeletedBlog = getBlogData.filter(
            (item) => item.isDeleted === false
        );

        if (getNotDeletedBlog.length == 0) {
            return res
                .status(404)
                .send({ status: false, msg: "The Blog is already deleted" });
        }


        // deleting and and set deleted timestamp
        querydata.authorId = authorLoggedIn;
        let deletedBlogs = await blogModel.updateMany(querydata, {
            isDeleted: true,
            isPublished: false,
            deletedAt: currentDate,
        });

        res.status(200).send({
            status: true,
            msg: `${deletedBlogs.modifiedCount} blogs has been deleted`,
        });

    } catch (err) {
        res.status(500).send({
            status: false,
            error: err.message,
        });
    }
};

module.exports = {
    createBlogs,
    getBlogs,
    updateBlogsData,
    deleteByBlogId,
    deleteBlogByQuery,
};

// Previosly aproched This Method