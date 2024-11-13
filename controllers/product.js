const Product = require("../model/Product")
const cloudinary = require("../middleware/cloudinary");
const upload = require("../middleware/multer");


exports.addproduct = async(req,res)=> {

const {id_user,reference ,date,numserie ,categorie  } = req.body

const result = await cloudinary.uploader.upload(req.file.path);

    try {
       
        const newProduct = new Product ({
            id_user,
            date,
            numserie,
             reference,
             categorie,
             profile_img: result.secure_url,
             cloudinary_id: result.public_id,           
        })
        

        await newProduct.save()
        
        res.status(200).send({ success : [{msg : 'Porduit ajouté'}] , newProduct})
        
    } catch (error) {
        res.status(400).send({msg : 'Produit non ajouté', error})   
    }
}




exports.deleteproduct = async (req,res) => {
    try {
        const{_id}= req.params;
        await Product.findOneAndDelete({_id})
        res.status(200).send({msg : "Product deleted"})
    } catch (error) {
        res.status(400).send({msg : "cannot delete this Product", error})      
    }
}



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