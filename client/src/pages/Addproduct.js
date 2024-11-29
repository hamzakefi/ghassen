import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();

  // État pour les champs du formulaire
  const [productData, setProductData] = useState({
    id_user: "",
    date: "",
    numserie: "",
    reference: "",
    categorie: "",
  });

  // État pour le fichier image
  const [file, setFile] = useState(null);

  // État pour les messages (succès ou erreur)
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fonction pour gérer les changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  // Fonction pour gérer la sélection d'un fichier
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Fonction pour gérer l'envoi du formulaire
  const handleAdd = async (e) => {
    e.preventDefault();

    // Réinitialiser les messages
    setMessage("");
    setError("");

    // Vérification des champs obligatoires
    if (
      !productData.id_user ||
      !productData.date ||
      !productData.numserie ||
      !productData.reference ||
      !productData.categorie
    ) {
      setError("Tous les champs doivent être remplis !");
      return;
    }

    if (!file) {
      setError("Une image doit être téléchargée !");
      return;
    }

    // Préparer les données pour l'envoi
    const formData = new FormData();
    formData.append("id_user", productData.id_user);
    formData.append("date", productData.date);
    formData.append("numserie", productData.numserie);
    formData.append("reference", productData.reference);
    formData.append("categorie", productData.categorie);
    formData.append("image", file);

    try {
      // Envoyer la requête POST
      const response = await axios.post(
        "http://localhost:7500/api/product/addProduct",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Message de succès
      setMessage(response.data.success[0].msg);

      // Réinitialiser le formulaire après succès
      setProductData({
        id_user: "",
        date: "",
        numserie: "",
        reference: "",
        categorie: "",
      });
      setFile(null);

      // Redirection vers la liste des produits
      navigate("/products"); // Modifiez le chemin selon votre route
    } catch (err) {
      // Gestion des erreurs côté serveur
      const serverError = err.response?.data?.msg || "Erreur lors de l'ajout !";
      setError(serverError);
    }
  };

  return (
    <Paper style={{ padding: 20, maxWidth: 500, margin: "20px auto" }}>
      <h1>Ajouter un Produit</h1>

      {/* Message de succès */}
      {message && <div style={{ color: "green", marginBottom: 20 }}>{message}</div>}

      {/* Message d'erreur */}
      {error && <div style={{ color: "red", marginBottom: 20 }}>{error}</div>}

      {/* Formulaire */}
      <form onSubmit={handleAdd}>
        <TextField
          label="ID Utilisateur"
          name="id_user"
          value={productData.id_user}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Date"
          type="date"
          name="date"
          value={productData.date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Numéro de Série"
          name="numserie"
          value={productData.numserie}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Référence"
          name="reference"
          value={productData.reference}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Catégorie"
          name="categorie"
          value={productData.categorie}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <Button
          variant="contained"
          component="label"
          style={{ marginTop: 20, marginBottom: 10 }}
        >
          Télécharger une Image
          <input type="file" hidden onChange={handleFileChange} />
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: 20 }}
        >
          Ajouter le Produit
        </Button>
      </form>
    </Paper>
  );
};

export default AddProduct;
