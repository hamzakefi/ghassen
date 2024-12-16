import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Stocker l'utilisateur connecté
  const token = localStorage.getItem("token"); // Récupérer le token

  // Charger les informations de l'utilisateur connecté
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:7500/api/user/current", {
          headers: {
            Authorization: token,
          },
        });
        setUser(response.data); // Enregistrer l'utilisateur
      } catch (err) {
        console.error("Impossible de récupérer l'utilisateur :", err);
      }
    };

    fetchUser();
  }, [token]);

  // État pour les données du formulaire
  const [productData, setProductData] = useState({
    id_user: "", // Initialisé après chargement de l'utilisateur
    date: "", // Rempli automatiquement
    numserie: "",
    reference: "",
    categorie: "",
  });

  const [file, setFile] = useState(null); // Stocker le fichier image
  const [message, setMessage] = useState(""); // Message de succès
  const [error, setError] = useState(""); // Message d'erreur

  // Remplir la date et l'ID utilisateur quand `user` est disponible
  useEffect(() => {
    if (user) {
      const today = new Date();
      const dateString = today.toISOString().split("T")[0]; // Format "yyyy-mm-dd"
      setProductData((prevState) => ({
        ...prevState,
        id_user: user._id, // Remplir avec l'ID de l'utilisateur connecté
        date: dateString, // Date actuelle
      }));
    }
  }, [user]);

  // Gestion des champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  // Gestion du fichier
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Gestion de la soumission
  const handleAdd = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // Vérifier les champs obligatoires
    if (!productData.numserie || !productData.reference || !productData.categorie || !file) {
      setError("Tous les champs obligatoires doivent être remplis !");
      return;
    }

    // Préparer les données pour la requête
    const formData = new FormData();
    formData.append("id_user", productData.id_user);
    formData.append("date", productData.date);
    formData.append("numserie", productData.numserie);
    formData.append("reference", productData.reference);
    formData.append("categorie", productData.categorie);
    formData.append("image", file);

    try {
      // Envoyer les données au serveur
      const response = await axios.post("http://localhost:7500/api/product/addProduct", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token, // Inclure le token pour l'autorisation
        },
      });

      setMessage(response.data.success[0].msg); // Message de succès

      // Réinitialiser le formulaire
      setProductData({
        id_user: user._id,
        date: productData.date,
        numserie: "",
        reference: "",
        categorie: "",
      });
      setFile(null);

      // Rediriger vers la liste des produits
      navigate("/products");
    } catch (err) {
      const serverError = err.response?.data?.msg || "Erreur lors de l'ajout du produit.";
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
        {/* Champ ID utilisateur (lecture seule) */}
        <TextField
          label="ID Utilisateur"
          name="id_user"
          value={productData.id_user}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true }} // Lecture seule
        />

        {/* Champ Date (lecture seule) */}
        <TextField
          label="Date"
          name="date"
          value={productData.date}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true }}
        />

        {/* Autres champs */}
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

        {/* Champ pour télécharger une image */}
        <Button
          variant="contained"
          component="label"
          style={{ marginTop: 20, marginBottom: 10 }}
        >
          Télécharger une Image
          <input type="file" hidden onChange={handleFileChange} />
        </Button>

        {/* Bouton pour soumettre */}
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
