const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    authorId: {
      type: ObjectId,
      ref: "blogAuthor",
      required: true,
    },
    tags: [String],
    category: {
      type: String,
      required: true,
    },
    subcategory: [String],
    createAt: Date,
    updateAt: Date,

    isDeleted: {
      type: Boolean,
      default: false,
    },
    Published: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: String,
      default: "",
    },
    deletedAt: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
