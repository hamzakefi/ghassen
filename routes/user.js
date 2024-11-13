const express = require("express") ;
const { register, login,  getOneUser } = require("../controllers/user");
const isAuth = require("../middleware/isAuth");
const { validation, registerValidator, loginValidator } = require("../middleware/validator");


const router = express.Router();

// register 

router.post('/register' ,  register)

//login

router.post('/login' , validation , loginValidator(), login)

router.get ("/current" , isAuth , (req,res) =>{
    res.send(req.user)
})




router.get('/:_id',getOneUser) 




module.exports = router;