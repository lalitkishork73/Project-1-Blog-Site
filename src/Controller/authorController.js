const authorModel = require("../Models/authorModel")

const createAuthor = async function(req, res) {

        let autherData = req.body
        // let emailId = req.body.email
        // if(!emailId){
        //     res.status(400).send({ msg: "Email Id already exist" })
        // }
        // else{
            let saveAuthor = await authorModel.create(autherData)
            res.status(201).send({status: true, data: saveAuthor})        
}
    


module.exports.createAuthor = createAuthor