const express = require("express");
const bodyParser = require("body-parser");
const route = require("./routes/route");
const { default: mongoose } = require("mongoose");
const app = express();

app.use(bodyParser.json());
<<<<<<< HEAD
=======



mongoose.connect("mongodb+srv://Pragesh_Yadav:Mongoblog22@cluster0.ebq4hak.mongodb.net/Project_1_blogs?authSource=admin&replicaSet=atlas-46anzu-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

app.use('/', route);
>>>>>>> d047cc786d6999168cab0b2d88ee693fae6a2c04

mongoose
  .connect(
    "mongodb+srv://lalitkishork73:UzPr9bb6Wvxda9eC@cluster0.o2wavxe.mongodb.net/myfirst-db?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});
