const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
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

module.exports = mongoose.model("blogAuthor", authorSchema);
