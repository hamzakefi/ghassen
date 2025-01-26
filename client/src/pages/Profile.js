import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";

const Profile = () => {
  const [user, setUser] = useState(null); // Stockage des informations utilisateur
  const [loading, setLoading] = useState(true); // État de chargement
  const [error, setError] = useState(null); // Gestion des erreurs
  const token = localStorage.getItem("token"); // Récupération du token depuis localStorage

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:7500/api/user/current",
          {
            headers: {
              Authorization: token, // Ajout du token dans les en-têtes
            },
          }
        );
        setUser(response.data); // Stocker les données utilisateur
        setError(null);
      } catch (err) {
        setError("Impossible de récupérer les informations utilisateur !");
      } finally {
        setLoading(false); // Terminer le chargement
      }
    };

    fetchUser();
  }, [token]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
      <Paper elevation={3} style={{ padding: "2rem" }}>
        <Typography variant="h4" gutterBottom>
          Profil utilisateur
        </Typography>
        <Typography variant="body1">
          <strong>Nom :</strong> {user.name}
        </Typography>
        <Typography variant="body1">
          <strong>Email :</strong> {user.email}
        </Typography>
        <Typography variant="body1">
          <strong>ID :</strong> {user._id}
        </Typography>
        {/* Affichez des champs supplémentaires si disponibles */}
        {user.isAdmin && (
          <Typography variant="body1" color="primary">
            <strong>Rôle :</strong> Administrateur
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Profile;
