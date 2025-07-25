import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css";

const AddProduct = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Store logged-in user
  const token = localStorage.getItem("token"); // Retrieve token from local storage

  // Load current user information
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:7500/api/user/current", {
          headers: { Authorization: token },
        });
        setUser(response.data); // Store user
      } catch (err) {
        toast.error("Impossible de récupérer l'utilisateur.");
      }
    };

    fetchUser();
  }, [token]);

  const isAdmin = user?.isAdmin;

  // State for form data
  const [productData, setProductData] = useState({
    id_user: "",
    date: "",
    numserie: "",
    reference: "",
    categorie: "",
  });

  const [file, setFile] = useState(null); // Store uploaded file
  const [preview, setPreview] = useState(null); // For image preview

  // Fill date and user ID when `user` is available
  useEffect(() => {
    if (user) {
      const today = new Date();
      const dateString = today.toISOString().split("T")[0];
      setProductData((prevState) => ({
        ...prevState,
        id_user: user._id,
        date: dateString,
      }));
    }
  }, [user]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  // Handle file changes and preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    } else {
      setPreview(null);
    }
  };

  // Cleanup preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Handle form submission
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!productData.numserie || !productData.reference || !productData.categorie || !file) {
      toast.error("Tous les champs obligatoires doivent être remplis !");
      return;
    }

    const formData = new FormData();
    formData.append("id_user", productData.id_user);
    formData.append("date", productData.date);
    formData.append("numserie", productData.numserie);
    formData.append("reference", productData.reference);
    formData.append("categorie", productData.categorie);
    formData.append("image", file);

    try {
      const response = await axios.post("http://localhost:7500/api/product/addProduct", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      });

      toast.success(response.data.success[0].msg);

      // Reset form
      setProductData({
        id_user: user._id,
        date: productData.date,
        numserie: "",
        reference: "",
        categorie: "",
      });
      setFile(null);
      setPreview(null);

      // Redirect to product list
      navigate("/productuser");
    } catch (err) {
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else if (err.response?.data?.errors) {
        const errors = err.response.data.errors.map((e) => e.msg).join(", ");
        toast.error(errors);
      } else {
        toast.error("Erreur lors de l'ajout du produit.");
      }
    }
  };

  return (
    <Paper style={{ padding: 20, maxWidth: 500, margin: "20px auto" }}>
      <h1>Ajouter un produit</h1>

      <form onSubmit={handleAdd}>
        <TextField
          label="ID Utilisateur"
          name="id_user"
          value={productData.id_user}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: !isAdmin }}
        />

        <TextField
          label="Date"
          name="date"
          value={productData.date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: !isAdmin }}
        />

        <TextField
          label="Numéro de série"
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

        {/* Aperçu de l'image avant les boutons */}
        {preview && (
          <div style={{ marginBottom: 20, textAlign: "center" }}>
            <img
              src={preview}
              alt="Aperçu"
              style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8, objectFit: "contain" }}
            />
          </div>
        )}

        <Button variant="contained" component="label" style={{ marginBottom: 10 }}>
          Upload Image
          <input type="file" hidden accept="image/*" onChange={handleFileChange} />
        </Button>

        <Button type="submit" variant="contained" color="primary" style={{ marginTop: 20 }}>
          Ajouter le produit
        </Button>
      </form>

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </Paper>
  );
};

export default AddProduct;
