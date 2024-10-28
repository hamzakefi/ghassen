const User = require("../model/User")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");



//***   Register */
exports.register = async(req,res) =>{
   try {
       const { firstname , name , email , password} = req.body;
       
       const foundUser = await User.findOne({email})
       if(foundUser){
          return  res.status(400).send({errors: [{ msg : "E-mail déjà utilisé... Réessayez"}]})
       }
       const saltRounds = 10;
       const hashedPassword = await bcrypt.hash(password, saltRounds )
       const newUser = new User({...req.body})
       newUser.password = hashedPassword;

       //save
       await newUser.save()

       //token
       const token = jwt.sign({
           id : newUser._id
       },
       process.env.SCRT_KEY,{expiresIn: "168h"}
       )
       res.status(200).send({ success : [{msg : "Inscription avec succès..."}] , user : newUser , token})

   } catch (error) {
       res.status(400).send({ errors : [{ msg : "inscription non reussi ... "}]})
   }
}






//**  Login */


exports.login = async(req,res) =>{
    try {
        const {email , password } = req.body ;
        
        //check email existance : 
        const foundUser = await User.findOne({email})
        if (!foundUser){
            return res.status(400).send({errors : [{ msg : "Utilisateur où E-mail non trouvé"}]})
        }
        const checkPassword = await bcrypt.compare(password,  foundUser.password)
        if (!checkPassword){
        return res.status(400).send({errors : [{ msg : "Veuillez vérifier votre mot de passe!!"}]})
    }
    const token = jwt.sign({
        id : foundUser._id,  isAdmin : foundUser.isAdmin 
    },
    process.env.SCRT_KEY,{expiresIn: "168h"}
    )
    res.status(200).send ({success : [{msg : "Welcome Back"}] , user : foundUser , token})



    } catch (error) {
        res.status(400).send({errors : [{ msg : "Impossible de trouver l'utilisateur!!"}]})
        
    }
}


exports.updateInfos = async(req,res) =>{
    try {
        const{_id}= req.params;
        const { firstname , name , email }  = req.body;      

        const updatedUser = await User.findOneAndUpdate(req.params, {$set:{...req.body}})     
        
      
        const updateddUser = new User({...req.body})
      
        const token = jwt.sign({
            id : updatedUser._id,
        },
        process.env.SCRT_KEY,{expiresIn: "168h"}
        )
        
        await updatedUser.save()
        

        res.status(200).send({success : [{ msg : "Mise à jour avec succés..."}] , user : updatedUser, token })
        
    } catch (error) {
        res.status(400).send({ errors : [{ msg : "Impossible de mettre à jour... Réessayez"}]})
    }
 }

 

 exports.updatePassword = async (req, res) => {
    const { oldPassword, password } = req.body;
    const{_id}= req.params;
    try {
      // get user
      const user = await User.findById(req.params);
      if (!user) {
          return res.status(400).send({ errors : [{ msg : 'Utilisateur non trouvé' }]});
      }
  
      // validate old password
      const isValidPassword = await bcrypt.compare(oldPassword, user.password);
      if (!isValidPassword) {
          return res.status(400).send({ errors: [{ msg : "Veuillez vérifier votre ancien mot de passe" }]})
      }
     
      // hash new password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // update user's password
      user.password = hashedPassword;
      

      const updatedUserPassword = await user.save();

      res.status(200).send({success : [{msg:"Mise à jour avec succés..."}] , user : updatedUserPassword })
  
     
    } catch (error) {
      return res.status(400).send({ errors : [{ msg :  "Réessayer plus tard" }]});
    }
  };


  exports.getusers = async (req,res) => {
    try {
        const listusers = await User.find();
        res.status(200).send({msg : 'Users list',listusers})
        
    } catch (error) {
        res.status(400).send({msg : 'cannot get all Users', error})
    }
  }


  exports.getOneUser = async (req,res) => {
    const{_id}= req.params;
   try{ 
    const userToGet = await User.findOne(req.params);
    res.status(200).send({msg : 'get user ',userToGet})
    
} catch (error) {
    res.status(400).send({msg : 'fail to get user ', error})
} }


