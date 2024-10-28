const express = require("express") ;
const { registerAdmin,loginAdmin, updateAdminInfos, updateAdminPassword } = require("../controllers/admin");
const { getusers } = require("../controllers/user");
const isAuthAdmin = require("../middleware/isAuthAdmin");
const isAdmin = require("../middleware/isAdmin");
const { validation, registerValidator, loginValidator } = require("../middleware/validator");

const router = express.Router();
router.post('/registerAdmin' , registerValidator(),validation, registerAdmin)

router.post('/loginAdmin', validation , loginValidator(), loginAdmin)
router.get ("/currentAdmin" , isAuthAdmin , (req,res) =>{res.send(req.admin)})



router.get ("/allusers" , getusers)

router.put('/:_id',updateAdminInfos) 
router.put('/password/:_id',updateAdminPassword) 



module.exports = router;