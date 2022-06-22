const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
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
    isDeleated: {
      type: Boolean,
      default: false,
    },
    Published: {
      type: Boolean,
      default: false,
    },
    PublishedAt: {
      type: String,
    },
    deletedAt: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
