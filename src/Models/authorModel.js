const mongoose = require("mongoose");

<<<<<<< HEAD
const authorSchema = new mongoose.Schema ( {
    firstName:{
        
            type:String,
            required: true
=======
const authorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
>>>>>>> 98e0b0063ad4e9aa74ab9229a943008c406efc89
    },
    lastName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      enum: ["Mr", "Mrs", "Miss"],
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
<<<<<<< HEAD
    password: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);
=======
    password:{
        type:String,
        unique:true,
        required:true
    }
}, { timestamps: true });
>>>>>>> d047cc786d6999168cab0b2d88ee693fae6a2c04

<<<<<<< HEAD
module.exports = mongoose.model('blogAuthor', authorSchema) // blogauthor
=======
module.exports = mongoose.model("blogAuthor", authorSchema);
>>>>>>> 98e0b0063ad4e9aa74ab9229a943008c406efc89
