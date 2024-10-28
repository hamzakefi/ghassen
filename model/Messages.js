const mongoose = require("mongoose") ;

// create schema 
const {Schema , model } = mongoose ;

const MessagesSchema = new Schema({
    
    name : {
        type: String, 
        required: true,    
    },
    
    email : {
        type: String,
        required: true,
    },

    phone: {
        type: String,
        required: true,
    }, 

    message: {
        type: String,
        required: true,
    }
    
})


module.exports = Messages = model('messages', MessagesSchema)