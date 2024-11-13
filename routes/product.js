const express = require("express") ;
const router = express.Router();
const { addproduct, deleteproduct, getproducts, getOneProduct, editproduct} = require("../controllers/product");



router.post('/addProduct',  addproduct);
// update contact

router.delete('/:_id',  deleteproduct);
router.put('/:_id',editproduct)

router.get ("/allproducts",   getproducts);

router.get('/:_id',  getOneProduct) ;






module.exports = router;