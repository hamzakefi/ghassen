const express = require("express");
const router = express.Router();
const { 
  addproduct, 
  deleteproduct, 
  getproducts, 
  getOneProduct, 
  editproduct 
} = require("../controllers/product");
const upload = require("../middleware/multer");

// Ajouter un produit (avec validation du fichier)
router.post('/addProduct', upload.single("image"), (req, res, next) => {
  if (!req.file) {
    return res.status(400).send({ msg: "Aucun fichier fourni" });
  }
  next();
}, addproduct);

// Récupérer tous les produits
router.get("/allproducts", getproducts);

// Récupérer un produit spécifique
router.get('/product/:_id', getOneProduct);

// Modifier un produit
router.put('/product/:_id', upload.single("image"), editproduct);

// Supprimer un produit
router.delete('/product/:_id', deleteproduct);

module.exports = router;
