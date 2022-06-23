const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: [],
      required: true,
      default:[]
    },
    authorId: {
      type: ObjectId,    
      ref: "blogAuthor",
      required: true,
    },     
    tags:{ 
      type:[String],
      default:[]
   },
    category: {
      type: String,
      required: true,
     
    },
    subcategory:{
      type:[String],
      default:[]
    },
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
