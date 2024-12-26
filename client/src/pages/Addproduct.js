import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Store logged-in user
  const token = localStorage.getItem("token"); // Retrieve token from local storage

  // Load current user information
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:7500/api/user/current", {
          headers: {
            Authorization: token,
          },
        });
        setUser(response.data); // Store user
      } catch (err) {
        console.error("Unable to fetch user:", err);
      }
    };

    fetchUser();
  }, [token]);

  // State for form data
  const [productData, setProductData] = useState({
    id_user: "", // Will be set when the user is loaded
    date: "", // Auto-filled
    numserie: "",
    reference: "",
    categorie: "",
  });

  const [file, setFile] = useState(null); // Store uploaded file
  const [message, setMessage] = useState(""); // Success message
  const [error, setError] = useState(""); // Error message

  // Fill date and user ID when `user` is available
  useEffect(() => {
    if (user) {
      const today = new Date();
      const dateString = today.toISOString().split("T")[0]; // Format "yyyy-mm-dd"
      setProductData((prevState) => ({
        ...prevState,
        id_user: user._id, // Set with the current user's ID
        date: dateString, // Current date
      }));
    }
  }, [user]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  // Handle file changes
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle form submission
  const handleAdd = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // Validate required fields
    if (!productData.numserie || !productData.reference || !productData.categorie || !file) {
      setError("All required fields must be filled!");
      return;
    }

    // Prepare form data for the request
    const formData = new FormData();
    formData.append("id_user", productData.id_user);
    formData.append("date", productData.date);
    formData.append("numserie", productData.numserie);
    formData.append("reference", productData.reference);
    formData.append("categorie", productData.categorie);
    formData.append("image", file);

    try {
      // Send data to the server
      const response = await axios.post("http://localhost:7500/api/product/addProduct", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token, // Include token for authorization
        },
      });

      setMessage(response.data.success[0].msg); // Success message

      // Reset the form
      setProductData({
        id_user: user._id,
        date: productData.date,
        numserie: "",
        reference: "",
        categorie: "",
      });
      setFile(null);

      // Redirect to the product list
      navigate("/productuser");
    } catch (err) {
      if (err.response?.data?.error) {
        // Single backend error
        setError(err.response.data.error);
      } else if (err.response?.data?.errors) {
        // Multiple backend errors
        const errors = err.response.data.errors.map((e) => e.msg).join(", ");
        setError(errors);
      } else {
        // Generic error message
        setError("Error adding product.");
      }
    }
  };

  return (
    <Paper style={{ padding: 20, maxWidth: 500, margin: "20px auto" }}>
      <h1>Add Product</h1>

      {/* Success Message */}
      {message && (
        <div style={{ color: "green", marginBottom: 20 }}>
          <strong>Success:</strong> {message}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{ color: "red", marginBottom: 20 }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleAdd}>
        {/* User ID (read-only) */}
        <TextField
          label="User ID"
          name="id_user"
          value={productData.id_user}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true }} // Read-only field
        />

        {/* Date (read-only) */}
        <TextField
          label="Date"
          name="date"
          value={productData.date}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true }}
        />

        {/* Other fields */}
        <TextField
          label="Serial Number"
          name="numserie"
          value={productData.numserie}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Reference"
          name="reference"
          value={productData.reference}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Category"
          name="categorie"
          value={productData.categorie}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        {/* Upload image */}
        <Button
          variant="contained"
          component="label"
          style={{ marginTop: 20, marginBottom: 10 }}
        >
          Upload Image
          <input type="file" hidden onChange={handleFileChange} />
        </Button>

        {/* Submit button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: 20 }}
        >
          Add Product
        </Button>
      </form>
    </Paper>
  );
};

export default AddProduct;
