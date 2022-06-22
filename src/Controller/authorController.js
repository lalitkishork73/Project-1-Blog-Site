const authorModel = require("../Models/authorModel");

const createAuthor = async function (req, res) {
  try {
    let namReg = /^([a-zA-Z])/;
    let mailReg = /^([a-zA-Z0-9]+)@([a-zA-Z]+)\.([a-zA-Z]{2,7}$)/;
    let { ...Userdata } = req.body;

<<<<<<< HEAD
        let autherData = req.body
        //const  firstLast = autherData
        let saveAuthor = await authorModel.create(autherData)
        res.status(201).send({status: true, data: saveAuthor})        
}
    
=======
    if (Object.keys(Userdata).length == 0)
      return res
        .status(400)
        .send({ status: false, msg: "Data is required to add a Author" });
    if (!Userdata.firstName)
      return res
        .status(400)
        .send({ status: false, msg: "First Name is required" });
    if (!namReg.test(Userdata.firstName))
      return res
        .status(400)
        .send({ status: false, msg: "First Name must be characters" });
    if (!Userdata.lastName)
      return res
        .status(400)
        .send({ status: false, msg: "Last Name is required" });
    if (!namReg.test(Userdata.lastName))
      return res
        .status(400)
        .send({ status: false, msg: "Last Name must be characters" });
    if (!Userdata.title)
      return res.status(400).send({ status: false, msg: "Title is required" });
    if (!Userdata.email)
      return res.status(400).send({ status: false, msg: "Email is required" });
    if (!mailReg.test(Userdata.email))
      return res
        .status(400)
        .send({ status: false, msg: "Provide right Email" });
    if (!Userdata.password)
      return res
        .status(400)
        .send({ status: false, msg: "Password is required" });
>>>>>>> 98e0b0063ad4e9aa74ab9229a943008c406efc89

    let CreatAuthor = await authorModel.create(autherData);
    res.status(201).send({ status: true, data: CreatAuthor });
  } catch (err) {
    res.status(500).send({ status: false, msg: "Bad Request" });
  }
};

module.exports.createAuthor = createAuthor;
