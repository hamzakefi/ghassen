const Admin = require("../model/Admin")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

//***   Register */
exports.registerAdmin = async(req,res) =>{
    try {
        const { firstname , name , email , password} = req.body;
        
        const foundAdmin = await Admin.findOne({email})
        if(foundAdmin){
           return  res.status(400).send({errors: [{ msg : "E-mail déjà utilisé... Réessayez"}]})
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds )
        const newAdmin = new Admin({...req.body})
        newAdmin.password = hashedPassword;
 
        //save
        await newAdmin.save()
 
        //token
        const token = jwt.sign({
            id : newAdmin._id
        },
        process.env.SCRT_KEY,{expiresIn: "168h"}
        )
        res.status(200).send({ success : [{msg : "Inscription avec succès..."}] , admin : newAdmin , token})
 
    } catch (error) {
        res.status(400).send({ errors : [{ msg : "inscription non reussi ... "}]})
    }
 }
 
 
 
exports.loginAdmin = async(req,res) =>{
    try {
        const {email , password } = req.body ;
        
        //check email existance : 
        const foundAdmin = await Admin.findOne({email})
        if (!foundAdmin){
            return res.status(400).send({errors : [{ msg : "bad credential !!"}]})
        }
        const checkPassword = await bcrypt.compare(password,  foundAdmin.password)
        if (!checkPassword){
        return res.status(400).send({errors : [{ msg : "bad credential !!"}]})
    }
    const token = jwt.sign({
        id : foundAdmin._id,  isAdmin : foundAdmin.isAdmin 
    },
    process.env.SCRT_KEY,{expiresIn: "168h"}
    )
    res.status(200).send ({msg : "Login sucess... welcome back" , user : foundAdmin , token})



    } catch (error) {
        res.status(400).send({errors : [{ msg : "Can not find user !!"}]})
        
    }
}


exports.updateAdminInfos = async(req,res) =>{
    try {
        const{_id}= req.params;
        const { firstname , name , email }  = req.body;      

        const updatedAdmin = await Admin.findOneAndUpdate(req.params, {$set:{...req.body}})     
        
      
        const updateddAdmin = new Admin({...req.body})
      
        const token = jwt.sign({
            id : updatedAdmin._id,
        },
        process.env.SCRT_KEY,{expiresIn: "168h"}
        )
        
        await updatedAdmin.save()
        

        res.status(200).send({msg : "Updated successfully..." , admin : updatedAdmin, token })
 
    } catch (error) {
        res.status(400).send({ errors : [{ msg : "Can not update ... Try again"}]})
    }
 }



 

 exports.updateAdminPassword = async (req, res) => {
    const { oldPassword, password } = req.body;
    const{_id}= req.params;
    try {
      // get user
      const admin = await Admin.findById(req.params);
      if (!admin) {
          return res.status(400).send('User not found');
      }
  
      // validate old password
      const isValidPassword = await bcrypt.compare(oldPassword, admin.password);
      if (!isValidPassword) {
          return res.status(400).send('Please enter correct old password');
      }
  
      // hash new password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // update user's password
      admin.password = hashedPassword;
      

      const updatedAdminPassword = await admin.save();
  
      return res.json({ admin : updatedAdminPassword});
    } catch (err) {
      return res.status(400).send('Something went wrong. Try again');
    }
  };