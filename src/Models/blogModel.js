const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.types.ObjectId

const blogSchema = new mongoose.Schema( {

    title:{
        type:String,
        require: true
    },
    body:{
        require:true
    },
    authorId:{
        type:ObjectId,
        ref:"Author",
        require:true
    },
    tags:[String],
    category:{
        type:String,
        require:true,
    
    },
    subcategory:[String],
    isDeleated:{
        type:Boolean,
        default:false
    },
    PublishedAt:{
        type:Boolean,
        default:false
    }

}, { timestamps: true });
    
module.exports = mongoose.model('Blog', blogSchema)