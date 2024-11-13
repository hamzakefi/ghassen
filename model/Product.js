const mongoose = require("mongoose") ;

// create schema 
const {Schema , model } = mongoose ;

const ProductSchema = new Schema({
    
    id_user : {
        type: String,     
    },
    
    date : {
        type: String,
    },
    numserie : {
        type: String,
        unique : true,
    },


    reference : {
        type: String,

    
    },
    categorie : {
        type: String,
    
    },

   
  

    product_img: String,
  cloudinary_id: String



}, { timestamps: true })


module.exports = Product = model('product', ProductSchema)