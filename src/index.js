const express = require("express");
const bodyParser = require("body-parser");
const route = require("./routes/route");
const { default: mongoose } = require("mongoose");
const app = express();

app.use(bodyParser.json());

mongoose.connect("mongodb+srv://Ravikirank9901406452:iyamph1ElXPUNhaW@cluster0.estzo.mongodb.net/Ravikirank-project1-blog?retryWrites=true&w=majority", {
        useNewUrlParser: true,
      }
    )
    .then(() => console.log("MongoDb is connected"))
    .catch((err) => console.log(err));
  


// mongoose.connect(
//     "mongodb+srv://lalitkishork73:UzPr9bb6Wvxda9eC@cluster0.o2wavxe.mongodb.net/myfirst-db?retryWrites=true&w=majority",
//     {
//       useNewUrlParser: true,
//     }
//   )
//   .then(() => console.log("MongoDb is connected"))
//   .catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});
