const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema( {

    firstName:{
            type:String,
            require: true
    },
    lastName:{
        type:String,
        require:true
    },
    title:{
        enum:["Mr", "Mrs", "Miss"],
        require: true
    },
    email:{
        type:String,
        unique:true,
        require:true
    },
    password:{
        type:String,
        unique:true
    }
}, { timestamps: true });

module.exports = mongoose.model('Author', authorSchema)