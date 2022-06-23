const jwt = require("jsonwebtoken");

const authentication = async function (req, res, next) {
  try {
    let token = req.headers["x-Api-key"];
    if (!token) token = req.headers["x-api-key"];
    if (!token)
      return res
        .status(403)
        .send({ status: false, msg: "Warning! Token Must Be Present" });
    console.log(token);

    let decodedToken = jwt.verify(token, "Secretkey");
    if (!decodedToken)
      return res
        .status(403)
        .send({ status: false, msg: "Warning! Invalid Token" });
    next();
  } catch (error) {
    console.log("This is the error :", err.message);
    res.status(500).send({ status: false, msg: err.message });
  }
};
module.exports.authentication = authentication;
