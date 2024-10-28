const isAdmin = async(req , res , next) => {
    if (req.admin.isAdmin){
        next();
    }else{
        res.status(401).send({ errors: [{msg : "Not authorized"}]})
    } 
}
module.exports = isAdmin
