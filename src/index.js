const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json());



mongoose.connect("mongodb+srv://Pragesh_Yadav:Mongoblog22@cluster0.ebq4hak.mongodb.net/Project_1_blogs?authSource=admin&replicaSet=atlas-46anzu-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

app.use('/', route);



app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
