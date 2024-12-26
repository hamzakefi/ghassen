const Product = require("../model/Product")
const cloudinary = require("../middleware/cloudinary");
const upload = require("../middleware/multer");

const express = require("express") ;
const app = express();
exports.addproduct = async (req, res) => {
  const { id_user, reference, date, numserie, categorie } = req.body;
  
  try {
    // Téléchargement de l'image sur Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Création du produit avec l'URL de l'image
    const newProduct = new Product({
      id_user,
      date,
      numserie,
      reference,
      categorie,
      product_img: result.secure_url,  // Stocker l'URL dans le champ correct
      cloudinary_id: result.public_id,
    });

    // Sauvegarde du produit dans la base de données
    await newProduct.save();

    // Réponse avec le produit ajouté
    res.status(200).send({ success: [{ msg: 'Produit ajouté' }], newProduct });

  } catch (error) {
    if (error.code === 11000) {  // Code d'erreur MongoDB pour duplication
      res.status(400).send({ error: 'Le numéro de série existe déjà.' });
    } else {
      res.status(400).send({ msg: 'Produit non ajouté', error });
    }
  }
};




exports.deleteproduct = async (req, res) => {
  const { _id } = req.params;

  try {
    const product = await Product.findById(_id);
    if (!product) {
      return res.status(404).send({ msg: "Produit introuvable" });
    }

    // Supprimer l'image de Cloudinary
    if (product.cloudinary_id) {
      await cloudinary.uploader.destroy(product.cloudinary_id);
    }

    await Product.findByIdAndDelete(_id);
    res.status(200).send({ msg: "Produit supprimé avec succès" });
  } catch (error) {
    res.status(500).send({ msg: "Erreur lors de la suppression du produit", error });
  }
};




exports.getproducts = async (req,res) => {
    try {
        const listProducts = await Product.find();
        res.status(200).send({msg : 'Products list',listProducts})
        
    } catch (error) {
        res.status(400).send({msg : 'cannot get all Products', error})
    }
  }


  exports.getOneProduct = async (req,res) => {
    const{_id}= req.params;

   try{ 
    const productToGet = await Product.findOne(req.params);
    res.status(200).send({msg : 'get product ',productToGet})
    
} catch (error) {
    res.status(400).send({msg : 'fail to get product ', error})
} }

exports.editproduct = async (req, res) => {
    const { _id } = req.params;
    const { id_user, reference, date, numserie, categorie } = req.body;
  
    try {
      const product = await Product.findById(_id);
      if (!product) {
        return res.status(404).send({ msg: "Produit non trouvé" });
      }
  
      // Si une nouvelle image est fournie, remplacer l'ancienne image sur Cloudinary
      let result;
      if (req.file) {
        // Supprimer l'ancienne image de Cloudinary
        await cloudinary.uploader.destroy(product.cloudinary_id);
  
        // Télécharger la nouvelle image sur Cloudinary
        result = await cloudinary.uploader.upload(req.file.path);
      }
  
      // Mettre à jour les champs du produit
      const updatedProduct = {
        id_user: id_user || product.id_user,
        reference: reference || product.reference,
        date: date || product.date,
        numserie: numserie || product.numserie,
        categorie: categorie || product.categorie,
        profile_img: result ? result.secure_url : product.profile_img,
        cloudinary_id: result ? result.public_id : product.cloudinary_id,
      };
  
      const productUpdated = await Product.findByIdAndUpdate(_id, updatedProduct, { new: true });
  
      res.status(200).send({ msg: 'Produit mis à jour', productUpdated });
    } catch (error) {
      res.status(400).send({ msg: 'Échec de la mise à jour du produit', error });
    }
  };