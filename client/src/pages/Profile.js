import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null); // Pour stocker les informations de l'utilisateur
  const [error, setError] = useState(null); // Pour gérer les erreurs de chargement
  const token = localStorage.getItem("token"); // Récupération du token du localStorage (ou sessionStorage)

  useEffect(() => {
    // Fonction pour récupérer les données utilisateur
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:7500/api/user//current", {
          headers: {
            Authorization: token, // Ajouter le token dans l'en-tête Authorization
          },
        });
        setUser(response.data); // Mettre à jour les données utilisateur
      } catch (err) {
        setError("Impossible de récupérer les informations utilisateur !");
      }
    };

    fetchUser();
  }, [token]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Chargement des informations utilisateur...</div>;
  }

  return (
    <div>
      <h1>Profil</h1>
      <p><strong>Nom :</strong> {user.name}</p>
      <p><strong>Email :</strong> {user.email}</p>
      <p><strong>ID :</strong> {user._id}</p>
      {/* Affichez plus de champs si disponibles */}
    </div>
  );
};

export default Profile;
