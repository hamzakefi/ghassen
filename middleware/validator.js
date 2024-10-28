const { check, validationResult } = require("express-validator")


exports.registerValidator = () => [
    check("firstname" , "Veuillez insérer votre prénom !").not().isEmpty(),
    check("name" , "Veuillez insérer votre prénom !").not().isEmpty(),
    check("email" , "N'est pas un e-mail").isEmail(),
    check("password" , " Entrez un mot de passe valide(Min:6)").isLength({min:6})

]


exports.loginValidator = () => [
    check("email" , "N'est pas un e-mail").isEmail(),
    check("password" , "Entrez un mot de passe valide(Min:6)").isLength({min:6})
    
]

exports.editValidator =() => [
    
    
]

exports.editPasswordValidator =() => [
    check("password" , " Entrez un mot de passe valide(Min:6)").isLength({min:6})
]

exports.validation = (req , res , next) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
     }
    next();
}


