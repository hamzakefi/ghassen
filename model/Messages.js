const mongoose = require("mongoose");

// Create schema
const { Schema, model } = mongoose;

const MessagesSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  idUser: {
    type: mongoose.Schema.Types.ObjectId,  // Ensure it's ObjectId type
    ref: "users",  // Reference to the 'users' collection
    required: true,
  },
  reponse: {
    type: String,
    default: "", // Default empty string for response
  },
  statut: {
    type: String,
    enum: ["non lu", "en cours", "traité"], 
    default: "non lu", 
  },
});

module.exports = Messages = model("messages", MessagesSchema);
