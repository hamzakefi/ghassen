const Admin = require("../model/Admin")
const jwt = require("jsonwebtoken")


const isAuthAdmin = async(req , res , next) => {
    try {
        // test if user has token 
        const token = req.headers["authorization"]

        if (!token){
        return res.status(401).send({errors: [{ msg : " Not authorized 1 !!!"}]})
    }

    const decoded = jwt.verify(token, process.env.SCRT_KEY) ///id
    const foundAdmin = await Admin.findOne({_id: decoded.id })


    if (!foundAdmin) {
        return res.status(401).send({errors: [{ msg : " Not authorized 2 !!!"}]})
    }
    req.admin = foundAdmin ;
     next()  
   
    } catch (error) {
        return res.status(401).send({errors: [{ msg : " Not authorized 3 !!!"}]})
    }
}

module.exports = isAuthAdmin