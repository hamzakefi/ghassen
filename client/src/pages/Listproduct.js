import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableHead, TableBody, TableCell, TableRow, TableContainer, Paper } from '@mui/material';

const Listproduct = () => {
  const [products, setProducts] = useState([]); // Toujours initialiser à un tableau

  useEffect(() => {
    axios
      .get("http://localhost:7500/api/product/allproducts")
      .then((res) => {
        // Vérification et extraction des données
        if (res.data && Array.isArray(res.data.listProducts)) {
          setProducts(res.data.listProducts); // Utiliser listProducts pour mettre à jour l'état
        } else {
          console.error("La clé listProducts est manquante ou n'est pas un tableau :", res.data);
          setProducts([]); // En cas de problème, tableau vide
        }
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des données :", err);
        setProducts([]); // En cas d'erreur, tableau vide
      });
  }, []); // [] pour que l'API soit appelée une seule fois

  return (
    <div className='hamza' style={{ padding: 20 }}>
      <h1>Liste des Produits</h1>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Utilisateur</TableCell>
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
                  <TableCell>{product.id_user}</TableCell>
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
                <TableCell colSpan={6} style={{ textAlign: "center" }}>
                  Aucun produit disponible
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Listproduct;
