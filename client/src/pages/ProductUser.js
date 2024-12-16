import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
} from "@mui/material";

const UserProducts = () => {
  const [products, setProducts] = useState([]); // État pour les produits
  const [user, setUser] = useState(null); // État pour l'utilisateur connecté
  const [loading, setLoading] = useState(true); // État pour indiquer si les données sont en cours de chargement
  const [error, setError] = useState(""); // État pour les erreurs

  const token = localStorage.getItem("token"); // Récupération du token

  // Récupérer les informations utilisateur
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:7500/api/user/current", {
          headers: {
            Authorization: token,
          },
        });
        setUser(response.data); // Stocker les données utilisateur
      } catch (err) {
        setError("Impossible de récupérer les informations de l'utilisateur.");
        console.error(err);
      }
    };

    fetchUser();
  }, [token]);

  // Récupérer les produits de l'utilisateur connecté
  useEffect(() => {
    if (user) {
      axios
        .get("http://localhost:7500/api/product/allproducts")
        .then((res) => {
          if (res.data && Array.isArray(res.data.listProducts)) {
            const userProducts = res.data.listProducts.filter(
              (product) => product.id_user === user._id // Filtrer par l'id de l'utilisateur connecté
            );
            setProducts(userProducts);
          } else {
            console.error("Problème dans les données des produits :", res.data);
            setProducts([]);
          }
        })
        .catch((err) => {
          console.error("Erreur lors de la récupération des produits :", err);
          setError("Erreur lors de la récupération des produits.");
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) {
    return <div>Chargement en cours...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Mes Produits</h1>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Numéro de série</TableCell>
              <TableCell>Référence</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell>Image</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Affichage des produits */}
            {products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.date}</TableCell>
                  <TableCell>{product.numserie}</TableCell>
                  <TableCell>{product.reference}</TableCell>
                  <TableCell>{product.categorie}</TableCell>
                  <TableCell>
                    {product.product_img && (
                      <img
                        src={product.product_img}
                        alt="Product"
                        width="100"
                        height="100"
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} style={{ textAlign: "center" }}>
                  Vous n'avez ajouté aucun produit.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserProducts;
